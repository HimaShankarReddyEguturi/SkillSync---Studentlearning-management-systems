const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function addMessageToChat(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessageToChat(userMessage, 'user');
        userInput.value = ''; // Clear input
        const botResponse = await getBotResponse(userMessage);
        addMessageToChat(botResponse, 'bot');
    }
});

// Allow pressing Enter to send a message
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

// Function to get bot response from the server
async function getBotResponse(userMessage) {
    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });
        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error('Error:', error);
        return "Sorry, I couldn't get a response.";
    }
}