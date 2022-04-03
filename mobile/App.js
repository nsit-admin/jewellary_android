import React from 'react';
import { StyleSheet, View, ImageBackground, Image, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Icon } from 'react-native-elements';

import { AuthScreen } from './screens';
import { MyChitsScreen } from './screens';
import { AddSchemeScreen } from './screens';

export default function App() {

  const Stack = createNativeStackNavigator();
  const options = { 
    headerTitle: () => <Image style={styles.logo} source={require('./public/images/Guruhasti-Thangamaligai.png')} />,
    headerLeft: () => <Text />, headerRight: () => <Icon name='sign-out' type='font-awesome' color='white' onPress={logoutHandler} />,
    headerTitleAlign: 'center',
    headerTintColor: 'white',
    headerBackVisible: true,
    headerTransparent: true
  };

  const optionsWithoutBackButton = {
    ...options,
    headerBackVisible: false
  }

  const navigationRef = React.createRef();

  const logoutHandler = () => {
    navigationRef.current?.navigate('Sign In', {logout: true});
  };

  return (
    <SafeAreaProvider>
      {/* <ImageBackground source={require('./public/images/gradient.png')} style={styles.image}> */}
        <View style={styles.container}>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>
              <Stack.Screen name="Sign In" component={AuthScreen} options={{ headerShown:false }} />
              <Stack.Screen name="Your Existing Chits" component={MyChitsScreen} options={optionsWithoutBackButton} />
              <Stack.Screen name="Add Scheme" component={AddSchemeScreen} options={options} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      {/* </ImageBackground> */}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },  
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    elevation: 9999
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain'
  }
});
