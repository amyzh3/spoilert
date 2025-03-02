import React, { useState, useEffect } from 'react';
import '../App.css';
import AddItem from './AddItem';
import axios from "axios";

function Dashboard({ user }) {
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
        "lemon": "🍋",
        "broccoli": "🥦",
        "tomato": "🍅",
        "bacon": "🥓",
        "orange": "🍊",
        "eggplant": "🍆",
        "cherry": "🍒",
        "grape": "🍇",
        "peach": "🍑",
        "kiwi": "🥝",
        "mango": "🥭",
        "pineapple": "🍍",
        "avocado": "🥑",
        "melon": "🍈",
        "olive": "🫒",
        "cucumber": "🥒",
        "potato": "🥔",
        "sweet_potato": "🍠",
        "corn": "🌽",
        "mushroom": "🍄",
        "garlic": "🧄",
        "onion": "🧅",
        "peanuts": "🥜",
        "chestnut": "🌰",
    };

    const username = "User";

    useEffect(() => {
        fetchData();
    }, []);

    const getItemEmoji = (item) => {
        return itemNameToEmoji[item._doc.itemName.toLowerCase()] || "❓";
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/get-all-items');
            const data = response.data.updatedItems;
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
            // textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
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
            }}>Hello, {user || "Guest"}</h1>
            
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
                <div className="popup-container">
                    <AddItem onClose={() => setShowPopup(false)} />
                </div>
            )}

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
                            {
                                item._doc.brand && item._doc.brand.length > 0 ? <span style={{ fontSize: '20px', color: 'gray' }}>{item._doc.brand}</span>
                                 : <span style={{ fontSize: '20px', opacity: '0' }}>placeholder</span>
                            }
                            {/* {item._doc.brand && <span style={{ fontSize: '20px', color: 'gray' }}>{item._doc.brand}</span>} */}
                            <span style={{ fontSize: "30px", color: "black", marginBottom: "5px", fontWeight: "500" }}>{item._doc.itemName}</span>
                            <span style={{ fontSize: "130px"}}>
                                {item.expired ? '🕳️' : getItemEmoji(item)}
                            </span>

                            {/* Progress Bar Wrapper */}
                            <div className="progress-bar-container">
                                <div className="progress-bar" style={{ width: `${item._doc.progress}%` }}></div>
                            </div>
                           

                            {hoveredItem === item && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: '-100%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(203, 211, 219, 0.8)',
                                    color: 'black',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    zIndex: 100
                                }}>
                                    <p style={{ color: '#343A40' }}><strong>Time Until Expired:</strong> {item.daysLeft || 'Unknown'}</p>
                                    <p style={{ color: '#343A40' }}><strong>Expiration Date:</strong> {item._doc.expirationDate ? formatDate(item._doc.expirationDate) : 'Unknown'}</p> {/* Updated to format expiration date */}
                                    <p style={{ color: '#343A40' }}><strong>Disposal Suggestion:</strong> {item._doc.disposalSuggestion || 'N/A'}</p>
                                    <p style={{ color: '#343A40' }}><strong>Calories:</strong> {item._doc.calories || 'N/A'}</p>
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
                        opacity: currentPage >= totalPages -1 ? '0' : '1'
                    }}>
                    →
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
