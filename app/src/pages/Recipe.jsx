import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Recipe.css';

function Recipe() {
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null); // Added state to hold the recipe content

  const navigate = useNavigate();

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/get-recipe');
      setLoading(false);

      if (response.status === 200) {
        const recipeString = response.data.recipe;
        const result = recipeString.substring(7, recipeString.length - 4);
        setRecipe(result);
      } else {
        alert("Failed to fetch recipe.");
      }
    } catch (error) {
      setLoading(false);
      alert("Error fetching recipe");
    }
  };

  return (
    <div style={{display: 'flex', flexDirection:'column', alignItems:'center', backgroundColor: 'white', minHeight: '80vh', padding: '30px'}}>
      <h1 style={{fontSize: '50px', color: '#427AA1', marginTop: '0px'}}>A Recipe for your Fridge...</h1>
      {loading && <p style={{color: '#427AA1', fontWeight: '700'}}>Loading...</p>}
      
      {/* Conditionally render recipe */}
      {!loading && recipe && (
        <div id='recipeContainer' style={{color: '#343A40', textAlign: 'left'}} dangerouslySetInnerHTML={{ __html: recipe }} />
      )}

      {/* If no recipe is loaded */}
      {!loading && !recipe && <p style={{color: '#343A40', fontWeight: '600'}}>Click below to see your recipe!</p>}
      <div className='button-container'>
        <button className="button" onClick={handleClick}>Get Recipe</button>
        <button className="button" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>
    </div>
  );
}

export default Recipe;
