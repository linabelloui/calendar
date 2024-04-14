let currentDate = new Date();
let lastClickedDay = null;

function generateCalendar(date) {
  const calendarContainer = document.getElementById('calendar');
  const daysOfWeekContainer = document.getElementById('daysOfWeek');
  const currentMonthYear = document.getElementById('currentMonthYear');
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  currentMonthYear.innerText = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  calendarContainer.innerHTML = '';

  if (daysOfWeekContainer.children.length === 0) {
    daysOfWeek.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day', 'day-name');
      dayElement.innerText = day;
      daysOfWeekContainer.appendChild(dayElement);
    });
  }

  for (let i = 0; i < firstDay.getDay(); i++) {
    const emptyDay = document.createElement('div');
    emptyDay.classList.add('day');
    calendarContainer.appendChild(emptyDay);
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.innerText = i;
    dayElement.addEventListener('click', function() {
      displayEventsTasksForDay(i);
    });
    calendarContainer.appendChild(dayElement);
  }
}

let currentlyDisplayedDay = null;

function displayEventsTasksForDay(day) {
  const eventsDisplayHtml = document.getElementById('eventsDisplay');

  if (currentlyDisplayedDay === day) {
    eventsDisplayHtml.style.display = eventsDisplayHtml.style.display === 'none' ? 'block' : 'none';
    if (eventsDisplayHtml.style.display === 'none') {
      currentlyDisplayedDay = null;
    }
    return;
  }

  currentlyDisplayedDay = day;

  eventsDisplayHtml.innerHTML = '';
  const eventKey = `event-${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
  let eventData = JSON.parse(localStorage.getItem(eventKey)) || [];

  if (!Array.isArray(eventData)) {
    console.error('eventData is not an array:', eventData);
    eventData = [];
  }

  let contentHtml = `<h2>Events/Tasks for ${day}</h2><ul>`;
  eventData.forEach(event => {
    contentHtml += `<li>${event.eventName} at ${event.eventTime}</li>`;
  });
  contentHtml += '</ul>';
  contentHtml += `<button onclick="openEventForm(${day})">Add Event</button>`;

  eventsDisplayHtml.innerHTML = contentHtml;
  eventsDisplayHtml.style.display = 'block';
}

function openEventForm(day) {
  const formContainer = document.getElementById('eventFormContainer');
  const formHtml = `
    <div id="eventForm" style="display: block;">
      <h2>Add Event</h2>
      <label for="eventName">Event Name:</label>
      <input type="text" id="eventName" name="eventName"><br>
      <label for="eventTime">Event Time:</label>
      <input type="time" id="eventTime" name="eventTime"><br>
      <input type="checkbox" id="eventNotify" name="eventNotify">
      <label for="eventNotify">Notify Me</label><br>
      <label for="eventColor">Choose a color:</label>
      <input type="color" id="eventColor" name="eventColor" value="#ff0000"><br>
      <button onclick="saveEvent(${day}, event)">Save Event</button>
    </div>
  `;
  formContainer.innerHTML = formHtml;
}


function saveEvent(day, event) {
  event.stopPropagation();
  
  const eventKey = `event-${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
  let eventsForDay = JSON.parse(localStorage.getItem(eventKey)) || [];
  
  const newEvent = {
    eventName: document.getElementById('eventName').value,
    eventTime: document.getElementById('eventTime').value,
    eventNotify: document.getElementById('eventNotify').checked,
    eventColor: document.getElementById('eventColor').value
  };
  
  eventsForDay.push(newEvent);
  localStorage.setItem(eventKey, JSON.stringify(eventsForDay));

  document.getElementById('eventForm').style.display = 'none';
  document.getElementById('eventFormContainer').innerHTML = '';
  displayEventsTasksForDay(day);
}

document.getElementById('prevMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar(currentDate);
});

document.getElementById('nextMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar(currentDate);
});

document.addEventListener('DOMContentLoaded', function() {
  generateCalendar(currentDate);
});

document.getElementById('imageUploader').addEventListener('change', function(event) {
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      document.body.style.backgroundImage = `url('${e.target.result}')`;
    };
    
    reader.readAsDataURL(event.target.files[0]);
  }
});

generateCalendar(currentDate);