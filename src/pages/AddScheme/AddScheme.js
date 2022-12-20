import React from "react"
import Header from "../../components/Header"
import "./AddScheme.css"

const AddScheme = () => {
  return (
    <div className="addScheme">
      <Header />
      <div className="container">
        <p className="details">
          Kindly provide all the below details to add scheme:
        </p>
        <div className="savingType">
          <p>
            <b>Savings Type:</b>
          </p>
          <div>
            <input type="radio" name="type" id="cash" />
            <label htmlFor="cash">Cash</label>
          </div>
          <div>
            <input type="radio" name="type" id="metal" />
            <label htmlFor="metal">Metal</label>
          </div>
        </div>
        <form action="">
          <div className="inputContainer">
            <input type="text" name="name" id="" placeholder="Name" />
            <input type="tel" name="tel" id="" placeholder="Phone Number" />
            <select name="installment" id="">
              <option value="Installment Amount" disabled selected>
                Installment Amount
              </option>
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
              <option value="2000">2000</option>
            </select>
            <input type="text" name="name" id="" placeholder="Name" />
          </div>
          <button type="button">Add Scheme</button>
        </form>
      </div>
    </div>
  )
}

export default AddScheme
