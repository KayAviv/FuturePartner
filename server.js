const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get('/manifest.json', (req, res) => {
    res.json({
        "name": "FuturePartner",
        "short_name": "FuturePartner",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#3b82f6",
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
        return res.json({ reply: "I'm listening.", actionType: null, actionUrl: "" });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                systemInstruction: "You are FuturePartner, an elite 24/7 autonomous AI super-agent floating on Samsung devices. Answer all general questions, chat naturally, discuss news, sports, and tasks. Only add a phone action button if the user explicitly asks to call or book a specific business like The Keg or Cactus Club."
            }
        });

        let aiReply = response.text || "I am on it.";
        let actionType = null;
        let actionUrl = "";

        const lower = query.toLowerCase();
        if (lower.includes('keg') || lower.includes('steakhouse')) {
            actionType = "🥩 Call The Keg";
            actionUrl = "tel:+17784843810";
        } else if (lower.includes('cactus club') || lower.includes('cactus')) {
            actionType = "🍽️ Call Cactus Club";
            actionUrl = "tel:+12505423838";
        }

        res.json({ reply: aiReply, actionType, actionUrl });

    } catch (error) {
        console.error("AI Error:", error);
        res.json({ 
            reply: "Hello! I am your AI agent. How can I help you today?", 
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
                .welcome-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(11, 15, 25, 0.95); backdrop-filter: blur(15px); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px; text-align: center; color: white; }
                .welcome-overlay h1 { font-size: 1.8rem; margin-bottom: 15px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .welcome-overlay p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin-bottom: 30px; max-width: 320px; }
                .permission-btn { background: linear-gradient(135deg, #3b82f6, #8b5cf6); border: none; border-radius: 16px; color: white; padding: 14px 28px; font-weight: 600; font-size: 1rem; cursor: pointer; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4); width: 100%; max-width: 280px; }
                .agent-bubble { position: fixed; bottom: 20px; right: 20px; width: 65px; height: 65px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.5); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999999; animation: pulse-glow 2s infinite; }
                .agent-bubble svg { width: 30px; height: 
