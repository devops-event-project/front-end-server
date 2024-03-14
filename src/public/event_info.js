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
    console.log("INITIAL DATA ", initialData);
    
    // Split the attendees string into an array of email addresses
    const attendeesArray = initialData.attendees.split(',').map(email => email.trim());

    // Manually creating a reminders array since initialData does not have one,
    // but we assume each event only has one reminder based on your description
    const remindersArray = [{
        type: initialData.reminderType,
        timeBefore: parseInt(initialData.timeBefore, 10) // Ensure this is a number
    }];

    const transformedData = {
        userID: initialData.userId,
        title: initialData.title,
        description: initialData.description,
        startDateTime: initialData.startDateTime,
        endDateTime: initialData.endDateTime,
        location: initialData.location,
        reminders: remindersArray, // Using the manually created array
        attendees: attendeesArray.map(attendeeEmail => ({
            // Map each email address to the expected object structure
            userID: attendeeEmail,
            attending: "True", // Assuming all provided attendees are attending
        })),
    };

    console.log("TRANSFORMED DATA ", transformedData);
    return transformedData;
}

async function filterEventsByDate() {
    try {
        const selectedDate = document.getElementById('dateFilter').value;
        const events = await fetchEventsForUser(); // Fetch all events

        // Filter events to those that match the selected date
        const filteredEvents = events.filter(event => {
            // Convert both dates to YYYY-MM-DD format for comparison
            const eventDate = new Date(event.startDateTime).toISOString().split('T')[0];
            return eventDate === selectedDate;
        });

        displayEvents(filteredEvents); // Display filtered events
    } catch (error) {
        console.error('Failed to filter events:', error);
    }
}

async function sortEvents(criterion) {
    try {
        const events = await fetchEventsForUser(); // Fetch events

        let sortedEvents;
        if (criterion === 'time') {
            // Sort by startDateTime
            sortedEvents = events.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
        } else if (criterion === 'location') {
            // Sort by location (alphabetically)
            sortedEvents = events.sort((a, b) => a.location.localeCompare(b.location));
        }
        console.log("SORTED EVENTS ", sortedEvents)
        displayEvents(sortedEvents); // Display sorted events
    } catch (error) {
        console.error('Failed to fetch or sort events:', error);
    }
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

// function sortEvents(criteria) {
//     if (criteria === 'time') {
//         events.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
//     } else if (criteria === 'location') {
//         events.sort((a, b) => a.location.localeCompare(b.location));
//     }

//     displayEvents(); 
// }

// function displayEvents(optionalEvents) {
//     // we deleted index
//     // console.log("OPTIONAL EVENTS ", optionalEvents);
//     const token = localStorage.getItem('token');
//     console.log("FUCKING TOKEN ", token);
//     const container = document.getElementById('eventsContainer');
//     container.innerHTML = ''; 

//     const events = optionalEvents || getEventsForCurrentUser(); 
//     // console.log("(GET)INSIDE DISPLAY EVENTS FUNCTION ", events);

//     const events2 = fetchEventsForUser()

//     console.log("(GET)EVENTS FROM BACK END", events2);

//     // code for displaying the events
//     events2.then(function(result) {
//         console.log(result);
    
//         console.log(result[0]); 
    
//         result.forEach(item => {
//             console.log(item); 
//         });
//     }).catch(function(error) {
//         console.error(error);
//     });
    

//     events.forEach((event, index) => {
//         const startTime = new Date(event.startDateTime).toLocaleString('en-GB', {
//             day: '2-digit', month: 'short', year: 'numeric', 
//             hour: '2-digit', minute: '2-digit', hour12: false
//         });
//         const endTime = new Date(event.endDateTime).toLocaleString('en-GB', {
//             hour: '2-digit', minute: '2-digit', hour12: false
//         });

//         const eventBox = document.createElement('div');
//         eventBox.className = 'eventBox';
//         eventBox.innerHTML = `
//             <h2>Event ${index + 1}: ${event.title}</h2>
//             <p>Description: ${event.description}</p>
//             <p>Time: ${startTime} - ${endTime}</p>
//             <p>Location: ${event.location}</p>
//             <button class="delete-btn">Delete</button>
//         `;
//         index = 0
//         const deleteButton = eventBox.querySelector('.delete-btn');
//         deleteButton.addEventListener('click', function() {
//         deleteEvent(index); 
//         deleteEventApi(eventId);
//         console.log("(DELETE) delete event", eventId);
// });
//         container.appendChild(eventBox);
//     });
// }


function displayEvents(optional) {
    const container = document.getElementById('eventsContainer');
    container.innerHTML = ''; // Clear existing content

     // Determine if optional is a Promise or an array
    const isPromise = optional instanceof Promise;

     // If optional is a Promise, wait for it; otherwise, proceed with the provided array
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
            // Event ${index + 1}: 
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

const BASE_URL = 'http://0.0.0.0:8081'; 



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


async function apiFetchPost(data) {
    let url = 'http://0.0.0.0:8081/event/';
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
        method: 'POST', // This sets the HTTP method
        headers: headers,
        // Uncomment and use body if you need to send data with the request
        body: data ? JSON.stringify(transformedData) : undefined,
    };

    const response = await fetch(url, init); // Use the init object here
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

// async function apiFetchGet(url, method, data) {
//     const token = localStorage.getItem('token');
//     const headers = {
//         'Accept': 'application/json',
//         // Uncomment and adjust the Content-Type header as necessary for your request
//         'Content-Type': 'application/json',
        
//     };

//     // Uncomment this if you need to send the Authorization token
//     if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//     }

//     // Prepare the init object for fetch
//     const init = {
//         method: method, // This sets the HTTP method
//         headers: headers,
//         // Uncomment and use body if you need to send data with the request
//         // body: data ? JSON.stringify(data) : undefined,
//     };

//     const response = await fetch(url, init); // Use the init object here
//     if (!response.ok) {
//         const errorMessage = await response.text();
//         throw new Error(errorMessage);
//     }
//     return response.json();
// }



async function fetchEventsForUser() {
    try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        console.log("FUCKING TOKEN ", token);

        let url = 'http://0.0.0.0:8081/event/'; // Your original API endpoint

        // Append the access_token as a query parameter if it exists
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
        throw error; // Rethrow or handle as needed
    }
}


async function deleteEvent(eventId) {
    try {
        const response = await fetch(`http://0.0.0.0:8081/event/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Example: Adjust according to your auth method
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        console.log("RESPONSE IS ", response);
        if (response.ok) {
            console.log(reponse)
            console.log('Event deleted successfully');
            // Call the function to refresh the events list
            
        }
        // } else {
        //     // Handle errors
        //     throw new Error('Failed to delete event');
        // }

        console.log('Event deleted successfully');
        // Optionally: Refresh the event list
    } catch (error) {
        // console.error('Error deleting event:', error);
        // alert('Error deleting event. Please try again.');
        console.log("An error happened", error)
    }
    displayEvents(); // Adjust this to match how you fetch and display events
}
