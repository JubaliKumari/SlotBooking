import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';

const VerifyOtp = ({ route, navigation }) => {
  // Get phone number from previous screen (Send OTP)
  const { phoneNumber } = route.params || { phoneNumber: '+1 234 567 890' };

  const [otp, setOtp] = useState(['', '', '', '']); // 4-digit OTP
  const [timer, setTimer] = useState(60);
  const inputs = useRef([]);

  // Auto-countdown for Resend button
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text !== '' && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length < 4) {
      alert('Please enter the full code');
      return;
    }
    // API Call Logic: POST /api/verify-otp
    console.log('Verifying code:', otpCode);

    // On success, navigate to Create Profile
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification Code</Text>
      <Text style={styles.subtitle}>We sent a code to {phoneNumber}</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpBox}
            keyboardType="number-pad"
            maxLength={1}
            ref={ref => (inputs.current[index] = ref)}
            onChangeText={text => handleChange(text, index)}
            value={digit}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify & Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity disabled={timer > 0}>
        <Text style={styles.resendText}>
          {timer > 0 ? `Resend code in ${timer}s` : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#082356',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpBox: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#082356',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#082356',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resendText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#082356',
    fontWeight: '500',
  },
});

export default VerifyOtp;
