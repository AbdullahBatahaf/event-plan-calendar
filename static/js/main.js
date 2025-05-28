document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Initialize calendar
    setCalendarHeader();
    renderCalendar(currentMonth, currentYear);



    function setCalendarHeader() {
        
        const calenderHeader = document.getElementById('calendar-header');

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const headerDiv = document.createElement('div');
        headerDiv.className = 'calendar-header';
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            headerDiv.appendChild(dayHeader);
        });
        calenderHeader.appendChild(headerDiv);

    }

    // Event listeners for month navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // Event form submission
    document.getElementById('eventForm').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');
        const eventData = {
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            description: document.getElementById('eventDescription').value,
            isUser: true
        };
        addEvent(eventData);
        this.reset();
    });
});

async function renderCalendar(month, year) {

    const monthDate = month < 10 ? `0${month + 1}` : `${month + 1}`;
    let events = [];

    const response = await fetch(`/getEvents/month/${year}-${monthDate}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();

    if (data.success) {
        events = data.events;
    }

    const calenderHeader = document.getElementById('calendar-header');
    const calendar = document.getElementById('calendar');
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();


    // Clear previous calendar
    calendar.innerHTML = '';

    // Add days
    let dayCount = 1;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            const dayDiv = document.createElement('div');
            let planEvent = null;
            dayDiv.className = 'calendar-day';
            let isEvent = false;

            if (i === 0 && j < startingDay) {
                // Previous month days
                const prevMonthLastDay = new Date(year, month, 0).getDate();
                dayDiv.textContent = prevMonthLastDay - startingDay + j + 1;
                dayDiv.classList.add('other-month');
            } else if (dayCount > totalDays) {
                // Next month days
                dayDiv.textContent = dayCount - totalDays;
                dayDiv.classList.add('other-month');
                dayCount++;
            } else {
                let dayCountString = dayCount.toString();
                if (dayCount < 10) {
                    dayCountString = `0${dayCount}`;
                }
                // Current month days
                dayDiv.textContent = dayCount;
                if (events.some(event => event.date == `${year}-${monthDate}-${dayCountString}`)) {
                    planEvent = events.find(event => event.date == `${year}-${monthDate}-${dayCountString}`);
                    dayDiv.classList.add('event-day');
                    const pointer = document.createElement('div');
                    pointer.className = 'pointer';
                    pointer.textContent = '•';
                    dayDiv.appendChild(pointer);
                    isEvent = true;
                }
                if (isToday(year, month, dayCount)) {
                    dayDiv.classList.add('today');
                }
                dayCount++;
            }
            if (isEvent) {
                const button = document.createElement('button');
                button.className = 'event-button';
                button.onclick = () => {
                    eventButtonHandler(planEvent);
                }
                dayDiv.appendChild(button);
            }
            calendar.appendChild(dayDiv);
        }
    }
}

function eventButtonHandler(planEvent) {
    console.log(planEvent);
    const eventContainer = document.createElement('div');
    eventContainer.className = 'event-container';
    const eventTitle = document.createElement('h3');
    eventTitle.textContent = planEvent.title;
    const eventDescription = document.createElement('p');
    eventDescription.textContent = planEvent.description;
    const eventTime = document.createElement('p');
    eventTime.textContent = planEvent.time;
    const eventClose = document.createElement('button');
    eventClose.className = 'event-close';
    eventClose.textContent = 'Close';
    eventClose.onclick = () => {
        document.body.removeChild(eventContainer);
    }
    eventContainer.appendChild(eventTitle);
    eventContainer.appendChild(eventDescription);
    eventContainer.appendChild(eventTime);
    eventContainer.appendChild(eventClose);
    document.body.appendChild(eventContainer);
}

function isToday(year, month, day) {
    const today = new Date();
    return today.getFullYear() === year &&
           today.getMonth() === month &&
           today.getDate() === day;
}

async function addEvent(eventData) {
    let isAdded = false;
    console.log('Adding event:', eventData);
    try {
        const response = await fetch('/addEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        const data = await response.json();
        if (data.success) {
            isAdded = true;
        }
        console.log('Server response:', data);
    }catch(error) {
        console.error('Error adding event:', error);
    }
    finally {
        if (isAdded) {
            alert('Event added successfully!');
        } else {
            alert('Failed to add event. Please try again.');
        }
    }
} 