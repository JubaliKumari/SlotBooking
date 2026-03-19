import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { membershipHistory } from '../api/api';
import axios from 'axios';
import { getToken } from '../util/auth';

const MembershipCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.plan}>{item.plan_title}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>

      <Text style={styles.date}>
        {item.start_date} to {item.end_date}
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>Price</Text>
        <Text>₹{Number(item.plan_price)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Discount</Text>
        <Text>
          {Number(item.discount_value)}
          {item.discount_type === 'percent' ? '%' : '₹'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Final Amount</Text>
        <Text>₹{Number(item.final_amount)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Paid Amount</Text>
        <Text style={{ color: 'green' }}>₹{Number(item.paid_amount)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Due Amount</Text>
        <Text style={{ color: 'red' }}>₹{Number(item.due_amount)}</Text>
      </View>

      <View style={styles.divider} />

      {item.isOfferApplied && (
        <Text style={styles.offer}>Offer: {item.offer_name}</Text>
      )}
    </View>
  );
};

export default function MembershipList() {
  const [memberships, setMemberships] = useState([]);
  const [status, setStatus] = useState('active'); // active default

  useEffect(() => {
    getMemberships(status);
  }, [status]);

  // const getMemberships = async () => {
  //   try {
  //     const token = await getToken();

  //     if (!token) {
  //       console.log('Token not found');
  //       return;
  //     }

  //     const response = await axios.get(membershipHistory, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         Accept: 'application/json',
  //       },
  //     });

  //     console.log('Membership History Response:', response.data);

  //     if (response.data.status === 200) {
  //       setMemberships(response.data.data);
  //     }
  //   } catch (error) {
  //     console.log('Membership API Error:', error);
  //   }
  // };
  const getMemberships = async (filterStatus = status) => {
    try {
      const token = await getToken();

      if (!token) {
        console.log('Token not found');
        return;
      }

      const response = await axios.get(membershipHistory, {
        params: {
          status: filterStatus, // API Filter
        },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (response.data.status === 200) {
        setMemberships(response.data.data);
      }
    } catch (error) {
      console.log('Membership API Error:', error);
    }
  };
  return (
    <>
      <Header />

      <View style={styles.filterContainer}>
        <Text
          style={[
            styles.filterButton,
            status === 'active' && styles.activeFilter,
          ]}
          onPress={() => setStatus('active')}
        >
          Active
        </Text>

        <Text
          style={[
            styles.filterButton,
            status === 'expired' && styles.activeFilter,
          ]}
          onPress={() => setStatus('expired')}
        >
          Expired
        </Text>
      </View>

      <FlatList
        data={memberships}
        keyExtractor={item => item.membership_id.toString()}
        renderItem={({ item }) => <MembershipCard item={item} />}
      />

      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  plan: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  status: {
    color: 'green',
    fontWeight: 'bold',
  },

  date: {
    color: '#777',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },

  label: {
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },

  offer: {
    color: '#ff6b00',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },

  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginHorizontal: 5,
  },

  activeFilter: {
    backgroundColor: '#ff6b00',
    color: '#fff',
  },
});
