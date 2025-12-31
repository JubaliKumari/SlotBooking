import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import Header from '../components/Header';
import Footer from '../components/Footer';

const { width } = Dimensions.get('window');

/* ---------------- Slider Images ---------------- */
const sliderImages = [
  require('../assets/slider1.jpg'),
  require('../assets/slider2.jpg'),
  require('../assets/slider3.jpg'),
];

/* ---------------- Quick Actions ---------------- */
const quickActions = [
  {
    title: 'Book Slot',
    image: require('../assets/badmin.png'),
    screen: 'BookSlot',
  },
  {
    title: 'My Bookings',
    image: require('../assets/offer.png'),
    screen: 'MyBookings',
  },
  {
    title: 'Profile',
    image: require('../assets/profile.webp'),
    screen: 'Profile',
  },
  {
    title: 'Offers',
    image: require('../assets/offer.png'),
    screen: 'Offers',
  },
];

/* ---------------- Sports ---------------- */
const sports = [
  {
    title: 'Badminton',
    image: require('../assets/badmin1.webp'),
    screen: 'BadmintonBookNow',
  },
  {
    title: 'Cricket',
    image: require('../assets/ball.jpg'),
    screen: 'CricketSlots',
  },
  {
    title: 'Football',
    image: require('../assets/volley.jpg'),
    screen: 'FootballSlots',
  },
  {
    title: 'Volleyball',
    image: require('../assets/volley.jpg'),
    screen: 'VolleyballSlots',
  },
];

const Dashboard = ({ navigation }) => {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /* -------- Auto Slider -------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % sliderImages.length;
      sliderRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <ImageBackground
      source={require('../assets/backgro.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------------- Promotions ---------------- */}
        <Text style={styles.sectionTitle}>Promotions</Text>

        <FlatList
          ref={sliderRef}
          data={sliderImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / width
            );
            setActiveIndex(index);
          }}
          renderItem={({ item }) => (
            <Image source={item} style={styles.sliderImage} />
          )}
        />

        {/* Slider Dots */}
        <View style={styles.dotsContainer}>
          {sliderImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* ---------------- Quick Actions ---------------- */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionContainer}>
          {quickActions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Image source={item.image} style={styles.actionIcon} />
              <Text style={styles.actionText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ---------------- Select Sports ---------------- */}
        <Text style={styles.sectionTitle}>Select Sports</Text>

        <View style={styles.sportsContainer}>
          {sports.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.sportCard}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Image source={item.image} style={styles.sportImage} />
              <Text style={styles.sportText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Footer />
    </ImageBackground>
  );
};

export default Dashboard;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    color: 'green',
    marginHorizontal: responsiveWidth(4),
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(1.5),
    backgroundColor: '#fff',
    padding: responsiveHeight(1.2),
    borderRadius: responsiveWidth(2),
  },

  sliderImage: {
    width: responsiveWidth(92),
    height: responsiveHeight(22),
    borderRadius: responsiveWidth(4),
    marginHorizontal: responsiveWidth(4),
    borderWidth: 2,
    borderColor: '#fff',
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: responsiveHeight(1),
  },

  dot: {
    width: responsiveWidth(2),
    height: responsiveWidth(2),
    borderRadius: responsiveWidth(1),
    backgroundColor: '#ccc',
    marginHorizontal: responsiveWidth(1),
  },

  activeDot: {
    backgroundColor: '#1E90FF',
    width: responsiveWidth(3),
  },

  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: responsiveWidth(3),
    marginTop: responsiveHeight(1),
  },

  actionCard: {
    width: responsiveWidth(18),
    height: responsiveHeight(8),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  actionIcon: {
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    marginBottom: responsiveHeight(0.8),
  },

  actionText: {
    fontSize: responsiveFontSize(1),
    fontWeight: '600',
    textAlign: 'center',
  },

  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
  },

  sportCard: {
    width: responsiveWidth(44),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(4),
    padding: responsiveHeight(2),
    marginBottom: responsiveHeight(2),
    alignItems: 'center',
    elevation: 4,
  },

  sportImage: {
    width: responsiveWidth(16),
    height: responsiveWidth(16),
    marginBottom: responsiveHeight(1),
  },

  sportText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '600',
  },
});
