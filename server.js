const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/manifest.json', (req, res) => {
    res.sendFile(__dirname + '/manifest.json');
});

// דף הבית הכולל את ממשק הבועה הצפה (Floating Bubble UI)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="he" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="manifest" href="/manifest.json">
            <title>FuturePartner - Super Agent</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background: transparent;
                    font-family: system-ui, -apple-system, sans-serif;
                    overflow: hidden;
                }
                /* הבועה הצפה */
                .agent-bubble {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 65px;
                    height: 65px;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    border-radius: 50%;
                    box-shadow: 0 10px 25px rgba(139, 92, 246, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 999999;
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    animation: pulse-glow 2s infinite;
                }
                .agent-bubble:active {
                    transform: scale(0.9);
                }
                .agent-bubble svg {
                    width: 30px;
                    height: 30px;
                    fill: white;
                }
                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.6); }
                    70% { box-shadow: 0 0 0 15px rgba(139, 92, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
                }
                /* חלון הצ'אט שנפתח מהבועה */
                .chat-container {
                    position: fixed;
                    bottom: 110px;
                    right: 20px;
                    width: 360px;
                    max-width: calc(100vw - 40px);
                    height: 520px;
                    background: rgba(15, 23, 42, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 28px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
                    display: none;
                    flex-direction: column;
                    z-index: 999998;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .chat-header {
                    padding: 18px 20px;
                    background: rgba(30, 41, 59, 0.7);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: #fff;
                    font-weight: 600;
                }
                .chat-body {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    color: #cbd5e1;
                    font-size: 0.95rem;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .message {
                    padding: 12px 16px;
                    border-radius: 16px;
                    max-width: 85%;
                    line-height: 1.4;
                }
                .message.agent {
                    background: #1e293b;
                    color: #f8fafc;
                    align-self: flex-start;
                    border-bottom-right-radius: 4px;
                }
                .chat-footer {
                    padding: 15px;
                    background: rgba(30, 41, 59, 0.7);
                    display: flex;
                    gap: 10px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                .chat-footer input {
                    flex: 1;
                    background: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 14px;
                    padding: 12px 16px;
                    color: white;
                    outline: none;
                    font-size: 0.95rem;
                }
                .chat-footer button {
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    border: none;
                    border-radius: 14px;
                    width: 46px;
                    height: 46px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .chat-footer button svg {
                    width: 20px;
                    height: 20px;
                    fill: white;
                }
            </style>
        </head>
        <body>

            <!-- הבועה הצפה במסך -->
            <div class="agent-bubble" onclick="toggleChat()">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.59 1.37 5.09L2 22l4.91-1.37C8.41 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.42 0-2.76-.38-3.91-1.05l-.28-.17-2.9 8.1 3.12-2.78.19-.11C9.24 19.62 10.58 20 12 20c4.41 0 8-3.59 8-8s-3.59-8-8-8-8 3.59-8 8c0 1.33.33 2.61.94 3.73l-.44.78.96-.27c1.12.61 2.4.94 3.73.94 4.41 0 8-3.59 8-8s-3.59-8-8-8z"/>
                </svg>
            </div>

            <!-- חלון השיחה של הסוכן -->
            <div class="chat-container" id="chatContainer">
                <div class="chat-header">
                    <span>FuturePartner AI</span>
                    <span style="font-size: 12px; color: #4ade80; display: flex; align-items: center; gap: 6px;">
                        <span style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%; display: inline-block;"></span> 24/7 Live
                    </span>
                </div>
                <div class="chat-body" id="chatBody">
                    <div class="message agent">שלום כפיר! אני FuturePartner, הסוכן האישי שלך. אני מחובר למוח אינסופי ולמערכות המכשיר. איפה תרצה שאעזור לך עכשיו? (התאמה למסעדות, חיפוש, או ביצוע שיחות אוטומטיות).</div>
                </div>
                <div class="chat-footer">
                    <input type="text" id="userInput" placeholder="דבר או כתוב לסוכן..." onkeypress="handleKeyPress(event)">
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

                function sendMessage() {
                    const input = document.getElementById('userInput');
                    const body = document.getElementById('chatBody');
                    if (!input.value.trim()) return;

                    const userMsg = document.createElement('div');
                    userMsg.className = 'message';
                    userMsg.style.background = '#3b82f6';
                    userMsg.style.color = '#fff';
                    userMsg.style.alignSelf = 'flex-end';
                    userMsg.innerText = input.value;
                    body.appendChild(userMsg);

                    const text = input.value;
                    input.value = '';
                    body.scrollTop = body.scrollHeight;

                    setTimeout(() => {
                        const agentMsg = document.createElement('div');
                        agentMsg.className = 'message agent';
                        agentMsg.innerText = "מעבד את הבקשה ומבצע אוטומציה ברקע עבור: " + text;
                        body.appendChild(agentMsg);
                        body.scrollTop = body.scrollHeight;
                    }, 1000);
                }

                function handleKeyPress(e) {
                    if (e.key === 'Enter') sendMessage();
                }
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`FuturePartner server running on port ${PORT}`);
});
