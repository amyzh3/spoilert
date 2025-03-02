import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from "axios";
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("");
  const [newItemData, setNewItemData] = useState({
    itemName: "",
    units: "",
    dateAdded: "",
    category: "fruits", // Default category
    expirationDate: "",
    daysLeft: "",
    brand: "",
  });

  useEffect(() => {
    axios.get("http://localhost:8000")
      .then((res) => res.data)
      .then((data) => setMessage(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setNewItemData({ ...newItemData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted Data:", newItemData);
    try {
      const response = await axios.post("http://localhost:8000/add-item", newItemData, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.data;
      alert(data.message || "Error adding item");
      alert("Item added successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
    
    setNewItemData({ itemName: "", units: "", dateAdded: "", category: "Fruits", expirationDate: "", daysLeft: "" });
  };

  return (
    <>
      <div>
      <h1>{message}</h1>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      </div>
      {/* New Form Section */}
      <div className="form-container">
        <h2>Add Food Item</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Item Name:
            <input
              type="text"
              name="itemName"
              value={newItemData.itemName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Number of Units:
            <input
              type="number"
              name="units"
              value={newItemData.units}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            dateAdded:
            <input
              type="date"
              name="dateAdded"
              value={newItemData.dateAdded}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Food Category:
            <select name="category" value={newItemData.category} onChange={handleChange}>
              <option value="fruits">Fruits</option>
              <option value="veggies">Veggies</option>
              <option value="dairy">Dairy</option>
              <option value="protein">protein</option>
              <option value="grains">Grains</option>
              <option value="beverages">Beverages</option>
            </select>
          </label>
          <label>
            Brand (Optional):
            <input
              type="text"
              name="brand"
              value={newItemData.brand}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Add Item</button>
        </form>
      </div>
    </>
    
  )
}

export default App
