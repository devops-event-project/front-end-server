const USER_BASE_URL = 'http://ec2-35-156-28-191.eu-central-1.compute.amazonaws.com/user'; 
// const USER_BASE_URL = 'http://0.0.0.0:8080/user'; 

function getUserData(email) {
    if (!email) {
        email = localStorage.getItem('loggedInUserEmail');
    }
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

async function handleSignUp(email, password) {
    const registrationData = {
        email: email, 
        username: email,
        password: password,
        is_admin: false
    };
    try {
        const response = await fetch(USER_BASE_URL + '/register', { 
            method: 'POST',
        
            headers: {
                'accept': 'application/json',
                
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData)
            
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.detail || 'Failed to register');
        }

        const data = await response.json();
        console.log("Registration successful", data);

        alert('Signup successful! Please login.');
     
        return data;
    } catch (error) {
        console.error('Registration failed:', error);
        alert(`Signup failed: ${error.message}`);
        
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        handleSignUp(email, password);
    });
});


async function handleLogin(email, password) {
    try {
        const response = await fetch(USER_BASE_URL + '/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username: email, 
                password: password,
            })
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        localStorage.setItem('token', data.access_token);
        localStorage.setItem('loggedInUserEmail', email);

        window.location.href = 'event_page.html';
    } catch (error) {
        console.error('Login error:', error);
        alert('Invalid login credentials.'); 
        throw error; 
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await handleLogin(email, password);
            // Successful login redirects inside handleLogin
        } catch (error) {
            // Login failed, error handling is inside handleLogin
        }
    });
});
