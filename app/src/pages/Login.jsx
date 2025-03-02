import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css"; // same as signup.css

function Login({ setUser }) {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/login", {
        loginUsername,
        loginPassword,
      });

      if (response.status === 200) {
        alert("Login successful!");
        setUser(loginUsername);
        localStorage.setItem("username", loginUsername);
        navigate("/dashboard");
      } 
      // else {
      //   alert(response.data.message);
      // }
    } catch (error) {
      console.error("Error logging in:", error);
      alert(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div
      className="dashboard-container"
      style={{
        backgroundImage: "url('/shutterstock_2134374041.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          backgroundColor: "#CBD3DB",
          width: "90vh",
          height: "75vh",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          opacity: 0.8,
          borderRadius: "15px",
        }}
      >      
      <img style={{width: '300px'}} src="public/spoilert.png" />
        <h2
          style={{
            color: "#343A40",
            textShadow: "0",
            fontWeight: "bold",
            fontSize: "36px",
            marginTop: "0px",
          }}
        >
          Login to Your Account
        </h2>
        <form
          className="login-form"
          onSubmit={handleLogin}
          style={{
            marginTop: "40px",
            display: "flex",
            flexDirection: "column",
            width: "300px",
            justifyContent: "center",
            alignItems: "center",
            color: "#343A40",
          }}
        >
          <div className="input-container">
            <div>
              <label className="input-label">Username:</label>
              <input
                className="input"
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="input-label">Password:</label>
              <input
                className="input"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div
            className="button-container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              gap: "10px",
            }}
          >
            <button
              onClick={() => navigate("/signup")}
              style={{
                background: "#FFFFFF",
                border: "2px solid #F5F5F5",
                fontSize: "24px",
                cursor: "pointer",
                color: "#343A40",
                opacity: "1",
                padding: "10px 20px",
                borderRadius: "25px",
                fontFamily: "Karla, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              Go to Signup
            </button>
            <button
              type="submit"
              style={{
                background: "#FFFFFF",
                border: "2px solid #F5F5F5",
                fontSize: "24px",
                cursor: "pointer",
                color: "#343A40",
                opacity: "1",
                padding: "10px 20px",
                borderRadius: "25px",
                fontFamily: "Karla, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
