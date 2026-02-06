const { Ollama } = require("ollama");

const ollama = new Ollama({
  host: "http://127.0.0.1:11434"
});

async function askLocalAI(systemPrompt, userMessage, history = []) {
  const response = await ollama.chat({
    model: "phi3",
    options: {
      temperature: 0.2,
      num_predict: 120
    },
    messages: [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: userMessage }
    ]
  });

  return response.message.content;
}

module.exports = askLocalAI;
