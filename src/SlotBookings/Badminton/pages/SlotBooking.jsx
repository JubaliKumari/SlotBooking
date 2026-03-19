import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import RazorpayCheckout from 'react-native-razorpay';
import { MultiSelect } from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import axios from 'axios';
import {
  getCourtList,
  getTimeSlot,
  badmintonSlotBooking,
  getUserInfo,
  createOrder,
} from '../../../api/api';
import { getToken, getUserDetails } from '../../../util/auth';

const SlotBooking = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCourts, setSelectedCourts] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [courts, setCourts] = useState([]);
  const [slots, setSlots] = useState([]);
  const [user, setUser] = useState(null);

  const formatDate = date => date.toISOString().split('T')[0];

  /* ---------------- USER INFO ---------------- */
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(getUserInfo, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response?.data?.data);
      } catch (error) {
        const localDetails = await getUserDetails();
        setUser(localDetails);
      }
    };
    fetchUserInfo();
  }, []);

  /* ---------------- COURTS ---------------- */
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await axios.get(getCourtList);
        const rawCourts = response.data?.data || [];
        setCourts(
          rawCourts.map(item => ({ id: item.id, name: item.court_name })),
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourts();
  }, []);

  /* ---------------- SLOTS ---------------- */
  useEffect(() => {
    const fetchSlots = async () => {
      if (selectedCourts.length === 0) {
        setSlots([]);
        return;
      }
      try {
        let allSlots = [];
        for (let courtId of selectedCourts) {
          const response = await axios.post(getTimeSlot, {
            court_id: courtId,
            booking_date: formatDate(selectedDate),
          });
          console.log(`Slots for Court ${courtId}:`, response);
          const slotsWithCourt = (response.data?.data || []).map(slot => ({
            ...slot,
            court_id: courtId,
          }));
          allSlots = [...allSlots, ...slotsWithCourt];
        }
        setSlots(allSlots);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSlots();
  }, [selectedDate, selectedCourts]);

  /* ---------------- DATE ---------------- */
  const handleConfirm = date => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  /* ---------------- SLOT TOGGLE ---------------- */
  const toggleSlot = slot => {
    const exists = selectedSlots.find(
      s => s.id === slot.id && s.court_id === slot.court_id,
    );
    if (exists) {
      setSelectedSlots(
        selectedSlots.filter(
          s => !(s.id === slot.id && s.court_id === slot.court_id),
        ),
      );
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  /* ---------------- PRICE ---------------- */
  let totalPrice = selectedSlots.reduce(
    (total, slot) => total + Number(slot.price || 0),
    0,
  );
  if (user?.have_membership) totalPrice = 0;

  /* ---------------- SUBMIT BOOKING ---------------- */

  const createOrderAndPay = async () => {
    if (selectedSlots.length === 0) return;

    // ✅ MEMBERSHIP → DIRECT BOOKING
    if (user?.have_membership) {
      submitBooking('0'); // no payment id
      return;
    }

    try {
      const token = await getToken();
      const amount = totalPrice; // rupees

      const response = await axios.post(
        createOrder,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // console.log('Order API Response:', response);

      if (response.data.status === true) {
        const orderId = response.data.id;
        const amount_options = response.data.amount;
        const currency = response.data.currency;

        handleBookNow(orderId, amount_options, currency);
      } else {
        Alert.alert('Error', 'Order creation failed');
      }
    } catch (error) {
      console.log('Create Order Error:', error.response?.data || error.message);
    }
  };
  /* ---------------- RAZORPAY ---------------- */

  const submitBooking = async (paymentData = null) => {
    try {
      const token = await getToken();

      const bookingArray = selectedSlots.map(slot => ({
        player_id: user?.id,
        court_id: slot.court_id,
        slot_id: slot.id,
        booking_date: formatDate(selectedDate),
        booking_amount: user?.have_membership ? 0 : slot.price,
        // payment_mode_id: paymentModeId,
        membership_plan_id: user?.membership_plan_id || '',
        membership_id: user?.membership_id || '',
      }));

      // ✅ FINAL PAYLOAD (IMPORTANT CHANGE)
      const payload = {
        have_membership: user?.have_membership,

        razorpay_order_id: paymentData?.razorpay_order_id || null,
        razorpay_payment_id: paymentData?.razorpay_payment_id || null,
        razorpay_signature: paymentData?.razorpay_signature || null,
        data: bookingArray,
      };
      // console.log('🚀 FINAL PAYLOAD:', JSON.stringify(payload, null, 2));

      const response = await axios.post(badmintonSlotBooking, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // console.log('✅ BOOKING RESPONSE:', response.data);

      if (response.data?.status === 200) {
        alert('✅ Booking Successful!');
        setSelectedSlots([]);
        setSelectedCourts([]);
      } else {
        alert(response.data?.message || 'Booking failed.');
      }
    } catch (error) {
      console.log('❌ ERROR:', error?.response?.data || error.message);
      alert(error?.response?.data?.message || 'Booking failed');
    }
  };
  const handleBookNow = (orderId, amount_options, currency) => {
    if (selectedSlots.length === 0) return;

    if (user?.have_membership) {
      submitBooking(null);
      return;
    }

    const options = {
      description: 'Court Slot Booking',
      order_id: orderId,
      currency: currency,
      amount: amount_options,
      key: 'rzp_live_SScaoKP8IRuQxe',
      name: 'Slot Booking',
      prefill: {
        email: user?.email || '',
        contact: user?.mobile || user?.phone || '',
        name: user?.name || '',
      },
      theme: { color: '#4CAF50' },
    };

    RazorpayCheckout.open(options)
      .then(paymentData => {
        // console.log('✅ Payment Success:', paymentData);
        // console.log('Sending booking count:', selectedSlots.length); // 👈 ADD THIS
        // console.log(
        //   'Order ID match:',
        //   orderId === paymentData.razorpay_order_id,
        // ); // 👈 ADD THIS

        if (
          !paymentData?.razorpay_payment_id ||
          !paymentData?.razorpay_order_id ||
          !paymentData?.razorpay_signature
        ) {
          alert('Payment verification failed');
          return;
        }

        submitBooking(paymentData);
      })
      .catch(error => {
        if (error.code === 0) {
          alert('Payment cancelled');
        } else {
          alert(error.description || 'Payment failed');
        }
      });
  };
  /* ---------------- UI ---------------- */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEF2F7' }}>
      <Header />

      <View style={styles.container}>
        <Text style={styles.title}>99GSports Dhanbad</Text>

        <View style={styles.selectionCard}>
          <View style={styles.row}>
            <View style={styles.halfSection}>
              <Text style={styles.sectionTitle}>Select Date</Text>
              <TouchableOpacity
                style={styles.dateBox}
                onPress={() => setDatePickerVisibility(true)}
              >
                <Text style={styles.dateText}>
                  {selectedDate.toDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.halfSection}>
              <Text style={styles.sectionTitle}>Select Courts</Text>
              <MultiSelect
                style={styles.dropdown}
                data={courts}
                labelField="name"
                valueField="id"
                placeholder="Select Courts"
                value={selectedCourts}
                onChange={item => setSelectedCourts(item)}
                selectedStyle={{ display: 'none' }}
              />
            </View>
          </View>
        </View>

        {selectedCourts.length > 0 && (
          <View style={styles.selectedCard}>
            <View style={styles.badgeRow}>
              {selectedCourts.map(court => (
                <View key={court} style={styles.courtBadge}>
                  <Text style={styles.badgeText}>Court {court}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.slotHeaderContainer}>
          <Text style={styles.slotHeaderText}>Available Slots</Text>
        </View>

        <FlatList
          data={slots}
          keyExtractor={item => `${item.court_id}-${item.id}`}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => {
            const selected = selectedSlots.some(
              s => s.id === item.id && s.court_id === item.court_id,
            );

            // ✅ FROM BACKEND
            const isExpired = item.is_time_expired === true;

            const isBooked =
              item.is_booked === true || item.availability === 'booked';

            // ✅ PRIORITY: BOOKED FIRST
            const isDisabled = isBooked || isExpired;
            return (
              <TouchableOpacity
                disabled={isDisabled}
                onPress={() => toggleSlot(item)}
                style={[
                  styles.slotCard,
                  isBooked && styles.bookedSlot,
                  !isBooked && isExpired && styles.expiredSlot,
                  selected && styles.selectedSlot, // ✅ MUST BE LAST (highest priority)
                ]}
              >
                <View>
                  <Text style={styles.courtText}>Court {item.court_id}</Text>
                  <Text style={styles.slotTime}>{item.slot_title}</Text>
                </View>

                <View style={styles.rightArea}>
                  {isBooked ? (
                    <Text style={styles.bookedLabel}>BOOKED</Text>
                  ) : isExpired ? (
                    <Text style={styles.expiredLabel}>EXPIRED</Text>
                  ) : (
                    <View style={styles.priceTag}>
                      <Text style={styles.priceText}>₹{item.price}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {/* ✅ Bottom Bar — Book Now directly opens Razorpay */}
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.totalPrice}>₹ {totalPrice}</Text>
            <Text style={styles.summary}>
              {selectedCourts.length} Courts | {selectedSlots.length} Slots
            </Text>
          </View>

          <TouchableOpacity
            disabled={selectedSlots.length === 0 || selectedCourts.length === 0}
            onPress={createOrderAndPay}
            style={[
              styles.bookBtn,
              (selectedSlots.length === 0 || selectedCourts.length === 0) &&
                styles.disabledBtn,
            ]}
          >
            <Text style={styles.bookText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          minimumDate={new Date()}
          onCancel={() => setDatePickerVisibility(false)}
        />
      </View>

      <Footer />
      {/* ✅ PaymentModal completely removed */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: responsiveWidth(4) },
  expiredSlot: {
    backgroundColor: '#ffce93',
    borderColor: '#ccc',
  },

  expiredLabel: {
    color: '#c00e0e',
    fontWeight: '700',
    fontSize: responsiveFontSize(1.4),
  },
  title: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: '700',
    color: '#184982',
    marginBottom: responsiveHeight(1.2),
    textAlign: 'center',
  },
  selectionCard: {
    backgroundColor: '#fff',
    padding: responsiveWidth(3),
    borderRadius: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
    borderWidth: 1,
    borderColor: '#E6E6E6',
    elevation: 3,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfSection: { flex: 1, marginRight: responsiveWidth(2) },
  sectionTitle: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '700',
    color: '#184982',
    marginBottom: responsiveHeight(0.6),
  },
  dateBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: responsiveWidth(2.5),
    borderRadius: responsiveWidth(2),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#F7F7F7',
    borderRadius: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(2),
    height: responsiveHeight(5),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCard: {
    backgroundColor: '#fff',
    padding: responsiveWidth(3),
    borderRadius: responsiveWidth(3),
    marginBottom: responsiveHeight(1.5),
    borderWidth: 1,
    borderColor: '#E6E6E6',
    elevation: 2,
  },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  courtBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.6),
    borderRadius: responsiveWidth(6),
    marginRight: responsiveWidth(2),
    marginBottom: responsiveHeight(0.8),
  },
  badgeText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.3),
    marginLeft: responsiveWidth(1),
    fontWeight: '600',
  },
  slotHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
    paddingVertical: responsiveHeight(0.6),
    borderBottomWidth: 1,
    borderColor: '#071c42',
  },
  slotHeaderText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#184982',
  },
  slotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: responsiveWidth(3),
    borderRadius: responsiveWidth(2.5),
    marginBottom: responsiveHeight(1),
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
  },
  selectedSlot: { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' },
  bookedSlot: { backgroundColor: '#FDECEA', borderColor: '#dc9635' },
  courtText: {
    fontWeight: '700',
    fontSize: responsiveFontSize(1.7),
    color: '#333',
  },
  slotTime: { fontSize: responsiveFontSize(1.5), color: '#666' },
  rightArea: { flexDirection: 'row', alignItems: 'center' },
  priceTag: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(0.6),
    borderRadius: responsiveWidth(1.5),
    marginRight: responsiveWidth(2),
  },
  priceText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: responsiveFontSize(1.4),
  },
  bookedLabel: {
    color: '#dc8635',
    fontWeight: '700',
    fontSize: responsiveFontSize(1.4),
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: responsiveWidth(4),
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  totalPrice: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: '700',
    color: '#000',
  },
  summary: { fontSize: responsiveFontSize(1.3), color: '#666' },
  bookBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(1.4),
    borderRadius: responsiveWidth(2),
  },
  disabledBtn: { backgroundColor: '#ccc' },
  bookText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: responsiveFontSize(1.7),
  },
});

export default SlotBooking;
