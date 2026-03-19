import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { sendOtp, login } from '../api/api';
import axios from 'axios';
import { setAuthToken } from '../util/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notify } from '../components/ToastHelper';
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';

// ── Change this to your actual backend Google login endpoint ──────────────────
const GOOGLE_LOGIN_API = 'https://your-api.com/api/auth/google';

const Login = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ── Configure Google Sign-In once on mount ──────────────────────────────────
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '463638625782-q5qnqcb1cufqds3qeo2am20d9irg0a8g.apps.googleusercontent.com', // ✅ type 3
      offlineAccess: true,
    });
  }, []);

  // ── Email Validation ────────────────────────────────────────────────────────
  const validateEmail = mail => /\S+@\S+\.\S+/.test(mail);

  // ── Regular Login ───────────────────────────────────────────────────────────
  const handleLogin = async () => {
    try {
      if (loginMethod === 'email') {
        if (!email) {
          notify('Please enter email address', 'danger');
          return;
        }
        if (!validateEmail(email)) {
          notify('Please enter valid email', 'danger');
          return;
        }

        setLoading(true);
        try {
          await axios.post(sendOtp, { email });
          notify('Verification mail sent', 'success');
          // navigation.navigate('VerifyEmail', { email });
        } catch (error) {
          const message =
            error.response?.data?.errors?.email?.[0] ||
            error.response?.data?.message ||
            'Failed to send email';
          notify(message, 'danger');
        }
        return;
      }

      if (!username || !password) {
        notify('Please enter username and password', 'danger');
        return;
      }

      setLoading(true);
      const response = await axios.post(login, {
        user_id: username || email,
        password: password,
      });

      if (response.data?.token) {
        await setAuthToken(response.data.token, response.data.user);
        navigation.replace('Dashboard');
      } else {
        notify('Login failed. Token not received.', 'danger');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        notify('Invalid username or password', 'danger');
      } else if (error.response?.data?.message) {
        notify(error.response.data.message, 'danger');
      } else {
        notify('Something went wrong. Please try again.', 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Google Sign-In ──────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // 1. Check Play Services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // 2. Sign out first to force account picker every time
      // await GoogleSignin.signOut();

      // 3. Trigger Google Sign-In
      const response = await GoogleSignin.signIn();
      console.log(
        'Working?',
        response?.type === 'success' ? '✅ YES' : '❌ NO',
      );
      console.log('Google Raw Response1:', JSON.stringify(response, null, 2));

      // 4. Check if cancelled
      if (!isSuccessResponse(response)) {
        notify('Google Sign-In was cancelled', 'danger');
        return;
      }

      // 5. Extract user data
      const idToken = response?.data?.idToken;
      const user = response?.data?.user;

      console.log('Google User:', JSON.stringify(user, null, 2));
      console.log('Google ID Token:', idToken);

      if (!idToken) {
        notify('Failed to get Google token. Please try again.', 'danger');
        return;
      }

      // 6. Send to your backend
      const backendResponse = await axios.post(GOOGLE_LOGIN_API, {
        id_token: idToken,
        email: user?.email,
        name: user?.name,
        photo: user?.photo,
      });

      console.log(
        'Backend Response:',
        JSON.stringify(backendResponse.data, null, 2),
      );

      // 7. Save token and navigate
      if (backendResponse.data?.token) {
        await setAuthToken(
          backendResponse.data.token,
          backendResponse.data.user,
        );
        notify('Logged in with Google!', 'success');
        navigation.replace('Dashboard');
      } else {
        notify('Google login failed. No token received.', 'danger');
      }
    } catch (error) {
      console.log('Google Sign-In Error:', JSON.stringify(error, null, 2));

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            notify('Google Sign-In cancelled', 'danger');
            break;
          case statusCodes.IN_PROGRESS:
            notify('Sign-In already in progress', 'danger');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            notify('Google Play Services not available', 'danger');
            break;
          default:
            notify(error.message || 'Google Sign-In failed', 'danger');
        }
      } else if (error.response?.data?.message) {
        notify(error.response.data.message, 'danger');
      } else {
        notify('Google Sign-In failed. Please try again.', 'danger');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Guest Mode ──────────────────────────────────────────────────────────────
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

  // ── UI ──────────────────────────────────────────────────────────────────────
  return (
    <ImageBackground
      source={require('../assets/back89.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.card}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Login</Text>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, loginMethod === 'email' && styles.activeTab]}
            onPress={() => setLoginMethod('email')}
          >
            <Text
              style={[
                styles.tabText,
                loginMethod === 'email' && styles.activeTabText,
              ]}
            >
              Email
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

        {/* Inputs */}
        {loginMethod === 'email' ? (
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#666"
            autoCapitalize="none"
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
            <View style={{ width: '100%', position: 'relative' }}>
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
                style={styles.showHideBtn}
              >
                <Text style={{ color: '#ff6200', fontWeight: '600' }}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Login Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {loginMethod === 'email' ? 'Send Verification Email' : 'Login'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Sign Up */}
        {loginMethod === 'credentials' && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.signUpBtn}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        )}

        {/* Google Sign-In Button */}
        {/* <TouchableOpacity
          style={[
            styles.guestButton,
            { marginBottom: responsiveHeight(1.5) },
            googleLoading && { opacity: 0.7 },
          ]}
          onPress={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator color="#0099ff" />
          ) : (
            <Text style={styles.guestButtonText2}>Continue with Google</Text>
          )}
        </TouchableOpacity> */}

        {/* Guest Button */}
        <TouchableOpacity style={styles.guestButton} onPress={handleGuest}>
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#ffffff',
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
  },
  title: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    backgroundColor: '#f2f4f7',
    borderRadius: 50,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: responsiveHeight(1),
    alignItems: 'center',
    borderRadius: 50,
  },
  activeTab: { backgroundColor: '#ff6200' },
  tabText: {
    fontSize: responsiveFontSize(1.8),
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: responsiveHeight(6.5),
    borderRadius: 15,
    paddingHorizontal: 18,
    marginBottom: 18,
    backgroundColor: '#f5f7fa',
    fontSize: responsiveFontSize(2),
  },
  button: {
    width: '100%',
    height: responsiveHeight(6),
    backgroundColor: '#ff6200',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: responsiveHeight(2),
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
  signUpBtn: {
    width: '100%',
    backgroundColor: '#ff6200',
    paddingVertical: responsiveHeight(1.5),
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: responsiveHeight(2),
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
    borderRadius: 12,
  },
  guestButtonText: {
    color: '#ff6200',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
  guestButtonText2: {
    color: '#0099ff',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
  logo: {
    width: responsiveScreenWidth(50),
    height: responsiveHeight(10),
    marginBottom: responsiveHeight(2),
  },
  showHideBtn: {
    position: 'absolute',
    right: 20,
    top: responsiveHeight(2.2),
  },
});
