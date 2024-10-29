import React, { useState } from "react";
import "../styles/Addrecipe.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRecipe = () => {
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [""],
    instructions: "",
  });
  const [image, setImage] = useState(null); // State to hold the image file

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe({
      ...recipe,
      [name]: value,
    });
  };

  const handleAddIngredient = () => {
    const lastIngredient = recipe.ingredients[recipe.ingredients.length - 1];
    if (lastIngredient !== "") {
      setRecipe({
        ...recipe,
        ingredients: [...recipe.ingredients, ""],
      });
    }
  };

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = value;
    setRecipe({
      ...recipe,
      ingredients: updatedIngredients,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Set the selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nonEmptyIngredients = recipe.ingredients.filter(
      (ingredient) => ingredient.trim() !== ""
    );

    if (nonEmptyIngredients.length === 0) {
      toast.warn("Please provide at least one non-empty ingredient.");
      return;
    }

    const formData = new FormData();
    formData.append("title", recipe.title);
    nonEmptyIngredients.forEach((ingredient) =>
      formData.append("ingredients", ingredient)
    );
    formData.append("instructions", recipe.instructions);
    if (image) {
      formData.append("image", image); // Append the image file
    }

    try {
      const response = await fetch("http://localhost:4000/auth/recipe", {
        method: "POST",
        body: formData, // Send form data
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token
        },
      });

      if (response.ok) {
        toast.success("Recipe added successfully");
        setTimeout(() => {
          window.location.href = "/recipes";
        }, 4000);
      } else {
        const errorResponse = await response.json(); // Get the error response
        toast.error(`Failed to add recipe: ${errorResponse.message}`);
      }
    } catch (error) {
      toast.error("An error occurred while adding the recipe.");
    }
  };

  return (
    <div className="add-recipe">
      <h2>Add Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={recipe.title}
            onChange={handleInputChange}
            required // Add required attribute
          />
        </div>
        <div>
          <label>Ingredients:</label>
          {recipe.ingredients.map((ingredient, index) => (
            <input
              type="text"
              key={index}
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              required // Add required attribute
            />
          ))}
          <button type="button" onClick={handleAddIngredient}>
            Add Ingredient
          </button>
        </div>
        <div>
          <label>Instructions:</label>
          <textarea
            name="instructions"
            value={recipe.instructions}
            onChange={handleInputChange}
            required // Add required attribute
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*" // Accept image files only
            onChange={handleImageChange}
            required // Add required attribute
          />
        </div>
        <div>
          <button type="submit">Add Recipe</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddRecipe;
