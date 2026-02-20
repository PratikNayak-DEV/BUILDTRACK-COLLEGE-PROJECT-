# BuildTrack Backend

Node.js + Express API for AI-assisted construction progress monitoring.

## Folder Structure

- `src/app.js` - Express app middleware + route registration
- `src/server.js` - Runtime bootstrap and graceful shutdown
- `src/config/` - Environment config, DB connector, Cloudinary setup
- `src/controllers/` - Route controller functions
- `src/middlewares/` - Error and request middlewares
- `src/models/` - Mongoose schemas/models
- `src/routes/` - API route definitions
- `src/services/` - Reusable services (Vision API, uploads, etc.)
- `src/utils/` - Utility helpers/constants
- `src/validations/` - Validation schemas

## Step 2-3 Implemented

- Express server setup with security and logging middleware.
- MongoDB connection via Mongoose.
- Cloudinary SDK configuration.
- Google Vision API integration service for object detection.
- Rule engine for mapping detected objects to construction stages.

## Setup

1. Copy `.env.example` to `.env` in the `backend/` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Health check:
   ```bash
   GET /api/health
   ```
