import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, FlatList } from 'react-native';
import { ListItem, Button, ThemeProvider, Icon } from 'react-native-elements';
import { useRoute, useNavigation } from '@react-navigation/native';

const API_URL = 'http://65.1.124.220:5000/api';

const MyChitsScreen = () => {

  const [myChits, setMyChits] = useState([]);

  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    if (myChits.length === 0) {
      getMySchemes();
    }
  });

  const [expanded, setExpanded] = useState('');

  const getMySchemes = () => {
    fetch(`${API_URL}/schemes?mobileNumber=${route.params.mobileNumber}`, {
        method: 'GET',
    })
    .then(async res => { 
        try {
            const jsonRes = await res.json();
            if (res.status === 200 && jsonRes.chits && jsonRes.chits.length > 0) {
              setMyChits(jsonRes.chits);
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
    navigation.navigate('Add Scheme');
  };

  const payDueHandler = (item) => {
    const payload = {
      mobileNumber: item.MobileNo,
      trno: item.trno,
      yrtrno: item.yrtrno,
      chitno: item.yrtrno,
      instno: Number(item.InstPaid) + 1,
    };
    fetch(`${API_URL}/payment`, {
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
              //
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
      <View style={styles.chits}>
        <TouchableOpacity style={styles.addScheme} onPress={addSchemeHandler}>
          <Text style={styles.addSchemeText}>Add Scheme</Text>
        </TouchableOpacity>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={myChits}
          renderItem= {({ item, index }) => (
              <ListItem.Accordion key={index}
                style={{ backgroundColor: 'transparent'}}
                theme={{ colors: {primary: '#fff'} }}
                // icon={<><Icon name='chevron-down' type='font-awesome' size={20} color={'white'} /></>}
                content={
                  <>
                    <Icon name='money' type='font-awesome' size={20} color={'white'} />
                    <ListItem.Content>
                      <ListItem.Title style={{color: 'white', fontWeight: 'bold'}}>  Chit Number - {item.yrtrno}</ListItem.Title>
                      {/* <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle> */}
                    </ListItem.Content>
                  </>
                }
                isExpanded={expanded === item.yrtrno}
                onPress={() => {
                  setExpanded(expanded === item.yrtrno ? '' : item.yrtrno);
                }}
              >
                <View style={styles.chitDetails}>
                  <ListItem theme={{ colors: {primary: '#fff'} }}>
                    <ListItem.Content>
                      <ListItem.Title style={{color: 'white', fontWeight: 'bold'}}>Due Amount:  {item.InstAmt ? item.InstAmt : '-'}</ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                  {item.InstAmt &&  Math.floor((new Date().getTime() - new Date(item.trdate).getTime()) / (1000 * 60 * 60 * 24)) > 30 && 
                    <ListItem theme={{ colors: {primary: '#fff'} }}>
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
    width: '100%',
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
    width: '35%',
    backgroundColor: 'white',
    padding: '1%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '5%'
  },
  addSchemeText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default MyChitsScreen;