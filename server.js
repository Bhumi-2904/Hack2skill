import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generateFromGemini(title, attempt = 1) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
You are an expert content writer for a college campus events platform.

Write ONE complete paragraph of 90–130 words in FUTURE TENSE for a campus event titled "${title}".

Rules:
- The paragraph MUST end with a full stop.
- Do NOT stop mid-sentence.
- No bullet points, headings, or emojis.
- Student-friendly but professional tone.
- If you are unsure, rewrite before responding.
                `
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.65,
          topP: 0.95,
          maxOutputTokens: 500
        }
      })
    }
  );

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  // 🛠️ FIX INCOMPLETE LAST SENTENCE (FREE TIER GEMINI BUG)
if (text) {
  // Remove trailing incomplete sentence
  if (!/[.!?]$/.test(text)) {
    const lastPunctuation = Math.max(
      text.lastIndexOf("."),
      text.lastIndexOf("!"),
      text.lastIndexOf("?")
    );

    if (lastPunctuation !== -1) {
      text = text.slice(0, lastPunctuation + 1);
    }
  }
}

if (!text || text.length < 120) {
  text = `Get ready for ${title}, an exciting campus event that will bring students together for an engaging and energetic experience. The event will focus on learning, interaction, and collaboration in a vibrant campus environment, giving participants a chance to grow their skills, connect with peers, and create memorable moments that extend beyond the event itself.`;
}
  // ✅ sanity checks
  const looksValid =
    text &&
    text.length > 140 &&
    /[.!?]$/.test(text);

  // retry once if garbage
  if (!looksValid && attempt < 3) {
    console.warn(`🔁 Gemini retry attempt ${attempt + 1}`);
    return generateFromGemini(title, attempt + 1);
  }

  return looksValid ? text : null;
}

app.post("/generate", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ text: "Event title missing 😑" });
  }

  try {
    const text = await generateFromGemini(title);

    if (!text) {
      // FINAL fallback (never broken)
      return res.json({
        text: `Get ready for ${title}, an exciting campus event that will bring students together for an energetic and engaging experience. The event will offer a vibrant atmosphere filled with interactive moments, meaningful connections, and opportunities to explore new ideas. Participants will enjoy a well-planned environment that encourages creativity, collaboration, and campus spirit while creating memorable experiences that will be talked about long after the event concludes.`
      });
    }

    res.json({ text });

  } catch (err) {
    console.error("🔥 Gemini error:", err);
    res.json({
      text: `Get ready for ${title}, an engaging campus event designed to bring students together in a lively and collaborative environment. The experience will focus on connection, creativity, and shared moments that make campus life memorable.`
    });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
