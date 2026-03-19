import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '../components/Header';
import Colors from '../components/Colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { getMembershipPlans, purchaseMembership } from '../api/api';
import axios from 'axios';
import PaymentModal from '../model/PaymentModal';
import { getPaymentModes } from '../api/api';
import { getToken } from '../util/auth';
import { getUserDetails } from '../util/auth';
import { notify } from '../components/ToastHelper';
import { useNavigation } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';

const Membership = () => {
  const navigation = useNavigation();
  const [acceptTC, setAcceptTC] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [user, setUser] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // Stores the full object
  const [planList, setPlanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const details = await getUserDetails();
        console.log('User Details:', details);
        setUser(details);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);
  // 1. Fetch Plans on Mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(getMembershipPlans);
        const fetchedData = response?.data?.data;
        console.log('Fetched Plans:', response?.data);

        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setPlanList(fetchedData);
          // Set the first plan as default selected
          setSelectedPlan(fetchedData[0]);
        }
      } catch (error) {
        console.error('Error fetching membership plans:', error);
        Alert.alert('Error', 'Could not load membership plans.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchPaymentModes = async () => {
      console.log('Requesting URL:', getPaymentModes);
      try {
        const response = await axios.get(getPaymentModes);
        console.log('Payment Modes Response:', response.data);

        if (response.data && response.data.status === 200) {
          const arrayFromServer = response.data.data;

          const formattedModes = arrayFromServer.map(mode => ({
            label: mode.title,
            value: mode.id,
          }));

          // ✅ MOVE THESE INSIDE THE IF BLOCK
          setPaymentOptions(formattedModes);
          console.log('✅ Formatted for Dropdown:', formattedModes);
        }
      } catch (error) {
        console.error('Error fetching payment modes:', error);
      }
    };

    fetchPaymentModes();
  }, []);
  // const handlePurchase = async paymentMode => {
  //   if (!selectedPlan) {
  //     return Alert.alert('Error', 'Please select a plan.');
  //   }
  //   const token = await getToken();
  //   setIsPurchasing(true); // Show loading state

  //   const payload = {
  //     player_id: 1, // Consider getting this from your Auth context/storage
  //     membership_plan_id: selectedPlan.id,
  //     start_date: new Date().toISOString().split('T')[0],
  //     paid_amount: selectedPlan.final_price,
  //     payment_mode: paymentMode, // Use the value from the modal
  //     transication_id: '0', // Ensure string/number matches your backend requirements
  //     is_offer_applied: selectedPlan.has_offer === 1 ? 1 : 0,
  //     offer_id: selectedPlan.has_offer === 1 ? selectedPlan.offer_id : null,
  //   };
  //   console.log('Purchase Payload:', payload);

  //   try {
  //     const response = await axios.post(purchaseMembership, payload, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     console.log('Purchase Response:', response);
  //     // Check response.data.status, not response.status
  //     if (response.data && response.data.status === 'success') {
  //       Alert.alert('Success', 'Plan activated!');
  //       setShowModal(false);
  //     } else {
  //       Alert.alert('Failed', response.data?.message || 'Something went wrong');
  //     }
  //   } catch (error) {
  //     console.error('API Error:', error.response?.data || error.message);
  //     Alert.alert('Error', 'Transaction failed. Please try again.');
  //   } finally {
  //     setIsPurchasing(false);
  //   }
  // };
  const handlePurchase = async paymentMode => {
    if (!selectedPlan) {
      return Alert.alert('Error', 'Please select a plan.');
    }

    const token = await getToken();

    // ✅ CHECK TOKEN FIRST
    if (!token) {
      Alert.alert('Login Required', 'Please login first.');
      return;
    }

    setIsPurchasing(true); // Show loading state

    const payload = {
      player_id: user?.id, // Better: get from user context or token
      membership_plan_id: selectedPlan.id,
      start_date: new Date().toISOString().split('T')[0],
      paid_amount: selectedPlan.final_price,
      payment_mode: paymentMode,
      transication_id: '0',
      is_offer_applied: selectedPlan.has_offer === 1 ? 1 : 0,
      offer_id: selectedPlan.has_offer === 1 ? selectedPlan.offer_id : null,
    };

    // console.log('Purchase Payload:', payload);

    try {
      const response = await axios.post(purchaseMembership, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Purchase Response:', response);

      if (response.data?.status === 'success') {
        setShowModal(false);

        Alert.alert('Success', 'Plan activated!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MembershipList'),
          },
        ]);
      } else {
        Alert.alert('Failed', response.data?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);

      // ✅ Optional: If backend returns 401
      if (error.response?.status === 401) {
        Alert.alert('Login Required', 'Session expired. Please login again.');
      } else {
        Alert.alert('Error', 'Transaction failed. Please try again.');
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Membership" />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 10 }}>Loading Plans...</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.mainTitle}>Choose Your Plan</Text>
            <Text style={styles.subTitle}>
              Enjoy unlimited court access and priority booking
            </Text>

            <View style={styles.planGrid}>
              {planList.map((item, index) => {
                // Check selection by Object ID
                const isSelected = selectedPlan?.id === item.id;

                return (
                  <TouchableOpacity
                    key={item.id || index}
                    style={[styles.planCard, isSelected && styles.selectedCard]}
                    onPress={() => setSelectedPlan(item)}
                  >
                    {isSelected}
                    <Text style={styles.planTitle}>{item.title}</Text>
                    {/* <Text style={styles.planPrice}>₹{item.final_price}</Text> */}
                    <Text style={styles.planPrice}>
                      ₹{parseInt(item.final_price)}
                    </Text>

                    <Text style={styles.planDuration}>
                      {item.duration_label}
                    </Text>

                    {item.has_offer === 1 && (
                      <View
                        style={[
                          styles.savingTag,
                          isSelected && { backgroundColor: Colors.accent },
                        ]}
                      >
                        <Text
                          style={[
                            styles.savingText,
                            isSelected && { color: '#fff' },
                          ]}
                        >
                          {item.discount_type === 'percent'
                            ? `Save ${parseInt(item.discount)}%`
                            : `Save ₹${parseInt(item.discount)}`}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.benefitsSection}>
              <Text style={styles.sectionHeader}>Membership Benefits</Text>
              <BenefitItem
                icon="calendar-check"
                text="Book up to 7 days in advance"
              />
              <BenefitItem icon="percent" text="10% discount on canteen" />
              <BenefitItem
                icon="account-group"
                text="Free entry to local tournaments"
              />
            </View>

            <View style={styles.tcContainer}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  acceptTC && {
                    backgroundColor: Colors.primary,
                    borderColor: Colors.primary,
                  },
                ]}
                onPress={() => setAcceptTC(!acceptTC)}
              >
                {acceptTC && (
                  <Text style={{ fontSize: 15 }}>{acceptTC ? '☑' : '☐'}</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.tcText}>
                I accept{' '}
                <Text
                  style={styles.tcLink}
                  onPress={() => navigation.navigate('MemberShipTc')}
                >
                  Terms & Conditions
                </Text>
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.payBtn,
                (isPurchasing || !acceptTC) && { opacity: 0.5 },
              ]}
              onPress={() => {
                if (!acceptTC) {
                  notify('Please accept Terms & Conditions');
                  return;
                }

                setShowModal(true);
              }}
              disabled={isPurchasing}
            >
              {isPurchasing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payText}>
                  Purchase {selectedPlan?.title?.toUpperCase() || 'PLAN'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      <PaymentModal
        visible={showModal}
        plan={selectedPlan}
        paymentOptions={paymentOptions}
        onClose={() => setShowModal(false)}
        onConfirm={handlePurchase} // Added prop to trigger API from Modal
      />
    </View>
  );
};

const BenefitItem = ({ icon, text }) => (
  <View style={styles.benefitItem}>
    <Icon name={icon} size={22} color="#713708" />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: responsiveScreenWidth(5),
    paddingBottom: responsiveHeight(15),
  },
  mainTitle: {
    fontSize: responsiveFontSize(3),
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: responsiveFontSize(1.8),
    color: '#777',
    textAlign: 'center',
    marginBottom: responsiveHeight(4),
    marginTop: responsiveHeight(0.5),
  },
  planGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  planCard: {
    backgroundColor: '#fff',
    width: '47%',
    padding: responsiveHeight(2.5),
    borderRadius: 20,
    marginBottom: responsiveHeight(2),
    borderWidth: 2,
    borderColor: '#eee',
    alignItems: 'center',
    position: 'relative',
  },
  selectedCard: {
    borderColor: Colors.accent || '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  checkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  planTitle: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '700',
    color: '#666',
  },
  planPrice: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: '900',
    color: '#333',
    marginVertical: responsiveHeight(1),
  },
  planDuration: {
    fontSize: responsiveFontSize(1.5),
    color: '#888',
    marginBottom: responsiveHeight(1.5),
  },
  savingTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  savingText: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: '800',
    color: Colors.bookNow || '#2E7D32',
  },
  benefitsSection: {
    marginTop: responsiveHeight(3),
  },
  sectionHeader: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '800',
    marginBottom: responsiveHeight(2),
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1.5),
  },
  benefitText: {
    marginLeft: 12,
    fontSize: responsiveFontSize(1.9),
    color: '#444',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: responsiveScreenWidth(5),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingBottom: responsiveHeight(4),
  },
  payBtn: {
    backgroundColor: Colors.primary || '#000',
    padding: responsiveHeight(2),
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  payText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  tcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(4),
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

  tcText: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
  },

  tcLink: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default Membership;
