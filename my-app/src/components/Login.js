import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const Email = email.toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false); // Reset error visibility

    if (!email || !password) {
      setShowError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: Email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login Successful");
        localStorage.setItem("token", data.token);
        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      } else {
        toast.error(data.error || "Login failed.");
      }
    } catch (error) {
      toast.error("An error occurred while logging in.");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="SignupContainer">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
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
        <Link to="/forgotPassword">Forgot Password</Link>
      </form>
      {showError && (
        <span className="fill-fields-error">Please fill all the fields</span>
      )}
      <ToastContainer />
    </div>
  );
};

export default Login;
