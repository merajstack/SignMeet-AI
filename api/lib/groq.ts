export async function callGroqAPI(
  prompt: string,
  systemPrompt: string = "You are SignMeet AI, an expert real-time Sign Language interpreter and sentence reconstructor. Return valid JSON only.",
  temperature = 0.2
) {
  const apiKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY || "";

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API Error HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  return JSON.parse(content);
}
