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
        const eventData = {
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            description: document.getElementById('eventDescription').value
        };
        addEvent(eventData);
        this.reset();
    });
});

function renderCalendar(month, year) {
    const calenderHeader = document.getElementById('calendar-header');
    const calendar = document.getElementById('calendar');
    console.log(calendar);
    const firstDay = new Date(year, month, 1);
    console.log(firstDay);
    const lastDay = new Date(year, month + 1, 0);
    console.log(lastDay);
    const startingDay = firstDay.getDay();
    console.log(startingDay);
    const totalDays = lastDay.getDate();
    console.log(totalDays);

    // Clear previous calendar
    calendar.innerHTML = '';

    // Add days
    let dayCount = 1;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';

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
                // Current month days
                dayDiv.textContent = dayCount;
                if (isToday(year, month, dayCount)) {
                    dayDiv.classList.add('today');
                }
                dayCount++;
            }

            calendar.appendChild(dayDiv);
        }
    }
}

function isToday(year, month, day) {
    const today = new Date();
    return today.getFullYear() === year &&
           today.getMonth() === month &&
           today.getDate() === day;
}

function addEvent(eventData) {
    // Here you would typically make an API call to save the event
    console.log('Adding event:', eventData);
    // For now, we'll just show an alert
    alert('Event added successfully!');
} 