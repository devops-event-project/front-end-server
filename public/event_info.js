/**
 * Event Management Frontend Script for Microservice Architecture
 * 
 * This script is an integral part of the frontend for an Event Management System
 * designed to operate within a microservice architecture. It facilitates interaction
 * between the client-side and various backend services through RESTful API calls,
 * focusing on event operations such as creation, display, filtering, sorting, and deletion.
 * The script enhances the user interface by dynamically updating an HTML page with event data,
 * utilizing modern web technologies for asynchronous data handling and DOM manipulation.
 * 
 * Key Features:
 * - Dynamically submit new events to the backend and display them on an HTML page.
 * - Provide interactive filtering by date and location, and sorting by time or location.
 * - Enable users to delete events, with confirmation prompts for security.
 * - Automatically populate filter dropdowns based on event data.
 * 
 * Structure:
 * The script organizes functionalities into sections for ease of maintenance and scalability:
 * - Utility functions for data transformation and validation.
 * - Core functionalities that implement the script's main features.
 * - Event handling and DOM manipulations for interactive UI elements.
 * - API communication methods for interfacing with backend services.
 * - Event filters and sorters to enhance data viewing.
 * - Initialization and event listeners to bootstrap and respond to user actions.
 * 
 * Dependencies:
 * Requires a web environment capable of ES6 and Fetch API. It should be connected to an HTML
 * page designed with IDs and classes that match the script's selectors. Backend services must
 * be properly configured and running to handle API requests.
 *
 * */

const EVENT_BASE_URL = 'http://ec2-18-184-151-174.eu-central-1.compute.amazonaws.com/event'; 
// const EVENT_BASE_URL = 'http://0.0.0.0:8081/event'; 

/************* UTILITY AND HELPER FUNCTIONS **************/

/**
 * Transforms form data into the format required by the API.
 * 
 * @param {Object} initialData - Data collected from the form.
 * @returns {Object} Transformed data ready for API submission.
 */
function transformEventData(initialData) {

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

    return transformedData;
}


/**
 * Validates the format of attendee emails.
 * 
 * @param {String} attendees - Comma-separated string of attendee emails.
 * @returns {Boolean} True if all emails are valid, false otherwise.
 */
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


/**
 * Validates form data before submission.
 * 
 * @param {Object} formObject - The form data as an object.
 * @returns {Boolean} True if the form data is valid, false otherwise.
 */
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


/************** CORE FUNCTIONALITIES **************/


/**
 * Handles form submission, including data validation, transformation, and API submission.
 */
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

    const response = apiFetchPost(formObject)

    const userEventsKey = `events_${loggedInUserId}`;
    const existingEvents = JSON.parse(localStorage.getItem(userEventsKey)) || [];

    existingEvents.push(formObject);

    localStorage.setItem(userEventsKey, JSON.stringify(existingEvents));

    form.reset();
    displayEvents();
}

/**
 * Clears session and local storage to log out the user and redirects to the login page.
 */
function logout() {

    sessionStorage.clear(); 
    localStorage.setItem('loggedInUserEmail', "None");
    window.location.href = 'index.html';
}


/*************** EVENT HANDLING AND DOM MANIPULATIONS **************/


/**
 * Displays events on the page. Optionally accepts an array of events to display, otherwise fetches events for the current user.
 * 
 * @param {Array} [optionalEvents] - An optional array of event objects to display.
 */
function displayEvents(optional) {
    const container = document.getElementById('eventsContainer');
    container.innerHTML = ''; 

    const isPromise = optional instanceof Promise;

    let eventsToDisplayPromise = optional ? Promise.resolve(optional) :fetchEventsForUser();

    eventsToDisplayPromise.then(events => {

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


/*************** API COMMUNICATION **************/


/**
 * Posts event data to the API.
 * 
 * @param {Object} data - The event data to post.
 * @returns {Promise} A promise that resolves with the API response.
 */
async function apiFetchPost(data) {
    let url = EVENT_BASE_URL + '/create';
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
    return response.json();
}

/**
 * Fetches events for the current user from the API.
 * 
 * @returns {Promise<Array>} A promise that resolves with an array of event objects.
 */
async function fetchEventsForUser() {
    try {
        const token = localStorage.getItem('token'); 

        // let url = 'http://ec2-3-123-33-105.eu-central-1.compute.amazonaws.com/event/';
        let url = EVENT_BASE_URL;

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

/**
 * Sends a request to delete an event via the API.
 * 
 * @param {String} eventId - The ID of the event to delete.
 */
async function deleteEvent(eventId) {
    try {
        const response = await fetch(EVENT_BASE_URL + `/${eventId}`, {
            method: 'DELETE',
            headers: {
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        if (response.ok) {
            console.log('Event deleted successfully');            
        }
    
        console.log('Event deleted successfully');
    } catch (error) {
        
        console.log("An error happened", error)
    }
    displayEvents(); 
}

/** EVENT FILTERS AND SORTERS */


/**
 * Sorts events based on a specified criterion ('time' or 'location').
 * 
 * @param {String} criterion - The criterion by which to sort events.
 */
async function sortEvents(criterion) {
    try {
        const events = await fetchEventsForUser(); 

        let sortedEvents;
        if (criterion === 'time') {

            sortedEvents = events.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
        } else if (criterion === 'location') {

            sortedEvents = events.sort((a, b) => a.location.localeCompare(b.location));
        }
        displayEvents(sortedEvents); 
    } catch (error) {
        console.error('Failed to fetch or sort events:', error);
    }
}

/**
 * Filters events to those occurring on a specified date.
 */
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

/*************** EVENT LISTENERS **************/

/**
 * Initializes application functionalities once the DOM content has fully loaded.
 * This includes setting up form submission behavior and handling click events for dynamically generated delete buttons.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('calendarForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitForm(); 
    });

    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const eventId = event.target.getAttribute('data-event-id');
            deleteEvent(eventId);
        }
    });
    displayEvents();
});









