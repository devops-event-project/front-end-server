function handleSignUp() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const hashedPassword = btoa(password);

    // Construct the user data object
    const userData = { email, hashedPassword }; // Add more fields as needed

    localStorage.setItem(email, JSON.stringify(userData));

    alert('User signed up successfully!');
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Select the signup form
    const signupForm = document.getElementById('signupForm');

    // Add an event listener for the 'submit' event
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission behavior

        // Call the handleSignUp function to process the signup
        handleSignUp();
    });
});

// getUserData(); 

function logAllLocalStorageData() {
    console.log('All saved user data in localStorage:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`Key: ${key}, Value: ${value}`);
    }
}


function getUserData(email) {
    if (!email) {
        console.log("I was here");
        // If no email is provided, attempt to get the logged-in user's email
        email = localStorage.getItem('loggedInUserEmail');
    }
    console.log("I got here");
    if (email) {
        const userDataString = localStorage.getItem(email);
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            console.log("Retrieved User Data:", userData);
        } else {
            console.log("User data not found for:", email);
        }
    } else {
        console.log("No user is currently logged in or specified.");
    }
}





document.addEventListener('DOMContentLoaded', (event) => {
    console.log("I WAS PRESENT AT LOGIN");
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from submitting normally

        const email = document.getElementById('loginEmail').value; 
        const password = document.getElementById('loginPassword').value;
        const hashedPassword = btoa(password); // Simple encoding for demonstration
        const storedUserDataString = localStorage.getItem(email);
        console.log('I WAS HERE lala');
        console.log("STORED STRING", storedUserDataString);

        if (storedUserDataString) {
            console.log("GONE");
            // const storedUserData = JSON.parse(storedUserDataString);
            // console.log("STORED USER DATA: ", storedUserData);
            if (storedUserDataString === hashedPassword) {
                localStorage.setItem('loggedInUserEmail', email);
                window.location.href = 'event_page.html';
            } else {
                alert('Invalid login credentials.');
            }
        } else {
            alert('Invalid login credentials.');
        }
    });
});
