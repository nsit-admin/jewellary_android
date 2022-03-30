import React, { useState } from 'react';
import { ImageBackground, View, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// const API_URL = Platform.OS === 'ios' ? 'http://localhost:5000' : 'http://10.0.2.2:5000';
const API_URL = 'http://65.1.124.220:5000/api';

const AuthScreen = () => {

    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [receiptNo, setReceiptNo] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [address3, setAddress3] = useState('');
    const [instamt, setInstamt] = useState('');

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [screenType, setScreenType] = useState('SignIn');

    const navigation = useNavigation();

    const onSubmitHandler = () => {
        let endpoint = '';
        let payload;
        if (screenType === 'SignUpNew') {
            endpoint = '/signup/new';
            payload = {
                mobileNumber,
                customerName,
                address1,
                address2,
                address3,
                instamt,
                password
            };
        } else if (screenType === 'SignUpExisting') {
            endpoint = '/signup/existing';
            payload = {
                mobileNumber,
                receiptNo,
                password
            };
        } else {
            endpoint = '/login';
            payload = {
                mobileNumber,
                password
            };
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
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    setIsError(true);
                    setMessage(jsonRes.message);
                } else {
                    if (screenType === 'SignIn') {
                        navigation.navigate('My Chits', {mobileNumber});
                    } else {
                        setIsError(false);
                        setMessage(jsonRes.message);
                    }
                }
            } catch (err) {
                console.log(err);
                setIsError(true);
                setMessage('There was a problem. Please try again later.');
            };
        })
        .catch(err => {
            console.log(err);
            setIsError(true);
            setMessage('There was a problem. Please try again later.');
        });
    };

    const screenTypeHandler = (screenType) => {
        setMessage('');
        setMobileNumber('');
        setPassword('');
        setConfirmPassword('');
        setReceiptNo('');
        setCustomerName('');
        setAddress1('');
        setAddress2('');
        setAddress3('');
        setInstamt('');
        setScreenType(screenType);
    };

    const getMessage = () => {
        const status = isError ? `Error: ` : `Success: `;
        return status + message;
    }

    return (
        <ImageBackground source={require('../public/images/gradient.png')} style={styles.image}>
            <ScrollView style={styles.card}>
                {screenType === 'SignIn' && <Image style={styles.logo} source={require('../public/images/logo.png')} />}
                {screenType != 'SignIn' && <Text style={styles.heading}>Sign Up</Text>}
                <View style={styles.form}>
                    <View style={styles.inputs}>
                        <TextInput style={styles.input} placeholderTextColor='white' placeholder='Mobile No' autoCapitalize='none' value={mobileNumber} onChangeText={setMobileNumber}></TextInput>
                        {screenType === 'SignUpExisting' && <TextInput style={styles.input} placeholderTextColor='white' placeholder="Receipt No" value={receiptNo} onChangeText={setReceiptNo}></TextInput>}
                        {screenType === 'SignUpNew' && <TextInput style={styles.input} placeholderTextColor='white' placeholder="Name" value={customerName} onChangeText={setCustomerName}></TextInput>}
                        {screenType === 'SignUpNew' && <TextInput style={styles.input} placeholderTextColor='white' placeholder="Address Line 1" value={address1} onChangeText={setAddress1}></TextInput>}
                        {screenType === 'SignUpNew' && <TextInput style={styles.input} placeholderTextColor='white' placeholder="Address Line 2" value={address2} onChangeText={setAddress2}></TextInput>}
                        {screenType === 'SignUpNew' && <TextInput style={styles.input} placeholderTextColor='white' placeholder="Address Line 3" value={address3} onChangeText={setAddress3}></TextInput>}
                        {screenType === 'SignUpNew' && <TextInput style={styles.input} placeholderTextColor='white' placeholder="Installment Amount" value={instamt} onChangeText={setInstamt}></TextInput>}
                        <TextInput secureTextEntry={true} style={styles.input} placeholderTextColor='white' placeholder="Password" value={password} onChangeText={setPassword}></TextInput>
                        {screenType != 'SignIn' && <TextInput secureTextEntry={true} style={styles.input} placeholderTextColor='white' placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword}></TextInput>}
                        <Text style={[styles.message, {color: 'white'}]}>{message ? getMessage() : null}</Text>
                        <TouchableOpacity style={styles.button} onPress={onSubmitHandler}>
                            <Text style={styles.buttonText}>{screenType === 'SignIn' ? 'Sign In' : 'Sign Up'}</Text>
                        </TouchableOpacity>
                        {screenType === 'SignIn' &&
                        <>
                            <TouchableOpacity style={styles.buttonAlt} onPress={() => {screenTypeHandler('SignUpExisting')}}>
                                <Text style={styles.buttonAltText}>Sign up if existing customer</Text>
                            </TouchableOpacity>
                            <Text style={styles.buttonAltText}>or</Text>
                            <TouchableOpacity style={styles.buttonAlt} onPress={() => {screenTypeHandler('SignUpNew')}}>
                                <Text style={styles.buttonAltText}>Sign up if new customer</Text>
                            </TouchableOpacity>
                        </>
                        }
                        {screenType != 'SignIn' &&
                        <>
                            <TouchableOpacity style={styles.buttonAlt} onPress={() => {screenTypeHandler('SignIn')}}>
                                <Text style={styles.buttonAltText}>Back to Sign In</Text>
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
        marginTop: '30%',
        marginLeft: '30%',
        marginBottom: '1%'
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: '15%',
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
        borderBottomWidth: 2,
        borderBottomColor: 'white',
        // paddingTop: '2%',
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
        // minHeight: 40,
        color: 'white',
    },
    button: {
        width: '30%',
        backgroundColor: 'white',
        // height: '15%',
        padding: '2%',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
    },
    buttonText: {
        color: 'red',
        fontSize: 18,
        fontWeight: '600',
        fontStyle: 'italic',
    },
    buttonAlt: {
        width: '80%',
        // borderWidth: 1,
        height: 40,
        // borderRadius: 50,
        // borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        // marginVertical: 5,
    },
    buttonAltText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        fontStyle: 'italic',
    },
    message: {
        fontSize: 16,
        marginVertical: '5%',
    },
});

export default AuthScreen;