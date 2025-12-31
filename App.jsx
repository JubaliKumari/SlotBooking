/**
 * Waste Management App
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard  from './src/screen/Dashboard';
import Login from './src/screen/Login';
import BadmintonBookNow from './src/SlotBookings/Badminton/pages/BadmintonBookNow';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ unmountOnBlur: true }}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ unmountOnBlur: true }}
          />

              <Stack.Screen
            name="BadmintonBookNow"
            component={BadmintonBookNow}
            options={{ unmountOnBlur: true }}
          />

          

        
          
        
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
