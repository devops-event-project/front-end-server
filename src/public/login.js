function handleSignUp() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const hashedPassword = btoa(password);

    const userData = { email, hashedPassword }; 

    localStorage.setItem(email, JSON.stringify(userData));

    alert('User signed up successfully!');
}

document.addEventListener('DOMContentLoaded', (event) => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        handleSignUp();
    });
});


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
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const hashedPassword = btoa(password); // Base64 encode the password
        
        const storedUserDataString = localStorage.getItem(email); // Retrieve the user data string from localStorage

        if (storedUserDataString) {
            const userObject = JSON.parse(storedUserDataString); // Parse the stored user data string into an object

            // Access the hashedPassword property from the object
            const hashedPassword_storage = userObject.hashedPassword;

            if (hashedPassword_storage === hashedPassword) {
                console.log("Password match. Logging in...");
                localStorage.setItem('loggedInUserEmail', email); // Mark the user as logged in
                window.location.href = 'event_page.html'; // Redirect to the events page
            } else {
                console.log("Password mismatch.");
                alert('Invalid login credentials.'); // Alert if the passwords do not match
            }
        } else {
            alert('Invalid login credentials.'); // Alert if there's no data for the provided email
        }
    });
});
