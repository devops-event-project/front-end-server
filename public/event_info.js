const EVENT_BASE_URL = 'http://ec2-3-123-33-105.eu-central-1.compute.amazonaws.com/event/'; 

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('calendarForm').addEventListener('submit', function(e) {
        e.preventDefault();
    });
});

function transformEventData(initialData) {
    console.log("INITIAL DATA ", initialData);

    const attendeesArray = initialData.attendees.split(',').map(email => email.trim());

    const remindersArray = [{
        type: initialData.reminderType,
        timeBefore: parseInt(initialData.timeBefore, 10) 
    }];

    const transformedData = {
        userID: initialData.userId,
        title: initialData.title,
        description: initialData.description,
        startDateTime: initialData.startDateTime,
        endDateTime: initialData.endDateTime,
        location: initialData.location,
        reminders: remindersArray, 
        attendees: attendeesArray.map(attendeeEmail => ({

            userID: attendeeEmail,
            attending: "True", 
        })),
    };

    console.log("TRANSFORMED DATA ", transformedData);
    return transformedData;
}

async function filterEventsByDate() {
    try {
        const selectedDate = document.getElementById('dateFilter').value;
        const events = await fetchEventsForUser(); 

        const filteredEvents = events.filter(event => {

            const eventDate = new Date(event.startDateTime).toISOString().split('T')[0];
            return eventDate === selectedDate;
        });

        displayEvents(filteredEvents); 
    } catch (error) {
        console.error('Failed to filter events:', error);
    }
}

async function sortEvents(criterion) {
    try {
        const events = await fetchEventsForUser(); 

        let sortedEvents;
        if (criterion === 'time') {

            sortedEvents = events.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
        } else if (criterion === 'location') {

            sortedEvents = events.sort((a, b) => a.location.localeCompare(b.location));
        }
        console.log("SORTED EVENTS ", sortedEvents)
        displayEvents(sortedEvents); 
    } catch (error) {
        console.error('Failed to fetch or sort events:', error);
    }
}

function logout() {

    sessionStorage.clear(); 
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

    console.log("EVENT TO POST ", formObject)
    const response = apiFetchPost(formObject)

    console.log("RESPONSE here form submission(POST): ", response)

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

function displayEvents(optional) {
    const container = document.getElementById('eventsContainer');
    container.innerHTML = ''; 

    const isPromise = optional instanceof Promise;

    let eventsToDisplayPromise = optional ? Promise.resolve(optional) :fetchEventsForUser();

    eventsToDisplayPromise.then(events => {
        console.log("(GET)EVENTS FROM BACK END", events);

        events.forEach((event, index) => {
            const startTime = new Date(event.startDateTime).toLocaleString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: false
            });
            const endTime = new Date(event.endDateTime).toLocaleString('en-GB', {
                hour: '2-digit', minute: '2-digit', hour12: false
            });

            const attendeesInfo = event.attendees.map(a => `
                <div class="attendee-info">${a.userID} <span class="attendance-indicator" style="background-color: ${a.attending === "True" ? 'green' : 'red'};"></span></div>
            `).join('');

            const eventBox = document.createElement('div');
            eventBox.className = 'eventBox';
            eventBox.innerHTML = `
                <h2>${event.title}</h2>
                <p>Description: ${event.description}</p>
                <p>Time: ${startTime} - ${endTime}</p>
                <p>Location: ${event.location}</p>
                <p>Reminder: 20 minutes before</p>
                <div>Attendees: ${attendeesInfo}</div>
                <button class="delete-btn" data-event-id="${event._id}">Delete</button>
            `;

            container.appendChild(eventBox);
        });

        if (!document.getElementById('event-style')) {
            const style = document.createElement('style');
            style.id = 'event-style';

            document.head.appendChild(style);
        }
    }).catch(function(error) {
        console.error(error);
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const eventId = event.target.getAttribute('data-event-id');
            console.log("Delete button clicked, EVENT ID IS", eventId);
            deleteEvent(eventId);
        }
    });
});

function getEventsForCurrentUser() {
    const loggedInUserId = localStorage.getItem('loggedInUserEmail'); 

    if (!loggedInUserId) {
        console.log("No logged-in user found.");
        return [];
    }

    const userEventsKey = `events_${loggedInUserId}`;
    const eventsJson = localStorage.getItem(userEventsKey);

    const events = eventsJson ? JSON.parse(eventsJson) : [];

    return events;
}

function populateLocationDropdown() {
    const locationFilter = document.getElementById('locationFilter');
    const events = getEventsForCurrentUser();

    const uniqueLocations = Array.from(new Set(events.map(event => event.location)));

    uniqueLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });

}

document.getElementById('applyLocationFilter').addEventListener('click', () => {
    const selectedLocation = document.getElementById('locationFilter').value;
    let filteredEvents = getEventsForCurrentUser();

    if (selectedLocation !== "all") {
        filteredEvents = filteredEvents.filter(event => event.location === selectedLocation);
    }

    displayEvents(filteredEvents); 
});

async function createEvent(eventData) {
    try {
        const data = await apiFetch(EVENT_BASE_URL, 'POST', eventData);
        console.log('Event created successfully:', data);

    } catch (error) {
        console.error('Failed to create event:', error);
        alert('Failed to create event. Please try again.');
    }
}

async function apiFetchPost(data) {
    let url = EVENT_BASE_URL;
    const token = localStorage.getItem('token');
    const transformedData = transformEventData(data)
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    const init = {
        method: 'POST',
        headers: headers,
        body: data ? JSON.stringify(transformedData) : undefined,
    };

    const response = await fetch(url, init); 
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
    else{
        console.log("POST WAS SUCCESFUL!!!!!")
        displayEvents();
    }

    return response.json();
}

async function fetchEventsForUser() {
    try {
        const token = localStorage.getItem('token'); 
        console.log("FUCKING TOKEN ", token);

        let url = 'http://ec2-3-123-33-105.eu-central-1.compute.amazonaws.com/event/';

        if (token) {
            url += `?access_token=${encodeURIComponent(token)}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch events:', error);
        throw error; 
    }
}

async function deleteEvent(eventId) {
    try {
        const response = await fetch(EVENT_BASE_URL + `${eventId}`, {
            method: 'DELETE',
            headers: {
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        console.log("RESPONSE IS ", response);
        if (response.ok) {
            console.log(reponse)
            console.log('Event deleted successfully');            
        }
    
        console.log('Event deleted successfully');
    } catch (error) {
        
        console.log("An error happened", error)
    }
    displayEvents(); 
}
