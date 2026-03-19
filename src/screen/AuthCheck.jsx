import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { isAuthenticated } from '../util/auth';

const AuthCheck = ({ navigation }) => {
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const loggedIn = await isAuthenticated();

    if (loggedIn) {
      navigation.replace('Dashboard');
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default AuthCheck;
