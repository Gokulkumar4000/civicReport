# Incident Report Feed App

## Overview
A mobile-first incident reporting web application built with HTML, CSS, and Tailwind CSS. The app allows users to view incident reports, create new posts, manage their profile, and track report statuses.

## Project Structure
- `index.html` - Main feed page showing recent incident reports
- `post.html` - Create new incident post page with image upload and tagging
- `profile.html` - User profile page with personal details and saved posts
- `report.html` - Reports dashboard with status tracking and filtering
- `server.py` - Python HTTP server for serving static files
- `.replit` - Replit configuration file

## Recent Changes
- **2025-09-24**: Initial setup in Replit environment
  - Configured Python HTTP server to serve static HTML files on port 5000
  - Set up workflow for automatic server management
  - Configured deployment settings for production use
  - Added cache control headers to prevent caching issues in Replit proxy environment

## Architecture
- **Frontend**: Static HTML with Tailwind CSS for styling and responsive design
- **Server**: Python HTTP server with cache control headers for Replit compatibility
- **Styling**: Tailwind CSS CDN with custom color scheme and dark mode support
- **Icons**: Google Material Symbols for consistent iconography

## Features
- Responsive mobile-first design
- Dark/light mode support
- Incident feed with interactive elements
- Post creation with image upload and tagging
- User profile management
- Report status tracking and filtering
- Navigation between pages

## Configuration
- Server runs on port 5000 (required for Replit)
- Cache control headers prevent proxy caching issues
- Tailwind CSS configuration includes custom primary color (#1193d4)
- Deployment configured for autoscale target