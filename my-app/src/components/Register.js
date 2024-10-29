import React, { useState } from "react";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const Email = email.toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false); // Reset error visibility

    if (!email || !password || !name) {
      setShowError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: Email, password }),
      });

      const user = await response.json();

      if (response.ok) {
        toast.success("Registration successful.");
        localStorage.setItem("token", user.token);
        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      } else {
        toast.error(user.error || "Registration failed.");
      }
    } catch (error) {
      toast.error("An error occurred while registering user.");
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="SignupContainer">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Your Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {showError && (
        <span className="fill-fields-error">Please fill all the fields</span>
      )}
      <ToastContainer />
    </div>
  );
};

export default Register;
