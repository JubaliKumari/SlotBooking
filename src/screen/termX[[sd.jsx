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

const Membership = () => {
  const navigation = useNavigation();

  const [acceptTC, setAcceptTC] = useState(false);

  const [paymentOptions, setPaymentOptions] = useState([]);
  const [user, setUser] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planList, setPlanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const details = await getUserDetails();
        setUser(details);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(getMembershipPlans);
        const fetchedData = response?.data?.data;

        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setPlanList(fetchedData);
          setSelectedPlan(fetchedData[0]);
        }
      } catch (error) {
        Alert.alert('Error', 'Could not load membership plans.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchPaymentModes = async () => {
      try {
        const response = await axios.get(getPaymentModes);

        if (response.data && response.data.status === 200) {
          const arrayFromServer = response.data.data;

          const formattedModes = arrayFromServer.map(mode => ({
            label: mode.title,
            value: mode.id,
          }));

          setPaymentOptions(formattedModes);
        }
      } catch (error) {
        console.error('Error fetching payment modes:', error);
      }
    };

    fetchPaymentModes();
  }, []);

  const handlePurchase = async paymentMode => {
    if (!selectedPlan) {
      return Alert.alert('Error', 'Please select a plan.');
    }

    const token = await getToken();

    if (!token) {
      Alert.alert('Login Required', 'Please login first.');
      return;
    }

    setIsPurchasing(true);

    const payload = {
      player_id: user?.id,
      membership_plan_id: selectedPlan.id,
      start_date: new Date().toISOString().split('T')[0],
      paid_amount: selectedPlan.final_price,
      payment_mode: paymentMode,
      transication_id: '0',
      is_offer_applied: selectedPlan.has_offer === 1 ? 1 : 0,
      offer_id: selectedPlan.has_offer === 1 ? selectedPlan.offer_id : null,
    };

    try {
      const response = await axios.post(purchaseMembership, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data?.status === 'success') {
        Alert.alert('Success', 'Plan activated!');
        setShowModal(false);
      } else {
        Alert.alert('Failed', response.data?.message || 'Something went wrong');
      }
    } catch (error) {
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
                const isSelected = selectedPlan?.id === item.id;

                return (
                  <TouchableOpacity
                    key={item.id || index}
                    style={[styles.planCard, isSelected && styles.selectedCard]}
                    onPress={() => setSelectedPlan(item)}
                  >
                    {isSelected && (
                      <Icon
                        name="check-circle"
                        size={20}
                        color={Colors.accent || '#4CAF50'}
                        style={styles.checkIcon}
                      />
                    )}

                    <Text style={styles.planTitle}>{item.title}</Text>

                    <Text style={styles.planPrice}>
                      ₹{parseInt(item.final_price)}
                    </Text>

                    <Text style={styles.planDuration}>
                      {item.duration_label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* TERMS & CONDITIONS CHECKBOX */}

            <View style={styles.tcContainer}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  acceptTC && { backgroundColor: Colors.primary },
                ]}
                onPress={() => setAcceptTC(!acceptTC)}
              >
                {acceptTC && <Icon name="check" size={16} color="#fff" />}
              </TouchableOpacity>

              <Text style={styles.tcText}>
                I accept{' '}
                <Text
                  style={styles.tcLink}
                  onPress={() => navigation.navigate('MembershipTc')}
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
        onConfirm={handlePurchase}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },

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

  checkIcon: { position: 'absolute', top: 10, right: 10 },

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
