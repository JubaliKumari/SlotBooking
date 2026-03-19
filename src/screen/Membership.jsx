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
import {
  getMembershipPlans,
  purchaseMembership,
  getPaymentModes,
  createOrder,
} from '../api/api';
import axios from 'axios';
import { getToken } from '../util/auth';
import { getUserDetails } from '../util/auth';
import { notify } from '../components/ToastHelper';
import { useNavigation } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';

const Membership = () => {
  const navigation = useNavigation();
  const [acceptTC, setAcceptTC] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planList, setPlanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Fetch User
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

  // Fetch Plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(getMembershipPlans);
        const fetchedData = response?.data?.data;
        console.log('Fetched Plans:', fetchedData);

        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setPlanList(fetchedData);
          setSelectedPlan(fetchedData[0]);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        Alert.alert('Error', 'Could not load membership plans.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const createOrderAndPay = async () => {
    try {
      const token = await getToken();
      const amount = parseInt(selectedPlan.final_price); // Razorpay expects paise

      const response = await axios.post(
        createOrder,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Order API Response:', response);

      if (response.data.status === true) {
        const orderId = response.data.id;
        const amount_options = response.data.amount;
        const currency = response.data.currency;

        handlePurchase(orderId, amount_options, currency);
      } else {
        Alert.alert('Error', 'Order creation failed');
      }
    } catch (error) {
      console.log('Create Order Error:', error.response?.data || error.message);
    }
  };

  const handlePurchase = (orderId, amount_options, currency) => {
    if (!selectedPlan) return Alert.alert('Error', 'Please select a plan.');
    if (!acceptTC) return notify('Please accept Terms & Conditions');

    // setIsPurchasing(true);

    const options = {
      description: selectedPlan.title,
      order_id: orderId,
      currency: currency, // ✅ ADD THIS
      amount: amount_options, // ✅ ADD THIS (in paise)
      key: 'rzp_live_SScaoKP8IRuQxe',
      name: 'Membership Booking',
      prefill: {
        email: user?.email || '',
        contact: user?.mobile || user?.phone || '',
        name: user?.name || '',
      },
      theme: { color: Colors.primary || '#F37254' },
    };
    // console.log('Razorpay Options:', options);

    RazorpayCheckout.open(options)
      .then(async paymentData => {
        console.log('SUCCESS:', paymentData);

        setIsPurchasing(false); // ✅ here only

        try {
          const token = await getToken();

          const payload = {
            player_id: user?.id,
            membership_plan_id: selectedPlan.id,
            start_date: new Date().toISOString().split('T')[0],
            paid_amount: selectedPlan.final_price,

            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,

            is_offer_applied: selectedPlan.has_offer === 1 ? 1 : 0,
            offer_id:
              selectedPlan.has_offer === 1 ? selectedPlan.offer_id : null,
          };

          // console.log('PURCHASE PAYLOAD:', payload);

          const response = await axios.post(purchaseMembership, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          console.log('PURCHASE RESPONSE:', response);

          // ✅ FIXED SUCCESS CONDITION
          if (response.status === 200) {
            Alert.alert('🎉 Success', 'Membership plan activated!', [
              {
                text: 'OK',
                onPress: () => navigation.navigate('MembershipList'),
              },
            ]);
          } else {
            Alert.alert(
              'Failed',
              response.data?.message || 'Something went wrong',
            );
          }
        } catch (apiError) {
          console.error(
            'API Error:',
            apiError.response?.data || apiError.message,
          );
          Alert.alert(
            'Error',
            'Payment done but activation failed. Contact support.',
          );
        }
      })
      .catch(error => {
        console.log('Razorpay Error:', error);

        if (error.code === 0) {
          Alert.alert('Cancelled', 'Payment was cancelled.');
        } else {
          Alert.alert('Payment Failed', `${error.code} | ${error.description}`);
        }
      })
      .finally(() => {
        setIsPurchasing(false);
      });
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
                const isSelected = selectedPlan?.id === item.id;
                return (
                  <TouchableOpacity
                    key={item.id || index}
                    style={[styles.planCard, isSelected && styles.selectedCard]}
                    onPress={() => setSelectedPlan(item)}
                  >
                    <Text style={styles.planTitle}>{item.title}</Text>
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
                {acceptTC && <Text style={{ fontSize: 15 }}>☑</Text>}
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

          {/* ✅ Single Pay Button — directly opens Razorpay */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.payBtn,
                (isPurchasing || !acceptTC) && { opacity: 0.5 },
              ]}
              onPress={() => {
                if (!isPurchasing) {
                  createOrderAndPay();
                }
              }}
              disabled={isPurchasing}
            >
              {isPurchasing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payText}>
                  Pay ₹{parseInt(selectedPlan?.final_price || 0)} —{' '}
                  {selectedPlan?.title?.toUpperCase() || 'PLAN'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
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
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  benefitsSection: { marginTop: responsiveHeight(3) },
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
  tcText: { fontSize: responsiveFontSize(1.8), color: '#333' },
  tcLink: { color: Colors.primary, fontWeight: 'bold' },
});

export default Membership;
