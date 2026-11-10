const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// אתחול מוח ה-AI האינסופי של Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

// מנוע פתוח וחכם לכל שאלה, שיחה, ספורט, חדשות ומשימות
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    const query = message ? message.trim() : '';

    if (!query) {
        return res.json({ reply: "I am listening. What do you need?", actionType: null, actionUrl: "" });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                systemInstruction: "You are FuturePartner, an elite, 24/7 autonomous AI super-agent integrated into a floating bubble on the user's Samsung device. You possess an infinite mind, capable of deep conversations, answering general knowledge, sports scores, news, gaming strategies, and giving advice. When the user asks to book a restaurant, make a call, or perform a real-world task (like calling The Keg, Cactus Club, or booking an appointment), provide the exact answer and generate a direct device action button (like tel: links) when applicable. Be sharp, modern, helpful, and concise."
            }
        });

        let aiReply = response.text || "I'm on it.";
        let actionType = null;
        let actionUrl = "";

        const lower = query.toLowerCase();
        
        // זיהוי חכם לפעולות חיוג ומשימות אקטואליות
        if (lower.includes('keg') || lower.includes('steakhouse')) {
            actionType = "🥩 Call The Keg Steakhouse";
            actionUrl = "tel:+17784843810";
        } else if (lower.includes('cactus club') || lower.includes('cactus')) {
            actionType = "🍽️ Call Cactus Club Cafe";
            actionUrl = "tel:+12505423838";
        } else if (lower.includes('call') || lower.includes('dial') || lower.includes('phone')) {
            actionType = "📞 Open Phone Dialer";
            actionUrl = "tel:";
        }

        res.json({ reply: aiReply, actionType, actionUrl });

    } catch (error) {
        console.error("AI Error:", error);
        res.json({ 
            reply: "FuturePartner core is active. I received your request: '" + query + "'. How can I help you execute it?", 
            actionType: null, 
            actionUrl: "" 
        });
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
            <title>FuturePartner - Super Agent</title>
            <style>
                body { margin: 0; padding: 0; background: transparent; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }
                .agent-bubble { position: fixed; bottom: 20px; right: 20px; width: 65px; height: 65px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.5); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999999; animation: pulse-glow 2s infinite; }
                .agent-bubble svg { width: 30px; height: 30px; fill: white; }
                @keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(139, 92, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); } }
                .chat-container { position: fixed; bottom: 95px; right: 15px; width: 360px; max-width: calc(100vw - 30px); height: 540px; background: rgba(15, 23, 42, 0.98); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8); display: flex; flex-direction: column; z-index: 999998; overflow: hidden; }
                .chat-header { padding: 16px 18px; background: rgba(30, 41, 59, 0.8); border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: space-between; color: #fff; font-weight: 600; font-size: 0.95rem; }
                .chat-body { flex: 1; padding: 16px; overflow-y: auto; color: #cbd5e1; font-size: 0.9rem; display: flex; flex-direction: column; gap: 10px; }
                .message { padding: 10px 14px; border-radius: 14px; max-width: 85%; line-height: 1.4; word-break: break-word; }
                .message.user { background: #3b82f6; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
                .message.agent { background: #1e293b; color: #f8fafc; align-self: flex-start; border-bottom-left-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.05); }
                .action-btn { display: inline-block; margin-top: 8px; background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 8px 14px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 0.85rem; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }
                .chat-footer { padding: 12px; background: rgba(30, 41, 59, 0.8); display: flex; gap: 8px; border-top: 1px solid rgba(255, 255, 255, 0.05); align-items: center; }
                .chat-footer input { flex: 1; background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 10px 14px; color: white; outline: none; font-size: 0.9rem; }
                .send-btn { background: linear-gradient(135deg, #3b82f6, #8b5cf6); border: none; border-radius: 12px; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .send-btn svg { width: 18px; height: 18px; fill: white; }
            </style>
        </head>
        <body>
            <div class="agent-bubble" onclick="toggleChat()">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.59 1.37 5.09L2 22l4.91-1.37C8.41 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.42 0-2.76-.38-3.91-1.05l-.28-.17-2.9 8.1 3.12-2.78.19-.11C9.24 19.62 10.58 20 12 20c4.41 0 8-3.59 8-8s-3.59-8-8-8-8 3.59-8 8c0 1.33.33 2.61.94 3.73l-.44.78.96-.27c1.12.61 2.4.94 3.73.94 4.41 0 8-3.59 8-8s-3.59-8-8-8z"/></svg>
            </div>
            <div class="chat-container" id="chatContainer" style="display: flex;">
                <div class="chat-header">
                    <span>FuturePartner AI</span>
                    <span style="font-size: 11px; color: #4ade80; display: flex; align-items: center; gap: 5px;">
                        <span style="width: 6px; height: 6px; background: #4ade80; border-radius: 50%;"></span> Infinite Mind 24/7
                    </span>
                </div>
                <div class="chat-body" id="chatBody">
                    <div class="message agent">Hello! I am FuturePartner, your 24/7 AI super-agent. Ask me about news, sports, gaming, advice, or request live phone/booking actions!</div>
                </div>
                <div class="chat-footer">
                    <input type="text" id="userInput" placeholder="Ask anything or command..." onkeypress="handleKeyPress(event)">
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
                        let content = data.reply;
                        if (data.actionType && data.actionUrl) {
                            content += '<br><a href="' + data.actionUrl + '" class="action-btn">' + data.actionType + '</a>';
                        }
                        agentMsg.innerHTML = content;
                        body.appendChild(agentMsg);
                        body.scrollTop = body.scrollHeight;
                    } catch (e) {
                        const errMsg = document.createElement('div');
                        errMsg.className = 'message agent';
                        errMsg.innerText = "Connection error.";
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
