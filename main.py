from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path
import uvicorn
from fastapi.responses import JSONResponse

PORT = 8000

app = FastAPI(
    title="Event Plan Calendar",
    # description="A web application for managing event plans and calendars",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# for testing
events = []


# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# index page
@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# get events
@app.get("/getEvents")
async def get_events():
    return JSONResponse(status_code=200, content={"success": True, "events": events})

# get events by month
@app.get("/getEvents/month/{year}-{month}")
async def get_events_by_month(year: int, month: int):
    filtered_events = [event for event in events if event["date"].startswith(f"{year}-{month:02d}")]
    if not filtered_events: 
        return JSONResponse(status_code=404, content={"success": False, "message": "No events found for the given month"})
    
    return JSONResponse(status_code=200, content={"success": True, "events": filtered_events})

# get events by date
@app.get("/getEvents/date/{date}")
async def get_events_by_date(date: str):
    filtered_events = [event for event in events if event["date"] == date]
    if not filtered_events:
        return JSONResponse(status_code=404, content={"success": False, "message": "No events found for the given date"})

    return JSONResponse(status_code=200, content={"success": True, "events": filtered_events})

# add event
@app.post("/addEvent")
async def add_event(request: Request):
    data = await request.json()
    if data:
        is_user_data = data.get("isUser")
        title = data.get("title")
        date = data.get("date")
        description = data.get("description")
        time = data.get("time")

        if not date:
            return JSONResponse(status_code=400, content={"success": False, "message": "Date is required"})

        events.append({
            "title": title,
            "date": date,
            "isUser": is_user_data,
            "id": len(events) + 1,
            "description": description,
            "time": time
        })

        print(events)
        
        return JSONResponse(status_code=200, content={"success": True, "message": "Event added successfully"})

@app.get("/event/{date}")
async def event_page(date: str, request: Request):
    filtered_events = [event for event in events if event['date'] == date]

    return templates.TemplateResponse("event.html", {'request': request, "events": filtered_events})


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)