import React, { useState } from 'react';
import { ImageBackground, View, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';

const API_URL = 'http://65.1.124.220:5000/api';

const AddSchemeScreen = () => {

  const [chitType, setChitType] = useState('amount');
  const [mobileNumber, setMobileNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [instamt, setInstamt] = useState('');
  const [message, setMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);

  const route = useRoute();
  const navigation = useNavigation();

  const addScheme = () => {
    if (!mobileNumber || !customerName || !address1 || !address2 || !address3 || !instamt) {
      // if(!message) {
        // setMessage('Kindly provide all the details');
        showAlert('Kindly provide all the details');
      // }
      return;
    } else {
      const inpt = isNaN(instamt) ? 0 : Number(instamt);
      if (inpt < 500 || inpt > 10000 || inpt % 500 != 0) {
        showAlert('Please enter an amount between 500 and 10000 in denominations of 500');
        return;
      }
    }
    const payload = {
      chitType,
      mobileNumber,
      customerName,
      address1,
      address2,
      address3,
      instamt,
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
              navigation.navigate('Your Existing Chits', { mobileNumber, reload: true })
            } else {
              // setMessage(jsonRes.message);
              showAlert(jsonRes.message);
            }
        } catch (err) {
            console.log(err);
        };
    })
    .catch(err => {
        console.log(err);
    });
  };

  const showAlert = (message) => {
    Alert.alert(message);
  }

  return (
    <ImageBackground source={require('../public/images/gradient.png')} style={styles.image}>
      <ScrollView style={styles.card}>
        <Text style={styles.welcomeText}>Kindly provide all the below details to add scheme</Text>
        <View style={styles.form}>
          <View style={styles.inputs}>
            <RadioButton.Group onValueChange={setChitType} value={chitType}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.radioButtonText}>Chit Type: </Text>
                <RadioButton
                  color='white'
                  uncheckedColor='white'
                  value="amount"
                />
                <Text style={styles.radioButtonText}>Amount</Text>
                <RadioButton
                  color='white'
                  uncheckedColor='white'
                  value="weight"
                />
                <Text style={styles.radioButtonText}>Weight</Text>
              </View>
            </RadioButton.Group>
            <TextInput style={styles.input} placeholderTextColor='white' placeholder='Mobile No' autoCapitalize='none' value={mobileNumber} onChangeText={setMobileNumber}></TextInput>
            <TextInput style={styles.input} placeholderTextColor='white' placeholder="Name" value={customerName} onChangeText={setCustomerName}></TextInput>
            <TextInput style={styles.input} placeholderTextColor='white' placeholder="Address Line 1" value={address1} onChangeText={setAddress1}></TextInput>
            <TextInput style={styles.input} placeholderTextColor='white' placeholder="Address Line 2" value={address2} onChangeText={setAddress2}></TextInput>
            <TextInput style={styles.input} placeholderTextColor='white' placeholder="Address Line 3" value={address3} onChangeText={setAddress3}></TextInput>
            <TextInput style={styles.input} placeholderTextColor='white' placeholder="Installment Amount" value={instamt} onChangeText={setInstamt}></TextInput>
            <Text style={[styles.message, { color: 'white' }]}>{message}</Text>
            <TouchableOpacity style={styles.button} onPress={addScheme}>
              <Text style={styles.buttonText}>Add Scheme</Text>
            </TouchableOpacity>
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
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: '25%',
    color: 'white',
    marginHorizontal: '5%',
    marginTop: '30%',
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
      fontWeight: 'bold',
      fontSize: 16,
      color: 'white',
  },
  button: {
    width: '40%',
    backgroundColor: 'white',
    padding: '2%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
      color: 'red',
      fontSize: 16,
      fontWeight: '600',
  },
  addScheme: {
    width: '35%',
    backgroundColor: 'white',
    // padding: '1%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '5%'
  },
  addSchemeText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    fontSize: 16,
    marginVertical: '10%',
    marginHorizontal: '5%',
    color: 'white',
  },
  radioButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    marginTop: 6,
  }
});

export default AddSchemeScreen;