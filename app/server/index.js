require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAtoiqA2MQ1XJy4KqnC_KLLWGaf9PMcUWk");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function getGeminiQuery(prompt){
  try {
    const result = await model.generateContent(prompt);
    console.log("Response:", result.response.text());
    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    return "An error occurred while fetching the answer.";
  }
}
async function getExpirationDays(item){
  const prompt = "Act as a expiration date expert and tell me how many days on minimum a " + item + " is good for consumption from its purchase date in the fridge. Only give me one number. Example: 10";
  
  return await getGeminiQuery(prompt);
}

async function getDisposalSuggestion(item, brand){
  const prompt = "Act as a disposal sustainability advisor and tell me in three sentences or less how to dispose a " + item + " of brand " + brand + " after it can't be consumed. If it's in a container (keep in mind the brand too), include what to do with disposing the container. Explain in easy, concise words so people are willing to read it.";

  return await getGeminiQuery(prompt);
}

// Middleware
app.use(cors());
app.use(express.json()); // For JSON parsing

// Test route
app.get('/', (req, res) => {
  res.send('Hello Express server is running!');
});

app.get('/exp', async (req, res) =>{
  const answer = await getExpirationDays("banana");

  res.send(answer);
})

app.get('/disposal', async (req, res) =>{
  const answer = await getDisposalSuggestion("greek yogurt", "trader joes");

  res.send(answer);
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
