import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

function Home() {
  const navigate = useNavigate();
  const [slideOut, setSlideOut] = useState(false); // State to trigger animation

  const handleClick = () => {
    setSlideOut(true); // Start animation
    setTimeout(() => {
      navigate("/login"); // Navigate after animation completes
    }, 600); // Match animation duration
  };

  return (
    <motion.div
      initial={{ x: 0 }}
      animate={slideOut ? { x: "100vw" } : { x: 0 }} // Slide right on click
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="home-container"
      style={{
        
        backgroundImage: "url('/fridge-closed.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      <img
        src="/sticky-note.png"
        alt="Sticky Note"
        style={{
          width: '30vw'
        }}
      />
        <button
        onClick={handleClick} // Trigger slide animation
        whileHover={{ scale: 1.1 }} // Slight zoom effect
        className="fridge-button"
        style={{
          //transform: 'transate(-50%, -50%) rotate(-10deg)',
          backgroundPosition:'center',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          top: '50%',
          left: '50%',
        }}
      >
        Open my fridge!
      </button>

    </motion.div>
  );
}

export default Home;

