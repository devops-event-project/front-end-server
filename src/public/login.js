function handleSignUp() {
    const userData = {
        email: document.getElementById('signupEmail').value,
        password: document.getElementById('signupPassword').value,
        // Reminder: Hash passwords before storing in a real application!
    };

    // Store userData object as a string in localStorage
    localStorage.setItem('user', JSON.stringify(userData));

    alert('User signed up successfully!');
    
    // Optionally, log the data to console immediately after signup
    getUserData(); // This will console.log the user data
}

document.addEventListener('DOMContentLoaded', (event) => {
    getUserData();
});

// getUserData(); 


function getUserData() {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        console.log(userData);
        // Use userData as needed
    }
}



// async function handleSignUp() {
//     const userData = {
//         email: document.getElementById('signupEmail').value,
//         password: document.getElementById('signupPassword').value,
//         // Ensure you hash passwords before sending them over the internet!
//     };

//     try {
//         const response = await fetch('https://backend.com/api/signup', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(userData),
//         });

//         if (!response.ok) throw new Error('Network response was not ok');

//         const result = await response.json();
//         console.log(result);
//         alert('User signed up successfully!');
//     } catch (error) {
//         console.error('Signup error:', error);
//         alert('Failed to sign up');
//     }
// }


