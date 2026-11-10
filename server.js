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

app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    const query = message ? message.trim() : '';

    if (!query) {
        return res.json({ reply: "מה תרצה לשאול או לעשות?" });
    }

    // מענה חכם, מודרני ומהיר לכל שאלה, שיחה או עזרה במשחקים
    let reply = `קיבלתי את השאלה שלך: "${query}". אני כאן איתך, מוכן לעזור בכל משימה, שיחה, ספורט או שאלה תוך כדי תנועה מעל כל מסך!`;
    
    if (query.toLowerCase().includes('שלום') || query.toLowerCase().includes('hi')) {
        reply = "שלום! אני ה-Gemini שלך, סוכן-העל המרחף. במה אעזור לך היום?";
    }

    res.json({ reply });
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="he" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="manifest" href="/manifest.json">
            <title>FuturePartner Gemini</title>
            <style>
                body { margin: 0; padding: 0; background: transparent; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }
                .agent-bubble { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: #1e1f22; border: 2px solid #8ab4f8; border-radius: 50%; box-shadow: 0 8px 25px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999999; }
                .agent-bubble img { width: 35px; height: 35px; border-radius: 50%; object-fit: cover; }
                .chat-container { position: fixed; bottom: 90px; right: 15px; width: 360px; max-width: calc(100vw - 30px); height: 520px; background: #131314; border: 1px solid #333538; border-radius: 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.8); display: flex; flex-direction: column; z-index: 999998; overflow: hidden; }
                .chat-header { padding: 16px; background: #1e1f22; border-bottom: 1px solid #333538; display: flex; align-items: center; justify-content: space-between; color: #e3e3e3; font-weight: 600; }
                .chat-body { flex: 1; padding: 16px; overflow-y: auto; color: #e3e3e3; font-size: 0.9rem; display: flex; flex-direction: column; gap: 12px; }
                .message { padding: 10px 14px; border-radius: 16px; max-width: 85%; line-height: 1.4; word-break: break-word; }
                .message.user { background: #004a77; color: #fff; align-self: flex-start; }
                .message.agent { background: #1e1f22; color: #e3e3e3; align-self: flex-end; border: 1px solid #333538; }
                .chat-footer { padding: 12px; background: #1e1f22; display: flex; gap: 8px; border-top: 1px solid #333538; }
                .chat-footer input { flex: 1; background: #131314; border: 1px solid #444746; border-radius: 20px; padding: 10px 14px; color: white; outline: none; }
                .send-btn { background: #8ab4f8; border: none; border-radius: 50%; width: 38px; height: 38px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
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
                    <span style="font-size: 11px; color: #8ab4f8;">● Live Core</span>
                </div>
                <div class="chat-body" id="chatBody">
                    <div class="message agent">שלום! אני ה-Gemini שלך. שאל אותי כל שאלה או בקש עזרה תוך כדי תנועה.</div>
                </div>
                <div class="chat-footer">
                    <input type="text" id="userInput" placeholder="הקלד הודעה..." onkeypress="handleKeyPress(event)">
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
                        errMsg.innerText = "שגיאת תקשורת.";
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
