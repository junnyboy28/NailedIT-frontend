# NailedIT - Advanced Nail Detection & Analysis

A computer vision application for detecting nails, measuring their dimensions, and finding matching pairs using advanced AI algorithms.

## Project Overview

NailedIT uses state-of-the-art computer vision algorithms to automatically detect and analyze nails in images. The system combines deep learning models with traditional computer vision techniques to provide accurate measurements and intelligent matching capabilities.

## Features

- Automatic nail detection and localization
- Precise dimension measurements
- Intelligent similarity matching
- Weight estimation algorithms

## Tech Stack

- Frontend:
  - React with TypeScript
  - Vite for build tooling
  - TailwindCSS for styling
  - shadcn/ui component library

- Backend:
  - FastAPI (Python)
  - YOLOv8 for object detection
  - OpenCV for image processing

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or bun

### Installation

```bash
# Clone this repository
git clone [your-repo-url]

# Navigate to the project directory
cd nail-vision-analysis-react

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

The app will be available at http://localhost:8080

## Backend Connection

The frontend is configured to connect to a backend API running on port 8000. You can change the API URL by setting the `VITE_API_URL` environment variable.

## Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
  - `/pages` - Application pages
  - `/utils` - Utility functions, including API interactions
  - `/hooks` - Custom React hooks
  - `/lib` - Helper libraries

## License
