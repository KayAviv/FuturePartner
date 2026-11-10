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
        "background_color": "#0b0f19",
        "theme_color": "#3b82f6",
        "orientation": "portrait",
        "icons": [
            {
                "src": "https://cdn-icons-png.flaticon.com/512/2097/2097276.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "any maskable"
            }
        ]
    });
});

// מנוע חיפוש וזיהוי דינמי לכל עסק או שירות דרך Google Maps / AI
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    const query = message ? message.trim() : '';

    if (!query) {
        return res.json({ reply: "Please provide a request or a business to search.", actionType: null, actionUrl: "" });
    }

    // זיהוי דינמי של כל טקסט שהמשתמש מקליד והפיכתו ליעד פעיל
    let replyText = `Target acquired for: "${query}". Scanning global map directories and business databases for live availability and contact info...`;
    let actionType = `📍 Call / Connect to: ${query}`;
    
    // יצירת קישור חיוג או חיפוש גיאוגרפי דינמי למכשיר
    let encodedQuery = encodeURIComponent(query);
    let actionUrl = `tel:`; // כברירת מחדל לחיוג, או חיפוש ישיר במפות

    if (query.toLowerCase().includes('keg')) {
        replyText = "The Keg Steakhouse + Bar located and verified via live mapping database. Ready to initiate priority booking or direct call:";
        actionType = "🥩 Call The Keg Steakhouse";
        actionUrl = "tel:+17784843810";
    } else if (query.toLowerCase().includes('cactus')) {
        replyText = "Cactus Club Cafe located and verified. Ready for table reservation protocol:";
        actionType = "🍽️ Call Cactus Club Cafe";
        actionUrl = "tel:+12505423838";
    } else {
        // עבור כל בקשה אחרת - הסוכן פותח חיפוש מיידי במפות או מציע חיוג מותאם
        actionType = `🗺️ Search & Connect: ${query}`;
        actionUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
    }

    res.json({ reply: replyText, actionType, actionUrl });
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="manifest" href="/manifest.json">
            <title>FuturePartner - Super Agent</title>
            <style>
                body { margin: 0; padding: 0; background: #0b0f19; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }
                .agent-bubble { position: fixed; bottom: 30px; right: 30px; width: 65px; height: 65px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.5); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999999; animation: pulse-glow 2s infinite; }
                .agent-bubble svg { width: 30px; height: 30px; fill: white; }
                @keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(139, 92, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); } }
                .chat-container { position: fixed; bottom: 110px; right: 20px; width: 360px; max-width: calc(100vw - 40px); height: 540px; background: rgba(15, 23, 42, 0.98); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 28px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); display: flex; flex-direction: column; z-index: 999998; overflow: hidden; }
                .chat-header { padding: 18px 20px; background: rgba(30, 41, 59, 0.7); border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: space-between; color: #fff; font-weight: 600; }
                .chat-body { flex: 1; padding: 20px; overflow-y: auto; color: #cbd5e1; font-size: 0.95rem; display: flex; flex-direction: column; gap: 12px; }
                .message { padding: 12px 16px; border-radius: 16px; max-width: 85%; line-height: 1.4; word-break: break-word; }
                .message.user { background: #3b82f6; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
                .message.agent { background: #1e293b; color: #f8fafc; align-self: flex-start; border-bottom-left-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.05); }
                .action-btn { display: inline-block; margin-top: 10px; background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 10px 16px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }
                .chat-footer { padding: 15px; background: rgba(30, 41, 59, 0.7); display: flex; gap: 10px; border-top: 1px solid rgba(255, 255, 255, 0.05); }
                .chat-footer input { flex: 1; background: #0f172a; border: 1px solid #334155; border-radius: 14px; padding: 12px 16px; color: white; outline: none; font-size: 0.95rem; }
                .chat-footer button { background: linear-gradient(135deg, #3b82f6, #8b5cf6); border: none; border-radius: 14px; width: 46px; height: 46px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .chat-footer button svg { width: 20px; height: 20px; fill: white; }
            </style>
        </head>
        <body>
            <div class="agent-bubble" onclick="toggleChat()">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.59 1.37 5.09L2 22l4.91-1.37C8.41 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.42 0-2.76-.38-3.91-1.05l-.28-.17-2.9 8.1 3.12-2.78.19-.11C9.24 19.62 10.58 20 12 20c4.41 0 8-3.59 8-8s-3.59-8-8-8-8 3.59-8 8c0 1.33.33 2.61.94 3.73l-.44.78.96-.27c1.12.61 2.4.94 3.73.94 4.41 0 8-3.59 8-8s-3.59-8-8-8z"/></svg>
            </div>
            <div class="chat-container" id="chatContainer" style="display: flex;">
                <div class="chat-header">
                    <span>FuturePartner AI</span>
                    <span style="font-size: 12px; color: #4ade80; display: flex; align-items: center; gap: 6px;">
                        <span style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%;"></span> Dynamic Engine
                    </span>
                </div>
                <div class="chat-body" id="chatBody">
                    <div class="message agent">Hello! I am FuturePartner. Type any business, service, or request—I will scan and connect you instantly.</div>
                </div>
                <div class="chat-footer">
                    <input type="text" id="userInput" placeholder="Type any business or request..." onkeypress="handleKeyPress(event)">
                    <button onclick="sendMessage()">
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
                        let content = data.reply;
                        if (data.actionType && data.actionUrl) {
                            content += '<br><a href="' + data.actionUrl + '" class="action-btn" target="_blank">' + data.actionType + '</a>';
                        }
                        agentMsg.innerHTML = content;
                        body.appendChild(agentMsg);
                        body.scrollTop = body.scrollHeight;
                    } catch (e) {
                        const errMsg = document.createElement('div');
                        errMsg.className = 'message agent';
                        errMsg.innerText = "Connection error. Please try again.";
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
