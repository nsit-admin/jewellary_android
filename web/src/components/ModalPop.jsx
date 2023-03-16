import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import "./ModalPop.css"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialogSlide = (props) => {
  // const [modalStatus, setModalStatus] = React.useState(item);
  // const [modalTitle, setModalTitle] = React.useState(item);
  const [open, setOpen] = React.useState(props.modalStatus);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    console.log("handleClose called");
    if (props.modalDesc == 'User has been registered successfully. Please signin to continue') {
      window.location.reload(false);
    }
    props.close();
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={props.modalStatus}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className={"title-center"}>{props.modalTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.modalDesc}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlertDialogSlide;