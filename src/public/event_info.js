document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('calendarForm').addEventListener('submit', function(e) {
        e.preventDefault();
    });
});

// attendees: "Event@gmail.com"
// description: "Event"
// endDateTime: "2024-03-14T13:31"
// location: "Event"
// reminderType: "email"
// startDateTime: "2024-03-13T13:31"
// timeBefore: "20"
// title: "Event"
// userId: "a@gmail.com"

function transformEventData(initialData) {
    // Transform the initial data into the desired format
    const transformedData = {
      userID: initialData.userId, // Assuming the initial data has a userID
      title: initialData.title, // Directly copying title
      description: initialData.description, // Directly copying description
      startDateTime: initialData.startDateTime, // Formatting or copying startDateTime
      endDateTime: initialData.endDateTime, // Formatting or copying endDateTime
      location: initialData.location, // Directly copying location
      reminders: initialData.reminders.map(reminder => ({
        // Assuming the structure of reminders is suitable or adjusting as necessary
        type: initialData.reminderType,
        timeBefore: initialData.timeBefore,
      })),
      attendees: initialData.attendees.map(attendee => ({
        // Transforming each attendee and setting attending flag to "True"
        userID: attendee.userId,
        attending: "True", // Ensuring the attending flag is always "True"
      })),
    };
    

    console.log("TRANSFORMED DATA ", transformedData);
    return transformedData;
  }


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

    console.log("EVENT TO POST ", formObject)
    const response = createEvent(formObject)

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

function sortEvents(criteria) {
    if (criteria === 'time') {
        events.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
    } else if (criteria === 'location') {
        events.sort((a, b) => a.location.localeCompare(b.location));
    }

    displayEvents(); 
}

function displayEvents(optionalEvents) {

    // console.log("OPTIONAL EVENTS ", optionalEvents);
    const container = document.getElementById('eventsContainer');
    container.innerHTML = ''; 

    const events = optionalEvents || getEventsForCurrentUser(); 
    // console.log("(GET)INSIDE DISPLAY EVENTS FUNCTION ", events);

    const events2 = fetchEventsForUser()

    console.log("(GET)EVENTS FROM BACK END", events2);

    // code for displaying the events
    events2.then(function(result) {
        console.log(result);
    
        console.log(result[0]); 
    
        result.forEach(item => {
            console.log(item); 
        });
    }).catch(function(error) {
        console.error(error);
    });
    

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
        deleteEventApi
});
        container.appendChild(eventBox);
    });
}

function getEventsForCurrentUser() {
    const loggedInUserId = localStorage.getItem('loggedInUserEmail'); 
    // console.log('Logged-in User ID:', loggedInUserId);
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

function populateLocationDropdown() {
    const locationFilter = document.getElementById('locationFilter');
    const events = getEventsForCurrentUser();

    // Extract unique locations
    const uniqueLocations = Array.from(new Set(events.map(event => event.location)));

    // Populate the dropdown
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

    // Filter if a specific location is selected
    if (selectedLocation !== "all") {
        filteredEvents = filteredEvents.filter(event => event.location === selectedLocation);
    }

    displayEvents(filteredEvents); 
});


// const response = await fetch('http://0.0.0.0:8080/user/register', { 
//     method: 'POST',

    // headers: {
    //     'accept': 'application/json',
        
    //     'Content-Type': 'application/json',
    // },
//     body: JSON.stringify(registrationData)
    
// });

const EVENT_BASE_URL = ''; 




async function createEvent(eventData) {
    try {
        const data = await apiFetch('http://0.0.0.0:8081/event/', 'POST', eventData);
        console.log('Event created successfully:', data);
        // Refresh or redirect
            // TODO - response with message codes 200, 404, 500
    } catch (error) {
        console.error('Failed to create event:', error);
        alert('Failed to create event. Please try again.');
    }
}


async function apiFetchPost(url, method, data) {
    const token = localStorage.getItem('token');
    const transformedData = transformEventData(data)
    const headers = {
        'Accept': 'application/json',
        // Uncomment and adjust the Content-Type header as necessary for your request
        'Content-Type': 'application/json',
    };

    // Uncomment this if you need to send the Authorization token
    // if (token) {
    //     headers['Authorization'] = `Bearer ${token}`;
    // }

    // Prepare the init object for fetch
    const init = {
        method: method, // This sets the HTTP method
        headers: headers,
        // Uncomment and use body if you need to send data with the request
        body: data ? JSON.stringify(transformedData) : undefined,
    };

    const response = await fetch(url, init); // Use the init object here
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
    return response.json();
}

async function apiFetch(url, method, data) {
    const token = localStorage.getItem('token');
    const headers = {
        'Accept': 'application/json',
        // Uncomment and adjust the Content-Type header as necessary for your request
        'Content-Type': 'application/json',
    };

    // Uncomment this if you need to send the Authorization token
    // if (token) {
    //     headers['Authorization'] = `Bearer ${token}`;
    // }

    // Prepare the init object for fetch
    const init = {
        method: method, // This sets the HTTP method
        headers: headers,
        // Uncomment and use body if you need to send data with the request
        // body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(url, init); // Use the init object here
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
    return response.json();
}

async function fetchEventsForUser() {
    try {
        const events = await apiFetch('http://0.0.0.0:8081/event/', 'GET');
        // console.log('Fetched events:', events);
        return events; // Process or display events
    } catch (error) {
        console.error('Failed to fetch events:', error);
        alert('Failed to fetch events. Please try again.');
    }
}


async function deleteEventApi(eventId) {
    try {
        const data = await apiFetch(`/event/${eventId}`, 'DELETE');
        console.log('Event deleted successfully:', data);
        // Refresh or update UI as needed
    } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Failed to delete event. Please try again.');
    }
}


