document.getElementById('showMessage').addEventListener('click', () => {
    const message = document.getElementById('message');
    message.textContent = 'Hello, this message was dynamically added!';
    message.style.color = 'green';
  });
  