document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('calendarForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission
    });
});

let events = [];


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
    fetch('your-endpoint-url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Indicate that we're sending JSON data
        },
        body: json, // Send the JSON string
    }).then(response => {
        if (response.ok) {
            return response.json(); // Assuming the server responds with JSON
        }
        throw new Error('Network response was not ok.');
    }).then(data => {
        console.log('Success:', data);
    }).catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function generateRandomUserID() {
    // This generates a random number between 1 and 10000 as a user ID
    // Adjust the range according to your needs
    return Math.floor(Math.random() * 10000) + 1;
}
