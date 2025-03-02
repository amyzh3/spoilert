import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

function Home() {

  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div>
      <div className="home-container" style={{
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
        color: 'white',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
        position: 'fixed',
        top: 0,
        left: 0
      }}>
      <img
        src="/sticky-note.png"
        alt="Sticky Note"
        style={{
          width: '30vw'
        }}
      />
      <button 
        onClick={() => navigate("/signup")} // Ensure you're passing the function reference, not calling it directly
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          color: 'black',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
        Open my fridge!
      </button>
      </div>
    </div>
  );
}

export default Home;
