document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('calendarForm').addEventListener('submit', function(e) {
        e.preventDefault();
    });
});


function logout() {

    sessionStorage.clear(); // or localStorage.clear();
    localStorage.setItem('loggedInUserEmail', "None");
    window.location.href = 'index.html';
}

let events = [
    {
        attendees: "a@gmail.com",
        description: "Amsterdam trip planning and itinerary discussions. Meeting to cover all the important places we want to visit and activities to do.",
        endDateTime: "2024-03-14T15:00",
        location: "Amsterdam",
        reminderType: "email",
        startDateTime: "2024-03-14T13:00",
        timeBefore: "30",
        title: "Amsterdam Trip Planning",
        userId: 1234
    },
    {
        attendees: "b@example.com, c@example.com",
        description: "Quarterly review meeting to discuss project progress, upcoming milestones, and address any concerns.",
        endDateTime: "2024-03-18T17:00",
        location: "Office Board Room",
        reminderType: "email",
        startDateTime: "2024-03-18T15:00",
        timeBefore: "15",
        title: "Project Review Meeting",
        userId: 5678
    }
];

window.onload = function() {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
        events = JSON.parse(savedEvents);
    }

    displayEvents();
};

function validateAttendees(attendees) {
    // Trim the input and check if empty
    const trimmedAttendees = attendees.trim();
    if (!trimmedAttendees) {
        alert('At least one attendee email is required.');
        return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const emailsArray = trimmedAttendees.split(',').map(email => email.trim());

    for (const email of emailsArray) {
        if (!emailRegex.test(email)) {
            alert(`Invalid email format: ${email}`);
            return false;
        }
    }

    return true;
}

function submitForm() {
    const form = document.getElementById('calendarForm');
    const formData = new FormData(form);
    
    let formObject = {};
    formData.forEach(function(value, key){
        formObject[key] = value;
    });

    if (!validateFormData(formObject)) {
        return; 
    }
    
    // Assuming you've stored the logged-in user's ID in localStorage during login
    const loggedInUserId = localStorage.getItem('loggedInUserEmail'); // or 'loggedInUserId', based on your key
    formObject['userId'] = loggedInUserId;

    // Retrieve existing events for the logged-in user
    const userEventsKey = `events_${loggedInUserId}`;
    const existingEvents = JSON.parse(localStorage.getItem(userEventsKey)) || [];
    
    existingEvents.push(formObject);

    // Save the updated events array back to localStorage
    localStorage.setItem(userEventsKey, JSON.stringify(existingEvents));

    console.log('Event added:', formObject);
    form.reset();
    displayEvents(); // Update display
}


function validateFormData(formObject) {
    if (!formObject.title.trim()) {
        alert('Title is required.');
        return false;
    }
    if (!formObject.description.trim()) {
        alert('Description is required.');
        return false;
    }
    if (!formObject.location.trim()) {
        alert('Location is required.');
        return false;
    }
    if (!formObject.startDateTime.trim()) {
        alert('Start Date and Time are required.');
        return false;
    }
    if (!formObject.endDateTime.trim()) {
        alert('End Date and Time are required.');
        return false;
    }
    if (!formObject.timeBefore.trim()) {
        alert('Time Before (minutes) is required.');
        return false;
    }

    return validateAttendees(formObject.attendees);
}

function generateRandomUserID() {
    return Math.floor(Math.random() * 10000) + 1;
}

function sortEvents(criteria) {
    if (criteria === 'time') {
        events.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
    } else if (criteria === 'location') {
        events.sort((a, b) => a.location.localeCompare(b.location));
    }

    displayEvents(); 
}

function displayEvents() {
    const container = document.getElementById('eventsContainer');
    container.innerHTML = ''; 

    events.forEach((event, index) => {
        const startTime = new Date(event.startDateTime).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit', hour12: false
        });
        const endTime = new Date(event.endDateTime).toLocaleString('en-GB', {
            hour: '2-digit', minute: '2-digit', hour12: false
        });

        const eventBox = document.createElement('div');
        eventBox.className = 'eventBox';
        eventBox.innerHTML = `
            <h2>Event ${index + 1}: ${event.title}</h2>
            <p>Description: ${event.description}</p>
            <p>Time: ${startTime} - ${endTime}</p>
            <p>Location: ${event.location}</p>
            <button onclick="deleteEvent(${index})" class="delete-btn">Delete</button>
        `;
        container.appendChild(eventBox);
    }); // <button onclick="editEvent(${index})" class="edit-btn">Edit</button>
}


function deleteEvent(index) {
    if (!confirm("Are you sure you want to delete this event?")) {
        return;
    }
    events.splice(index, 1);
    localStorage.setItem('events', JSON.stringify(events));
    
    displayEvents();
}


