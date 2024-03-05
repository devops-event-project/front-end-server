document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('calendarForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission
    });
});

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
    // Load saved events from localStorage
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
        events = JSON.parse(savedEvents);
    }

    displayEvents();
};

function submitForm() {
    const form = document.getElementById('calendarForm');
    const formData = new FormData(form);
    
    // Create an object to hold the form data
    let formObject = {};
    
    // Convert FormData into a regular object
    formData.forEach(function(value, key){
        formObject[key] = value;
    });
    
    // Add a randomly generated user ID to the object
    formObject['userId'] = generateRandomUserID();

    events.push(formObject);

    // Convert the object into a JSON string
    let json = JSON.stringify(formObject);

    // console.log('JSON Data:', json);
    console.log('JSON', events)

    // Send the JSON data using Fetch API
    // fetch('your-endpoint-url', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json', // Indicate that we're sending JSON data
    //     },
    //     body: json, // Send the JSON string
    // }).then(response => {
    //     if (response.ok) {
    //         return response.json(); // Assuming the server responds with JSON
    //     }
    //     throw new Error('Network response was not ok.');
    // }).then(data => {
    //     console.log('Success:', data);
    // }).catch(error => {
    //     console.error('There has been a problem with your fetch operation:', error);
    // });
    // Convert events array to a string and save in localStorage
    localStorage.setItem('events', JSON.stringify(events));
    console.log('EVENTS LIST', events);
    form.reset();

    displayEvents(); // Call this function to update the UI with the latest events

    

}

function generateRandomUserID() {
    // This generates a random number between 1 and 10000 as a user ID
    // Adjust the range according to your needs
    return Math.floor(Math.random() * 10000) + 1;
}

function sortEvents(criteria) {
    if (criteria === 'time') {
        // Sort by startDateTime
        events.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
    } else if (criteria === 'location') {
        // Sort alphabetically by location
        events.sort((a, b) => a.location.localeCompare(b.location));
    }

    displayEvents(); // Re-display the events after sorting
}

function displayEvents() {
    const container = document.getElementById('eventsContainer');
    container.innerHTML = ''; // Clear previous content

    events.forEach((event, index) => {
        // Format start and end times
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
    // Confirm before deleting
    if (!confirm("Are you sure you want to delete this event?")) {
        return;
    }

    // Remove the event at the given index
    events.splice(index, 1);
    
    // Update localStorage with the new list of events
    localStorage.setItem('events', JSON.stringify(events));
    
    // Re-display the updated list of events
    displayEvents();
}

