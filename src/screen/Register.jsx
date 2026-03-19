import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import CustomDatePicker from '../components/CustomDatePicker';
import { createProfile, updateProfile } from '../api/api';
import axios from 'axios';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { notify } from '../components/ToastHelper';
import { getToken } from '../util/auth';
import { launchImageLibrary } from 'react-native-image-picker';

const Register = ({ route }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const userData = route.params?.user;
  const isEdit = !!userData;

  const [profileImage, setProfileImage] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    dob: null,
    gender: null,
    password: null,
  });

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0]); // save full object
      }
    });
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handlesubmit = async () => {
    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'phone',
      'dob',
      'gender',
    ];

    if (!isEdit) requiredFields.push('password');

    const isFormInvalid = requiredFields.some(key => !formData[key]);

    if (isFormInvalid) {
      notify('Please fill all required fields', 'danger');
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();

      payload.append('first_name', formData.first_name.trim());
      payload.append('last_name', formData.last_name.trim());
      payload.append('email', formData.email.trim().toLowerCase());
      payload.append('phone', formData.phone.trim());

      payload.append(
        'dob',
        formData.dob instanceof Date
          ? formData.dob.toISOString().split('T')[0]
          : formData.dob,
      );

      payload.append('gender', formData.gender);

      if (formData.password) {
        payload.append('password', formData.password);
      }

      if (profileImage) {
        payload.append('image', {
          uri: profileImage.uri,
          type: profileImage.type || 'image/jpeg',
          name: profileImage.fileName || 'profile.jpg',
        });
      }

      // console.log('Payload before API call:', payload);

      let response;

      if (isEdit) {
        const token = await getToken();

        response = await axios.post(updateProfile, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post(createProfile, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        const successMsg = isEdit
          ? 'Profile updated successfully!'
          : 'Profile created successfully!';

        notify(successMsg, 'success');

        if (!isEdit) {
          Alert.alert(
            'Registration Successful',
            `Your User ID is: ${response.data.data.user_id}`,
            [
              {
                text: 'Copy ID',
                onPress: () => {
                  Clipboard.setString(response.data.data.user_id.toString());
                  navigation.navigate('Login');
                },
              },
              {
                text: 'OK',
                onPress: () => navigation.navigate('Login'),
              },
            ],
            { cancelable: false },
          );
        } else {
          navigation.navigate('Login');
        }
      }
    } catch (error) {
      console.log('API Error:', error.response?.data || error.message);

      if (error.response?.status === 400) {
        const errors = error.response?.data?.errors;

        let errorMessage = '';

        if (errors?.email) errorMessage += errors.email[0] + '\n';
        if (errors?.phone) errorMessage += errors.phone[0];

        notify(errorMessage || 'Invalid data', 'danger');
      } else {
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Something went wrong',
        );
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dob: userData.dob ? new Date(userData.dob) : null,
        gender: userData.gender || null,
        password: '',
      });
    }
  }, [userData]);

  const GenderOption = ({ label, value, icon }) => (
    <TouchableOpacity
      style={styles.genderRow}
      onPress={() => handleInputChange('gender', value)}
    >
      <View style={styles.genderLabelGroup}>
        <Text style={styles.genderEmoji}>{icon}</Text>
        <Text style={styles.genderText}>{label}</Text>
      </View>

      <View
        style={[
          styles.radioCircle,
          formData.gender === value && styles.radioSelected,
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* ORANGE HEADER */}
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        {/* <Text style={styles.logoText}>Your Logo</Text> */}
      </View>

      {/* FORM CARD */}
      <View style={styles.container}>
        <Text style={styles.title}>Create Profile</Text>

        {/* Profile Upload */}
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage?.uri }}
              style={styles.profileImage}
            />
          ) : (
            <Text style={styles.uploadText}>Upload Photo</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.first_name}
          onChangeText={text => handleInputChange('first_name', text)}
        />

        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.last_name}
          onChangeText={text => handleInputChange('last_name', text)}
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          keyboardType="email-address"
          onChangeText={text => handleInputChange('email', text)}
        />

        <Text style={styles.label}>Phone *</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          keyboardType="phone-pad"
          maxLength={10}
          onChangeText={text => handleInputChange('phone', text)}
        />

        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={formData.password}
          onChangeText={text => handleInputChange('password', text)}
        />

        <Text style={styles.label}>DOB *</Text>
        <CustomDatePicker
          value={formData.dob}
          onDateChange={date => handleInputChange('dob', date)}
        />

        <Text style={styles.label}>Gender *</Text>
        <View style={styles.genderCard}>
          <GenderOption label="Male" value="male" icon="🙋‍♂️" />
          <View style={styles.divider} />
          <GenderOption label="Female" value="female" icon="🙋‍♀️" />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handlesubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isEdit ? 'Update Profile' : 'Save & Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ade7b3',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  logo: {
    width: responsiveScreenWidth(20),
    height: responsiveHeight(10),
    marginBottom: 10,
    resizeMode: 'contain',
    marginTop: 20,
    paddingBottom: 20,
  },

  logoText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  container: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    marginTop: -50,
    elevation: 6,
  },

  title: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: 'bold',
    color: '#082356',
    textAlign: 'center',
  },

  imageUpload: {
    alignSelf: 'center',
    marginVertical: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  uploadText: {
    color: '#666',
  },

  label: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    marginTop: 15,
  },

  input: {
    backgroundColor: '#EBE8EF',
    borderRadius: 12,
    padding: 12,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#D1CDD7',
  },

  genderCard: {
    backgroundColor: '#F3F2F7',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D1CDD7',
    paddingHorizontal: 15,
    marginTop: 5,
  },

  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },

  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
  },

  radioSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },

  divider: {
    height: 1,
    backgroundColor: '#D1CDD7',
  },

  button: {
    backgroundColor: '#18c77a',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
