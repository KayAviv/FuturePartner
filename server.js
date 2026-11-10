const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/manifest.json', (req, res) => {
    res.json({
        "name": "FuturePartner",
        "short_name": "FuturePartner",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#131314",
        "theme_color": "#131314",
        "orientation": "portrait",
        "icons": [
            {
                "src": "image_8.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "image_8.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    });
});

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    const query = message ? message.trim() : '';

    if (!query) {
        return res.json({ reply: "I am listening. How can I help you today?" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.json({ reply: "Error: GEMINI_API_KEY is missing in Render Environment Variables!" });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: query }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.json({ reply: "Google API Error: " + data.error.message });
        }

        const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiReply) {
            return res.json({ reply: aiReply });
        } else {
            return res.json({ reply: "Received empty response from Gemini model." });
        }

    } catch (error) {
        console.error("Fetch Error:", error);
        return res.json({ reply: "Server connection error: " + error.message });
    }
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="manifest" href="/manifest.json">
            <title>FuturePartner - Gemini Overlay</title>
            <style>
                body { margin: 0; padding: 0; background: transparent; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }
                .agent-bubble { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: #1e1f22; border: 2px solid #8ab4f8; border-radius: 50%; box-shadow: 0 8px 25px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999999; }
                .agent-bubble img { width: 35px; height: 35px; border-radius: 50%; object-fit: cover; }
                .chat-container { position: fixed; bottom: 90px; right: 15px; width: 360px; max-width: calc(100vw - 30px); height: 520px; background: #131314; border: 1px solid #333538; border-radius: 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.8); display: flex; flex-direction: column; z-index: 999998; overflow: hidden; }
                .chat-header { padding: 16px; background: #1e1f22; border-bottom: 1px solid #333538; display: flex; align-items: center; justify-content: space-between; color: #e3e3e3; font-weight: 600; font-size: 0.95rem; }
                .chat-body { flex: 1; padding: 16px; overflow-y: auto; color: #e3e3e3; font-size: 0.9rem; display: flex; flex-direction: column; gap: 12px; }
                .message { padding: 10px 14px; border-radius: 16px; max-width: 85%; line-height: 1.4; word-break: break-word; }
                .message.user { background: #004a77; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
                .message.agent { background: #1e1f22; color: #e3e3e3; align-self: flex-start; border-bottom-left-radius: 4px; border: 1px solid #333538; }
                .chat-footer { padding: 12px; background: #1e1f22; display: flex; gap: 8px; border-top: 1px solid #333538; align-items: center; }
                .chat-footer input { flex: 1; background: #131314; border: 1px solid #444746; border-radius: 20px; padding: 10px 14px; color: white; outline: none; font-size: 0.9rem; }
                .send-btn { background: #8ab4f8; border: none; border-radius: 50%; width: 38px; height: 38px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .send-btn svg { width: 18px; height: 18px; fill: #131314; }
            </style>
        </head>
        <body>
            <div class="agent-bubble" onclick="toggleChat()">
                <img src="image_8.png" alt="AI">
            </div>
            <div class="chat-container" id="chatContainer" style="display: flex;">
                <div class="chat-header">
                    <span>FuturePartner Gemini</span>
                    <span style="font-size: 11px; color: #8ab4f8; display: flex; align-items: center; gap: 5px;">
                        <span style="width: 6px; height: 6px; background: #8ab4f8; border-radius: 50%;"></span> Live Core
                    </span>
                </div>
                <div class="chat-body" id="chatBody">
                    <div class="message agent">Hello! I am your Gemini AI assistant. Ask me anything!</div>
                </div>
                <div class="chat-footer">
                    <input type="text" id="userInput" placeholder="Ask Gemini anything..." onkeypress="handleKeyPress(event)">
                    <button class="send-btn" onclick="sendMessage()">
                        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                </div>
            </div>
            <script>
                function toggleChat() {
                    const chat = document.getElementById('chatContainer');
                    chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
                }
                async function sendMessage() {
                    const input = document.getElementById('userInput');
                    const body = document.getElementById('chatBody');
                    const text = input.value.trim();
                    if (!text) return;

                    const userMsg = document.createElement('div');
                    userMsg.className = 'message user';
                    userMsg.innerText = text;
                    body.appendChild(userMsg);
                    input.value = '';
                    body.scrollTop = body.scrollHeight;

                    try {
                        const res = await fetch('/api/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ message: text })
                        });
                        const data = await res.json();

                        const agentMsg = document.createElement('div');
                        agentMsg.className = 'message agent';
                        agentMsg.innerText = data.reply;
                        body.appendChild(agentMsg);
                        body.scrollTop = body.scrollHeight;
                    } catch (e) {
                        const errMsg = document.createElement('div');
                        errMsg.className = 'message agent';
                        errMsg.innerText = "Connection error with server.";
                        body.appendChild(errMsg);
                    }
                }
                function handleKeyPress(e) { if (e.key === 'Enter') sendMessage(); }
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
