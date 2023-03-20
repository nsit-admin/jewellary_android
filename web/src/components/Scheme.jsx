import React, { useState } from "react";
import "./Scheme.css";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Link } from "react-router-dom";
const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

const Scheme = ({ item, expandedChitNo, onExpand }) => {
  const API_URL = "https://guruhastithangamaaligai.com/api";
  // const API_URL = "http://localhost:5000/api";
  const [openPayment, setOpenPayment] = useState(false);
  const orderId =
    Math.floor(Math.random() * 10000 + 1) +
    "_" +
    item.chits.yrtrno +
    "_" +
    item.chits.STCode;
  item.chits["order_id"] = orderId;
  let url = `/about?amount=${item.chits.InstAmt}&order=${orderId}`;
  const handleClose = () => {
    setOpenPayment(false);
  };

  const getDueDate = (val) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const d = val ? new Date(val) : new Date();
    var month = d.getMonth();
    if (month === 11) {
      return (
        months[d.getMonth()] + " " + (d.getFullYear() + 1).toString().substr(-2)
      );
    } else {
      return (
        months[d.getMonth() + 1] + " " + d.getFullYear().toString().substr(-2)
      );
    }
  };

  const getDate = (date) => {
    const d = date ? new Date(date) : new Date();
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  };

  const payhandler = () => {
    setOpenPayment(true);
    fetch(`${API_URL}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    window.open(url, "_blank");
  };

  return (
    <>
      <div className="scheme">
        <div className="container">
          <div className="header">
            <div className="title">
              <p className="schemeName">Scheme No - {item.chits.yrtrno}</p>
            </div>
            <Link
              className="expand"
              onClick={() => onExpand(item.chits.yrtrno)}>
              {!(expandedChitNo === item.chits.yrtrno) && <ControlPointOutlinedIcon />}
              {(expandedChitNo === item.chits.yrtrno) && <RemoveCircleOutlineOutlinedIcon />}
            </Link>
          </div>
          {(expandedChitNo === item.chits.yrtrno) && (
            <div className="content">
              <div className="values">
                <span className="label">Name</span>
                <br />
                <span className="value">{item.chits.CustName}</span>
              </div>
              <div className="values">
                <span className="label">Chit type</span>
                <br />
                <span className="value">
                  {item.chits.STCode == "1" ? "Metal" : "Cash"}
                </span>
              </div>
              <div className="values">
                <span className="label">Last Installment Paid</span>
                <br />
                <span className="value">
                  {item.receipts.length && item.receipts[0].InstNo
                    ? item.receipts[0].InstNo + "/11"
                    : "0/11"}
                </span>
              </div>
              <div className="values">
                <span className="label">Last Installment Amount</span>
                <br />
                <span className="value">
                  {(item.receipts.length &&
                    item.receipts[0].TrDate &&
                    item.chits.InstAmt &&
                    getDate(item.receipts[0].TrDate) +
                    " - Rs: " +
                    item.chits.InstAmt +
                    "/-") ||
                    "-"}
                </span>
              </div>
              <div className="values">
                <span className="label">Current Due Date</span>
                <br />
                <span className="value">
                  {getDueDate(item.receipts[0].TrDate) +
                    " - Rs: " +
                    item.chits.InstAmt +
                    "/-"}
                </span>
              </div>
              {!item.receipts.length ||
                (Math.floor(
                  (new Date().getTime() -
                    new Date(item.receipts[0].TrDate).getTime()) /
                  (1000 * 60 * 60 * 24)
                ) > 30 && (
                    <Link className="addSchemeBtn">
                      <button
                        type="button"
                        onClick={payhandler}>
                        Pay Scheme
                      </button>
                    </Link>
                  ))}
            </div>
          )}
        </div>
      </div>
      {/* <div>
        <Dialog
          open={openPayment}
          TransitionComponent={Transition}
          fullScreen
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Payment Gateway
              </Typography>
            </Toolbar>
          </AppBar>
          window.open(url);
          <DialogContent className="iframeClass">

          <iframe 
          allowFullScreen
          src={url}
          // sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
          sandbox="allow-top-navigation allow-scripts allow-forms"
          frameBorder="0"
          height={900}
          width={500}
          scrolling="no"
        /> 
          </DialogContent>
        </Dialog>
      </div>  */}
    </>
  );
};

export default Scheme;
