require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@wahlkampf.de',
    password: 'admin123',
    role: 'admin',
    points: 1000,
    badges: ['Gründer', 'Experte'],
    isActive: true
  },
  {
    name: 'Jan Dieren',
    email: 'jan.dieren@spd.de',
    password: 'kandidat123',
    role: 'admin',
    points: 1000,
    badges: ['Kandidat', 'Teamleiter'],
    isActive: true
  },
  {
    name: 'Maria Schmidt',
    email: 'maria@example.com',
    password: 'volunteer123',
    role: 'volunteer',
    points: 750,
    badges: ['Fleißige Biene', 'Türöffner'],
    isActive: true
  },
  {
    name: 'Thomas Weber',
    email: 'thomas@example.com',
    password: 'volunteer123',
    role: 'volunteer',
    points: 500,
    badges: ['Social Media Star'],
    isActive: true
  },
  {
    name: 'Lisa Müller',
    email: 'lisa@example.com',
    password: 'volunteer123',
    role: 'volunteer',
    points: 250,
    badges: ['Neuling'],
    isActive: true
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing users
    await User.deleteMany({});
    console.log('Deleted existing users');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(users.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return {
        ...user,
        password: hashedPassword
      };
    }));

    await User.insertMany(hashedUsers);
    console.log('Users seeded successfully');

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedUsers();