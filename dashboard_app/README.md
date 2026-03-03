# Bluepin Dashboard

A modern dashboard application built with React + TypeScript + Tailwind CSS frontend and Flask REST API backend.

## Project Structure

```
dashboard_app/
├── frontend/          # React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── api/       # API services
│   │   ├── components/# Reusable components
│   │   ├── context/   # React context (Auth)
│   │   ├── pages/     # Page components
│   │   └── index.css  # Tailwind + custom styles
│   └── package.json
│
├── backend/           # Flask REST API
│   ├── app/
│   │   ├── routes/    # API endpoints
│   │   ├── services/  # Business logic
│   │   ├── models.py  # Database models
│   │   └── extensions.py
│   ├── data/          # CSV data files
│   ├── config.py
│   └── run.py
│
└── README.md
```

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
python run.py
```

Backend runs at: http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

## Features

- **Dashboard Overview** - Stats, charts, and metrics
- **Products** - Browse, filter, and search products
- **Suppliers** - View supplier information
- **Comparisons** - Compare multiple products
- **AI Analysis** - AI-powered insights
- **University** - Articles and resources
- **Wishlist** - Save favorite products
- **Admin Dashboard** - User and content management

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS 4
- Vite
- Chart.js
- React Router

**Backend:**
- Flask
- Flask-SQLAlchemy
- Flask-Login
- Flask-CORS
- Pandas
