require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAtoiqA2MQ1XJy4KqnC_KLLWGaf9PMcUWk");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function getExpirationDays(item){
  const prompt = "Act as a expiration date expert and tell me how many days on minimum a " + item + " is good for consumption from its purchase date in the fridge. Only give me one number. Example: 10";
  
  try {
    const result = await model.generateContent(prompt);
    console.log("Response:", result.response.text());
    return result.response.text(); // Return the response text
  } catch (error) {
    console.error("Error generating content:", error);
    return "An error occurred while fetching the answer.";
  }
}

// Middleware
app.use(cors());
app.use(express.json()); // For JSON parsing

// Test route
app.get('/', (req, res) => {
  res.send('Hello Express server is running!');
});

app.get('/rot', async (req, res) =>{
  const answer = await getExpirationDays("banana");

  res.send(answer);
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
