import React, { useState } from "react"
import "./Scheme.css"
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined"
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined"
import { Link } from "react-router-dom"

const Scheme = ({ item }) => {
  const [expand, setExpand] = useState(false)

  const getDueDate = (val) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = val ? new Date(val) : new Date();
    // console.log("dude => ", months[d.getMonth()] + " " + d.getFullYear())
    var month = d.getMonth();
    if (month === 11) {
      return months[d.getMonth()] + " " + (d.getFullYear() + 1).toString().substr(-2);
    } else {
      return months[d.getMonth() + 1] + " " + d.getFullYear().toString().substr(-2);
    };
  }

  const getDate = (date) => {
    console.log('date', date)
    const d = date ? new Date(date) : new Date();
    console.log("get dat =>", d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear())
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  }

  const payhandler = () => {
    window.open(`http://65.1.124.220:3002/about?amount=${item.chits.InstAmt}&order=${Math.floor((Math.random() * 100) + 1)}`);
  };

  return (
    <>
      <div className="scheme">
        <div className="container">
          <div className="header">
            <div className="title">
              <p className="schemeName">Scheme No - {item.chits.yrtrno}</p>
            </div>
            <Link className="expand" onClick={() => setExpand(!expand)}>
              {!expand && <ControlPointOutlinedIcon />}
              {expand && <RemoveCircleOutlineOutlinedIcon />}
            </Link>
          </div>
          {expand && (
            <div className="content">
              <div className="values">
                <span className="label">Name</span>
                <br />
                <span className="value">{item.chits.CustName}</span>
              </div>
              <div className="values">
                <span className="label">Chit type</span>
                <br />
                <span className="value">{item.chits.STCode == '1' ? 'Metal' : 'Cash'}</span>
              </div>
              <div className="values">
                <span className="label">Last Installment Paid</span>
                <br />
                <span className="value">{item.receipts.length && item.receipts[0].InstNo ? item.receipts[0].InstNo + '/11' : '0/11'}</span>
              </div>
              <div className="values">
                <span className="label">Last Installment Amount</span>
                <br />
                <span className="value">{item.receipts.length && item.receipts[0].TrDate && item.chits.InstAmt && getDate(item.receipts[0].TrDate) + ' - Rs: ' + item.chits.InstAmt + '/-' || '-'}</span>
              </div>
              <div className="values">
                <span className="label">Current Due Date</span>
                <br />
                <span className="value">{getDueDate(item.receipts[0].TrDate) + ' - Rs: ' + item.chits.InstAmt + '/-'}</span>
              </div>
              {!item.receipts.length || Math.floor((new Date().getTime() - new Date(item.receipts[0].TrDate).getTime()) / (1000 * 60 * 60 * 24)) > 30 &&
                <Link className="addSchemeBtn">
                  <button type="button" onClick={payhandler}>Pay Scheme</button>
                </Link>
              }
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Scheme
