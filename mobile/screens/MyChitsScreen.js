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
    getMySchemes();
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

  return (
    <ImageBackground source={require('../public/images/gradient.png')} style={styles.image}>
      <View style={styles.chits}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={myChits}
          renderItem= {({ item, index }) => (
              <ListItem.Accordion key={index}
                style={{ backgroundColor: 'transparent'}}
                theme={{ colors: {primary: '#fff'} }}
                content={
                  <>
                    <Icon name='check' type='font-awesome' size={20} color={'white'} />
                    <ListItem.Content>
                      <ListItem.Title style={{color: 'white', fontWeight: 'bold'}}>{item.yrtrno}</ListItem.Title>
                      {/* <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle> */}
                    </ListItem.Content>
                  </>
                }
                isExpanded={expanded === item.yrtrno}
                onPress={() => {
                  setExpanded(expanded === item.yrtrno ? '' : item.yrtrno);
                }}
              >
                {/* <View style={styles.chitDetails}>
                  {item.chitDetails.map((c, i) => (
                    <ListItem key={i} theme={{ colors: {primary: '#fff'} }}>
                      <ListItem.Content>
                        <ListItem.Title style={{color: 'white', fontWeight: 'bold'}}>{c.title}</ListItem.Title>
                        <ListItem.Subtitle style={{color: 'white', fontWeight: 'bold'}}>{c.value}</ListItem.Subtitle>
                      </ListItem.Content>
                    </ListItem>
                  ))}
                </View> */}
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
});

export default MyChitsScreen;