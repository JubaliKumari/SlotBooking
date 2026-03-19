import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../../../components/Header';
import Colors from '../../../components/Colors';
import Footer from '../../../components/Footer';
const sports = ['Badminton'];

const courts = [
  {
    id: '1',
    name: '99GSports',
    location: 'Ground Floor,Ramaji Complex,Memko More,Dhanbad,Jharkhand',

    distance: '2.5',
    rating: '4.4',
    price: '2000',
    image: require('../../../assets/slider1.jpg'),
    action: 'BOOK',
  },
];

const BadmintonBookNow = ({ navigation }) => {
  const [selectedSport, setSelectedSport] = useState('Badminton');

  const renderSport = sport => (
    <TouchableOpacity
      key={sport}
      style={[
        styles.sportBtn,
        selectedSport === sport && styles.activeSportBtn,
      ]}
      onPress={() => setSelectedSport(sport)}
    >
      <Text
        style={[
          styles.sportText,
          selectedSport === sport && styles.activeSportText,
        ]}
      >
        {sport}
      </Text>
    </TouchableOpacity>
  );

  const renderCourt = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <View style={styles.rowBetween}>
          <Text style={styles.courtName} numberOfLines={1}>
            {item.name}
          </Text>
          {/* <Text style={styles.heart}>♡</Text> */}
        </View>

        <Text style={styles.location}>{item.location}</Text>

        {/* <View style={styles.infoRow}>
          <Text style={styles.infoText}>📍 {item.distance} km</Text>
          <Text style={styles.infoText}>⭐ {item.rating}</Text>
        </View> */}

        <View style={styles.bottomRow}>
          {/* <Text style={styles.price}>₹ {item.price}/hr</Text> */}

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => navigation.navigate('SlotBooking', { data: item })}
          >
            <Text style={styles.bookText}>{item.action}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Header title="Select Sport" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* SPORT FILTER */}
        <View style={styles.sportRow}>{sports.map(renderSport)}</View>

        {/* COURT LIST */}
        <FlatList
          data={courts}
          keyExtractor={item => item.id}
          renderItem={renderCourt}
          scrollEnabled={false}
        />
      </ScrollView>
      <Footer />
    </>
  );
};

export default BadmintonBookNow;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 12,
  },

  /* SPORT FILTER */
  sportRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sportBtn: {
    borderWidth: 1,
    borderColor: '#1b8f3a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeSportBtn: {
    backgroundColor: '#1b8f3a',
  },
  sportText: {
    color: '#1b8f3a',
    fontWeight: '600',
  },
  activeSportText: {
    color: '#fff',
  },

  /* CARD */
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 14,
    padding: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  cardImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courtName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },

  heart: {
    fontSize: 18,
    color: '#aaa',
    marginLeft: 6,
  },

  location: {
    fontSize: 13,
    color: '#666',
  },

  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },

  infoText: {
    fontSize: 12,
    color: '#444',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // 👉 push button to right
    alignItems: 'center',
    marginTop: 8,
  },

  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.bookNow,
  },

  bookBtn: {
    backgroundColor: Colors.bookNow,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
  },

  bookText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
