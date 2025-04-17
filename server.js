const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.post("/generate-plan", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0].message.content;

    let parsedResult;
    try {
      // Supprime les backticks et le "```json" éventuel
      const cleaned = result.replace(/```json\n?/, "").replace(/```$/, "");
      parsedResult = JSON.parse(cleaned);
    } catch (e) {
      console.error("Échec parsing JSON :", e);
      return res.status(500).json({ error: "Réponse non parsable en JSON." });
    }
    console.log(parsedResult);
    res.json(parsedResult); // <-- maintenant "plan" sera à la racine

  } catch (error) {
    console.error("Erreur avec OpenAI :", error);
    res.status(500).json({ error: "Échec génération du plan." });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Serveur en ligne !");
});

app.listen(port, () => {
  console.log(`✅ Serveur API lancé sur http://localhost:${port}`);
});

