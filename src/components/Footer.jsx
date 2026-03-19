import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from './Colors';

const Footer = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('Dashboard')}
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
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.icon}>📊</Text>
          <Text style={styles.text}>Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Footer;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.primary,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8, // ✅ control height here
  },

  item: {
    alignItems: 'center',
  },

  icon: {
    fontSize: 22,
  },

  text: {
    color: Colors.white,
    fontSize: 13, // slightly reduced
    marginTop: 2,
    fontWeight: '600',
  },
});
