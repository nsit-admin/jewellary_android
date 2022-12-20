import React , {useState, useEffect}from "react"
import { Link } from "react-router-dom"
import "./ExistingScheme.css"
import Scheme from "../../components/Scheme"
import Header from "../../components/Header"
const ExistingScheme = () => {
  const [myChits, setMyChits] = useState([]);
  const getMySchemes = () => {
    fetch(`http://65.1.124.220:5000/api/schemes?mobileNumber=9994501928`, {
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
  useEffect(() => {
    getMySchemes();
  },[])
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
          <button onClick={payhandler} className="addSchemeBtn">Pay</button></Link>
        
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
