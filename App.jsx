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
import Dashboard from './src/screen/Dashboard';
import Login from './src/screen/Login';
import BadmintonBookNow from './src/SlotBookings/Badminton/pages/BadmintonBookNow';
import Register from './src/screen/Register';
import VerifyOtp from './src/screen/VerifyOtp';
import SlotBooking from './src/SlotBookings/Badminton/pages/SlotBooking';
import Membership from './src/screen/Membership';
import TrainingForm from './src/SlotBookings/TrainingForm';
import Profile from './src/screen/Profile';
import { RootSiblingParent } from 'react-native-root-siblings';
import BadmintonTC from './src/components/BadmintonTC';
import StudentListScreen from './src/SlotBookings/StudentListScreen';
import MembershipList from './src/SlotBookings/MembershipList';
import OffersScreen from './src/SlotBookings/OffersScreen';
import AuthCheck from './src/screen/AuthCheck';
import BookingHistory from './src/SlotBookings/BookingHistory';
import WelcomeScreen from './src/screen/WelcomeScreen';
import SlotTc from './src/components/SlotTc';
import MemberShipTc from './src/components/MemberShipTc';
import StudentTC from './src/components/StudentTC';
import TermsScreen from './src/screen/TermsScreen';
const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <RootSiblingParent>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="WelcomeScreen"
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
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="VerifyOtp"
              component={VerifyOtp}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="SlotBooking"
              component={SlotBooking}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="Membership"
              component={Membership}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="TrainingForm"
              component={TrainingForm}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="StudentListScreen"
              component={StudentListScreen}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="BadmintonTC"
              component={BadmintonTC}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="MembershipList"
              component={MembershipList}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="OffersScreen"
              component={OffersScreen}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="BookingHistory"
              component={BookingHistory}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen name="AuthCheck" component={AuthCheck} />
            <Stack.Screen
              name="WelcomeScreen"
              component={WelcomeScreen}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="SlotTc"
              component={SlotTc}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="MemberShipTc"
              component={MemberShipTc}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="StudentTC"
              component={StudentTC}
              options={{ unmountOnBlur: true }}
            />
            <Stack.Screen
              name="TermsScreen"
              component={TermsScreen}
              options={{ unmountOnBlur: true }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </RootSiblingParent>
    </SafeAreaProvider>
  );
}

export default App;
