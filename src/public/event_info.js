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

function getEventsForCurrentUser() {
    const loggedInUserId = localStorage.getItem('loggedInUserEmail'); 
    if (!loggedInUserId) {
        console.log("No logged-in user.");
        return;
    }

    const userEventsKey = `events_${loggedInUserId}`;
    const eventsJson = localStorage.getItem(userEventsKey);
    
    if (eventsJson) {
        const userEvents = JSON.parse(eventsJson);
        console.log(`Events for user ${loggedInUserId}:`, userEvents);
        return userEvents;
    } else {
        console.log(`No events found for user ${loggedInUserId}.`);
        return [];
    }
}



window.onload = function() {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
        events = JSON.parse(savedEvents);
    }

    displayEvents();
};

function validateAttendees(attendees) {
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
    
    const loggedInUserId = localStorage.getItem('loggedInUserEmail'); 
    formObject['userId'] = loggedInUserId;

    const userEventsKey = `events_${loggedInUserId}`;
    const existingEvents = JSON.parse(localStorage.getItem(userEventsKey)) || [];
    
    existingEvents.push(formObject);

    localStorage.setItem(userEventsKey, JSON.stringify(existingEvents));

    console.log('Event added:', formObject);
    form.reset();
    displayEvents();
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

function displayEvents(optionalEvents) {
    console.log("OPTIONAL EVENTS ", optionalEvents);
    const container = document.getElementById('eventsContainer');
    container.innerHTML = ''; 

    const events = optionalEvents || getEventsForCurrentUser(); 
    console.log("INSIDE DISPLAY EVENTS FUNCTION ", events);
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
            <button class="delete-btn">Delete</button>
        `;
        const deleteButton = eventBox.querySelector('.delete-btn');
        deleteButton.addEventListener('click', function() {
        deleteEvent(index); 
});
        container.appendChild(eventBox);
    });
}


function getEventsForCurrentUser() {
    const loggedInUserId = localStorage.getItem('loggedInUserEmail'); 
    console.log('Logged-in User ID:', loggedInUserId);
    if (!loggedInUserId) {
        console.log("No logged-in user found.");
        return [];
    }

    const userEventsKey = `events_${loggedInUserId}`;
    const eventsJson = localStorage.getItem(userEventsKey);
    // console.log('Retrieved Events JSON:', eventsJson);
    
    const events = eventsJson ? JSON.parse(eventsJson) : [];
    // console.log('Parsed Events:', events);
    return events;
}


function deleteEvent(index) {
    const loggedInUserId = localStorage.getItem('loggedInUserEmail');
    if (!loggedInUserId) {
        console.error('No logged-in user found.');
        return;
    }

    const userEventsKey = `events_${loggedInUserId}`;
    const eventsJson = localStorage.getItem(userEventsKey);
    if (eventsJson) {
        const events = JSON.parse(eventsJson);

        if (confirm('Are you sure you want to delete this event?')) {
            events.splice(index, 1);
            localStorage.setItem(userEventsKey, JSON.stringify(events));
            displayEvents(); 
        }
    } else {
        console.error('Events not found for user:', loggedInUserId);
    }
}

function sortEvents(criteria) {
    let events = getEventsForCurrentUser(); 
    console.log('Displaying events before sorting FUNC:', events); // Debug log

    if (!events || events.length === 0) {
        console.log("No events found for sorting.");
        return;
    }

    if (criteria === 'time') {
        events.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
        console.log("SORTED EVENTS BY TIME ", events);
    } else if (criteria === 'location') {
        events.sort((a, b) => a.location.localeCompare(b.location));
    } else {
        console.log("Invalid sorting criteria.");
        return;
    }

    displayEvents(events); // Pass the sorted events to your display function
}

// const BASE_URL = 'http://127.0.0.1:8000'; 

// async function apiFetch(url, method, data) {
//     const token = localStorage.getItem('token');
//     const headers = { 'Content-Type': 'application/json' };
//     if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//     }
//     const response = await fetch(`${BASE_URL}${url}`, {
//         method: method,
//         headers: headers,
//         body: data ? JSON.stringify(data) : undefined,
//     });
//     if (!response.ok) {
//         const errorMessage = await response.text();
//         throw new Error(errorMessage);
//     }
//     return response.json();
// }


// async function createEvent(eventData) {
//     try {
//         const data = await apiFetch('/event/', 'POST', eventData);
//         console.log('Event created successfully:', data);
//         // Refresh or redirect
//     } catch (error) {
//         console.error('Failed to create event:', error);
//         alert('Failed to create event. Please try again.');
//     }
// }


// async function fetchEventsForUser() {
//     try {
//         const events = await apiFetch('/event/', 'GET');
//         console.log('Fetched events:', events);
//         return events; // Process or display events
//     } catch (error) {
//         console.error('Failed to fetch events:', error);
//         alert('Failed to fetch events. Please try again.');
//     }
// }


// async function deleteEvent(eventId) {
//     try {
//         const data = await apiFetch(`/event/${eventId}`, 'DELETE');
//         console.log('Event deleted successfully:', data);
//         // Refresh or update UI as needed
//     } catch (error) {
//         console.error('Failed to delete event:', error);
//         alert('Failed to delete event. Please try again.');
//     }
// }


