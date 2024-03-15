# Front-End for Event Management Application

## Overview
This documentation outlines the front-end functionality of an Event Management Application designed to allow users to view, create, sort, and filter events. The application provides a user-friendly interface for managing events with functionalities such as user authentication (login/sign-up), event creation, and dynamic event display.

## Features
User Authentication: Users can sign up for a new account and log in to the application. Authentication is handled through a secure API that communicates with the backend.
Event Management: Users can create new events by providing details such as title, description, attendees, date, and time. Events are stored and managed through API calls to the backend.
Dynamic Event Display: The application dynamically displays events from the backend, allowing users to view all the events they have created or are invited to.
Event Sorting and Filtering: Users can sort events based on time or location and filter events by specific dates or locations for better event organization.

## File Structure
login.js: Handles user login and sign-up functionalities, including form submission and API communication for user authentication.
event_info.js: Manages event-related functionalities, including event creation, display, sorting, filtering, and deletion through interactions with the backend API.
login_user_style.css, event_page_style.css: CSS files providing styling for the login/sign-up and event management pages, ensuring a consistent and pleasant user interface.
event_page.html, login_page.html: HTML files defining the structure of the login/sign-up and event management pages, incorporating form elements and placeholders for dynamic content.
server.js: A simple Express.js server script for serving the static files of the front-end application, allowing it to be tested locally or deployed.