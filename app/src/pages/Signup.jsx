import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup({ setUser }) {

  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/signup', {signupUsername, signupPassword}); // Assuming backend has an /items route

      if(response.status === 201){
        alert("signup successful!");
        setUser(response.data.username);
        navigate("/dashboard");
      }else{
        alert("Sign up failed.")
      }
    } catch (error) {
      console.error('Error signing up:', error);
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
    </div>
  );
}

export default Signup;
