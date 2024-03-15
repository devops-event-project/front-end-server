/**
 * Frontend Authentication Script
 * 
 * This script manages user registration and login functionalities for a web application.
 * It interfaces with the backend authentication service to register new users and authenticate existing users.
 * Upon successful registration or login, the user is redirected to the main event page.
 * 
 * Features:
 * - User registration with email, password, and additional security measures.
 * - User login with email and password, including token storage for session management.
 * - Error handling for both registration and login processes.
 * 
 * The script utilizes modern asynchronous JavaScript (async/await) for network requests,
 * leveraging the Fetch API for communication with the backend server. It ensures a smooth
 * user experience by handling form submissions without page reloads and providing immediate
 * feedback on the authentication process.
 * 
 * Note: This script assumes the presence of HTML elements with specific IDs for the forms and input fields.
 *       It also relies on a global `USER_BASE_URL` variable that specifies the backend service URL.
 */


const USER_BASE_URL = 'http://ec2-35-156-28-191.eu-central-1.compute.amazonaws.com/user'; 
// const USER_BASE_URL = 'http://0.0.0.0:8080/user'; 


/**
 * Asynchronously registers a new user with the provided email and password.
 * This function sends the user registration data to the backend's "/register" endpoint
 * using the POST method and handles the response.
 * 
 * @param {string} email - User's email address to register.
 * @param {string} password - User's chosen password for registration.
 * @returns {Promise<Object>} The response data from the registration API call.
 * @throws {Error} When registration fails.
 */
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


/**
 * Asynchronously handles user login with the provided email and password.
 * Sends login credentials to the backend's "/login" endpoint using the POST method.
 * On successful login, stores the received access token and the user's email in localStorage
 * and redirects to the event page.
 * 
 * @param {string} email - User's email address for login.
 * @param {string} password - User's password for login.
 * @throws {Error} When login fails.
 */
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


/**
 * Initializes event listeners for the login form on document load.
 * Prevents the default form submission action, retrieves email and password from the form inputs,
 * and invokes the handleLogin function with these credentials.
 */
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

/**
 * This function sets up an event listener for the signup form. 
 * When the form is submitted, it prevents the default action, 
 * extracts the email and password from the form fields, and passes 
 * them to the handleSignUp function for processing.
 */
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        handleSignUp(email, password);
    });
});
