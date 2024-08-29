import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getDatabase, ref, set, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyCQJgyILZvOygQQZ1KApqBdi0QNHMPhkRQ",
    authDomain: "chatroom-d8bde.firebaseapp.com",
    databaseURL: "https://chatroom-d8bde-default-rtdb.firebaseio.com",
    projectId: "chatroom-d8bde",
    storageBucket: "chatroom-d8bde.appspot.com",
    messagingSenderId: "557056104899",
    appId: "1:557056104899:web:76d88d284c34338a90c576",
    measurementId: "G-G93LKCFC51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const chatRef = ref(db, 'chat');

// Function to send a message
function sendMessage(username, message) {
    const newMessageRef = ref(db, 'chat/' + Date.now());
    set(newMessageRef, {
        username: username,
        message: message,
        timestamp: Date.now()
    });
}

// Function to listen for new messages
function listenForMessages(callback) {
    onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
}

// Function to clear chat history
function clearChatHistory() {
    remove(chatRef)
        .then(() => {
            console.log('Chat history cleared successfully.');
        })
        .catch((error) => {
            console.error('Error clearing chat history:', error);
        });
}

// Function to check if the user is Howellissosmart
function checkUser(username) {
    if (username === "howellissosmart") {
        document.getElementById('clearButton').style.display = 'block'; // Show button
    } else {
        document.getElementById('clearButton').style.display = 'none'; // Hide button
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('username').value = username;
        checkUser(username); // Check the username to conditionally show the button
    } else {
        window.location.href = 'index.html'; // Redirect to the username page if no username
    }
});

// Add event listener for the clear button
document.getElementById('clearButton').addEventListener('click', () => {
    clearChatHistory();
});

// Example usage: Send a message
document.getElementById('sendButton').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value.trim();
    if (message) {
        sendMessage(username, message);
        document.getElementById('message').value = ''; // Clear the input field after sending
        const messageList = document.getElementById('messageList');
        messageList.scrollTop = messageList.scrollHeight; // Auto-scroll to the most recent message
    }
});

// Example usage: Listen for new messages
listenForMessages((messages) => {
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = ''; // Clear existing messages
    for (let key in messages) {
        const message = messages[key];
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.username}: ${message.message}`;
        messageList.appendChild(messageElement);
    }
    messageList.scrollTop = messageList.scrollHeight; // Auto-scroll to the most recent message
});
