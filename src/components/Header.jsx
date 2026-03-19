import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
  Share,
  Alert,
  Image,
} from 'react-native';
import Colors from '../components/Colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { logoutEndpoint } from '../api/api';
import { getUserInfo } from '../api/api';
import { getToken } from '../util/auth';

const Header = () => {
  const navigation = useNavigation();

  const [userInfo, setUserInfo] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await getToken();

        const response = await axios.get(getUserInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log('Profile Fetch Response:', response?.data);

        setUserInfo(response?.data?.data);
      } catch (error) {
        console.log('Profile Fetch Error:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkLoginStatus();
    });

    return unsubscribe;
  }, [navigation]);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const handleNav = screen => {
    setSidebarVisible(false);
    navigation.navigate(screen);
  };

  const onShare = async () => {
    try {
      await Share.share({
        message:
          'Check out this awesome app! Download it here: https://play.google.com/store/apps/details?id=com.badmintonslotbooking',
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        try {
          await axios.get(logoutEndpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
        } catch (apiError) {
          console.log('Logout API failed, continuing local logout');
        }
      }

      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');

      delete axios.defaults.headers.common['Authorization'];

      setIsLoggedIn(false);
      setSidebarVisible(false);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.log('Logout error:', error.message);
    }
  };

  return (
    <>
      {/* HEADER */}
      <View style={styles.respovsheader}>
        {/* Left Menu */}
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setSidebarVisible(true)}
        >
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>

        {/* Center Title */}
        <Text style={styles.title}>99GSports</Text>

        {/* Right Logo */}
        <Image source={require('../assets/logo2.png')} style={styles.logo} />
      </View>
      <Modal
        transparent
        visible={sidebarVisible}
        animationType="fade"
        onRequestClose={() => setSidebarVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setSidebarVisible(false)}
        >
          <View style={styles.sidebar}>
            {/* PROFILE SECTION */}
            <View style={styles.profileBox}>
              <View style={styles.avatar}>
                {userInfo?.image ? (
                  <Image
                    source={{
                      uri: `${userInfo.image}`,
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 50,
                      borderWidth: 2,
                      borderColor: Colors.primary,
                    }}
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {userInfo?.first_name?.charAt(0) || 'U'}
                  </Text>
                )}
              </View>
              <Text style={styles.profileName}>
                {isLoggedIn && userInfo
                  ? `${userInfo.first_name} ${userInfo.last_name}`
                  : 'Guest User'}
              </Text>

              <Text style={styles.profileSub}>
                {isLoggedIn
                  ? 'Manage your bookings'
                  : 'Login to access features'}
              </Text>
            </View>

            {/* MENU ITEMS */}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNav('Dashboard')}
            >
              <Text style={styles.menuIcon}>🏠</Text>
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>

            {isLoggedIn && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNav('Profile')}
              >
                <Text style={styles.menuIcon}>👤</Text>
                <Text style={styles.menuText}>Profile</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.menuItem} onPress={onShare}>
              <Text style={styles.menuIcon}>📤</Text>
              <Text style={styles.menuText}>Share App</Text>
            </TouchableOpacity>

            {/* LOGIN */}
            {!isLoggedIn && (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: Colors.primary }]}
                onPress={() => handleNav('Login')}
              >
                <Text style={styles.actionText}>Login</Text>
              </TouchableOpacity>
            )}

            {/* LOGOUT */}
            {isLoggedIn && (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#e53935' }]}
                onPress={logout}
              >
                <Text style={styles.actionText}>Logout</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSidebarVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  respovsheader: {
    height: responsiveHeight(11),
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop:
      Platform.OS === 'ios' ? responsiveHeight(5) : responsiveHeight(3),
    paddingHorizontal: responsiveWidth(4),
    position: 'relative', // important
  },

  menuBtn: {
    padding: responsiveWidth(2),
    zIndex: 1,
  },

  menuIcon: {
    color: Colors.white,
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
  },

  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: Colors.white,
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },

  logo: {
    width: responsiveWidth(22),
    height: responsiveWidth(22),
    resizeMode: 'contain',
    borderRadius: responsiveWidth(5),
  },
  title: {
    color: Colors.white,
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginLeft: responsiveWidth(3),
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    flexDirection: 'row',
  },

  sidebar: {
    width: responsiveWidth(75),
    height: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(6),
    borderTopRightRadius: responsiveWidth(6),
    borderBottomRightRadius: responsiveWidth(6),
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  profileBox: {
    alignItems: 'center',
    marginBottom: responsiveHeight(4),
  },

  avatar: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    borderRadius: responsiveWidth(9),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },

  avatarText: {
    color: '#fff',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
  },

  profileName: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#222',
  },

  profileSub: {
    fontSize: responsiveFontSize(1.5),
    color: '#777',
    marginTop: responsiveHeight(0.3),
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.6),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
  },

  menuText: {
    fontSize: responsiveFontSize(2),
    color: '#333',
    fontWeight: '500',
    marginLeft: responsiveWidth(3),
  },

  actionBtn: {
    marginTop: responsiveHeight(3),
    padding: responsiveHeight(1.5),
    borderRadius: responsiveWidth(2),
    alignItems: 'center',
  },

  actionText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },

  closeBtn: {
    marginTop: responsiveHeight(2),
    backgroundColor: '#444',
    paddingVertical: responsiveHeight(1.4),
    borderRadius: responsiveWidth(2),
    alignItems: 'center',
  },

  closeText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.9),
    fontWeight: '600',
  },
});

export default Header;
