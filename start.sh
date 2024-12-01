#!/bin/bash

# Install dependencies
echo "Installing backend dependencies..."
cd backend
npm install

echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Start both servers
echo "Starting servers..."
cd ../backend
node server.js & 
cd ../frontend
npm start
