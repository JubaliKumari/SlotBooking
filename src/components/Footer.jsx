import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.icon}>🏠</Text>
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('More')}
      >
        <Text style={styles.icon}>☰</Text>
        <Text style={styles.text}>More</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    height: 65,
    flexDirection: 'row',
    backgroundColor: 'green',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 22,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
    fontWeight: '600',
  },
});
