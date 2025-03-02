require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

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
    calories: Number,
  });

const Item = mongoose.model("Item", itemSchema);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// add new food item
app.post("/add-item", async (req, res) => {
    try {
        // store item properties
        const newItem = new Item(req.body);
        console.log(newItem);
        // const { itemName, units, dateAdded, category, brand } = req.body.body;
        console.log("itemName", newItem.itemName);
        //console.log("dateAdded", dateAdded);
        newItem.daysLeft = parseInt(await getExpirationDays(newItem.itemName, newItem.brand)) || 0;
        
        const parsedDate = new Date(newItem.dateAdded);
        if (isNaN(parsedDate)) {
            throw new Error(`Invalid dateAdded value: ${dateAdded}`);
        }
        parsedDate.setDate(parsedDate.getDate() + parseInt(newItem.daysLeft));
        newItem.expirationDate = parsedDate.toISOString();
        newItem.calories = parseInt(await getCalories((newItem.itemName || ""), (newItem.brand || "")));
    
        await newItem.save();
        res.status(201).json({ message: "Item added successfully!" });
      } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ error: "Failed to save item" });
      }
  });

  // get all items
app.get("/get-all-items", async (req, res) => {
  try {
    const items = await Item.find({});
    // sort items by expiration
    const sortedItems = items.sort((a, b) => {
        const currentDate = new Date();
        
        // convert dateAdded to Date object
        const aDateAdded = new Date(a.dateAdded);
        const bDateAdded = new Date(b.dateAdded);
      
        // compute remaining days
        const aRemaining = a.daysLeft - Math.floor((currentDate - aDateAdded) / (1000 * 60 * 60 * 24));
        const bRemaining = b.daysLeft - Math.floor((currentDate - bDateAdded) / (1000 * 60 * 60 * 24));
      
        return aRemaining - bRemaining; // sort least to greatest
    });

    const currentDate = new Date();

      // calculate progress bar percentage
    const updatedItems = sortedItems.map(item => {
        const expirationDate = new Date(item.expirationDate);
        
        // calculate remaining time in milliseconds
        const timeLeft = expirationDate - currentDate;
        
        // convert to days
        const currDaysLeft = timeLeft / (1000 * 60 * 60 * 24);
        
        // calculate percentage
        const percentage = currDaysLeft / item.daysLeft * 100;
        // expired = true if it's after the expiration date
        const expired = currentDate > expirationDate;
        return { ...item, percentage, expired }; // Add percentage to item
    });
    console.log(updatedItems);
    res.status(200).json({updatedItems})
  }catch (error) {
    res.status(500).json({ error: "Failed to get all items"})
  }
})

app.post("/login", (req, res) => {
  const {username, password} = req.body;
  User.findOne({username : username})
  .then(user => {
      if(user) {
          if(user.password === password){
              res.json("Success")
          }else{
              res.json("The password is incorrect")
          }
      }else{
          res.json("No record existed")
      }
  })
})

app.post("/register", (req, res) => {
  User.create(req.body)
  .then(users => res.json(users))
  .catch(err => res.json(err))
})

// home route
app.get('/', (req, res) => {
    res.send('Hello Express server is running!');
  });

// subtract 1 from item
app.post('/subtract-one', async (req, res) => {
    try {
        const { itemID } = req.body;
        if (!mongoose.Types.ObjectId.isValid(itemID)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }
        // get item
        const item = await Item.findById(itemID);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        // if item's unit is 1, delete item
        if (item.units === 1) {
            await Item.findByIdAndDelete(itemID);
            return res.status(200).json({ message: "Item removed from inventory." });
        }
        // Otherwise, decrement units of item
        const updatedItem = await Item.findByIdAndUpdate(
            itemID,
            { $inc: { units: -1 } },
            { new: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ error: "Item not found" });
          }
        res.status(200).json({ message: "Updated successfully!", item: updatedItem });
        } catch (error) {
            console.error("Error updating item:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
});

// add 1 to item
app.post('/add-one', async (req, res) => {
    try {
        const { itemID } = req.body;
        if (!mongoose.Types.ObjectId.isValid(itemID)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }
        const updatedItem = await Item.findByIdAndUpdate(
            itemID,
            { $inc: { units: 1 } },
            { new: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ error: "Item not found" });
          }
        res.status(200).json({ message: "Updated successfully!", item: updatedItem });
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
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
