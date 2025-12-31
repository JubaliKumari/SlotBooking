import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from 'react-native'
import { responsiveFontSize,responsiveHeight,responsiveScreenWidth } from 'react-native-responsive-dimensions'

const Login = ({ navigation }) => { // <-- receive navigation here
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleSendOtp = () => { // <-- remove ({ navigation }) here
    console.log('Send OTP to:', phoneNumber);

    // Navigate to Dashboard after sending OTP
    navigation.navigate('Dashboard');
  }

  const handleGuest = () => {
    console.log('Continue as guest');
  }

  return (
    <ImageBackground
      source={require('../assets/badminton1.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholderTextColor="#666"
        />

        <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.guestButton} onPress={handleGuest}>
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}


export default Login

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: responsiveScreenWidth(90), // 90% width
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: responsiveHeight(2.5),
    borderRadius: responsiveHeight(1.5),
    alignItems: 'center',
    elevation: 6,

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    marginTop: responsiveHeight(30), // instead of 400
  },

  title: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(3),
  },

  input: {
    width: '100%',
    height: responsiveHeight(6.5),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: responsiveHeight(1),
    paddingHorizontal: responsiveHeight(2),
    marginBottom: responsiveHeight(2.5),
    backgroundColor: '#fff',
    fontSize: responsiveFontSize(2),
  },

  button: {
    width: '100%',
    height: responsiveHeight(6.5),
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveHeight(1),
    marginBottom: responsiveHeight(2),
  },

  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },

  guestButton: {
    width: '100%',
    height: responsiveHeight(6.5),
    borderWidth: 1,
    borderColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveHeight(1),
  },

  guestButtonText: {
    color: '#007bff',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
})

