import { Reddit } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useRoute, redirect } from "react-router-dom";
import AlertDialogSlide from '../../components/ModalPop';
import ExistingScheme from '../ExistingScheme/ExistingScheme';
import "./Login.css";

const API_URL = 'http://65.1.124.220:5000/api';
// const API_URL = 'http://localhost:5000/api';
const RESEND_OTP_SECONDS = 60;

const Login = () => {

    const [mobileNumber, setMobileNumber] = useState('');
    const [modalStatus, setModalStatus] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalDesc, setModalDesc] = useState('');

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
                // setModalDesc('please enter your phone number');
                setModalStatus(true);
                setModalTitle('GHT');
                setModalDesc('please enter your phone number');
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
                            // setModalDesc('Entered mobile number is not registerd with Guru Hasti, please register now');
                            setModalStatus(true);
                            setModalTitle('GHT');
                            setModalDesc('Entered mobile number is not registerd with Guru Hasti, please register now');
                        } else {
                            setIsOtpSent(true);
                            startResendOTPTimer();
                        }
                    } catch (err) {
                        setIsError(true);
                        // setMessage('There was a problem. Please try again later.');
                        setModalStatus(true);
                        setModalTitle('GHT');
                        setModalDesc('There was a problem. Please try again later.');
                    };
                })
                .catch(err => {
                    console.log(err);
                    setIsError(true);
                    // setMessage('There was a problem. Please try again later.');
                    setModalStatus(true);
                    setModalTitle('GHT');
                    setModalDesc('There was a problem. Please try again later.');
                });
        } else {
            let endpoint = '/verifyOtp';
            let payload = {
                mobileNumber,
                otp
            };
            if (!otp) {
                setModalStatus(true);
                setModalTitle('GHT');
                setModalDesc('Kindly enter otp');
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
                            setModalStatus(true);
                            setModalTitle('GHT');
                            setModalDesc('Entered OTP is not valid/expired. Please enter the right one');
                        } else {
                            setIsOtpVerified(true);
                            if (screenType === 'SignIn') {
                                navigate("/existing-scheme", { state: { mobileNumber: mobileNumber, isStoreLogin: false } });
                            }
                        }
                    } catch (err) {
                        setIsError(true);
                        // setMessage('There was a problem. Please try again later.');
                        setModalStatus(true);
                        setModalTitle('GHT');
                        setModalDesc('There was a problem. Please try again later.');
                    };
                })
                .catch(err => {
                    console.log(err);
                    setIsError(true);
                    // setMessage('There was a problem. Please try again later.');
                    setModalStatus(true);
                    setModalTitle('GHT');
                    setModalDesc('There was a problem. Please try again later.');
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
                setModalStatus(true);
                setModalTitle('GHT');
                setModalDesc('Kindly enter mobile number and password');
            } else {
                // setMessage('Kindly provide all the details');
                setModalStatus(true);
                setModalTitle('GHT');
                setModalDesc('Kindly provide all the details');
            }
            return;
        }
        // else if ((screenType === 'SignUpNew' || screenType === 'SignUpExisting') && password != confirmPassword) {
        //     // setMessage('Password and Confirm Password does not match');
        //     showsetModalDesc('Password and Confirm Password does not match');
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
                        setModalStatus(true);
                        setModalTitle('GHT');
                        setModalDesc(jsonRes.message);
                    } else {
                        if (screenType === 'StoreLogin') {
                            navigate("/existing-scheme", { state: { mobileNumber: mobileNumber, isStoreLogin: true } });
                        } else {
                            setIsError(false);
                            // setMessage(jsonRes.message);
                            setModalStatus(true);
                            setModalTitle('GHT');
                            setModalDesc(jsonRes.message);
                        }
                    }
                } catch (err) {
                    console.log(err);
                    setIsError(true);
                    setModalStatus(true);
                    setModalTitle('GHT');
                    setModalDesc('There was a problem. Please try again later.');
                };
            })
            .catch(err => {
                console.log(err);
                setIsError(true);
                setModalStatus(true);
                setModalTitle('GHT');
                setModalDesc('There was a problem. Please try again later.');
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
        fetch(`${API_URL}/resendOtp?mobileNumber=${mobileNumber}`, {
            method: 'GET',
        })
            .then(async res => {
                try {
                    const jsonRes = await res.json();
                    setResendOTPCount(resendOTPCount + 1);
                    setResendOTPTimer(RESEND_OTP_SECONDS);
                    startResendOTPTimer();
                    setModalStatus(true);
                    setModalTitle('GHT');
                    setModalDesc(jsonRes.message);
                } catch (err) {
                    setModalStatus(true);
                    setModalTitle('GHT');
                    setModalDesc('There was a problem. Please try again later.');
                };
            })
            .catch(err => {
                setModalStatus(true);
                setModalTitle('GHT');
                setModalDesc('There was a problem. Please try again later.');
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
            <AlertDialogSlide modalStatus={modalStatus}
                modalTitle={modalTitle}
                modalDesc={modalDesc}
                close={() => setModalStatus(false)}
            ></AlertDialogSlide>
            <img src="img/logo.png" alt="logo" className="logo" />
            <div className="container">
                <img src="img/login-bg.jpeg" alt="login" />
                <div className="form">
                    {(screenType === 'SignIn' || screenType === 'StoreLogin') && <h3>Guru Hasti Thanga Maaligai</h3>}
                    {(screenType === 'SignIn' || screenType === 'StoreLogin') && <h4>Welcome to Gold Scheme Online Payment System</h4>}
                    {/* {screenType === 'SignIn' && !isOtpVerified && <h5>Login</h5>} */}
                    {screenType === 'SignUpExisting' && <h6>Kindly provide registered phone number and last receipt number</h6>}
                    {screenType === 'SignUpNew' && <h6>Kindly provide all the below details to complete your new registration</h6>}
                    {screenType === 'SignUpNew' && !isOtpVerified && <h1>Sign Up</h1>}
                    <div className="formContainer">
                        {<input
                            type="text"
                            value={mobileNumber}
                            name="phonenumber"
                            disabled={isOtpSent}
                            placeholder="Phone Number" onChange={e => setMobileNumber(e.target.value)}
                        />}
                        {(screenType === 'StoreLogin') && <input type="password" value={password} name="password" placeholder="Enter store password" onChange={e => setPassword(e.target.value)} />}
                        {(screenType === 'SignUpNew' || screenType === 'SignIn') && isOtpSent && !isOtpVerified && <input type="password" value={otp} name="otp" placeholder="otp" onChange={e => setOtp(e.target.value)} />}
                        {screenType === 'SignUpNew' && isOtpVerified && <input type="text" value={customerName} name="Name" placeholder="Name" onChange={e => setCustomerName(e.target.value)} />}
                        {screenType === 'SignUpNew' && isOtpVerified && <input type="text" value={address1} name="Address Line 1" placeholder="Address Line 1" onChange={e => setAddress1(e.target.value)} />}
                        {screenType === 'SignUpNew' && isOtpVerified && <input type="text" value={address2} name="Address Line 2" placeholder="Address Line 2" onChange={e => setAddress2(e.target.value)} />}
                        {screenType === 'SignUpNew' && isOtpVerified && <input type="text" value={address3} name="Address Line 3" placeholder="Address Line 3" onChange={e => setAddress3(e.target.value)} />}
                        {screenType === 'SignUpExisting' && !isOtpVerified && <input type="text" value={receiptNo} name="Last Receipt No" placeholder="Last Receipt No" onChange={e => setReceiptNo(e.target.value)} />}

                        {isOtpSent && !isOtpVerified && resendOTPCount < 3 &&
                            <div>
                                <a href='' onClick={resendOTPHandler} disabled={resendOTPTimer > 0} >Resend OTP</a>
                                {resendOTPTimer > 0 && <span>  in {resendOTPTimer} seconds</span>}
                            </div>}

                        <Link >
                            {screenType === 'SignUpNew' &&
                                <div>
                                    {isOtpVerified && <button type="button" onClick={isOtpVerified ? onSubmitHandler : otpHandler}>Register</button>}
                                    {!isOtpVerified && <button type="button" onClick={isOtpVerified ? onSubmitHandler : otpHandler}>{isOtpSent ? 'Verify Phone' : 'Get OTP'}</button>}
                                </div>
                            }{screenType === 'SignIn' &&
                                <div>
                                    {!isOtpVerified && <button type="button" onClick={isOtpVerified ? onSubmitHandler : otpHandler}>{isOtpSent ? 'Login' : 'Get OTP'}</button>}
                                </div>
                            }
                            {screenType === 'StoreLogin' &&
                                <div>
                                    {!isOtpVerified && <button type="button" onClick={onSubmitHandler}>{'Login'}</button>}
                                </div>
                            }
                            {(screenType === 'SignUpExisting') && (!isOtpSent || !isOtpVerified) &&
                                <div>
                                    {screenType === 'SignUpExisting' && <button type="button" onClick={onSubmitHandler}>{'Register'}</button>}
                                </div>
                            }
                            {(screenType === 'SignUpExisting') && (!isOtpSent || !isOtpVerified) &&
                                <div>
                                    {screenType === 'SignUpExisting' && <button type="button" onClick={onSubmitHandler}>{'Register'}</button>}
                                </div>
                            }
                        </Link>
                        {screenType === 'SignIn' &&
                            <span onClick={() => { screenTypeHandler('StoreLogin') }}>
                                Store User? <Link className="signup"> - Login here</Link>
                            </span>}
                        {screenType === 'SignIn' &&
                            <>
                                {/* <Text style={styles.buttonAlt}>
                                    <Text style={styles.normalText}>If you are an existing customer with GHT, please </Text>
                                    <Text style={styles.linkText} onPress={() => { screenTypeHandler('SignUpExisting') }}>click here</Text>
                                </Text> */}
                                <span onClick={() => { screenTypeHandler('SignUpNew') }}>
                                    If you are a new customer to GHT and would like to register, please <Link className="signup"> click here </Link>
                                </span>

                            </>
                        }
                        {screenType != 'SignIn' &&
                            <>

                                <span onClick={() => { screenTypeHandler('SignIn') }}>
                                    <Link className="signup"> Back to Sign In </Link>
                                </span>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
