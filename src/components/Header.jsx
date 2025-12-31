import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';

const Header = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setSidebarVisible(true)}
        >
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Badminton Booker</Text>
      </View>

      {/* SIDEBAR MODAL */}
      <Modal
        transparent
        visible={sidebarVisible}
        animationType="slide"
        onRequestClose={() => setSidebarVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setSidebarVisible(false)}
        >
          <View style={styles.sidebar}>
            <Text style={styles.menuTitle}>Menu</Text>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Share App</Text>
            </TouchableOpacity>

            
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSidebarVisible(false)}
            >
              <Text style={{ color: '#fff' }}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSidebarVisible(false)}
            >
              <Text style={{ color: '#fff' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 25,
    paddingHorizontal: 15,
  },
  menuBtn: {
    padding: 10,
  },
  menuIcon: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
  },
  sidebar: {
    width: 260,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
menuItem: {
  paddingVertical: 15,
  borderBottomWidth: 1,
  borderBottomColor: 'green',
},

  menuText: {
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 30,
    backgroundColor: 'green',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default Header;
 