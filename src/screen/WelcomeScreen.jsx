import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem('token');

    setTimeout(() => {
      if (token) {
        navigation.replace('Dashboard');
      } else {
        navigation.replace('Login');
      }
    }, 2500);
  };

  return (
    <LinearGradient
      colors={['#fcfaf7', '#ff6a00', '#ffffff']}
      style={styles.container}
    >
      <StatusBar backgroundColor="#ff6a00" barStyle="light-content" />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        <Text style={styles.title}>BADMINTON</Text>
        <Text style={styles.subTitle}>99GSPORTS</Text>
      </View>

      {/* Middle Image */}
      <Image
        source={require('../assets/image.png')}
        style={styles.middleImage}
      />

      {/* Bottom Text */}
      <View style={styles.bottomContainer}>
        <Text style={styles.welcome}>WELCOME TO</Text>
        <Text style={styles.brand}>BADMINTON 99GSPORTS</Text>
        <Text style={styles.tagline}>The Ultimate Badminton Experience</Text>
      </View>
    </LinearGradient>
  );
};

export default WelcomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(8),
    paddingHorizontal: responsiveWidth(5),
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },

  logo: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    resizeMode: 'contain',
    marginBottom: responsiveHeight(1),
  },

  middleImage: {
    width: responsiveWidth(90),
    height: responsiveHeight(35),
    resizeMode: 'contain',
  },

  title: {
    fontSize: responsiveFontSize(4),
    fontWeight: 'bold',
    color: '#fff',
  },

  subTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '600',
    color: '#fff',
  },

  bottomContainer: {
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(2),
  },

  welcome: {
    fontSize: responsiveFontSize(2),
    color: '#ff6a00',
    fontWeight: '600',
  },

  brand: {
    fontSize: responsiveFontSize(3.2),
    fontWeight: 'bold',
    color: '#ff6a00',
    marginVertical: responsiveHeight(0.8),
    textAlign: 'center',
  },

  tagline: {
    fontSize: responsiveFontSize(1.6),
    color: '#555',
    textAlign: 'center',
  },
});
