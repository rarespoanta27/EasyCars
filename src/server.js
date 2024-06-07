const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'easycars'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Ruta pentru înregistrarea utilizatorilor
app.post('/api/register', async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
    [email, hashedPassword, first_name, last_name],
    (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ msg: 'Database error' });
      }
      const token = jwt.sign({ userId: result.insertId }, 'secret_key', { expiresIn: '1h' });
      res.status(200).json({ token });
    }
  );
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ msg: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });
    res.status(200).json({ token });
  });
});

app.get('/api/user', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    const decoded = jwt.verify(token, 'secret_key');
    db.query('SELECT first_name, last_name, email FROM users WHERE id = ?', [decoded.userId], (err, result) => {
      if (err) {
        console.error('Error fetching user details:', err);
        return res.status(500).send('Database error');
      }
      if (result.length === 0) {
        return res.status(404).send('User not found');
      }
      const user = result[0];
      res.status(200).json({ name: `${user.first_name} ${user.last_name}`, email: user.email });
    });
  } catch (error) {
    res.status(400).send('Invalid token');
  }
});

// Ruta pentru obținerea listei de mașini
app.get('/api/cars', (req, res) => {
  const sql = 'SELECT * FROM cars';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

// Ruta pentru adăugarea unei mașini în coș
app.post('/api/cart', (req, res) => {
  const { userId, carId, startDate, endDate } = req.body;

  // Verifică dacă mașina este deja rezervată în intervalul selectat
  const checkAvailabilitySql = `
    SELECT * FROM orders 
    WHERE car_id = ? AND (
      (start_date <= ? AND end_date >= ?) OR
      (start_date <= ? AND end_date >= ?) OR
      (start_date >= ? AND end_date <= ?)
    )
  `;
  db.query(checkAvailabilitySql, [carId, startDate, startDate, endDate, endDate, startDate, endDate], (err, results) => {
    if (err) {
      console.error('Error checking availability:', err);
      return res.status(500).send('Database error');
    }

    if (results.length > 0) {
      const car = results[0];
      return res.status(400).send(`${car.brand} ${car.model} is not available for the selected dates.`);
    }

    const sql = 'INSERT INTO cart (user_id, car_id, start_date, end_date) VALUES (?, ?, ?, ?)';
    db.query(sql, [userId, carId, startDate, endDate], (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send('Car added to cart');
      }
    });
  });
});

app.get('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = 'SELECT cars.*, cart.start_date, cart.end_date FROM cars INNER JOIN cart ON cars.id = cart.car_id WHERE cart.user_id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

app.delete('/api/cart/:userId/:carId', (req, res) => {
  const { userId, carId } = req.params;
  const sql = 'DELETE FROM cart WHERE user_id = ? AND car_id = ?';
  db.query(sql, [userId, carId], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('Car removed from cart');
    }
  });
});

app.post('/api/checkout', (req, res) => {
  const { userId, cartItems } = req.body;

  cartItems.forEach((item) => {
    const { carId, startDate, endDate, conditie } = item;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalPrice = diffDays * parseFloat(conditie);

    const sql = 'INSERT INTO orders (user_id, car_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [userId, carId, startDate, endDate, totalPrice], (err, result) => {
      if (err) {
        console.error('Error inserting order:', err);
      }
    });
  });

  const clearCartSql = 'DELETE FROM cart WHERE user_id = ?';
  db.query(clearCartSql, [userId], (err, result) => {
    if (err) {
      console.error('Error clearing cart:', err);
    }
  });

  res.status(200).send('Order placed successfully');
});

app.post('/api/support', (req, res) => {
  const { name, email, message } = req.body;
  const sql = 'INSERT INTO support (name, email, message) VALUES (?, ?, ?)';
  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error('Error sending support message:', err);
      res.status(500).send('Database error');
    } else {
      res.status(200).send('Support message sent');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
