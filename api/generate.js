
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, topic, age, language } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'SISTEMA: La API Key de Gemini no está configurada' });
    }

    // CHANGED TO STABLE v1 PATH
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a professional children's book author. Create a magical story for a ${age} year old child named ${name} about ${topic}. Language: ${language}. Divide the story into 3 short pages. Return only the story text.`
          }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `API ERROR: ${data.error?.message || 'Error en la API de Google'}` 
      });
    }

    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
        const storyText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ 
            success: true, 
            story: storyText,
            images: ["https://via.placeholder.com/512?text=Pixar+1", "https://via.placeholder.com/512?text=Pixar+2", "https://via.placeholder.com/512?text=Pixar+3"]
        });
    } else {
        res.status(500).json({ error: 'Respuesta vacía de la IA' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Error interno: ' + error.message });
  }
}
