import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../components/Header';
import { Dropdown } from 'react-native-element-dropdown';
import Footer from '../components/Footer';
import { studentAddmission, coursePlanList, createOrder } from '../api/api';
import axios from 'axios';
import { getToken } from '../util/auth';
import { getUserDetails } from '../util/auth';
import { useNavigation } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay'; // ✅ Added

export default function TrainingForm() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [coursePlans, setCoursePlans] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [acceptTC, setAcceptTC] = useState(false);
  const [userDetails, setUserDetails] = useState(null); // ✅ Added

  const [formData, setFormData] = useState({
    studentName: '',
    graduationName: '',
    contactNo: '',
    address: '',
    planId: null,
    duration: '',
    price: '',
    registrationFee: '',
    startDate: new Date(),
  });

  // Fetch User
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const details = await getUserDetails();
        if (!details) {
          Alert.alert('Login Required', 'Please login to continue.');
          return;
        }
        setUserDetails(details); // ✅ Save user
      } catch (error) {
        console.log('User Fetch Error:', error);
      }
    };
    getUserInfo();
  }, []);

  // Fetch Plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(coursePlanList);
        const plans = Array.isArray(res?.data?.data) ? res.data.data : [];
        const apiRegistrationFee = res?.data?.registrationFee || '0';
        console.log('Course Plans from API:', res);

        setCoursePlans(plans);
        setFormData(prev => ({
          ...prev,
          registrationFee: String(apiRegistrationFee),
          ...(plans.length > 0 && {
            planId: plans[0].id,
            duration: plans[0].lebel,
            price: plans[0].fee,
          }),
        }));
      } catch (err) {
        console.error('Error fetching course plans:', err);
      }
    };
    fetchPlans();
  }, []);

  const handleDurationChange = item => {
    if (!item) return;
    setFormData(prev => ({
      ...prev,
      planId: item.id,
      duration: item.lebel,
      price: item.fee,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, startDate: selectedDate }));
    }
  };

  const createOrderAndPay = async () => {
    try {
      const token = await getToken();
      const amount = totalAmount;

      const response = await axios.post(
        createOrder,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // console.log('Order API Response:', response);

      if (response.data.status === true) {
        const orderId = response.data.id;
        const amount_options = response.data.amount;
        const currency = response.data.currency;

        handleSubmit(orderId, amount_options, currency); // ✅ Pass these to Razorpay
      } else {
        Alert.alert('Error', 'Order creation failed');
      }
    } catch (error) {
      console.log('Create Order Error:', error.response?.data || error.message);
    }
  };

  // ✅ Razorpay then submit to backend
  const handleSubmit = (orderId, amount_options, currency) => {
    if (!formData.studentName || !formData.contactNo || !formData.planId) {
      Alert.alert('Error', 'Please fill in Name, Contact and Select a Plan.');
      return;
    }
    if (!acceptTC) {
      Alert.alert('Terms Required', 'Please accept Terms & Conditions');
      return;
    }

    setLoading(true);
    const options = {
      description: `Training - ${formData.duration}`,
      order_id: orderId,
      currency: currency,
      key: 'rzp_live_SScaoKP8IRuQxe',
      amount: amount_options, // ✅ MUST (VERY IMPORTANT)
      name: 'Student Registration',
      prefill: {
        email: userDetails?.email || '',
        contact: formData.contactNo || userDetails?.phone || '',
        name: formData.studentName || '',
      },
      theme: { color: '#ff6f00' },
    };

    // console.log('Razorpay Options:', options);

    RazorpayCheckout.open(options)
      .then(async paymentData => {
        // console.log('✅ Payment Success:', paymentData);

        // ✅ STRICT VALIDATION
        if (
          !paymentData?.razorpay_payment_id ||
          !paymentData?.razorpay_order_id ||
          !paymentData?.razorpay_signature
        ) {
          Alert.alert('Error', 'Payment verification failed');
          return; // ⛔ STOP
        }

        try {
          const token = await getToken();

          const formattedDate = formData.startDate.toISOString().split('T')[0];

          const payload = {
            player_id: userDetails?.id,
            name: formData.studentName,
            guardian: formData.graduationName,
            phone: formData.contactNo,
            address: formData.address,

            fee: totalAmount,
            course_plan: formData.planId,
            start_date: formattedDate,

            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,
          };

          // console.log('FINAL PAYLOAD:', payload);

          const response = await axios.post(studentAddmission, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200 || response.status === 201) {
            Alert.alert('🎉 Success', 'Registration Successful!', [
              {
                text: 'OK',
                onPress: () => navigation.navigate('StudentListScreen'),
              },
            ]);
          } else {
            Alert.alert('Failed', response.data?.message);
          }
        } catch (error) {
          console.log('API ERROR:', error.response?.data || error.message);
          Alert.alert('Error', 'Payment done but registration failed');
        }
      })

      .catch(error => {
        console.log('❌ Payment Failed / Cancelled:', error);

        if (error.code === 0) {
          Alert.alert('Cancelled', 'Payment was cancelled.');
        } else {
          Alert.alert('Payment Failed', error.description || 'Try again');
        }

        return;
      })

      .finally(() => {
        setLoading(false);
      });
  };

  const totalAmount =
    (Number(formData.price) || 0) + (Number(formData.registrationFee) || 0);

  return (
    <>
      <Header title="Training Registration" />

      <ScrollView style={styles.container}>
        <Text style={styles.header}>Student Registration</Text>

        <Text style={styles.label}>Student Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Full Name"
          value={formData.studentName}
          onChangeText={val =>
            setFormData(prev => ({ ...prev, studentName: val }))
          }
        />

        <Text style={styles.label}>Guardians Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Guardians Name"
          value={formData.graduationName}
          onChangeText={val =>
            setFormData(prev => ({ ...prev, graduationName: val }))
          }
        />

        <Text style={styles.label}>Contact No</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="9999999999"
          maxLength={10}
          value={formData.contactNo}
          onChangeText={val =>
            setFormData(prev => ({ ...prev, contactNo: val }))
          }
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
          multiline
          placeholder="Enter Address"
          value={formData.address}
          onChangeText={val => setFormData(prev => ({ ...prev, address: val }))}
        />

        <Text style={styles.label}>Select Duration</Text>
        <View style={styles.pickerContainer}>
          <Dropdown
            style={styles.dropdown}
            data={coursePlans}
            labelField="lebel"
            valueField="id"
            placeholder="Select Duration"
            value={formData.planId}
            onChange={handleDurationChange}
          />
        </View>

        <View style={styles.feeRow}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Course Fee</Text>
            <TextInput
              style={[styles.input, styles.priceInput]}
              value={`₹${formData.price || '0'}`}
              editable={false}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Reg. Fee</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.registrationFee}
              editable={false}
              onChangeText={val =>
                setFormData(prev => ({ ...prev, registrationFee: val }))
              }
            />
          </View>
        </View>

        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {formData.startDate.toDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.startDate}
            mode="date"
            onChange={handleDateChange}
          />
        )}

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Payable:</Text>
          <Text style={styles.totalAmount}>
            ₹{totalAmount.toLocaleString()}
          </Text>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.tcContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              acceptTC && {
                backgroundColor: '#007AFF',
                borderColor: '#007AFF',
              },
            ]}
            onPress={() => setAcceptTC(!acceptTC)}
          >
            {acceptTC && (
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.tcText}>
            I accept{' '}
            <Text
              style={styles.tcLink}
              onPress={() => navigation.navigate('StudentTC')}
            >
              Terms & Conditions
            </Text>
          </Text>
        </View>

        {/* ✅ Pay Button — opens Razorpay directly */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={createOrderAndPay}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>
              Pay ₹{totalAmount.toLocaleString()} & Register
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0a377a',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    color: '#555',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    color: '#000',
  },
  priceInput: {
    backgroundColor: '#eef2f7',
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dropdown: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  pickerContainer: { marginBottom: 15 },
  dateButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  dateText: { color: '#333', fontSize: 16 },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
  submitBtn: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  tcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tcText: { fontSize: 14, color: '#333' },
  tcLink: { color: '#007AFF', fontWeight: 'bold' },
});
