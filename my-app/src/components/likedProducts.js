import React, { useState, useEffect } from "react";
import "../styles/likedProducts.css";
import { toast, ToastContainer } from "react-toastify";

const LikedProducts = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    fetchLikedProducts();
  }, []);

  const fetchLikedProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authorization token found.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/auth/likedRecipes", {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to fetch liked products");
        return;
      }

      const data = await response.json();
      setLikedProducts(data);
    } catch (error) {
      toast.error(`Error fetching liked products: ${error.message}`);
    }
  };

  const handleRemoveItem = async (recipeId) => {
    try {
      if (window.confirm("Are you sure you want to remove this recipe from favourites?")) {
        const response = await fetch(`http://localhost:4000/auth/removeLiked/${recipeId}`, {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (response.ok) {
          toast.success("Item removed successfully");
          fetchLikedProducts(); // Refresh the liked products
        } else {
          const data = await response.json();
          toast.error(data.message || "Failed to remove item");
        }
      }
    } catch (error) {
      toast.error(`Error removing item from liked products: ${error.message}`);
    }
  };

  const handleEditItem = (product) => {
    setCurrentProduct(product);
    setEditMode(true);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:4000/auth/updateLiked/${currentProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(currentProduct),
      });

      if (response.ok) {
        toast.success("Item updated successfully");
        fetchLikedProducts(); // Refresh the liked products
        setEditMode(false);
        setCurrentProduct(null);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update item");
      }
    } catch (error) {
      toast.error(`Error updating item: ${error.message}`);
    }
  };

  return (
    <div className="likedRecipes">
      <h2>Favourites</h2>
      <ul>
        {likedProducts.length > 0 ? (
          likedProducts.map((product) => (
            <li key={product._id} className="list">
              <div>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} />
                ) : (
                  <p>No image available</p>
                )}
                <h4>Ingredients:</h4>
                <ul className="ingredients-list">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>

                <div className="instructions-container">
                  <h4>Instructions:</h4>
                  <div className="instructions-list">
                    {product.instructions.split("\n").map((step, index) => (
                      <p key={index}>{step}</p>
                    ))}
                  </div>
                </div>

                <button className="remove-item-button" onClick={() => handleRemoveItem(product._id)}>
                  Remove Item
                </button>
                <button className="edit-item-button" onClick={() => handleEditItem(product)}>
                  Edit Item
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No liked recipes found.</p>
        )}
      </ul>

      {editMode && currentProduct && (
        <form onSubmit={handleUpdateItem} className="edit-form">
          <h3>Edit Product</h3>
          <label>
            Title:
            <input
              type="text"
              value={currentProduct.title}
              onChange={(e) => setCurrentProduct({ ...currentProduct, title: e.target.value })}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              value={currentProduct.description}
              onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
              required
            />
          </label>
          <label>
            Ingredients:
            <input
              type="text"
              value={currentProduct.ingredients.join(", ")}
              onChange={(e) => setCurrentProduct({ ...currentProduct, ingredients: e.target.value.split(", ") })}
              required
            />
          </label>
          <label>
            Instructions:
            <textarea
              value={currentProduct.instructions}
              onChange={(e) => setCurrentProduct({ ...currentProduct, instructions: e.target.value })}
              required
            />
          </label>
          <button type="submit">Update Product</button>
          <button type="button" onClick={() => { setEditMode(false); setCurrentProduct(null); }}>
            Cancel
          </button>
        </form>
      )}

      <ToastContainer />
    </div>
  );
};

export default LikedProducts;
