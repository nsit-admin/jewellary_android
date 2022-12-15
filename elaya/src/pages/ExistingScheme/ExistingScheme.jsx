import React from "react"
import { Link } from "react-router-dom"
import "./ExistingScheme.css"
import Scheme from "../../components/Scheme"
import Header from "../../components/Header"

const ExistingScheme = () => {
  const data = [
    {
      id: 1,
      no: "8465",
      name: "Prabhakar",
      chitType: "Metal",
      lastInstPaid: "01-Nov-2022",
      lastInstDateAndAmount: ["12/12/2022", "1000"],
      currentDue: ["23-Dec-2022", "1000"]
    },
    {
      id: 2,
      no: "8453",
      name: "Elayaraja",
      chitType: "Flexi",
      lastInstPaid: "08-Aug-2022",
      lastInstDateAndAmount: ["12/12/2022", "1000"],
      currentDue: ["23-Dec-2022", "1000"]
    },
    {
      id: 2,
      no: "8411",
      name: "Prabha",
      chitType: "Flexi",
      lastInstPaid: "11-Dec-2022",
      lastInstDateAndAmount: ["12/12/2022", "1000"],
      currentDue: ["23-Dec-2022", "1000"]
    }
  ]
  return (
    <div className="existingScheme">
      <Header />
      <div className="heading">
        <h2>Your Existing Schemes</h2>
        <Link className="addScheme">
          <button>Add Scheme</button>
        </Link>
      </div>
      <div className="schemeList">
        {data?.map((item) => (
          <Scheme item={item} key={item.id} />
        ))}
      </div>
    </div>
  )
}

export default ExistingScheme
