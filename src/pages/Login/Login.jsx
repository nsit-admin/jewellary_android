import React from "react"
import { Link } from "react-router-dom"
import "./Login.css"

const Login = () => {
  return (
    <div className="login">
      <img src="img/logo.png" alt="logo" className="logo" />
      <div className="container">
        <img src="img/login-bg.jpeg" alt="login" />
        <div className="form">
          <h1>Login</h1>
          <span>Please signin to your account</span>
          <div className="formContainer">
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
            />
            <Link className="forgotPassword">
              <span>Forgot password?</span>
            </Link>
            <Link to="/existing-scheme">
              <button type="button">Signin</button>
            </Link>
            <span>
              Don't have an account? <Link className="signup">Signup</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
