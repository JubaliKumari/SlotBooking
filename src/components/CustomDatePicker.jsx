import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDatePicker = ({ label, value, onDateChange, required = false }) => {
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios'); // Keep open on iOS, close on Android
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  // Helper to format date display
  const formatDate = date => {
    if (!date) return 'Select date';
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <View style={styles.fieldContainer}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={styles.inputWithIcon}
        onPress={() => setShow(true)}
        activeOpacity={0.7}
      >
        <Text style={value ? styles.dateText : styles.placeholderText}>
          {value ? formatDate(value) : 'Select date'}
        </Text>
        <MaterialCommunityIcons
          name="calendar-month-outline"
          size={24}
          color="#4CAF50"
        />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  fieldContainer: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: '600', color: '#444', marginBottom: 8 },
  required: { color: 'red' },
  inputWithIcon: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#888',
  },
  placeholderText: { color: '#999', fontSize: 16 },
  dateText: { color: '#000', fontSize: 16 },
});
