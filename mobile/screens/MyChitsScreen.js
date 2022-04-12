import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, FlatList } from 'react-native';
import { ListItem, Button, ThemeProvider, Icon } from 'react-native-elements';
import { useRoute, useNavigation } from '@react-navigation/native';

const API_URL = 'http://65.1.124.220:5000/api';

const MyChitsScreen = () => {

  const [myChits, setMyChits] = useState([]);
  const [storeLogin, setStoreLogin] = useState(false);
  const [viewChits, setViewChits] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');

  const route = useRoute();
  const navigation = useNavigation();



  useEffect(() => {
    if (myChits.length === 0 || route.params.reload || !storeLogin) {
      // getMySchemes();
      route.params.reload = false;
    }
    setStoreLogin(route.params.isStoreLogin);
  });

  const getDueDate = (val) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = val ? new Date(val) : new Date();
    // console.log("dude => ", months[d.getMonth()] + " " + d.getFullYear())
    var month = d.getMonth();
    if (month === 11) {
      return months[d.getMonth()] + " " + d.getFullYear() + 1;
    } else {
      return months[d.getMonth() + 1] + " " + d.getFullYear();
    };
  }

  const getDate = (date) => {
    console.log('date', date)
    const d = date ? new Date(date) : new Date();
    console.log("get dat =>", d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear())
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  }

  const [expanded, setExpanded] = useState('');

  const getMySchemes = () => {
    fetch(`${API_URL}/schemes?mobileNumber=${route.params.mobileNumber}`, {
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

  const getCustomerSchemes = () => {
    console.log(customerPhone);
    // setMakeApiCall(true);
    fetch(`${API_URL}/schemes?mobileNumber=${customerPhone}`, {
      method: 'GET',
    })
      .then(async res => {
        setViewChits(true);
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

  const addSchemeHandler = () => {
    navigation.navigate('Add Scheme', { myChits });
  };

  const payDueHandler = (item) => {
    // const payload = {
    //   mobileNumber: item.MobileNo,
    //   trno: item.trno,
    //   yrtrno: item.yrtrno,
    //   chitno: item.yrtrno,
    //   instno: Number(item.InstPaid) + 1,
    // };
    fetch(`${API_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
      .then(async res => {
        try {
          const jsonRes = await res.json();
          if (res.status === 200) {

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
    <ImageBackground source={require('../public/images/gradient.png')} style={styles.image}>
      {storeLogin && !viewChits &&
        <View style={styles.form}>

          <View style={styles.inputs}>
            {/* <View style={{ flexDirection: 'row' }}> */}
            <Text style={styles.heading}>Get the customer details</Text>
            <TextInput style={styles.input} placeholderTextColor='white' maxLength={10}
              placeholder="Customer Phone Number" value={customerPhone} onChangeText={setCustomerPhone}></TextInput>
            <TouchableOpacity style={styles.addScheme} onPress={() => { getCustomerSchemes() }}>
              <Text style={styles.buttonText}>Fetch Customer Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      {(!storeLogin || viewChits) &&
        <View style={styles.chits}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.heading}>Your Existing Chits</Text>
            <TouchableOpacity style={styles.addScheme} onPress={addSchemeHandler}>
              <Text style={styles.addSchemeText}>Add Scheme</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={myChits}
            renderItem={({ item, index }) => (
              <ListItem.Accordion key={index}
                style={{ backgroundColor: 'transparent' }}
                theme={{ colors: { primary: '#fff' } }}
                // icon={<><Icon name='chevron-down' type='font-awesome' size={20} color={'white'} /></>}
                content={
                  <>
                    <Icon name='money' type='font-awesome' size={20} color={'white'} />
                    <ListItem.Content>
                      <ListItem.Title style={{ color: 'white', fontWeight: 'bold' }}>  Chit Number - {item.chits.yrtrno}</ListItem.Title>
                      {/* <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle> */}
                    </ListItem.Content>
                  </>
                }
                isExpanded={expanded === item.chits.yrtrno}
                onPress={() => {
                  setExpanded(expanded === item.chits.yrtrno ? '' : item.chits.yrtrno);
                }}
              >
                <View style={styles.chitDetails}>
                  <ListItem theme={{ colors: { primary: '#fff' } }}>
                    <ListItem.Content>
                      <ListItem.Title style={{ color: 'white' }}>Name: {item.chits.CustName}</ListItem.Title>
                      <ListItem.Title style={{ color: 'white' }}>Last Inst Paid: {item.receipts.length ? item.receipts[0].InstNo : '-'}/11</ListItem.Title>
                      <ListItem.Title style={{ color: 'white' }}>Last Inst Date: {getDate(item.receipts.length ? item.receipts[0].TrDate : new Date())} Rs:{item.receipts[0].InstAmt} /-</ListItem.Title>
                      <ListItem.Subtitle style={{ color: 'white', fontWeight: 'bold' }}>Current Due: {getDueDate(item.chits.TrDate ? item.chits.TrDate : new Date())} - {item.chits.InstAmt ? item.chits.InstAmt : '-'}</ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                  {Math.floor((new Date().getTime() - new Date(item.trdate).getTime()) / (1000 * 60 * 60 * 24)) > 30 &&
                    <ListItem theme={{ colors: { primary: '#fff' } }}>
                      <ListItem.Content>
                        <TouchableOpacity style={styles.button} onPress={() => { payDueHandler(item) }}>
                          <Text style={styles.buttonText}>Pay</Text>
                        </TouchableOpacity>
                      </ListItem.Content>
                    </ListItem>
                  }
                </View>
              </ListItem.Accordion>
            )}
          />
        </View>
      }
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  chits: {
    flex: 1,
    width: '80%',
    marginTop: '20%',
  },
  chitDetails: {
    width: '100%',
    marginLeft: '10%',
  },
  button: {
    width: '15%',
    backgroundColor: 'white',
    padding: '1%',
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
    // width: '35%',
    backgroundColor: 'white',
    paddingVertical: '2%',
    paddingHorizontal: '5%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '5%',
    marginLeft: '20%',
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
    // width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    fontSize: 16,
    color: 'white',
  },
  addSchemeText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    marginVertical: '6%',
  }
});

export default MyChitsScreen;
