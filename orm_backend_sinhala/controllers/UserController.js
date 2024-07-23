const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User'); // Adjust the path as necessary

class UserController {
  async createUser(req, res) {
    try {
      const { email, password, first_name, last_name, factory } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists.',
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const newUser = await User.create({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        factory,
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: newUser,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }


  //method for user login

  async login(req, res) {
    const { email, password } = req.body;

    // Check if all required fields are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Both email and password are required for login.' });
    }

    try {
      // Fetch user from the database based on the provided email
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // If the password is valid, create a JWT token for authentication
      const token = jwt.sign(
        { userId: user.userId, email: user.email },
        'your_secret_key', // Replace with your secret key
        { expiresIn: '1h' }
      );

      res.status(200).json({ token, expiresIn: 3600 });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  //method to get the factory user name and last name
  async getUserInfo(req, res) {
    const { email } = req.query; // Use req.query to get the query parameter
    console.log(email);
  
    try {
      // Fetch user from the database based on the provided email
      const user = await User.findOne({ 
        where: { email },
        attributes: ['first_name', 'last_name', 'factory']
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      res.status(200).json({
        success: true,
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          factory: user.factory
        }
      });
    } catch (error) {
      console.error('Error retrieving user info:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new UserController();
