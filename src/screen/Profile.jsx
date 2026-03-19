import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { getUserInfo } from '../api/api';
import { getToken } from '../util/auth';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();

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

  return (
    <>
      <Header title="Profile" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* PROFILE CARD */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri:
                    userInfo?.image ||
                    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                }}
                style={styles.avatar}
              />
            </View>

            <Text style={styles.nameHeader}>
              {userInfo?.first_name} {userInfo?.last_name}
            </Text>

            <Text style={styles.emailText}>{userInfo?.email}</Text>
          </View>

          {/* INFO SECTION */}
          <View style={styles.infoWrapper}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>
                {userInfo?.first_name} {userInfo?.last_name}
              </Text>
            </View>

            <View style={styles.separator} />

            {userInfo?.have_membership === true && (
              <>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Membership</Text>
                  <Text style={[styles.infoValue, { color: '#2E7D32' }]}>
                    Active Membership
                  </Text>
                </View>

                <View style={styles.separator} />
              </>
            )}

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date Of Birth</Text>
              <Text style={styles.infoValue}>{userInfo?.dob}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userInfo?.email}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{userInfo?.gender}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{userInfo?.phone}</Text>
            </View>
          </View>

          {/* BUTTON */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate('Register', { user: userInfo })
              }
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },

  /* PROFILE CARD */

  profileCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 18,
    paddingVertical: 25,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },

  avatarWrapper: {
    borderWidth: 3,
    borderColor: '#1A11B1',
    borderRadius: 70,
    padding: 4,
    marginBottom: 10,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  nameHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A2558',
  },

  emailText: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
  },

  /* INFO CARD */

  infoWrapper: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 15,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,

    borderWidth: 1,
    borderColor: '#EEE',
    overflow: 'hidden',
  },

  infoItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  infoLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginTop: 3,
  },

  separator: {
    height: 1,
    backgroundColor: '#EEE',
    marginHorizontal: 15,
  },

  /* BUTTON */

  buttonRow: {
    marginTop: 25,
    alignItems: 'center',
  },

  editButton: {
    backgroundColor: '#1A11B1',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 12,

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;
