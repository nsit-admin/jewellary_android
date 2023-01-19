import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import AlertDialogSlide from '../../components/ModalPop'
import "./AddScheme.css"

const AddScheme = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState(null);
  const [storeLogin, setStoreLogin] = useState(false);
  const [chitType, setChitType] = useState('metal');
  const [customerName, setCustomerName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [isEditable, setIsEditable] = useState(true);
  const [instamt, setInstamt] = useState({});
  const [message, setMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);
  const [isDefaultsSet, setIsDefaultsSet] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const API_URL = 'http://65.1.124.220:5000/api';

  useEffect(() => {
    setStoreLogin(location.state.isStoreLogin);
    setMobileNumber(location.state.mobileNumber);
    var chit = location.state.customer[0];
    console.log("====> ",chit);
    if (chit && !isDefaultsSet) {
      setMobileNumber(chit.chits.MobileNo);
      setCustomerName(chit.chits.CustName);
      setAddress1(chit.chits.Add1);
      setAddress2(chit.chits.Add2);
      setAddress3(chit.chits.Add3);
      setIsEditable(false);
      setIsDefaultsSet(true);
    }
  }, []);

  const instData = [
    { label: 'Plan - 500', value: '500' },
    { label: 'Plan - 1000', value: '1000' },
    { label: 'Plan - 2000', value: '2000' },
    { label: 'Plan - 3000', value: '3000' },
    { label: 'Plan - 4000', value: '4000' },
    { label: 'Plan - 5000', value: '5000' },
    { label: 'Plan - 10000', value: '10000' },
  ];


  const goBack = () => {
    navigate("/existing-scheme", { state: { mobileNumber: mobileNumber, isStoreLogin: storeLogin } });
  }

  const addScheme = () => {
    if (!customerName || !address1 || !address2 || !address3 || !instamt) {
      setModalStatus(true);
      setModalTitle('GHT');
      setModalDesc('Kindly provide all the details');
      return;
    }
    const payload = {
      chitType,
      mobileNumber,
      customerName,
      address1,
      address2,
      address3,
      instamt: instamt
    };
    fetch(`${API_URL}/schemes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(async res => {
        try {
          const jsonRes = await res.json();
          if (res.status === 200) {
            navigate("/existing-scheme", { state: { mobileNumber: location.state.mobileNumber, isStoreLogin: location.state.storeLogin } });
          } else {
            // setMessage(jsonRes.message);
            setModalStatus(true);
            setModalTitle('GHT');
            setModalDesc(jsonRes.message);
          }
        } catch (err) {
          console.log(err);
        };
      })
      .catch(err => {
        console.log(err);
      });
  };



  return (
    <div className="addScheme">
      <AlertDialogSlide modalStatus={modalStatus}
        modalTitle={modalTitle}
        modalDesc={modalDesc}
        close={() => setModalStatus(false)}
      ></AlertDialogSlide>
      <Header />
      <div className="container">
        <p className="details">
          Kindly provide all the below details to add scheme:
        </p>
        <div className="savingType">
          <p>
            <b>Savings Type:</b>
          </p>
          <div onChange={(e) => {setChitType(e.target.value)}}>
            <input type="radio" value="cash" name="chitType" checked={chitType === "cash"} /> Cash
            <input type="radio" value="metal" name="chitType" checked={chitType === "metal"} /> Metal
          </div>
        </div>
        <form action="">
          <div className="inputContainer">
            <input type="text" name="name" disabled id="" placeholder="Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)}/>
            <input type="tel" name="tel" id="" disabled placeholder="Phone Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
            <input type="text" name="name" id="" placeholder="address1" disabled value={address1} onChange={(e) => setAddress1(e.target.value)} />
            <input type="text" name="name" id="" placeholder="address2" disabled value={address2} onChange={(e) => setAddress2(e.target.value)} />
            <input type="text" name="name" id="" placeholder="address3" disabled value={address3} onChange={(e) => setAddress3(e.target.value)} />

            <select name="installment" id="" onChange={(e) => setInstamt(e.target.value)}>
              <option value="Installment Amount" disabled selected>
                Installment Amount
              </option>
              {instData.map(currentOption => (
                <option key={currentOption.key} value={currentOption.value}>
                  {currentOption.label}
                </option>
              ))}
            </select>
          </div>
          <button type="button" onClick={addScheme}>Add Scheme</button>
          <button type="button" onClick={goBack}>Cancel</button>
        </form>
      </div>
    </div>
  )
}

export default AddScheme
