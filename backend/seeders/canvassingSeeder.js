const mongoose = require('mongoose');
const CanvassingArea = require('../models/CanvassingArea');
require('dotenv').config();

const seedData = [
  {
    districtId: 'NK001',
    districtName: 'Neukirchen-Nord',
    totalHouseholds: 450,
    visitedHouseholds: 0,
    progress: 0,
    status: 'not_started'
  },
  {
    districtId: 'NK002',
    districtName: 'Neukirchen-Süd',
    totalHouseholds: 380,
    visitedHouseholds: 0,
    progress: 0,
    status: 'not_started'
  },
  {
    districtId: 'VL001',
    districtName: 'Vluyn-Nord',
    totalHouseholds: 320,
    visitedHouseholds: 0,
    progress: 0,
    status: 'not_started'
  },
  {
    districtId: 'VL002',
    districtName: 'Vluyn-Süd',
    totalHouseholds: 290,
    visitedHouseholds: 0,
    progress: 0,
    status: 'not_started'
  }
];

const seedCanvassingAreas = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await CanvassingArea.deleteMany({});
    console.log('Cleared existing canvassing areas');

    // Insert new data
    await CanvassingArea.insertMany(seedData);
    console.log('Seeded canvassing areas');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeder if this file is run directly
if (require.main === module) {
  seedCanvassingAreas();
}