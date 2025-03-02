import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setUser }) {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/signup', {signupUsername, signupPassword}); // Assuming backend has an /items route

      if(response.status === 201){
        alert("signup successful!");
        setUser(signupUsername); // Update state
        localStorage.setItem("username", signupUsername);
        navigate("/dashboard");
      }else{
        alert("Sign up failed.")
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert(error.response.data.message);
    }
};

  const handleLogin = async (e) => {
      e.preventDefault();

      try {
        const response = await axios.post('http://localhost:8000/login', {loginUsername, loginPassword}); // Assuming backend has an /items route

        if(response.status === 200){
          alert("Login successful!");
          setUser(loginUsername); // Update state
          localStorage.setItem("username", loginUsername); 
          navigate("/dashboard");
        }else{
          alert(response.data.message)
        }
    } catch (error) {
      console.error('Error logging in:', error.response.data.message);
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <label>Username:</label>
        <input type="username" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} required />
        <label>Password:</label>
        <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
        <button type="submit">Signup</button>
      </form>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Username:</label>
        <input type="username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} required />
        <label>Password:</label>
        <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
