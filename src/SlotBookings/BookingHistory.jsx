import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { badmintonBookingHistory } from '../api/api';
import { getToken } from '../util/auth';
import Footer from '../components/Footer';
import Header from '../components/Header';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('');
  const [membership, setMembership] = useState('');
  const [loading, setLoading] = useState(false);

  const formatTime = time => {
    const [hour, minute] = time.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formatted = h % 12 || 12;
    return `${formatted}:${minute} ${ampm}`;
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const res = await axios.get(badmintonBookingHistory, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          status: status,
          have_membership: membership,
        },
      });

      setBookings(res?.data?.data || []);
    } catch (error) {
      console.log('Booking history error:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, [status, membership]);

  const renderItem = ({ item }) => {
    const isCancelled = item.status === 'cancelled';

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.bookingId}>{item.booking_id}</Text>

          <Text
            style={[styles.status, { color: isCancelled ? 'red' : 'green' }]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{item.name}</Text>

        <Text style={styles.info}>📍 Court : {item.court_name}</Text>

        <Text style={styles.info}>
          🕒 Slot : {formatTime(item.slots.start_time)} -{' '}
          {formatTime(item.slots.end_time)}
        </Text>

        <Text style={styles.info}>📅 Date : {item.booking_date}</Text>

        <Text style={styles.info}>🏅 Membership : {item.have_membership}</Text>
      </View>
    );
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        {/* STATUS FILTER */}

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterBtn, status === '' && styles.active]}
            onPress={() => setStatus('')}
          >
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterBtn, status === 'booked' && styles.active]}
            onPress={() => setStatus('booked')}
          >
            <Text style={styles.filterText}>Booked</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterBtn, status === 'cancelled' && styles.active]}
            onPress={() => setStatus('cancelled')}
          >
            <Text style={styles.filterText}>Cancelled</Text>
          </TouchableOpacity>
        </View>

        {/* MEMBERSHIP FILTER */}

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterBtn, membership === '' && styles.active]}
            onPress={() => setMembership('')}
          >
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterBtn, membership === '1' && styles.active]}
            onPress={() => setMembership('1')}
          >
            <Text style={styles.filterText}>Membership</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterBtn, membership === '0' && styles.active]}
            onPress={() => setMembership('0')}
          >
            <Text style={styles.filterText}>Without</Text>
          </TouchableOpacity>
        </View>

        {/* LIST */}

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <Text style={styles.empty}>No Booking Found</Text>
            )}
          />
        )}
      </View>

      <Footer />
    </>
  );
};

export default BookingHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },

  filterRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#ddd',
    borderRadius: 20,
    marginRight: 10,
  },

  active: {
    backgroundColor: '#4CAF50',
  },

  filterText: {
    color: '#000',
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  bookingId: {
    fontWeight: 'bold',
    fontSize: 15,
  },

  status: {
    fontWeight: 'bold',
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },

  info: {
    fontSize: 14,
    marginBottom: 2,
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#777',
  },
});
