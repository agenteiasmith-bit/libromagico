
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, topic, age, language } = req.body;

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key not configured on server' });
    }

    // Call OpenAI for the story
    const storyResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: 'system',
          content: `You are a professional children's book author. Create a magical story for a ${age} year old child named ${name} about ${topic}. Language: ${language}. Divide the story into 3 short pages. Format: JSON array of strings.`
        }]
      })
    });

    const storyData = await storyResponse.json();
    const storyText = storyData.choices[0].message.content;

    // For the demo, we simulate the image generation links or call DALL-E here
    // To keep it fast and avoid costs in the first test, we'll return a structured response
    res.status(200).json({ 
        success: true, 
        story: storyText,
        images: ["https://via.placeholder.com/512?text=Pixar+Scene+1", "https://via.placeholder.com/512?text=Pixar+Scene+2", "https://via.placeholder.com/512?text=Pixar+Scene+3"]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
