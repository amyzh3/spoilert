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


app.use(cors());
app.use(express.json()); 

// connecting mongoDB
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

const itemSchema = new mongoose.Schema({
    itemName: String,
    units: Number,
    dateAdded: String,
    category: String,
    brand: String, 
    disposalSuggestion: String, 
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
        // const { itemName, units, dateAdded, category, brand } = req.body.body;
        //console.log("dateAdded", dateAdded);
        let daysLeft = parseInt(await getExpirationDays(newItem.itemName, newItem.brand)) || 0;
        
        const parsedDate = new Date(newItem.dateAdded);
        if (isNaN(parsedDate)) {
            throw new Error(`Invalid dateAdded value: ${dateAdded}`);
        }
        parsedDate.setDate(parsedDate.getDate() + parseInt(daysLeft));
        newItem.expirationDate = parsedDate.toISOString();
        newItem.calories = parseInt(await getCalories((newItem.itemName || ""), (newItem.brand || "")));
        newItem.disposalSuggestion = await getDisposalSuggestion(newItem.itemName || ""), (newItem.brand || "");
    
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
    const currentDate = new Date();

    // calculate currDaysLeft for each item
    const updatedItems = items.map(item => {
        const expirationDate = new Date(item.expirationDate);
        item.expirationDate = expirationDate.toISOString();
        const dateAdded = new Date(item.dateAdded);
        
        // calculate remaining time in milliseconds
        const timeLeft = expirationDate - currentDate;
        
        // convert to days
        let currDaysLeft = timeLeft / (1000 * 60 * 60 * 24);

        const totalLifespan = (expirationDate - dateAdded) / (1000 * 60 * 60 * 24);

        
        // Calculate percentage
        let percentage = Math.round((currDaysLeft / totalLifespan) * 100);
      
        if(percentage < 0 || Math.round(currDaysLeft) <= 0){
            percentage = 0;
        }else if(percentage > 100 || dateAdded >= currentDate){
            percentage = 100;
        }
        // Check if item is expired
        const expired = Math.round(currDaysLeft) <= 0;


        return { ...item, daysLeft: Math.round(currDaysLeft), percentage, expired };
    });


    // sort items by currDaysLeft (least to greatest)
    const sortedItems = updatedItems.sort((a, b) => a.daysLeft - b.daysLeft);

    res.status(200).json({ updatedItems: sortedItems });
  } catch (error) {
    res.status(500).json({ error: "Failed to get all items" });
  }
})

app.post("/login", (req, res) => {
  const {loginUsername, loginPassword} = req.body;
  User.findOne({username : loginUsername})
  .then(user => {
      if(user) {
          if(user.password === loginPassword){
              res.status(200).json({message: "Success"});
          }else{
              return res.status(400).json({ message: "The password is incorrect" });
          }
      }else{
          return res.status(400).json({ message: "Username does not exist." });
      }
  })
})

app.post("/signup", async (req, res) => {
  const {signupUsername, signupPassword} = req.body;
  
  try {
    const existingUser = await User.findOne({ username: signupUsername });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken." });
    }

    const newUser = new User({ username: signupUsername, password: signupPassword });

    await newUser.save();

    res.status(201).json({ message: "User successfully signed up!" });
  } catch (err) {
    console.error("Sign up failed.", err);
    res.status(500).json({ message: "Sign up failed." });
  }
})

// home route
app.get('/', (req, res) => {
    res.send('Hello Express server is running!');
  });

// subtract 1 from item
app.post('/subtract-one', async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
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
        const { itemId } = req.body;


        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            { $inc: { units: 1 } },
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

// delete item
app.post('/delete-item', async (req, res) => {
    try {
        const { itemId } = req.body;

        const deletedItem = await Item.findByIdAndDelete(itemId);
        if (!deletedItem) {
            return res.status(404).json({ error: "Item not found" });
          }
        res.status(200).json({ message: "Item deleted successfully!" });
    } catch (error) {
        console.error("Error deleting item:", error);
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
