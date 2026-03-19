import React, { useRef, useState, useEffect, use } from 'react';
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
import Colors from '../components/Colors';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getSliders } from '../api/api';
import { getToken } from '../util/auth';
import axios from 'axios';
const { width } = Dimensions.get('window');

/* ---------------- Quick Actions ---------------- */
const quickActions = [
  {
    title: 'Membership',
    image: require('../assets/profile.webp'),
    screen: 'Membership',
  },

  {
    title: 'Training',
    image: require('../assets/tranning.png'),
    screen: 'TrainingForm',
  },
  {
    title: 'Profile',
    image: require('../assets/profile.webp'),
    screen: 'Profile',
  },
  {
    title: 'Offers',
    image: require('../assets/offer.png'),
    screen: 'OffersScreen',
  },
];

/* ---------------- Sports ---------------- */
const sports = [
  {
    title: 'Badminton',
    image: require('../assets/badmin1.webp'),
    screen: 'BadmintonBookNow',
    requireAuth: false,
  },
  {
    title: 'Membership',
    image: require('../assets/profile.webp'),
    screen: 'MembershipList',
    requireAuth: true,
  },
  {
    title: 'Student',
    image: require('../assets/student.png'),
    screen: 'StudentListScreen',
    requireAuth: true,
  },
  {
    title: 'Booking History',
    image: require('../assets/badmin1.webp'),
    screen: 'BookingHistory',
    requireAuth: true,
  },
];

const Dashboard = ({ navigation }) => {
  const sliderRef = useRef(null);
  const [apiSliders, setApiSliders] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const t = await getToken();
      setToken(t);
    };

    fetchToken();
  }, []);

  const visibleSports = sports.filter(item => {
    if (!item.requireAuth) return true; // show always
    return token; // show only if token exists
  });
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await axios.get(getSliders);
        const slidersFromApi = Array.isArray(res?.data?.data)
          ? res.data.data
          : [];
        setApiSliders(slidersFromApi);
        // console.log('API Sliders Set:', slidersFromApi);
      } catch (err) {
        console.error('Error fetching sliders:', err);
      }
    };
    fetchSliders();
  }, []);

  useEffect(() => {
    if (apiSliders.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % apiSliders.length;

      sliderRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, apiSliders]);

  return (
    <ImageBackground
      source={require('../assets/back99.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------------- Promotions ---------------- */}

        {apiSliders.length > 0 && (
          <>
            {/* <Text style={styles.sectionTitle}>Promotions</Text> */}

            <FlatList
              ref={sliderRef}
              data={apiSliders}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : index.toString()
              }
              onMomentumScrollEnd={e => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setActiveIndex(index);
              }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.image }}
                  style={styles.sliderImage}
                  resizeMode="cover"
                />
              )}
            />

            <View style={styles.dotsContainer}>
              {apiSliders.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </>
        )}

        {/* ---------------- Select Sports ---------------- */}
        <Text style={styles.sectionTitle}>Dashboard</Text>

        <View style={styles.sportsContainer}>
          {visibleSports.map((item, index) => (
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

        {/* ---------------- Quick Actions ---------------- */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <FlatList
          data={quickActions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingHorizontal: responsiveWidth(4),
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.actionCard, { marginRight: responsiveWidth(3) }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Image source={item.image} style={styles.actionIcon} />
              <Text style={styles.actionText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      <Footer />
    </ImageBackground>
  );
};

export default Dashboard;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  actionContainer: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
  },

  actionCard: {
    width: responsiveWidth(22),
    height: responsiveHeight(9),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(3), // spacing between cards
    elevation: 5,
  },

  actionIcon: {
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    marginBottom: responsiveHeight(0.8),
  },

  actionText: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: '600',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  sectionTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    color: Colors.warning,
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
    marginTop: responsiveHeight(2),
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
    marginBottom: responsiveHeight(2),
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
