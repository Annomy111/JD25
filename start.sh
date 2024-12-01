#!/bin/bash

# Install dependencies
echo "Installing backend dependencies..."
cd backend
npm install

echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Start backend server
echo "Starting backend server..."
cd ../backend
node server.js &
backend_pid=$!

# Wait a bit for backend to start
sleep 5

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
PORT=3000 npm start &
frontend_pid=$!

# Wait for either process to finish
wait $backend_pid $frontend_pid
