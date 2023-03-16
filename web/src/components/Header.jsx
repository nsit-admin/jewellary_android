import React from "react"
import { Link } from "react-router-dom"
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined"
import "./Header.css"

const Header = () => {
  return (
    <div className="header">
      <img src="img/logo.png" alt="logo" className="logo" />
      <div className="logout">
        <Link to="/">
          <span>Logout</span> <LogoutOutlinedIcon />
        </Link>
      </div>
    </div>
  )
}

export default Header;
