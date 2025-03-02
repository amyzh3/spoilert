import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Signup.css';

function Signup({ setUser }) {

  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/signup', {signupUsername, signupPassword}); 

      if(response.status === 201){
        alert("signup successful!");
        setUser(signupUsername);
        localStorage.setItem("username", signupUsername);
        navigate("/dashboard");
      }
      // else{
      //   alert("Sign up failed.")
      // }
    } catch (error) {
      console.error('Error signing up:', error);
      alert(error.response.data.message);
    }
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
      position: 'fixed',
      top: 0,
      left: 0
  }}>
    <div style={{
      backgroundColor: '#CBD3DB',
      width: '90vh',
      height: '60vh',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column', 
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      opacity: 0.8,
      borderRadius: '15px',
    }}>
      <h2 style={{
        color: '#343A40',
        textShadow: '0',
        fontWeight: 'bold',
        fontSize: '36px',
      }}>Sign up for a New Account</h2>
      <form className="signup-form" onSubmit={handleSignup} style={{
                  marginTop: '40px',
                  display: 'flex', 
                  flexDirection: 'column', 
                  width: '300px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#343A40'
      }}>
        <div className="input-container">
          <div>
            <label className="input-label">Username:</label>
            <input className="input" type="username" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} required />
          </div>
          <div>
            <label className="input-label">Password:</label>
            <input className="input" type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />   
          </div>
        </div>
        <div className="button-container" style={{
            display: 'flex',
            justifyContent: 'space-between', 
            width: '100%', 
            gap: '10px', 
        }}>
          <button 
            onClick={() => navigate("/login")}
            style={{
              background: "#FFFFFF",
              border: "2px solid #F5F5F5", 
              fontSize: "24px",
              cursor: "pointer",
              color: '#343A40',
              opacity: '1',
              padding: '10px 20px',
              borderRadius: '25px',
              fontFamily: 'Karla, sans-serif',
              whiteSpace: 'nowrap',
            }}> Go to Login</button>
            <button 
              type="submit"
              style={{
                  background: "#FFFFFF",
                  border: "2px solid #F5F5F5", 
                  fontSize: "24px",
                  cursor: "pointer",
                  color: '#343A40',
                  opacity: '1',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  fontFamily: 'Karla, sans-serif',
                  whiteSpace: 'nowrap',
              }}> Sign up!
          </button>
        </div>
      </form>
    </div>
  </div>
  );
}

export default Signup;
