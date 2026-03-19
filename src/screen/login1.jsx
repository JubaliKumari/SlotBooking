import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Alert,
  Image,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { login as loginApi } from '../api/api';
import axios from 'axios';
import { setAuthToken } from '../util/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notify } from '../components/ToastHelper';

const Login = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      if (loginMethod === 'phone') {
        if (phoneNumber.length < 10) {
          notify('Please enter a valid phone number', 'warning');
          return;
        }
        console.log('Send OTP to:', phoneNumber);
        navigation.navigate('VerifyOtp', { phone: phoneNumber });
        return;
      }

      if (!username || !password) {
        notify('Please enter username and password', 'danger');
        return;
      }

      // Email/Username login
      const response = await axios.post(loginApi, {
        user_id: username,
        password: password,
      });

      if (response.data?.token) {
        setAuthToken(response.data.token, response.data.user);
      }

      navigation.replace('Dashboard');
    } catch (error) {
      console.log('Login Error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        notify('Invalid username or password', 'danger');
      } else if (error.response?.data?.message) {
        notify(error.response.data.message, 'danger');
      } else {
        notify('Something went wrong. Please try again.', 'danger');
      }
    }
  };

  const handleGuest = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      Alert.alert('Success', 'You are now in guest mode.');
      navigation.navigate('Dashboard');
    } catch (error) {
      console.log('Guest Error:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/back57.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ImageBackground
        source={require('../assets/back59.jpeg')} // Change this to your specific card background image
        style={styles.card}
        imageStyle={styles.cardBackgroundImage}
      >
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Login</Text>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, loginMethod === 'phone' && styles.activeTab]}
            onPress={() => setLoginMethod('phone')}
          >
            <Text
              style={[
                styles.tabText,
                loginMethod === 'phone' && styles.activeTabText,
              ]}
            >
              Phone
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              loginMethod === 'credentials' && styles.activeTab,
            ]}
            onPress={() => setLoginMethod('credentials')}
          >
            <Text
              style={[
                styles.tabText,
                loginMethod === 'credentials' && styles.activeTabText,
              ]}
            >
              Username
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conditional Input Rendering */}
        <View style={styles.inputContainer}>
          {loginMethod === 'phone' ? (
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              maxLength={10}
              onChangeText={text => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
              placeholderTextColor="#666"
            />
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#666"
                autoCapitalize="none"
              />
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { paddingRight: 70 }]}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#666"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.showHideToggle}
                >
                  <Text style={styles.orangeLinkText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Login Button - Works for both methods */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>
              {loginMethod === 'phone' ? 'Send OTP' : 'Login'}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.signUpButton}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.guestButton} onPress={handleGuest}>
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </ImageBackground>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: responsiveScreenWidth(92),
    paddingVertical: responsiveHeight(3),
    paddingHorizontal: responsiveScreenWidth(6),
    borderRadius: 25,
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    borderWidth: 1,
    borderColor: '#ff6200',
    overflow: 'hidden', // Ensures the image respects the borderRadius
  },
  cardBackgroundImage: {
    borderRadius: 25,
    opacity: 0.95, // Adjust transparency of the card background
    backgroundColor: '#ffffff', // Fallback color
  },
  logo: {
    width: responsiveScreenWidth(50),
    height: responsiveHeight(10),
    marginBottom: responsiveHeight(2),
  },
  title: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    backgroundColor: '#f2f4f7',
    borderRadius: 50,
    padding: 5,
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: responsiveHeight(1),
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#ff6200',
    borderRadius: 50,
  },
  tabText: {
    fontSize: responsiveFontSize(1.8),
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: responsiveHeight(6.5),
    borderRadius: 15,
    paddingHorizontal: 18,
    marginBottom: 18,
    backgroundColor: '#f5f7fa',
    fontSize: responsiveFontSize(2),
    color: '#000',
  },
  passwordWrapper: {
    width: '100%',
    position: 'relative',
  },
  showHideToggle: {
    position: 'absolute',
    right: 20,
    top: responsiveHeight(1.8),
  },
  orangeLinkText: {
    color: '#ff6200',
    fontWeight: '600',
  },
  button: {
    width: '100%',
    height: responsiveHeight(6),
    backgroundColor: '#ff6200',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: responsiveHeight(2),
    marginTop: responsiveHeight(1),
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
  signUpButton: {
    width: '100%',
    marginBottom: responsiveHeight(2),
    backgroundColor: '#ff6200',
    paddingVertical: responsiveHeight(1.5),
    alignItems: 'center',
    borderRadius: 10,
  },
  signUpText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
  },
  guestButton: {
    width: '100%',
    height: responsiveHeight(6.5),
    borderWidth: 1,
    borderColor: '#ff6200',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  guestButtonText: {
    color: '#ff6200',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
});
