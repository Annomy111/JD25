#!/bin/bash

# Navigate to frontend directory
cd /Users/winzendwyers/Desktop/Campaing\ Manager/frontend

# Install missing dependencies
npm install @radix-ui/react-select

# Start the frontend development server
npm run dev

# Open a new terminal and navigate to backend
cd ../backend

# Start the backend server
npm run dev