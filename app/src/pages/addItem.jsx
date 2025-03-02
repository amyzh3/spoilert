import { useState, useEffect } from 'react'
import './AddItem.css'

function AddItem({ onClose }) {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("");
  const [newItemData, setNewItemData] = useState({
    itemName: "",
    units: "",
    dateAdded: "",
    category: "fruits", 
    expirationDate: "",
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
      // alert(data.message || "Error adding item");
      window.location.reload(); // Refresh the page
      // alert("Item added successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
    
    setNewItemData({ itemName: "", units: "", dateAdded: "", category: "Fruits", expirationDate: "", brand: "" });
  };

  const handleCancel = () => {
    // reset the form fields
    setNewItemData({ itemName: "", units: "", dateAdded: "", category: "Fruits", expirationDate: "", brand: "" });
    onClose();
  };

  return (
    <>

      {/* New Form Section */}
      <div className="form-container">
        <h2 style={{marginTop: '0'}} className="header-color">Add Food Item</h2>
        <form onSubmit={handleSubmit}>
          <label className="form-item">
            <div className="add-item-mainlabels">Item Name <span className="required-asterisk">*</span></div>
            <input
              className='add-item-input'
              type="text"
              name="itemName"
              value={newItemData.itemName}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-item">
            <div className="add-item-mainlabels">Quantity <span className="required-asterisk">*</span></div>
            <input
              className='add-item-input'
              type="number"
              name="units"
              value={newItemData.units}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-item">
            <div className="add-item-mainlabels">Date Purchased <span className="required-asterisk">*</span></div>
            <input
              className='add-item-input'
              type="date"
              name="dateAdded"
              value={newItemData.dateAdded}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-item">
            <div className="add-item-mainlabels">Food Category <span className="required-asterisk">*</span></div>
            <select className="add-item-input" name="category" value={newItemData.category} onChange={handleChange} required>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="dairy">Dairy</option>
              <option value="meat">Meat</option>
              <option value="grains">Grains</option>
            </select>
          </label>
          <label className="form-item">
            <div className="add-item-mainlabels">Brand (optional):</div>
            <input
              className='add-item-input'
              type="text"
              name="brand"
              value={newItemData.brand}
              onChange={handleChange}
            />
          </label>
          <button style={{marginTop: '10px'}} type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
          <button type="submit" className="add-item-button">Add Item</button>
        </form>
      </div>
    </>
    
  )
}

export default AddItem
