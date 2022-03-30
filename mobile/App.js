import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { AuthScreen } from './screens';
import { MyChitsScreen } from './screens';

export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaProvider>
      {/* <ImageBackground source={require('./public/images/gradient.png')} style={styles.image}> */}
        <View style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Sign In" component={AuthScreen} options={{ headerShown:false }} />
              <Stack.Screen name="Your Existing Chits" component={MyChitsScreen} 
                options={{ headerTitleAlign: 'center', headerTintColor: 'white', headerBackVisible: true, headerTransparent: true}} />
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
});
