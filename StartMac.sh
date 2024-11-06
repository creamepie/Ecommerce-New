#!/bin/bash

# Get the directory of the current script (the location of this file)
BASE_DIR=$(dirname "$0")

# Start Backend (Ensure it runs on port 5000)
osascript -e 'tell application "Terminal" to do script "cd $BASE_DIR/ecommerce-backend && node server.js"' &

# Start Frontend (Ensure it runs on port 3000)
osascript -e 'tell application "Terminal" to do script "cd $BASE_DIR/frontend && npm install && npm start"' &

# Output info about running services
echo "Backend is running on http://localhost:5000"
echo "Frontend is running on http://localhost:3000"
echo "Ensure MongoDB is running and the link is default (mongodb://localhost:27017)"
