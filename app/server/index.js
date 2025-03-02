require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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
async function getExpirationDays(item, brand){
  const prompt = "Act as a expiration date expert and tell me how many days on minimum a " + brand + item + " is good for consumption from its purchase date in the fridge. Only give me one number. Example: 10";
  
  return await getGeminiQuery(prompt);
}

async function getDisposalSuggestion(item, brand){
  const prompt = "Act as a disposal sustainability advisor and tell me in three sentences or less how to dispose a " + brand + " " + item + " after it can't be consumed. If it's in a container (keep in mind the brand too), include what to do with disposing the container. Explain in easy, concise words so people are willing to read it.";

  return await getGeminiQuery(prompt);
}

async function getCalories(item, brand){
  const prompt = "Tell me how many calories a " + brand + item + " is. Only give me one number. Example: 65";

  return await getGeminiQuery(prompt);
}

// Middleware
app.use(cors());
app.use(express.json()); // For JSON parsing

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

const itemSchema = new mongoose.Schema({
    itemName: String,
    units: Number,
    dateAdded: String,
    category: String,
    daysLeft: Number, // calculated using GeminiAI
    brand: String, // Optional
    disposalSuggestion: String, // filled the first time it is asked to be displayed
    expirationDate: String,

  });

const Item = mongoose.model("Item", itemSchema);

// add new food item
app.post("/add-item", async (req, res) => {
    try {
      const newItem = new Item(req.body);
      const dateAdded = new Date(newItem.dateAdded);
      newItem.daysLeft = await getExpirationDays(newItem.itemName);
      const expirationDate = new Date(dateAdded);
      expirationDate.setDate(expirationDate.getDate() + newItem.daysLeft);
      newItem.expirationDate = expirationDate.toISOString();
      await newItem.save();
      res.status(201).json({ message: "Item added successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Failed to save item" });
    }
  });

  // get all items
app.get("/get-all-items", async (req, res) => {
  try {
    const items = await Item.find({});

    console.log(items);
    res.status(200).json({items})
  }catch (error) {
    res.status(500).json({ error: "Failed to get all items"})
  }
})

// home route
app.get('/', (req, res) => {
    res.send('Hello Express server is running!');
  });

app.get('/exp', async (req, res) => {
  const answer = await getExpirationDays("banana");

  res.send(answer);
})

app.get('/disposal', async (req, res) => {
  const answer = await getDisposalSuggestion("greek yogurt", "trader joes");

  res.send(answer);
})

app.get('/calories', async (req, res) => {
  const answer = await getCalories("apple", "");

  res.send(answer);
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
