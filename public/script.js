document.addEventListener("DOMContentLoaded", () => {
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const messagesDiv = document.getElementById('messages');
  const typingIndicator = document.getElementById('typing-indicator');

  const sendMessage = async () => {
    const message = messageInput.value.trim();
    if (message === "") return;

    // Display user's message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.textContent = `You: ${message}`;
    messagesDiv.appendChild(userMessageDiv);

    // Clear the input field
    messageInput.value = "";

    // Show typing indicator
    typingIndicator.style.display = 'block';

    // Send the message to the server
    try {
      const response = await fetch('/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: message })
      });
      const data = await response.json();

      // Hide typing indicator
      typingIndicator.style.display = 'none';

      // Display assistant's response
      const assistantMessageDiv = document.createElement('div');
      assistantMessageDiv.textContent = `SerGe: ${data.output}`;
      messagesDiv.appendChild(assistantMessageDiv);
    } catch (error) {
      console.error('Error:', error);
      typingIndicator.style.display = 'none';
    }
  };

  // Send message when the button is clicked
  sendButton.addEventListener('click', sendMessage);

  // Send message when Enter key is pressed
  messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });
});
