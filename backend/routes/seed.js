const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/create-admin', async (req, res) => {
  try {
    const adminUser = new User({
      email: 'admin@jandieren.de',
      password: 'Admin123!',
      name: 'Admin',
      role: 'admin'
    });

    await adminUser.save();
    res.json({ message: 'Admin user created successfully', email: adminUser.email });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Error creating admin user' });
  }
});

module.exports = router;