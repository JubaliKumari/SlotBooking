import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { membershipPlanOfferList } from '../api/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OffersScreen = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOffers();
  }, []);

  const getOffers = async () => {
    try {
      const response = await axios.get(membershipPlanOfferList);

      if (response.data.status === 200) {
        setOffers(response.data.data);
      }
    } catch (error) {
      console.log('Offer API Error', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (price, discount, type) => {
    const p = Number(price);
    const d = Number(discount);

    if (type === 'percent') {
      return p - (p * d) / 100;
    }
    return p - d;
  };

  const renderItem = ({ item }) => {
    const finalPrice = calculatePrice(
      item.plan_info.price,
      item.discount_value,
      item.discount_type,
    );

    return (
      <View style={styles.card}>
        {/* Offer Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {parseFloat(item.discount_value)}
            {item.discount_type === 'percent' ? '% OFF' : '₹ OFF'}
          </Text>
        </View>

        <Text style={styles.offerTitle}>{item.offer_name}</Text>

        <Text style={styles.plan}>{item.plan_info.title}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.oldPrice}>₹{item.plan_info.price}</Text>
          <Text style={styles.newPrice}> ₹{finalPrice}</Text>
        </View>

        <Text style={styles.date}>
          Valid: {item.start_date} → {item.end_date}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6b00" />
      </View>
    );
  }

  return (
    <>
      <Header />

      <View style={styles.container}>
        {/* Page Title */}
        <Text style={styles.pageTitle}>🔥 Special Membership Offers</Text>

        <FlatList
          data={offers}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
        />
      </View>

      <Footer />
    </>
  );
};

export default OffersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 15,
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#222',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 5,
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff6b00',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },

  plan: {
    fontSize: 15,
    marginTop: 6,
    color: '#666',
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
    fontSize: 16,
  },

  newPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27AE60',
  },

  date: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
  },
});
