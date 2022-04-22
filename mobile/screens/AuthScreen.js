import React, { useState, useEffect } from 'react';
import { ImageBackground, View, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Image, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

// const API_URL = Platform.OS === 'ios' ? 'http://localhost:5000' : 'http://10.0.2.2:5000';
const API_URL = 'http://65.1.124.220:5000/api';
// const API_URL = 'http://localhost:5000/api';
const RESEND_OTP_SECONDS = 60;

const AuthScreen = () => {

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
    const [resendOTPTimer, setResendOTPTimer] = useState(RESEND_OTP_SECONDS)
    const [resendOTPCount, setResendOTPCount] = useState(0)

    const route = useRoute();
    const navigation = useNavigation();

    useEffect(() => {
        if (route.params && route.params.logout) {
            setMobileNumber('');
            setPassword('');
            // setMessage('');
            route.params.logout = false;
            screenTypeHandler('SignIn');
        }
    });

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
                showAlert('please enter your phone number');
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
                            showAlert('Entered mobile number is not registerd with Guru Hasti, please register now');
                        } else {
                            setIsOtpSent(true);
                            startResendOTPTimer();
                        }
                    } catch (err) {
                        setIsError(true);
                        // setMessage('There was a problem. Please try again later.');
                        showAlert('There was a problem. Please try again later.');
                    };
                })
                .catch(err => {
                    console.log(err);
                    setIsError(true);
                    // setMessage('There was a problem. Please try again later.');
                    showAlert('There was a problem. Please try again later.');
                });
        } else {
            let endpoint = '/verifyOtp';
            let payload = {
                mobileNumber,
                otp
            };
            if (!otp) {
                showAlert('Kindly enter otp');
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
                            showAlert(res.message);
                        } else {
                            setIsOtpVerified(true);
                            if (screenType === 'SignIn') {
                                navigation.navigate('Guru Hasti Chit Details', { mobileNumber, isStoreLogin: false });
                            }
                        }
                    } catch (err) {
                        setIsError(true);
                        // setMessage('There was a problem. Please try again later.');
                        showAlert('There was a problem. Please try again later.');
                    };
                })
                .catch(err => {
                    console.log(err);
                    setIsError(true);
                    // setMessage('There was a problem. Please try again later.');
                    showAlert('There was a problem. Please try again later.');
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
                showAlert('Kindly enter mobile number and password');
            } else {
                // setMessage('Kindly provide all the details');
                showAlert('Kindly provide all the details');
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
                        showAlert(jsonRes.message);
                    } else {
                        if (screenType === 'StoreLogin') {
                            navigation.navigate('Guru Hasti Chit Details', { mobileNumber, isStoreLogin: true });
                        } else {
                            setIsError(false);
                            // setMessage(jsonRes.message);
                            showAlert(jsonRes.message);
                        }
                    }
                } catch (err) {
                    console.log(err);
                    setIsError(true);
                    // setMessage('There was a problem. Please try again later.');
                    showAlert('There was a problem. Please try again later.');
                };
            })
            .catch(err => {
                console.log(err);
                setIsError(true);
                showAlert('There was a problem. Please try again later.');
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
              showAlert(jsonRes.message);
            } catch (err) {
              console.log(err);
              showAlert('There was a problem. Please try again later.');
            };
          })
          .catch(err => {
            console.log(err);
            showAlert('There was a problem. Please try again later.');
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

    const showAlert = (message) => {
        Alert.alert(message);
    }

    return (
        <ImageBackground source={require('../public/images/gradient.png')} style={styles.image}>
            <ScrollView style={styles.card}>
                {(screenType === 'SignIn' || screenType === 'StoreLogin') && <Text style={styles.headline}>Guru Hasti Thanga Maaligai</Text>}
                {(screenType === 'SignIn' || screenType === 'StoreLogin') && <Text style={styles.subheadline}>Welcome to Chit Online Payment System</Text>}
                {screenType === 'SignUpExisting' && <Text style={styles.welcomeText}>Kindly provide registered phone number and last receipt number</Text>}
                {screenType === 'SignUpNew' && <Text style={styles.welcomeText}>Kindly provide all the below details to complete your new registration</Text>}
                {(screenType === 'SignIn' || screenType === 'StoreLogin') && <Image style={styles.logo} source={require('../public/images/Guruhasti-Thangamaligai.png')} />}
                {(screenType === 'SignUpNew' || screenType === 'SignUpExisting') && <Text style={styles.heading}>Sign Up</Text>}
                {/* {screenType === 'forgotPassword' && <Text style={styles.welcomeText}>Forgot Password</Text>} */}
                <View style={styles.form}>
                    <View style={styles.inputs}>
                        {
                            <View style={styles.inputContainer}>
                                <Text style={styles.prefix}>+91</Text>
                                {<TextInput style={styles.input} placeholderTextColor='white' placeholder='Mobile Number' keyboardType="number-pad" maxLength={10} autoCapitalize='none' value={mobileNumber} onChangeText={setMobileNumber} editable={!isOtpSent}></TextInput>}
                            </View>}
                        {screenType === 'StoreLogin' &&
                            <TextInput secureTextEntry={true} style={styles.input} placeholderTextColor='white'
                                placeholder="Password" value={password} onChangeText={setPassword}></TextInput>}

                        {(screenType === 'SignUpNew' || screenType === 'SignIn') && isOtpSent && !isOtpVerified && <TextInput style={styles.input} secureTextEntry={true} placeholderTextColor='white' placeholder="Otp" value={otp} onChangeText={setOtp}></TextInput>}
                        {screenType === 'SignUpNew' && isOtpVerified && <TextInput style={styles.input} placeholderTextColor='white' placeholder="Name" value={customerName} onChangeText={setCustomerName}></TextInput>}
                        {screenType === 'SignUpNew' && isOtpVerified && <TextInput style={styles.input} placeholderTextColor='white' placeholder="Address Line 1" value={address1} onChangeText={setAddress1}></TextInput>}
                        {screenType === 'SignUpNew' && isOtpVerified && <TextInput style={styles.input} placeholderTextColor='white' placeholder="Address Line 2" value={address2} onChangeText={setAddress2}></TextInput>}
                        {screenType === 'SignUpNew' && isOtpVerified && <TextInput style={styles.input} placeholderTextColor='white' placeholder="Address Line 3" value={address3} onChangeText={setAddress3}></TextInput>}
                        {/* {screenType === 'SignUpNew' && isOtpVerified && <TextInput secureTextEntry={true} style={styles.input} placeholderTextColor='white' placeholder="Password" value={password} onChangeText={setPassword}></TextInput>}
                        {screenType === 'SignUpNew' && isOtpVerified && <TextInput secureTextEntry={true} style={styles.input} placeholderTextColor='white' placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword}></TextInput>} */}

                        {(screenType === 'SignUpExisting') && <TextInput style={styles.input} placeholderTextColor='white' placeholder="Last Receipt No" value={receiptNo} onChangeText={setReceiptNo}></TextInput>}
                        {/* {screenType === 'SignUpExisting' && <TextInput secureTextEntry={true} style={styles.input} placeholderTextColor='white' placeholder="Password" value={password} onChangeText={setPassword}></TextInput>} */}
                        {/* {screenType === 'SignUpExisting' && <TextInput secureTextEntry={true} style={styles.input} placeholderTextColor='white' placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword}></TextInput>} */}

                        <Text style={[styles.message, { color: 'white' }]}>{message ? getMessage() : null}</Text>
                        {isOtpSent && resendOTPCount < 3 &&
                            <TouchableOpacity onPress={resendOTPHandler} disabled={resendOTPTimer > 0}>
                                <Text style={{marginBottom: '4%'}}>
                                    <Text style={styles.linkText}>Resend OTP</Text>
                                    { resendOTPTimer > 0 && <Text style={styles.normalText}>  in {resendOTPTimer} seconds</Text> }
                                </Text>
                            </TouchableOpacity>
                        }
                        {screenType === 'SignUpNew' &&
                            <TouchableOpacity style={styles.button} onPress={isOtpVerified ? onSubmitHandler : otpHandler}>
                                {isOtpVerified && <Text style={styles.buttonText}>{'Register'}</Text>}
                                {!isOtpVerified && <Text style={styles.buttonText}>{isOtpSent ? 'Verify Phone' : 'Get OTP'}</Text>}
                            </TouchableOpacity>
                        }
                        {screenType === 'SignIn' &&
                            <TouchableOpacity style={styles.button} onPress={isOtpVerified ? onSubmitHandler : otpHandler}>
                                {/* {isOtpVerified && <Text style={styles.buttonText}>{'Register'}</Text>} */}
                                {!isOtpVerified && <Text style={styles.buttonText}>{isOtpSent ? 'Login' : 'Get OTP'}</Text>}
                            </TouchableOpacity>
                        }
                        {screenType === 'StoreLogin' &&
                            <TouchableOpacity style={styles.button} onPress={onSubmitHandler}>
                                {/* {isOtpVerified && <Text style={styles.buttonText}>{'Register'}</Text>} */}
                                {<Text style={styles.buttonText}>{'Login'}</Text>}
                            </TouchableOpacity>
                        }
                        {(screenType === 'SignUpExisting') && (!isOtpSent || !isOtpVerified) &&
                            <TouchableOpacity style={styles.button} onPress={onSubmitHandler}>
                                {/* {screenType === 'SignIn' && <Text style={styles.buttonText}>{'Login'}</Text>} */}
                                {screenType === 'SignUpExisting' && <Text style={styles.buttonText}>{'Register'}</Text>}
                            </TouchableOpacity>
                        }
                        {/* {(screenType === 'forgotPassword') &&
                            <TouchableOpacity style={styles.button} onPress={onSubmitHandler}>
                                {screenType === 'forgotPassword' && <Text style={styles.buttonText}>{'Send Password'}</Text>}
                            </TouchableOpacity>
                        } */}
                        {screenType === 'SignIn' && <Text style={styles.linkText} onPress={() => { screenTypeHandler('StoreLogin') }}>Store Login</Text>}
                        {screenType === 'SignIn' &&
                            <>
                                {/* <Text style={styles.buttonAlt}>
                                    <Text style={styles.normalText}>If you are an existing customer with GHT, please </Text>
                                    <Text style={styles.linkText} onPress={() => { screenTypeHandler('SignUpExisting') }}>click here</Text>
                                </Text> */}
                                <Text style={styles.buttonAlt}>
                                    <Text style={styles.normalText}>If you are a new customer to GHT and would like to register, please </Text>
                                    <Text style={styles.linkText} onPress={() => { screenTypeHandler('SignUpNew') }}>click here</Text>
                                </Text>
                            </>
                        }
                        {screenType != 'SignIn' &&
                            <>
                                <TouchableOpacity onPress={() => { screenTypeHandler('SignIn') }}>
                                    <Text style={styles.linkText}>Back to Sign In</Text>
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    card: {
        flex: 1,
        backgroundColor: 'transparent',
        width: '80%',
        // marginTop: '25%',
        // borderRadius: 20,
        // maxHeight: 380,
        // paddingBottom: '30%',
    },
    logo: {
        margin: '30%',
        marginTop: '2%',
        marginBottom: 0,
    },
    headline: {
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: '15%',
        marginBottom: 0,
        // width: auto,
        color: 'white',
        // backgroundColor: 'yellow',
    },
    subheadline: {
        fontSize: 15,
        fontWeight: 'bold',
        margin: '7%',
        // marginLeft: '30%',
        marginTop: '3%',
        // marginBottom: '30%',
        color: 'white',
    },
    inputContainer: {
        // borderWidth: 1,
        flexDirection: 'row',
        width: '90%',
        // alignItems: 'center',
        // backgroundColor: 'white',
        // marginHorizontal: 10,
        // borderRadius: 10
    },
    prefix: {
        marginTop: '5%',
        paddingBottom: '5%',
        marginLeft: '6%',
        // fontWeight: 'bold',
        color: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        fontSize: 16,
    },
    welcomeText: {
        fontSize: 15,
        fontWeight: 'bold',
        margin: '7%',
        // marginLeft: '30%',
        marginTop: '20%',
        // marginBottom: '30%',
        color: 'white',
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: '7%',
        marginLeft: '30%',
        // marginTop: '5%',
        // marginBottom: '30%',
        color: 'white',
    },
    form: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: '5%',
    },
    inputs: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '10%',
    },
    input: {
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        fontSize: 16,
        color: 'white',
    },
    button: {
        // width: '30%',
        backgroundColor: 'white',
        // height: '15%',
        paddingVertical: '3%',
        paddingHorizontal: '5%',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        marginBottom: '7%',
    },
    buttonText: {
        color: 'red',
        fontSize: 15,
        fontWeight: '600',
        // fontStyle: 'italic',
    },
    buttonAlt: {
        // width: '80%',
        // borderWidth: 1,
        // height: 40,
        // borderRadius: 50,
        // borderColor: 'white',
        // justifyContent: 'center',
        // alignItems: 'center',
        // marginVertical: 5,
        margin: '2%',
        paddingTop: '7%',
        borderTopWidth: 1,
        borderTopColor: 'white',
    },
    normalText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '200',
    },
    linkText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        // paddingLeft: '1%'
    },
    message: {
        fontSize: 16,
        marginVertical: '1%',
    },

});

export default AuthScreen;
