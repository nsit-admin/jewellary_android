import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import "./ExistingScheme.css"
import Scheme from "../../components/Scheme"
import Header from "../../components/Header"


const ExistingScheme = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [myChits, setMyChits] = useState([]);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [storeLogin, setStoreLogin] = useState(false);
  const [viewChits, setViewChits] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');
  const [showPayment, setShowPayment] = useState(false);


  useEffect(() => {
    setStoreLogin(location.state.isStoreLogin);
    setMobileNumber(location.state.mobileNumber);
    getMySchemes();
    if (!location.state.isStoreLogin && (myChits.length === 0)) {
    }
  }, []);

  const getMySchemes = () => {
    fetch(`http://65.1.124.220:5000/api/schemes?mobileNumber=${location.state.mobileNumber}`, {
      method: 'GET',
    })
      .then(async res => {
        try {
          const jsonRes = await res.json();
          if (res.status === 200 && jsonRes.records && jsonRes.records.length > 0) {
            setMyChits(jsonRes.records);
          }
        } catch (err) {
          console.log(err);
        };
      })
      .catch(err => {
        console.log(err);
      });
  };

  const payhandler = () => {
    window.open('http://65.1.124.220:3002/about');
  };
  return (
    <div className="existingScheme">
      <Header />
      <div className="heading">
        <h2>Your Existing Schemes</h2>
        <Link to="/add-scheme" className="addSchemeBtn">
          <button>Add Scheme</button></Link>
        <Link className="addSchemeBtn">
          {/* <button onClick={payhandler} className="addSchemeBtn">Pay</button> */}
          </Link>

      </div>
      <div className="schemeList">
        {myChits?.map((item, index) => (
          <Scheme item={item} key={index} />
        ))}
      </div>
    </div>

  )
}

export default ExistingScheme;
