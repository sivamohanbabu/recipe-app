import React, { useState } from "react";
import "../styles/ForgotPassword.css";
import { toast, ToastContainer } from "react-toastify";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:4000/auth/forgotpassword", // Changed to http if your backend doesn't support https
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        toast.success("Password updated successfully");

        setTimeout(() => {
          window.location.href = "/login";
        }, 4000);
      } else {
        const errorData = await response.json(); // Get error details from response
        setMessage(errorData.message || "An error occurred while updating the password.");
        toast.error(errorData.message || "Error in password update");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while updating the password.");
      toast.error("An error occurred while updating the password.");
    }
  };

  return (
    <div className="update-password-container">
      <h2>Update Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Password</button>
      </form>
      {message && <p className="error-message">{message}</p>}
      <ToastContainer />
    </div>
  );
};

export default UpdatePassword;
