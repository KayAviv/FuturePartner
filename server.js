const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// דף הבית של FuturePartner
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="he" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>FuturePartner - AI Partner</title>
            <style>
                body {
                    background-color: #0f172a;
                    color: #f8fafc;
                    font-family: system-ui, -apple-system, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 20px;
                    text-align: center;
                }
                .card {
                    background: #1e293b;
                    border: 1px solid #334155;
                    border-radius: 24px;
                    padding: 32px;
                    max-width: 400px;
                    width: 100%;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
                }
                h1 {
                    font-size: 2rem;
                    margin-bottom: 8px;
                    background: linear-gradient(to right, #38bdf8, #818cf8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                p {
                    color: #94a3b8;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(34, 197, 94, 0.1);
                    color: #4ade80;
                    padding: 6px 16px;
                    border-radius: 9999px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-top: 16px;
                }
                .pulse {
                    width: 8px;
                    height: 8px;
                    background-color: #22c55e;
                    border-radius: 50%;
                    box-shadow: 0 0 12px #22c55e;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>FuturePartner</h1>
                <p>השותף החכם שלך מוכן לפעולה. השרת פועל ומחובר בהצלחה!</p>
                <div class="status-badge">
                    <span class="pulse"></span>
                    מערכת פעילה 24/7
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`FuturePartner server running on port ${PORT}`);
});
