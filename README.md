# Sentilyst Frontend

React frontend for Sentilyst — an M&A news sentiment. Visualizes headline sentiment from Google News and NewsAPI, classified with a pre-trained DistilBERT NLP model.

## Features

- **Search & Analyze**: Query M&A deals and view sentiment results instantly
- **Results Dashboard**: Sentiment visualization and headline sources
- **M&A News Feed**: Browse categorized merger and acquisition headlines
- **Responsive Design**: Mobile-friendly interface
- **Data Visualization**: Charts powered by Recharts

## Tech Stack

- React 19 + Vite
- Tailwind CSS 4
- React Router v7
- Recharts for data visualization
- Axios for API communication
- React Hot Toast for notifications

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Backend API (see [Sentilyst API](https://github.com/Shoaib-Imrann/Sentilyst-api))

## Installation

**Install dependencies:**

```bash
cd frontend
npm install
```

**Configure environment variables:**

```bash
cp .env.template .env
```

Edit `.env` and set:

```env
VITE_API_URL=http://localhost:8000  # Your backend API URL
```

## Development

**Start the development server:**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

**Create production build:**

```bash
npm run build
```

**Preview production build:**

```bash
npm run preview
```

## Linting

**Run ESLint:**

```bash
npm run lint
```

**Auto-fix issues:**

```bash
npm run lint:fix
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Route pages
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## Available Routes

- `/` - Home / search
- `/results` - Sentiment analysis results
- `/news` - M&A news feed
- `/about` - About page

## Deployment

This app is optimized for deployment on Vercel. See `vercel.json` for configuration.

## Environment Variables

- `VITE_API_URL` - Backend API endpoint (required)
