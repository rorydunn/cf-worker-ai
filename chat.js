document.getElementById('chatForm').onsubmit = async function(e) {
    e.preventDefault(); // Prevent the form from submitting traditionally

    const userInputField = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const userInput = userInputField.value;
    userInputField.value = ''; // Clear the input field

    // Display user message
    chatBox.innerHTML += `<div class="message"><span class="user">User:</span> ${userInput}</div>`;

    // Add blinking cursor to indicate loading
    const cursor = document.createElement('span');
    cursor.className = 'blinking-cursor';
    chatBox.appendChild(cursor);

    // Sending the POST request to your Cloudflare Worker
    const response = await fetch('https://your-cloudflare-worker.com/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput })
    });

    // Remove blinking cursor after receiving response
    chatBox.removeChild(cursor);

    if (response.ok) {
        const tasks = await response.json();
        const aiResponse = tasks.length > 0 && tasks[0].response ? tasks[0].response.response : "No response";
        chatBox.innerHTML += `<div class="message"><span class="ai">AI:</span><pre><code class="language-javascript">${aiResponse}</code></pre></div>`;
    } else {
        chatBox.innerHTML += `<div class="message"><span class="ai">AI:</span> Sorry, I couldn't process your message.</div>`;
    }

    // Keep the chatBox scrolled to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
};

// Function to add messages to the chat box
function addMessage(content, isCode = false, language = 'javascript') {
    const chatBox = document.getElementById('chatBox');
    let messageHTML = '';
  
    if (isCode) {
      // For code, use the <pre> and <code> tags with PrismJS class for syntax highlighting
      messageHTML = `<div class="message"><pre><code class="language-${language}">${content}</code></pre></div>`;
    } else {
      // For regular text
      messageHTML = `<div class="message">${content}</div>`;
    }
  
    chatBox.innerHTML += messageHTML;
    Prism.highlightAll(); // Trigger PrismJS to highlight new code blocks
    chatBox.scrollTop = chatBox.scrollHeight; // Keep the chatBox scrolled to the bottom
  }
  
