import React, { useState, useEffect } from 'react';
import '../App.css';
import AddItem from './AddItem';
import axios from "axios";

function Dashboard() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const username = "User"; // Replace with dynamic username if needed

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/get-all-items'); // Assuming backend has an /items route
            console.log(response.data.updatedItems);
            const data = response.data.updatedItems;
            console.log(data[0]);
            setItems(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const handleAddItem = (newItem) => {
        setItems([...items, newItem]);
    };

    return (
        <div className="dashboard-container" style={{
            backgroundImage: "url('/shutterstock_2134374041.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
            position: 'fixed',
            top: 0,
            left: 0
        }}>
            <h1 style={{
                position: 'absolute',
                top: '10px',
                left: '20px',
                fontSize: '24px',
                fontWeight: 'bold'
            }}>Hello, {username}</h1>
            
            <button 
                onClick={() => setShowPopup(true)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    backgroundColor: '#427AA1',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}>
                Add Food Item
            </button>
            {showPopup && <AddItem onClose={() => setShowPopup(false)} onAddItem={handleAddItem} />}

            <div style={{ marginTop: '50px', width: '80%' }}>
                {items.map((item, index) => (
                    <div 
                        key={index} 
                        style={{
                            padding: '10px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            margin: '10px 0',
                            cursor: 'pointer',
                            borderRadius: '5px',
                            position: 'relative'
                        }}
                        onMouseEnter={() => setHoveredItem(item)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        {item.itemName} ({item.brand})

                        {hoveredItem === item && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'white',
                                color: 'black',
                                padding: '10px',
                                borderRadius: '5px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                zIndex: 100
                            }}>
                                <p><strong>Expiration Days:</strong> {item.daysLeft}</p>
                                <p><strong>Disposal Suggestion:</strong> {item.disposalSuggestion}</p>
                                <p><strong>Calories:</strong> {item.calories}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
