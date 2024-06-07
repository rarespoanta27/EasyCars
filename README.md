# EasyCars

EasyCars is a comprehensive car rental application designed to provide users with a seamless and user-friendly experience when browsing and renting cars. This platform allows users to view a wide range of available cars, add desired vehicles to their cart, and place rental orders with ease. The application incorporates robust user authentication and support features, ensuring both security and assistance for users at every step of their rental journey. 

## Key Features

- **User Authentication:** Secure user registration and login functionality using JWT (JSON Web Tokens) for authentication. User credentials are safely encrypted using bcrypt for added security.
- **Browse Available Cars:** Users can view a detailed list of available cars, including information such as brand, model, year, daily rental price, and images.
- **Search Functionality:** A powerful search bar allows users to filter the list of cars by brand, making it easy to find the perfect vehicle.
- **Add to Cart:** Users can select rental start and end dates for each car and add the desired vehicles to their cart.
- **Cart Management:** The cart feature allows users to view all the cars they have selected for rental, remove unwanted cars, and proceed to checkout.
- **Checkout and Order Placement:** Upon checkout, the application calculates the total rental cost based on the selected dates and daily rental price, and then places the order, saving it to the database.
- **Support Form:** Users can easily reach out for support through a dedicated support form. For logged-in users, the support form is auto-filled with their name and email for convenience.
- **Multilingual Support:** The application supports both English and Romanian languages, catering to a broader audience.

### Backend and Database

- **Backend:** The backend is built with Node.js and Express, providing a robust and scalable server-side architecture.
- **Database:** MySQL is used for storing user data, car information, cart details, orders, and support messages. The database structure ensures data integrity and efficient querying.
- **API Endpoints:** The backend exposes a set of RESTful API endpoints for user authentication, car listings, cart management, order placement, and support message handling.

## Usage

### Main screen

- **Search by brand:** Use the search bar to filter cars by brand.
- **Add to Cart:** Select rental start and end dates, then click "Add to Cart" to add the car to your cart.

### Cart

- **View Cart:** Click on the "Cart" link to view your cart.
- **Remove from Cart:** Click the "Șterge" button to remove a car from your cart.
- **Proceed to Checkout:** Click the "Proceed to Checkout" button to place your order.

### Support 

- **Support Form:** Fill out the support form to contact support. If logged in, the name and email fields will be autofilled.

## API Endpoints

- **User Registration:** POST /api/register
- **User Login:** POST /api/login
- **Get Cars:** GET /api/cars
- **Add to Cart:** POST /api/cart
- **Get Cart Items:** GET /api/cart/:userId
- **Remove from Cart:** DELETE /api/cart/:userId/:carId
- **Place Order:** POST /api/checkout
- **Submit Support Message:** POST /api/support


### Installation

1. **Clone the Repository:** Clone the project repository from GitHub.
   ```sh
   git clone https://github.com/yourusername/easycars.git

2. **Navigate to the project directory:**
   ```bash
   cd easycars

3. **Install the dependencies for the backend and frontend:**
   ```bash
   npm install
   cd client
   npm install
   cd ..

## Run the application:

1. **Start the backend server:**
   ```bash
   node server_name.js

2. **Start the frontend development server:**
   ```bash
   cd client
   npm start

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact rarespoanta10@gmail.com.
