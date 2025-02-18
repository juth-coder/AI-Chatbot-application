document.addEventListener("DOMContentLoaded", function () {
    const chatBody = document.querySelector(".chat-form");
    const messageInput = document.querySelector(".message-input");
    const API_KEY = "AIzaSyBWr4NHHAeu6nddHmWkZ_c6MGXzSIJttyI"; // Replace with your actual API key

    function appendMessage(sender, text) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender === "bot" ? "bot-message" : "user-message");
        messageDiv.innerHTML = `<div class="message-text">${text}</div>`;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    async function getGeminiResponse(userMessage) {
        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=" + API_KEY;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: userMessage }] }] })
            });

            const data = await response.json();
            const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand that.";
            appendMessage("bot", botResponse);
        } catch (error) {
            console.error("Error:", error);
            appendMessage("bot", "Error retrieving response. Please try again.");
        }
    }

    document.querySelector(".chat-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;

        appendMessage("user", userMessage);
        messageInput.value = "";
        getGeminiResponse(userMessage);
    });
});

