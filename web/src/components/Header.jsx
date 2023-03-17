import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import "./Header.css";
import ConfirmationBox from "./ConfirmationBox/ConfirmationBox";

const Header = () => {
  const [logout, setLogout] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const handleLogout = () => {
    setLogout(true);
    setModalStatus(true);
    setModalTitle("Logout");
    setModalDesc("Are you sure that you want to LogOut?");
  };
  const onClose = () => {
    setLogout(false);
  };
  return (
    <div className="header">
      <img
        src="img/logo.png"
        alt="logo"
        className="logo"
      />
      <ConfirmationBox
        modalStatus={modalStatus}
        modalTitle={modalTitle}
        modalDesc={modalDesc}
        close={() => setModalStatus(false)}></ConfirmationBox>
      <div
        className="logout"
        onClick={handleLogout}>
        <Link>
          <span>Logout</span> <LogoutOutlinedIcon />
        </Link>
      </div>
    </div>
  );
};

export default Header;
