import React, { useEffect, useState } from 'react';
import { ImageBackground, View, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
// import {StyleSheet, View, ScrollView} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const API_URL = 'http://65.1.124.220:5000/api';

const AddSchemeScreen = () => {

  const instData = [
    { label: 'Plan - 500', value: '500' },
    { label: 'Plan - 1000', value: '1000' },
    { label: 'Plan - 2000', value: '2000' },
    { label: 'Plan - 3000', value: '3000' },
    { label: 'Plan - 4000', value: '4000' },
    { label: 'Plan - 5000', value: '5000' },
    { label: 'Plan - 10000', value: '10000' },
  ];

  const [chitType, setChitType] = useState('1');
  const [mobileNumber, setMobileNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [isEditable, setIsEditable] = useState(true);
  const [instamt, setInstamt] = useState({});
  const [message, setMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);
  const [isDefaultsSet, setIsDefaultsSet] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    let chit = route.params.myChits[0];

    // if (!chit) {
    //   chit = getCustomerDetails(route.params.mobileNumber);
    // } 
    // console.log(route.params.myChits)
    if(chit && !isDefaultsSet) {
      setMobileNumber(chit.chits.MobileNo);
      setCustomerName(chit.chits.CustName);
      setAddress1(chit.chits.Add1);
      setAddress2(chit.chits.Add2);
      setAddress3(chit.chits.Add3);
      setIsEditable(false);
      setIsDefaultsSet(true);
    }
  })

  const getCustomerDetails = () => {
    fetch(`${API_URL}/customer?mobileNumber=${route.params.mobileNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
  }).then((res) => {
    return res;
  })
  }

  const addScheme = () => {
    if (!customerName || !address1 || !address2 || !address3 || !instamt.value) {
      // if(!message) {
        // setMessage('Kindly provide all the details');
        showAlert('Kindly provide all the details');
      // }
      return;
    } 
    // else {
    //   const inpt = isNaN(instamt) ? 0 : Number(instamt);
    //   if (inpt < 500 || inpt > 10000 || inpt % 500 != 0) {
    //     showAlert('Please enter 500, 1000, 2000, 3000, 4000, 5000 or 10000');
    //     return;
    //   }
    // }
    const payload = {
      chitType,
      mobileNumber,
      customerName,
      address1,
      address2,
      address3,
      instamt: instamt.value
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
              navigation.navigate('Guru Hasti Chit Details', { mobileNumber, reload: true })
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
                <Text style={styles.radioButtonText}>Savings Type: </Text>
                <RadioButton
                  color='white'
                  uncheckedColor='white'
                  value="2"
                />
                <Text style={styles.radioButtonText}>Cash</Text>
                <RadioButton
                  color='white'
                  uncheckedColor='white'
                  value="1"
                />
                <Text style={styles.radioButtonText}>Metal</Text>
              </View>
            </RadioButton.Group>
            <TextInput style={styles.input} editable={isEditable} placeholderTextColor='white' placeholder='Mobile Number' autoCapitalize='none' value={mobileNumber} onChangeText={setMobileNumber}></TextInput>
            <TextInput style={styles.input} editable={!isEditable} placeholderTextColor='white' placeholder="Customer Name" value={customerName} onChangeText={setCustomerName}></TextInput>
            <TextInput style={styles.input} editable={!isEditable} placeholderTextColor='white' placeholder="Address Line 1" value={address1} onChangeText={setAddress1}></TextInput>
            <TextInput style={styles.input} editable={!isEditable} placeholderTextColor='white' placeholder="Address Line 2" value={address2} onChangeText={setAddress2}></TextInput>
            <TextInput style={styles.input} editable={!isEditable} placeholderTextColor='white' placeholder="Address Line 3" value={address3} onChangeText={setAddress3}></TextInput>
            {/* <TextInput style={styles.input} editable={!isEditable} placeholderTextColor='white' placeholder="Installment Amount" value={instamt} onChangeText={setInstamt}></TextInput> */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={{color: 'white'}}
              selectedTextStyle={{color: 'black'}}
              selectedTextProps={{style: {color: 'white', fontSize: 16}}}
              iconStyle={{tintColor: 'white'}}
              data={instData}
              labelField="label"
              valueField="value"
              placeholder="Installment Amount"
              value={instamt.value}
              onChange={setInstamt}
            />
            <TouchableOpacity style={styles.button} onPress={addScheme}>
              <Text style={styles.buttonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.notes}>
          Bonus Details{"\n"}
CASH{"\n"}
Free Gift + 1 Month Bonus at the end of scheme{"\n"}
GOLD{"\n"}
Free Gift + No MC, No VA (Wastage) on accumulated weight at the end of scheme{"\n"}
Terms & Conditions{"\n"}
Only ONE instalment per month{"\n"}
Scheme maturity ONE month after end of scheme{"\n"}
No Cash/Coins will be given for Bonus scheme{"\n"}
ONE instalment will be deducted if discontinued{"\n"}
No CASH for GOLD scheme{"\n"}
GST Applicable{"\n"}
          </Text>
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
notes: {
  // width: '80%',
  // borderBottomWidth: 1,
  // borderBottomColor: 'white',
  fontSize: 10,
  color: 'black',
  fontStyle: 'italic',
  marginTop: 10,

},
input: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
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
    marginTop: 20,
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
  },
  dropdown: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    fontSize: 16,
    color: 'white',
    padding: 5,
    textDecorationColor: 'white',
  }
});

export default AddSchemeScreen;