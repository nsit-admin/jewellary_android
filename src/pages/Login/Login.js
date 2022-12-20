import { Reddit } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useRoute, redirect } from "react-router-dom";
import ExistingScheme from '../ExistingScheme/ExistingScheme';
import "./Login.css";

const API_URL = 'http://65.1.124.220:5000/api';
// const API_URL = 'http://localhost:5000/api';
const RESEND_OTP_SECONDS = 60;

const Login = () => {
 
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [receiptNo, setReceiptNo] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [otp, setOtp] = useState('');

  const [isError, setIsError] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);


  const [message, setMessage] = useState('');
  const [screenType, setScreenType] = useState('SignIn');
  const [resendOTPTimer, setResendOTPTimer] = useState(RESEND_OTP_SECONDS);
  const [resendOTPCount, setResendOTPCount] = useState(0);


  useEffect(() => {
});

const navigate = useNavigate();
const otpHandler = () => {
  if (!isOtpSent) {
      let endpoint = '/sendOtp';
      const isLogin = (screenType === 'SignIn') ? 'login' : 'signup'
      let payload = {
          mobileNumber,
          otp,
          isLogin
      };
      if (!mobileNumber) {
          alert('please enter your phone number');
          return;
      }
      fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
      })
          .then(async res => {
              try {
                  if (res.status !== 200) {
                      setIsError(true);
                      // setMessage('There was a problem. Please try again later.');
                      alert('Entered mobile number is not registerd with Guru Hasti, please register now');
                  } else {
                      setIsOtpSent(true);
                      startResendOTPTimer();
                  }
              } catch (err) {
                  setIsError(true);
                  // setMessage('There was a problem. Please try again later.');
                  alert('There was a problem. Please try again later.');
              };
          })
          .catch(err => {
              console.log(err);
              setIsError(true);
              // setMessage('There was a problem. Please try again later.');
              alert('There was a problem. Please try again later.');
          });
  } else {
      let endpoint = '/verifyOtp';
      let payload = {
          mobileNumber,
          otp
      };
      if (!otp) {
          alert('Kindly enter otp');
          return;
      }
      fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
      })
          .then(async res => {
              try {
                  if (res.status !== 200) {
                      setIsError(true);
                      // setMessage('There was a problem. Please try again later.');
                      alert(res.message);
                  } else {
                      setIsOtpVerified(true);
                      if (screenType === 'SignIn') {
                          //navigation.navigate('Guru Hasti Scheme Details', { mobileNumber, isStoreLogin: false });
                      }
                  }
              } catch (err) {
                  setIsError(true);
                  // setMessage('There was a problem. Please try again later.');
                  alert('There was a problem. Please try again later.');
              };
          })
          .catch(err => {
              console.log(err);
              setIsError(true);
              // setMessage('There was a problem. Please try again later.');
              alert('There was a problem. Please try again later.');
          });
  }
}

const onSubmitHandler = () => {
    let endpoint = '';
    let payload;
    if (screenType === 'forgotPassword') {
        endpoint = '/forgot-pass';
        payload = {
            mobileNumber,
            receiptNo
        };
    } else if (screenType === 'SignUpNew') {
        endpoint = '/signup/new';
        payload = {
            mobileNumber,
            customerName,
            address1,
            address2,
            address3,
            // password
        };
    } else if (screenType === 'SignUpExisting') {
        if (isOtpVerified) {
            endpoint = '/verify';
            payload = {
                mobileNumber,
                receiptNo,
                // password
            };
        } else {
            endpoint = '/signup/existing';
            payload = {
                mobileNumber,
                receiptNo,
                // password
            };
        }

    } else {
        endpoint = '/login';
        payload = {
            mobileNumber,
            password
        };
    }

    if (payload && !Object.values(payload).every(item => item)) {
        if (screenType === 'SignIn') {
            // setMessage('Kindly enter mobile number and password');
            alert('Kindly enter mobile number and password');
        } else {
            // setMessage('Kindly provide all the details');
            alert('Kindly provide all the details');
        }
        return;
    } 
    // else if ((screenType === 'SignUpNew' || screenType === 'SignUpExisting') && password != confirmPassword) {
    //     // setMessage('Password and Confirm Password does not match');
    //     showAlert('Password and Confirm Password does not match');
    //     return;
    // }
    fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then(async res => {
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    setIsError(true);
                    // setMessage(jsonRes.message);
                    alert(jsonRes.message);
                } else {
                    if (screenType === 'StoreLogin') {
                    } else {
                        setIsError(false);
                        // setMessage(jsonRes.message);
                        alert(jsonRes.message);
                    }
                }
            } catch (err) {
                console.log(err);
                setIsError(true);
                // setMessage('There was a problem. Please try again later.');
                alert('There was a problem. Please try again later.');
            };
        })
        .catch(err => {
            console.log(err);
            setIsError(true);
            alert('There was a problem. Please try again later.');
        });
};

const startResendOTPTimer = () => {
    setResendOTPTimer(RESEND_OTP_SECONDS);
    let interval = setInterval(() => {
        setResendOTPTimer(lastTimerCount => {
            lastTimerCount <= 1 && clearInterval(interval)
            return lastTimerCount - 1
        });
    }, 1000)
    return () => clearInterval(interval);
}

