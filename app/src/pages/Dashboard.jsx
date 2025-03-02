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

        // // calculations for the progress bar
        // const calculateProgress = (dateAdded, daysLeft) => {
        //     const currentDate = new Date();
        //     const addedDate = new Date(dateAdded);
        //     const expirationDate = new Date(addedDate);
        //     expirationDate.setDate(expirationDate.getDate() + daysLeft);
    
        //     const totalDays = (expirationDate - addedDate) / (1000 * 60 * 60 * 24);
        //     const remainingDays = (expirationDate - currentDate) / (1000 * 60 * 60 * 24);
    
        //     return Math.max(0, Math.min(100, (remainingDays / totalDays) * 100));
        // };

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

    const handleAddone = async (itemId) => {
        try {
            await axios.post('http://localhost:8000/add-one', { itemId });
            fetchData();
        } catch (error) {
            console.error('Error adding one:', error);
        }
    }

    const handleRemoveOne = async (itemId) => {
        try {
            await axios.post('http://localhost:8000/subtract-one', { itemId });
            fetchData(); 
        } catch (error) {
            console.error('Error removing one:', error);
        }
    }

    const handleRemove = async (itemId) => {
        try {
            const response = await axios.post('http://localhost:8000/delete-item', { itemId });
            fetchData(); // Refresh data after removing item
            alert(response.data.message);
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Error removing item');
        }
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
                top: '-15px',
                left: '20px',
                fontSize: '40px',
                fontWeight: 'bold',
                color: '#343A40',
                textTransform: 'uppercase',
                textAlign: 'center',
                width: '100%',
            }}>Hello, <span style={{color: '#427AA1'}}>{user || "Guest"}</span> 👋</h1>
            
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
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontFamily: 'Karla, sans-serif',
                    fontWeight: 'bold',
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
                    {displayedItems.map((item, index) => {
                        const progress = item.percentage;

                        let progressBarColor = '#49A93C';

                        if (progress <= 50) {
                            progressBarColor = '#E3CD28';
                        }
                        
                        if (progress <= 25) {
                            progressBarColor = '#ED5353';
                        }

                        return (
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
                                <span style={{ fontSize: "30px", color: "black", marginBottom: "5px", fontWeight: "500" }}>{item._doc.itemName}</span>
                                <span style={{ fontSize: "130px"}}>
                                {item.expired ? '🕳️' : getItemEmoji(item)}
                            </span>

                                {/* Progress Bar Wrapper */}
                                <div className="progress-bar-container">
                                <div className="progress-bar" style={{
                                     width: `${progress}%`, 
                                     backgroundColor: progressBarColor,
                                }}></div>
                                </div>
                            

                            {hoveredItem === item && (
                                <div style={{
                                    position: 'absolute',
                                    top: '40%',
                                    left: '-40%',
                                    width: '20vw',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(203, 211, 219, 0.95)',
                                    color: 'black',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    zIndex: 100
                                }}>
                                    <p style={{ color: '#343A40' }}><strong>Time Until Expired:</strong>   {item.daysLeft > 0 ? item.daysLeft + ' day(s)' : Math.abs(item.daysLeft) + ' day(s) ago'}
                                    </p>
                                    <p style={{ color: '#343A40' }}><strong>Expiration Date:</strong> {item._doc.expirationDate ? formatDate(item._doc.expirationDate) : 'Unknown'}</p> {/* Updated to format expiration date */}
                                    <p style={{ color: '#343A40' }}><strong>Disposal Suggestion:</strong> {item._doc.disposalSuggestion || 'N/A'}</p>
                                    <p style={{ color: '#343A40' }}><strong>Calories:</strong> {item._doc.calories || 'N/A'}</p>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px', backgroundColor: 'white', padding: '5px 8px', borderRadius: '5px', width: '' }}>
                                    <button 
                                            onClick={async () => handleRemoveOne(item._doc._id)}
                                            style={{
                                                backgroundColor: '#427AA1',
                                                color: 'white',
                                                border: 'none',
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                marginLeft: '10px'
                                            }}
                                        >
                                            -
                                        </button>
                                        <span style={{ fontSize: '24px', color: '#343A40', fontWeight: '600', margin: '0px 5px' }}>{item._doc.units}</span>
                                        <button 
                                            onClick={() => handleAddone(item._doc._id)}
                                            style={{
                                                backgroundColor: '#427AA1',
                                                color: 'white',
                                                border: 'none',
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                marginRight: '10px'
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button onClick={() => handleRemove(item._doc._id)} className="remove-item-button" style={{display: 'block', margin: "10px auto"}}>Remove</button>
                                </div>
                            )}
                        </div>

                    )})};
                </div>


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
