const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// אתחול מוח ה-AI המלא של Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

// מנוע צ'אט ישיר מול Gemini AI - בדיוק כמו האפליקציה הרשמית
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    const query = message ? message.trim() : '';

    if (!query) {
        return res.json({ reply: "הקשבתי, מה תרצה שנשוחח או נעשה עכשיו?" });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                systemInstruction: "You are FuturePartner, an advanced AI assistant integrated as a floating bubble on the user's Samsung device. You respond with the exact intelligence, tone, and capability of Google Gemini. Answer everything naturally, help with games, apps, news, sports, coding, and general advice. Respond in the language the user speaks (Hebrew/English)."
            }
        });

        const aiReply = response.text || "אני כאן איתך, אשמח לעזור בכל מה שתצטרך.";
        res.json({ reply: aiReply });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.json({ reply: "תקלה זמנית בחיבור למוח ה-AI. נסה שוב עוד רגע." });
    }
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="he" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="manifest" href="/manifest.json">
            <title>FuturePartner - Gemini Overlay</title>
            <style>
                body { margin: 0; padding: 0; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; }
                .welcome-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(19, 19, 20, 0.96); backdrop-filter: blur(20px); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px; text-align: center; color: #e3e3e3; }
                .welcome-overlay h1 { font-size: 1.8rem; margin-bottom: 10px; background: linear-gradient(135deg, #8ab4f8, #c58af9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .welcome-overlay p { color: #c4c7c5; font-size: 0.95rem; line-height: 1.6; margin-bottom: 30px; max-width: 320px; }
                .permission-btn { background: linear-gradient(135deg, #8ab4f8, #c58af9); border: none; border-radius: 28px; color: #131314; padding: 14px 32px; font-weight: 700; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 15px rgba(138, 180, 248, 0.3); }
                
                .agent-bubble { position: fixed; bottom: 25px; left: 25px; width: 60px; height: 60px; background: #1e1f22; border: 2px solid rgba(138, 180, 248, 0.4); border-radius: 50%; box-shadow: 0 8px 25px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999999; }
                .agent-bubble img { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; }
                
                .chat-container { position: fixed; bottom: 95px; left: 15px; width: 370px; max-width: calc(100vw - 30px); height: 550px; background: #131314; border: 1px solid #333538; border-radius: 28px; box-shadow: 0 25px 50px rgba(0,0,0,0.8); display: flex; flex-direction: column; z-index: 999998; overflow: hidden; }
                .chat-header { padding: 18px 20px; background: #1e1f22; border-bottom: 1px solid #333538; display: flex; align-items: center; justify-content: space-between; color: #e3e3e3; font-weight: 600; font-size: 1rem; }
                .chat-body { flex: 1; padding: 18px; overflow-y: auto; color: #e3e3e3; font-size: 0.92rem; display: flex; flex-direction: column; gap: 14px; }
                .message { padding: 12px 16px; border-radius: 18px; max-width: 88%; line-height: 1.5; word-break: break-word; }
                .message.user { background: #004a77; color: #ffffff; align-self: flex-start; border-bottom-left-radius: 4px; }
                .message.agent { background: #1e1f22; color: #e3e3e3; align-self: flex-end; border-bottom-right-radius: 4px; border: 1px solid #333538; }
                
                .chat-footer { padding: 12px 16px; background: #1e1f22; display: flex; gap: 10px; border-top: 1px solid #333538; align-items: center; }
                .chat-footer input { flex: 1; background: #131314; border: 1px solid #444746; border-radius: 24px; padding: 12px 18px; color: white; outline: none; font-size: 0.95rem; }
                .send-btn { background: #8ab4f8; border: none; border-radius: 50%; width: 42px; height: 42px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .send-btn svg { width: 20px; height: 20px; fill: #131314; }
            </style>
        </head>
        <body>
            <div class="welcome-overlay" id="welcomeOverlay">
                <h1>FuturePartner Gemini</h1>
                <p>הסוכן החכם שלך מוכן לפעולה. לחץ למטה כדי לאפשר לבועה לרחף מעל כל אפליקציה או משחק.</p>
                <button class="permission-btn" onclick="grantPermission()">הפעל סוכן מרחף</button>
            </div>

            <div class="agent-bubble" onclick="toggleChat()">
                <img src="image_8.png" alt="Gemini">
            </div>

            <div class="chat-container" id="chatContainer" style="display: flex;">
                <div class="chat-header">
                    <span>Gemini AI Assistant</span>
                    <span style="font-size: 11px; color: #8ab4f8; display: flex; align-items: center; gap: 6px;">
                        <span style="width: 7px; height: 7px; background: #8ab4f8; border-radius: 50%;"></span> פעיל ברקע
                    </span>
                </div>
                <div class="chat-body" id="chatBody">
                    <div class="message agent">שלום! אני ה-Gemini שלך. שאל אותי כל שאלה, בקש עזרה במשחקים, חדשות, ספורט או כל דבר שתרצה תוך כדי תנועה.</div>
                </div>
                <div class="chat-footer">
                    <input type="text" id="userInput" placeholder="שאל את Gemini..." onkeypress="handleKeyPress(event)">
                    <button class="send-btn" onclick="sendMessage()">
                        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                </div>
            </div>

            <script>
                function grantPermission() {
                    document.getElementById('welcomeOverlay').style.display = 'none';
                }
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
                        errMsg.innerText = "שגיאת תקשורת מול השרת.";
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
