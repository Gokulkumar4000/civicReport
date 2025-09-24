# Incident Report Feed App

## Overview
A mobile-first incident reporting web application built with HTML, CSS, and Tailwind CSS. The app allows users to view incident reports, create new posts, manage their profile, and track report statuses.

## Project Structure
- `index.html` - Main feed page showing recent incident reports
- `post.html` - Create new incident post page with image upload and tagging
- `profile.html` - User profile page with personal details and saved posts
- `report.html` - Reports dashboard with status tracking and filtering
- `server.js` - Node.js Express server for serving static files on port 5000
- `package.json` - Node.js dependencies and scripts

## Recent Changes
- **2025-09-24**: Successfully imported from GitHub and configured for Replit environment
  - Switched from Python to Node.js/Express server for better JavaScript workflow
  - Fixed Tailwind CSS loading issue by moving configuration before CDN script
  - Configured Express server to serve static HTML files on port 5000
  - Set up workflow for automatic server management
  - Configured deployment settings for production use
  - Added cache control headers to prevent caching issues in Replit proxy environment

## User Preferences
- Prefers JavaScript over Python for development
- Wants to keep as static pages for now, planning to use Firebase as backend in the future
- Focus on seeing the UI working properly with Tailwind CSS styling

## Project Architecture
- **Frontend**: Static HTML with Tailwind CSS for styling and responsive design
- **Server**: Node.js Express server with cache control headers for Replit compatibility
- **Styling**: Tailwind CSS CDN with custom color scheme and dark mode support
- **Icons**: Google Material Symbols for consistent iconography

## Technical Configuration
- Server runs on port 5000 (required for Replit)
- Express serves static files from root directory
- Cache control headers prevent proxy caching issues
- Tailwind CSS configuration includes custom primary color (#1193d4)
- Deployment configured for autoscale target

## Features
- Responsive mobile-first design
- Dark/light mode support
- Incident feed with interactive elements
- Post creation with image upload and tagging
- User profile management
- Report status tracking and filtering
- Navigation between pages

## Next Steps
- User plans to integrate Firebase as backend in the future
- Current setup ready for static frontend development