import React, { useState, useEffect } from 'react';
import '../App.css';
import AddItem from './AddItem';
import axios from "axios";

function Dashboard() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;
    const itemNameToEmoji = {
        "strawberry": "🍓",
        "banana": "🍌",
        "apple": "🍎",
        "carrot": "🥕",
        "bread": "🍞",
        "cheese": "🧀",
        "watermelon": "🍉",
        "pear": "🍐",
        "blueberry": "🫐",
        "chicken": "🍗",
        "fish": "🐟",
        "milk": "🥛",
        "egg": "🥚",
    };

    const categoryToEmoji = {
        "fruits": "🍇",
        "vegetables": "🥦",
        "dairy": "🧈",
        "meat": "🥩",
        "seafood": "🦐",
        "grains": "🌾",
        "beverages": "🧃",
    };
    const username = "User"; // Replace with dynamic username if needed

    useEffect(() => {
        fetchData();
    }, []);

    const getItemEmoji = (item) => {
        return itemNameToEmoji[item._doc.itemName.toLowerCase()] || categoryToEmoji[item._doc.category.toLowerCase()] || "❓";
    };

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

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const displayedItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);


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
            {showPopup && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(211, 217, 223, 0.9)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    padding: '30px',
                    width: '400px',
                    borderRadius: '15px',
                    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)'
                }}>
                    <AddItem onClose={() => setShowPopup(false)} onAddItem={handleAddItem} />
                </div>
            )}

            {/* <div style={{ marginTop: '50px', width: '80%', display: 'flex', justifyContent: "center", alignItems: "center"}}>
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
                        <span style ={{ fontSize: "130px"}}>{getItemEmoji(item)}</span>
                        <span>{item._doc.itemName} {item._doc.brand ? item._doc.brand : ""}</span>

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
                                <p><strong>Expiration Days:</strong> {item._doc.daysLeft}</p>
                                <p><strong>Disposal Suggestion:</strong> {item._doc.disposalSuggestion}</p>
                                <p><strong>Calories:</strong> {item._doc.calories}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div> */}
            <div style={{ marginTop: '50px', width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Left Button */}
                    <button 
                        onClick={() => setCurrentPage(prev => prev > 0 ? prev - 1 : prev)}
                        disabled={currentPage === 0}
                        style={{
                            background: "transparent",
                            border: "none",
                            fontSize: "24px",
                            cursor: currentPage === 0 ? "not-allowed" : "pointer",
                            marginRight: '10px',
                            color: 'black',
                            opacity: currentPage === 0 ? '0' : '1'
                        }}>
                        ←
                    </button>
                    
                    {/* Items container */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '20px',
                        flexWrap: 'wrap',
                        flex: 1,
                    }}>
                        {displayedItems.map((item, index) => (
                            <div 
                                key={index} 
                                style={{
                                    padding: '10px',
                                    background: 'rgba(255, 255, 255, 0)',
                                    margin: '10px',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}
                                onMouseEnter={() => setHoveredItem(item)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <span style={{ fontSize: "130px" }}>{getItemEmoji(item)}</span>
                                <span style={{color: "black", fontSize: "50px"}}>
                                    {item._doc.itemName} {(item._doc.brand) || ""}
                                </span>

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
                                        <p><strong>Expiration Days:</strong> {item._doc.daysLeft}</p>
                                        <p><strong>Disposal Suggestion:</strong> {item._doc.disposalSuggestion}</p>
                                        <p><strong>Calories:</strong> {item._doc.calories}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Button */}
                    <button 
                        onClick={() => setCurrentPage(prev => prev < totalPages - 1 ? prev + 1 : prev)}
                        disabled={currentPage >= totalPages - 1}
                        style={{
                            background: "transparent",
                            border: "none",
                            fontSize: "24px",
                            cursor: currentPage >= totalPages - 1 ? "not-allowed" : "pointer",
                            marginLeft: '10px',
                            color: 'black',
                            opacity: currentPage >=totalPages -1 ? '0' : '1'
                        }}>
                        →
                    </button>
                </div>
        </div>
    );
}

export default Dashboard;