const resendOTPHandler = () => {
    fetch(`${API_URL}/resendotp?mobileNumber=${mobileNumber}`, {
      method: 'GET',
    })
      .then(async res => {
        try {
          const jsonRes = await res.json();
          setResendOTPCount(resendOTPCount + 1);
          setResendOTPTimer(RESEND_OTP_SECONDS);
          startResendOTPTimer();
          alert(jsonRes.message);
        } catch (err) {
          console.log(err);
          alert('There was a problem. Please try again later.');
        };
      })
      .catch(err => {
        console.log(err);
        alert('There was a problem. Please try again later.');
      });
};

const screenTypeHandler = (screenType) => {
 
    setMobileNumber('');
    setOtp('');
    setPassword('');
    setConfirmPassword('');
    setReceiptNo('');
    setCustomerName('');
    setAddress1('');
    setAddress2('');
    setAddress3('');
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setResendOTPTimer(RESEND_OTP_SECONDS);
    setResendOTPCount(0);
    setScreenType(screenType);
};

const getMessage = () => {
    const status = isError ? `Error: ` : `Success: `;
    // alert(status + message);
    return message;
}

  return (
    <div className="login">
      <img src="img/logo.png" alt="logo" className="logo" />
      <div className="container">
        <img src="img/login-bg.jpeg" alt="login" />
        <div className="form">
        {screenType === 'SignIn' && !isOtpVerified &&  <h1>Login</h1> }
        {screenType === 'SignUpNew' && !isOtpVerified &&  <h1>Register</h1> }
          <span>Please Enter your phone number</span>
          <div className="formContainer">
          {(screenType === 'SignIn' || screenType === 'StoreLogin') &&  <input
              type="text"
              value={mobileNumber}
              name="phonenumber"
              placeholder="Phone Number"  onChange={e => setMobileNumber(e.target.value)} editable={!isOtpSent}
            />}
             {(screenType === 'SignUpNew' || screenType === 'SignIn') && isOtpSent && !isOtpVerified &&  <input type="password" value={otp} name="otp" placeholder="otp"  onChange={e => setOtp(e.target.value)} />}
             {screenType === 'SignUpNew' && !isOtpVerified && <input type="text" value={customerName} name="Name" placeholder="Name"  onChange={e => setCustomerName(e.target.value)} />}
             {screenType === 'SignUpNew' && !isOtpVerified && <input type="text" value={address1} name="Address Line 1" placeholder="Address Line 1"  onChange={e => setAddress1(e.target.value)} />}
             {screenType === 'SignUpNew' && !isOtpVerified && <input type="text" value={address2} name="Address Line 2" placeholder="Address Line 2"  onChange={e => setAddress2(e.target.value)} />}
             {screenType === 'SignUpNew' && !isOtpVerified && <input type="text" value={address3} name="Address Line 3" placeholder="Address Line 3"  onChange={e => setAddress3(e.target.value)} />}
             {screenType === 'SignUpExisting' && !isOtpVerified && <input type="text" value={receiptNo} name="Last Receipt No" placeholder="Last Receipt No"  onChange={e => setReceiptNo(e.target.value)} />}
            
             {isOtpSent && resendOTPCount < 3 &&
             <a href='' onClick={resendOTPHandler} disabled={resendOTPTimer > 0} >Resend OTP</a>}
             { resendOTPTimer > 0 && <span>  in {resendOTPTimer} seconds</span> }
             
            <Link >
            {screenType === 'SignUpNew' &&
            <div>
            {!isOtpVerified && <button type="button" onClick={isOtpVerified ? onSubmitHandler : otpHandler}>Register</button> }
            {isOtpVerified && <button type="button" onClick={isOtpVerified ? onSubmitHandler : otpHandler}>{isOtpSent ? 'Verify Phone' : 'Get OTP'}</button> }
            </div>
            }{screenType === 'SignIn' &&
            <div>
            {!isOtpVerified && <button type="button" onClick={isOtpVerified ? onSubmitHandler : otpHandler}>{isOtpSent ? 'Login' : 'Get OTP'}</button> }
            </div>
            }
            {screenType === 'StoreLogin' &&
            <div>
            {!isOtpVerified && <button type="button" onClick={isOtpVerified ? onSubmitHandler : otpHandler}>{isOtpSent ? 'Login' : 'Get OTP'}</button> }
            </div>
            }
            {(screenType === 'SignUpExisting') && (!isOtpSent || !isOtpVerified) &&
            <div>
            {screenType === 'SignUpExisting' && <button type="button" onClick={onSubmitHandler}>{'Register'}</button> }
            </div>
            }
            {(screenType === 'SignUpExisting') && (!isOtpSent || !isOtpVerified) &&
            <div>
            {screenType === 'SignUpExisting' && <button type="button" onClick={onSubmitHandler}>{'Register'}</button> }
            </div>
            }
            </Link>
            {screenType === 'SignIn' &&
            <span onClick={() => { screenTypeHandler('SignUpNew') }}>
              Don't have an account? <Link className="signup">Signup</Link>
            </span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
