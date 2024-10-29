import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({ title: "", ingredients: [], instructions: "" });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:4000/auth/recipe/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        toast.error("Failed to fetch recipe details");
      }
    };

    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ingredients") {
      setRecipe((prev) => ({
        ...prev,
        ingredients: value.split(","),
      }));
    } else {
      setRecipe((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/auth/recipe/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(recipe),
      });

      if (response.ok) {
        toast.success("Recipe updated successfully");
        navigate("/recipes");
      } else {
        toast.error("Failed to update recipe");
      }
    } catch (error) {
      toast.error("An error occurred while updating the recipe");
    }
  };

  return (
    <div className="EditRecipe">
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={recipe.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="ingredients"
          value={recipe.ingredients.join(",")}
          onChange={handleChange}
          placeholder="Ingredients (comma separated)"
          required
        />
        <textarea
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          placeholder="Instructions"
          required
        />
        <button type="submit">Update Recipe</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditRecipe;
