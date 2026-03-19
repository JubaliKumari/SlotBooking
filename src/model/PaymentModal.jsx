import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Colors from '../components/Colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { getPaymentModes } from '../api/api';
import axios from 'axios';

// Added 'onConfirm' to props
const PaymentModal = ({
  visible,
  onClose,
  plan,
  onConfirm,
  paymentOptions,
}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(false); // Local loading for the button

  const data = [
    { label: 'UPI', value: 1 }, // Changed to numeric to match your API requirements
    { label: 'Debit / Credit Card', value: 2 },
    { label: 'Wallet', value: 3 },
    { label: 'Pay at Venue (Cash)', value: 4 },
  ];

  const handlePayNow = async () => {
    if (!value) {
      Alert.alert('Selection Required', 'Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      // This calls handlePurchase(value) in the parent
      await onConfirm(value);
      // We don't necessarily need to reset value here if the modal closes
    } catch (error) {
      // Error is usually handled by the parent's try/catch
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Payment Method</Text>
          <Text style={styles.amount}>₹{plan?.final_price}</Text>

          <Dropdown
            style={[
              styles.dropdown,
              isFocus && { borderColor: Colors.primary || 'blue' },
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={paymentOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select Payment Mode' : '...'}
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue(item.value);
              setIsFocus(false);
            }}
          />

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Text style={[styles.cancel, loading && { opacity: 0.5 }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.payBtn, loading && { opacity: 0.7 }]}
              onPress={handlePayNow}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.payText}>Pay Now</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: responsiveScreenWidth(90),
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  amount: {
    fontSize: responsiveFontSize(3),
    fontWeight: '700',
    color: 'green',
    textAlign: 'center',
    marginBottom: 20,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cancel: {
    color: 'red',
    fontSize: responsiveFontSize(2),
  },
  payBtn: {
    backgroundColor: Colors.primary || '#000',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  payText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
});

export default PaymentModal;
