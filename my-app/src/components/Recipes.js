import React, { useEffect, useState } from "react";
import "../styles/RecipeStyle.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState(new Set());

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/recipe", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipe data");
      }

      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching recipes");
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const response = await fetch(
          `http://localhost:4000/auth/recipe/${recipeId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          toast.success("Recipe deleted successfully");
          setRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe._id !== recipeId));
        } else {
          toast.error("Failed to delete recipe");
        }
      } catch (error) {
        toast.error("An error occurred while deleting the recipe");
      }
    }
  };

  const handleAddToFavorites = async (recipeId) => {
    if (favoriteRecipes.has(recipeId)) {
      toast.error("Recipe is already in favorites.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/auth/likedRecipes/${recipeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setFavoriteRecipes((prev) => new Set(prev).add(recipeId)); // Add to favorites
        toast.success("Recipe added to favorites successfully");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to add to favorites");
      }
    } catch (error) {
      toast.error("An error occurred while adding to favorites");
      console.error("An error occurred while adding to favorites:", error);
    }
  };

  const SearchRecipes = async (e) => {
    try {
      const query = e.target.value;
      if (query) {
        const response = await fetch(
          `http://localhost:4000/auth/searchRecipes/${query}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const searchedRecipes = await response.json();
        setRecipes(searchedRecipes);
      } else {
        getRecipes();
      }
    } catch (error) {
      console.error(error.message);
      toast.error("An error occurred while searching for recipes");
    }
  };

  return (
    <div className="Recipes">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes"
          onChange={SearchRecipes}
        />
      </div>

      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div key={recipe._id} className="Recipe">
            <h2>{recipe.title}</h2>
            {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} />}
            <h3>Ingredients:</h3>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <div className="instructions-container">
              <h3>Instructions:</h3>
              <ol>
                {recipe.instructions.split("\n").map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <button
              className="delete-button"
              onClick={() => handleDeleteRecipe(recipe._id)}
            >
              Delete
            </button>
            <button
              className="add-to-favorites-button"
              onClick={() => handleAddToFavorites(recipe._id)}
              disabled={favoriteRecipes.has(recipe._id)}
            >
              {favoriteRecipes.has(recipe._id) ? "Already Favorited" : "Add to Favorites"}
            </button>
            <Link to={`/editRecipe/${recipe._id}`} className="edit-button">Edit Recipe</Link>
          </div>
        ))
      ) : (
        <h2 className="no-recipes">No Recipes Found</h2>
      )}
      <ToastContainer />
    </div>
  );
};

export default Recipes;
