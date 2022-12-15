import React, { useState } from "react"
import "./Scheme.css"
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined"
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined"
import { Link } from "react-router-dom"

const Scheme = ({ item }) => {
  const [expand, setExpand] = useState(false)

  return (
    <>
      <div className="scheme">
        <div className="container">
          <div className="header">
            <div className="title">
              <p className="schemeName">Scheme No - {item.no}</p>
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
                <span className="name">{item.name}</span>
              </div>
              <div className="values">
                <span className="label">Chit type</span>
                <br />
                <span className="name">{item.chitType}</span>
              </div>
              <div className="values">
                <span className="label">Last Installment Paid</span>
                <br />
                <span className="name">{item.lastInstPaid}</span>
              </div>
              <div className="values">
                <span className="label">Last Installment Amount</span>
                <br />
                <span className="name">{item.lastInstDateAndAmount[1]}</span>
              </div>
              <div className="values">
                <span className="label">Current Due Date</span>
                <br />
                <span className="name">{item.currentDue[0]}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Scheme
