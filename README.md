# Event Plan Calendar

A web application built with FastAPI for managing event plans and form them in calendar.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

To run the application in development mode:

```bash
uvicorn main:app --reload
```

The API will be available at:
- Main API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Alternative API Documentation: http://localhost:8000/redoc

## API Endpoints

- `GET /`: Welcome message
- `GET /health`: Health check endpoint

## Features

- FastAPI framework for high performance
- Automatic API documentation
- CORS middleware enabled
- Health check endpoint 