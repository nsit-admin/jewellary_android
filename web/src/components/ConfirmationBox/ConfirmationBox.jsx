import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import "./ConfirmationBox";
import { useNavigate } from "react-router-dom";

const ConfirmationBox = (props) => {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(props.modalStatus);

  const handleLogout = () => {
    navigate("/");
  };
  const handleClose = () => {
    props.close();
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={props.modalStatus}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle className={"title-center"}>{props.modalTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.modalDesc}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleLogout}
            style={{
              borderRadius: 10,
              backgroundColor: "#e7d38d",
              padding: "4px 8px",
              fontSize: "14px",
              color: "black"
            }}
            variant="contained">
            OK
          </Button>
          <Button
            onClick={handleClose}
            style={{
              borderRadius: 10,
              backgroundColor: "#e7d38d",
              padding: "4px 8px",
              fontSize: "14px",
              color: "black"
            }}
            variant="contained">
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmationBox;
