import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AlertDialogSlide from "../../components/ModalPop";
import "./ExistingScheme.css";
import Scheme from "../../components/Scheme";
import Header from "../../components/Header";

const ExistingScheme = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [myChits, setMyChits] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [storeLogin, setStoreLogin] = useState(false);
  const [customerDtls, setCustomerDtls] = useState(false);
  const [viewChits, setViewChits] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const API_URL = "https://guruhastithangamaaligai.com/api";
  // const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    setStoreLogin(location.state.isStoreLogin);
    setMobileNumber(location.state.mobileNumber);
    console.log("mobile num ber", location.state.mobileNumber);
    if (!location.state.isStoreLogin && myChits.length === 0) {
      getMySchemes();
    }
  }, []);

  const openAddScheme = () => {
    console.log("store login", storeLogin);
    console.log("customer exist", customer);
    navigate("/add-scheme", {
      state: {
        mobileNumber: mobileNumber,
        isStoreLogin: storeLogin,
        chits: myChits,
        customer: customer,
      },
    });
  };

  const getMySchemes = () => {
    fetch(`${API_URL}/schemes?mobileNumber=${location.state.mobileNumber}`, {
      method: "GET",
    })
      .then(async (res) => {
        console.log("resppp", res);
        setViewChits(true);
        try {
          const jsonRes = await res.json();
          console.log("jsonRes: ", jsonRes);
          if (
            res.status === 200 &&
            jsonRes.records &&
            jsonRes.records.length > 0
          ) {
            setMyChits(jsonRes.records);
          }
          if (
            res.status === 200 &&
            jsonRes.customer &&
            jsonRes.customer.length > 0
          ) {
            console.log(" customer => ", jsonRes.customer);
            setCustomer(jsonRes.customer);
          }
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCustomerSchemes = () => {
    setMyChits([]);
    setViewChits(false);
    if (!customerPhone) {
      setModalStatus(true);
      setModalTitle("GHT");
      setModalDesc("Kindly enter customer mobile number");
      return;
    }
    if (customerPhone && customerPhone.length != 10) {
      setModalStatus(true);
      setModalTitle("GHT");
      setModalDesc("Kindly enter Valid  mobile number of Customer");
      return;
    }
    fetch(`${API_URL}/schemes?mobileNumber=${customerPhone}`, {
      method: "GET",
    })
      .then(async (res) => {
        setCustomerDtls(false);
        try {
          const jsonRes = await res.json();
          console.log("jsonRes", jsonRes);
          if (
            res.status === 200 &&
            jsonRes.records &&
            jsonRes.records.length > 0
          ) {
            setViewChits(true);
            setMyChits(jsonRes.records);
            if (jsonRes.customer && jsonRes.customer.length) {
              setCustomer(jsonRes.customer);
            }
          } else {
            setModalStatus(true);
            setModalTitle("GHT");
            setModalDesc("Please enter a valid number");
          }
        } catch (err) {
          setViewChits(false);
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="existingScheme">
      <AlertDialogSlide
        modalStatus={modalStatus}
        modalTitle={modalTitle}
        modalDesc={modalDesc}
        close={() => setModalStatus(false)}></AlertDialogSlide>
      <Header />

      {storeLogin && (
        <div className="heading">
          <input
            type="text"
            className="existingButton"
            value={customerPhone}
            maxLength="10"
            name="Name"
            placeholder="Customer Phone Number"
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
          <button
            type="button"
            className="getExistingButton"
            onClick={getCustomerSchemes}>
            {"Get Existing"}
          </button>
        </div>
      )}
      <div className="heading">
        {storeLogin && viewChits && (
          <>
            <h2>
              {storeLogin ? "Customer Scheme Details" : "Your Existing Schemes"}
            </h2>
            <button
              type="button"
              className="getExistingButton"
              onClick={openAddScheme}>
              Add Customer Scheme
            </button>
          </>
        )}
        {!storeLogin && (
          <>
            <h2>
              {storeLogin ? "Customer Scheme Details" : "Your Existing Schemes"}
            </h2>
            <button
              type="button"
              className="getExistingButton"
              onClick={openAddScheme}>
              Add New Scheme
            </button>
          </>
        )}
      </div>
      {viewChits && (
        <div className="schemeList">
          {myChits?.map((item, index) => (
            <Scheme
              item={item}
              key={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExistingScheme;
