document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  let username = ''; // New variable to store the username

  const usernameInput = document.getElementById('usernameInput');
  const messagesContainer = document.getElementById('messagesContainer');
  const messageInput = document.getElementById('messageInput');
  const sendMessageBtn = document.getElementById('sendMessageBtn');

  // Listen for username input and set the username
  usernameInput.addEventListener('change', () => {
    username = usernameInput.value.trim();
    if (username === '') {
      alert('Please enter a valid username.');
      usernameInput.value = '';
    }
  });

  // Listen for incoming messages
  socket.on('update_messages', (messages) => {
    displayMessages(messages);
  });

  // Function to display messages
  function displayMessages(messages) {
    messagesContainer.innerHTML = '';
    messages.forEach((message) => {
      const messageElement = document.createElement('div');
      messageElement.textContent = message;
      messagesContainer.appendChild(messageElement);
    });
  }

  // Listen for new messages from the user
  sendMessageBtn.addEventListener('click', () => {
    const newMessage = messageInput.value.trim();
    if (newMessage !== '' && username !== '') {
      // Send the new message with username to the server
      socket.emit('new_message', `${username}: ${newMessage}`);
      messageInput.value = '';
    } else {
      alert('Please enter a valid message and username.');
    }
  });

  // Focus on the username input when the page loads
  usernameInput.focus();
});