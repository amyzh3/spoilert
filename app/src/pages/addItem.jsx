import { useState, useEffect } from 'react'
import '../App.css'

function AddItemPage() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("");
  const [newItemData, setNewItemData] = useState({
    itemName: "",
    units: "",
    dateAdded: "",
    category: "fruits", // Default category
    daysLeft: "",
    brand: "",
  });

  useEffect(() => {
    fetch("http://localhost:8000")
      .then((res) => res.text())
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
      const response = await fetch("http://localhost:8000/add-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItemData),
      });
      const data = await response.json();
      alert(data.message || "Error adding item");
      alert("Item added successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
    
    setNewItemData({ itemName: "", units: "", dateAdded: "", category: "Fruits", daysLeft: "" });
  };

  return (
    <>

      {/* New Form Section */}
      <div className="form-container">
        <h2>Add Food Item</h2>
        <form onSubmit={handleSubmit}>
          <label className="form-item">
            Item Name:
            <input
              type="text"
              name="itemName"
              value={newItemData.itemName}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-item">
            Number of Units:
            <input
              type="number"
              name="units"
              value={newItemData.units}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-item">
            Date Purchased:
            <input
              type="date"
              name="dateAdded"
              value={newItemData.dateAdded}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-item">
            Food Category:
            <select name="category" value={newItemData.category} onChange={handleChange}>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="dairy">Dairy</option>
              <option value="meat">Meat</option>
              <option value="grains">Grains</option>
            </select>
          </label>
          <label className="form-item">
            Brand (Optional):
            <input
              type="text"
              name="brand"
              value={newItemData.brand}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="add-item-button">Add Item</button>
        </form>
      </div>
    </>
    
  )
}

export default AddItemPage
