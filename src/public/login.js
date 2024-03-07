
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
        
        const storedUserDataString = localStorage.getItem(email); 

        if (storedUserDataString) {
            const userObject = JSON.parse(storedUserDataString); 

            const hashedPassword_storage = userObject.hashedPassword;

            if (hashedPassword_storage === hashedPassword) {
                console.log("Password match. Logging in...");
                localStorage.setItem('loggedInUserEmail', email); 
                window.location.href = 'event_page.html'; 
            } else {
                console.log("Password mismatch.");
                alert('Invalid login credentials.'); 
            }
        } else {
            alert('Invalid login credentials.'); 
        }
    });
});




// const API_BASE_URL = '/user'; 

// async function handleSignUp(email, password) {
//     const registrationData = {
//         email: email, 
//         password: password,
//     };

//     try {
//         const response = await fetch('/user/register', { 
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(registrationData)
//         });

//         if (!response.ok) {
//             const errorData = await response.json(); 
//             throw new Error(errorData.detail || 'Failed to register');
//         }

//         const data = await response.json();
//         console.log("Registration successful", data);

//         alert('Signup successful! Please login.');
     
//         return data;
//     } catch (error) {
//         console.error('Registration failed:', error);
//         alert(`Signup failed: ${error.message}`);
        
//     }
// }


// document.addEventListener('DOMContentLoaded', () => {
//     const signupForm = document.getElementById('signupForm');

//     signupForm.addEventListener('submit', async function(event) {
//         event.preventDefault(); 
        
//         const email = document.getElementById('signupEmail').value;
//         const password = document.getElementById('signupPassword').value;

//         handleSignUp(email, password);
//     });
// });


// async function handleLogin(email, password) {
//     try {
//         const response = await fetch('/user/login', { 
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             body: new URLSearchParams({
//                 username: email, 
//                 password: password,
//             })
//         });

//         if (!response.ok) {
//             throw new Error(`Login failed: ${response.status} ${response.statusText}`);
//         }

//         const data = await response.json();
//         console.log("Login successful, received token:", data.access_token);

//         localStorage.setItem('token', data.access_token);
//         localStorage.setItem('loggedInUserEmail', email);

//         window.location.href = 'event_page.html';
//     } catch (error) {
//         console.error('Login error:', error);
//         alert('Invalid login credentials.'); 
//         throw error; 
//     }
// }


// document.addEventListener('DOMContentLoaded', () => {
//     const loginForm = document.getElementById('loginForm');
//     loginForm.addEventListener('submit', async function(event) {
//         event.preventDefault();

//         const email = document.getElementById('loginEmail').value;
//         const password = document.getElementById('loginPassword').value;

//         try {
//             await handleLogin(email, password);
//             // Successful login redirects inside handleLogin
//         } catch (error) {
//             // Login failed, error handling is inside handleLogin
//         }
//     });
// });
