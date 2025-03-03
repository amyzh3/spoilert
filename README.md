# Welcome to spoilert!
Contributors:
- Yoonseo Choi: yoonseo@usc.edu
- Amy Zhang: amyz@usc.edu
- Senya Wong: senyawon@usc.edu
- Elly Chong: yechong@usc.edu

## Our Demo
https://github.com/user-attachments/assets/192f144e-1e8b-4ae6-946d-fd9ef1216f5b


## Inspiration  
Hello 👋 We're Team Spoilert! We've all faced the same problem—buying groceries with the best intentions, only to find wilted lettuce and moldy bread hiding in the fridge. It’s frustrating, wasteful, and harmful to the environment, yet it happens to so many of us. That’s why we built Spoilert, a web app that helps you keep track of your groceries, reduce food waste, and make sustainability fun!  

Our app alerts you when your food is about to expire—hence the name **Spoil + Alert = Spoilert!**  

---

## What it does  
Spoilert is your everyday companion, helping you track your groceries and reminding you before they spoil! Simply add your food items, and the app will calculate their expiration dates based on purchase date, category, and brand.  

But that’s not all! Spoilert also:  

- 🎯 **Provides recipe recommendations** based on what’s expiring soon  
- ♻️ **Offers proper disposal methods**  
- 🔥 **Sustainability streaks** to track how many foods you’ve beat to the expiration date!

It’s a fun way to help users save money, reduce waste, and make mindful food choices!

---

## How we built it  

The app begins on the home page, where you see a fridge door handle. Click "_Open my fridge!_" to slide into your very own virtual fridge—and your journey to reducing food waste begins!  

After logging in, users can add their food items, selecting:  

- 🍎 **Item Name** (with familiar iOS default emojis that pop up for user familiarity)  
- 🏷 **Brand**  
- 📅 **Purchase Date** (to account for purchased date to track freshness)  

Our system then calculates an estimated expiration date based on real-world data using **Gemini API**.  

When you finish an item before it expires, you receive a **point**, an incentive to prioritize finishing your own groceries!  

We built Spoilert using a **full-stack JavaScript approach** with:  

- **Frontend:** *React.js* for a dynamic and responsive user interface  
- **Backend:** *Node.js & Express.js* to handle API requests and user authentication  
- **Database:** *MongoDB* to store user data and grocery items  
- **Design & Prototyping:** *Figma* for wireframing and crafting an intuitive UI  
- **Animations & Interactivity:** *Framer Motion* to create a seamless and engaging user experience  


---

## Challenges we ran into  

Our biggest challenge was frequent merge conflicts. Every merge seemed to come with a new set of issues that we had to resolve one by one. But along the way, we picked up a lot of handy **Git commands** to help us troubleshoot more efficiently.  

On the backend, working with **MongoDB and Node.js with Express** for the first time was a learning curve. Handling requests and debugging errors required a lot of trial and error.  

Meanwhile, on the frontend, implementing smooth animations and fine details required great attention.  

---

## Accomplishments that we're proud of  

Ultimately, we are incredibly proud of our team of four, who persevered with positivity and determination throughout the entire project journey.  

In just one day, we successfully built an end-to-end product—from concept to implementation.  

We're proud of our intuitive design, ensuring a seamless experience for all users.  

Additionally, we're thrilled about the expiration date calculation feature, which not only tracks spoilage but also provides accurate expiry dates for both past and future purchases.  

---

## What we learned  

- 🎨 _Learned Figma, React, and CSS** all at once for the first time! – Senya_
- 🔗 _Gained a better understanding of connecting frontend and backend and working with APIs!** – Yoonseo_
- 🗄 _Learned how to use MongoDB and Axios for database integration! – Amy_
- ⚡ _Improved Git version control skills and deepened knowledge of React! – Elly_ 

---

## What's Next for Spoilert  

- **AI-powered receipt scanning**  
  Snap a picture of your grocery receipt, and our app will automatically detect and log your purchases into your virtual fridge.  

- **Grocery Wrapped**  
  A personalized breakdown of your food habits, tracking trends in what you eat most, finish on time, or waste—helping you make smarter grocery decisions! 
