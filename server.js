import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// TEMP: hardcode key just to verify flow works
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/generate", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ text: "Event title missing 😑" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are writing content for a college events app. Write ONE engaging paragraph (60–90 words) in FUTURE TENSE for a campus event titled "${title}" Do not list options. Do not stop mid-sentence.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            topP: 0.9,
            maxOutputTokens: 300
          }
        })

      }
    );

    console.log("Gemini status:", response.status);

    const data = await response.json();
    console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // 🔒 SAFETY FALLBACK
    if (!text || text.length < 50) {
      return res.json({
        text: `Get ready for ${title}, an exciting campus event packed with activities, energy, and unforgettable experiences. Join fellow students to explore, learn, and create memories together.`
      });
    }

    res.json({ text });


  } catch (err) {
    console.error("🔥 Gemini error:", err);
    res.status(500).json({ text: "AI broke internally " });
  }
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
