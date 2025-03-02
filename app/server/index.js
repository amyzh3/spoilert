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
  const prompt = "Act as a disposal sustainability advisor and tell me in three sentences or less how to dispose the food, " + brand + " " + item + ", after it can't be consumed. If it's in a container (keep in mind the brand too), include what to do with disposing the container. Explain in easy, concise words so people are willing to read it.";

  return await getGeminiQuery(prompt);
}

async function getCalories(item, brand){
  const prompt = "Tell me how many calories a " + brand + item + " is. Only give me one number. Example: 65";

  return await getGeminiQuery(prompt);
}

async function generateRecipes(items) {
  const prompt = "Act as a recipe generator and tell me how to use the following food items in one recipe: " 
  + items.map(item => `${item.units} ${item.brand} ${item.itemName}`).join(", ") 
  + ". Provide a short recipe that summarizes the ingredients and steps. Make it easy to understand and follow. Give me in html format so I can embed directly into my React code. Do not include any additional information or disclaimers. Do not preceed/proceed with quotation marks.";

  
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
  points: Number,
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

  app.get("/get-recipe", async (req, res) => {
    try {
      const response = await axios.get("http://localhost:8000/get-all-items");
      const itemsAllProperties = response.data.updatedItems;

      const items = itemsAllProperties.map(item => ({
        itemName: item._doc.itemName,
        units: item._doc.units,
        brand: item._doc.brand
      }));

      if (!items || items.length === 0) {
        return res.status(404).json({ message: "No items available for recipes" });
      }

      const recipes = await generateRecipes(items);
      console.log(recipes)
      res.status(200).json({ recipe: recipes });

    } catch (error) {
      console.error("Error getting recipe:", error);
      res.status(500).json({ error: "Failed to get recipe" });
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

    const newUser = new User({ username: signupUsername, password: signupPassword, points: 0});

    await newUser.save();

    res.status(201).json({ message: "User successfully signed up!" });
  } catch (err) {
    console.error("Sign up failed.", err);
    res.status(500).json({ message: "Sign up failed." });
  }
})

// adding points
app.post('/add-points', async (req, res) => {
    try {
        const {userID} = req.body;
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }
        const user = await User.findById(userID);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userID,
            { $inc: { points: 10 } },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
          }
        res.status(200).json({ message: "Updated successfully!", points: updatedUser.points });
    } catch (error) {
        console.error("Error updating points for user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// get points
app.get('/get-points', async (req, res) => {
    try {
        // console.log(req);
        const username = req.query.user;
        // console.log('req.query: ', req.query);
        // console.log('username: ', username);
        const userObject = await User.findOne({ username: username });
        if(!userObject) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json({ points: userObject.points });
    } catch (error) {
        console.error("Error updating points for user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// home route
app.get('/', (req, res) => {
    res.send('Hello Express server is running!');
  });

// subtract 1 from item
app.post('/subtract-one', async (req, res) => {
    try {
        
        const { itemId, user } = req.body;
        console.log('itemId: ', itemId);
        console.log('user: ', user);
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }
        // get item
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        // if item's unit is 1, delete item, add 10 points
        if (item.units === 1) {
            await Item.findByIdAndDelete(itemId);
            console.log("deleted item");
            console.log('username: ', user);
            const userObject = await User.findOne({ username: user });
            if (!userObject) {
                console.log("user not found");
                return res.status(404).json({ error: "User not found" });
            }
            console.log(userObject);
            const updatedUser = await User.findOneAndUpdate(
                { _id: userObject._id },
                { $inc: { points: 10 } },
                { new: true }
            );
            if (!updatedUser) {
                console.log("no updated user");
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json({ message: "Item removed from inventory.", points: updatedUser.points });
        }
        // Otherwise, decrement units of item
        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
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
