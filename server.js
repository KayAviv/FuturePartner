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
        // שימוש במודל המומלץ והעדכני gemini-3.8-flash לפי הודעת המערכת
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
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
                .agent-bubble img { width: 35px; height: 35px; border-radius: 50%; object-fit:
