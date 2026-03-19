import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { getToken } from '../util/auth';
import { trainingRegistrationList } from '../api/api';

export default function StudentListScreen() {
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('');

  // useEffect(() => {
  //   getStudents();
  // }, []);

  // const getStudents = async () => {
  //   try {
  //     const token = await getToken();

  //     const response = await axios.get(trainingRegistrationList, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.data.status === 200) {
  //       setStudents(response.data.data);
  //     }
  //   } catch (error) {
  //     console.log('Student List Error:', error);
  //   }
  // };

  useEffect(() => {
    getStudents(status);
  }, [status]);
  const getStudents = async (filterStatus = '') => {
    try {
      const token = await getToken();

      const response = await axios.get(trainingRegistrationList, {
        params: {
          status: filterStatus,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.log('Student List Error:', error);
    }
  };
  const renderItem = ({ item }) => {
    const startDate = new Date(item.start_date).toDateString();
    const expiryDate = new Date(item.end_date).toDateString();

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.phone}>📞 {item.phone}</Text>
            <Text style={styles.plan}>📚 {item.course_info?.course_level}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Start Date</Text>
          <Text style={styles.value}>{startDate}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Registration Fee</Text>
          <Text style={styles.value}>₹ {item.registration_fee}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Expiry Date</Text>
          <Text style={[styles.value, { color: 'red' }]}>{expiryDate}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.value, { color: 'green' }]}>{item.status}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Header title="Student List" />

      <View style={styles.filterContainer}>
        <Text
          style={[styles.filterBtn, status === '' && styles.activeFilter]}
          onPress={() => setStatus('')}
        >
          All
        </Text>

        <Text
          style={[styles.filterBtn, status === 1 && styles.activeFilter]}
          onPress={() => setStatus(1)}
        >
          Active
        </Text>

        <Text
          style={[styles.filterBtn, status === 0 && styles.activeFilter]}
          onPress={() => setStatus(0)}
        >
          Expired
        </Text>
      </View>

      <View style={styles.container}>
        <FlatList
          data={students}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
        />
      </View>

      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginHorizontal: 5,
    fontWeight: '600',
  },

  activeFilter: {
    backgroundColor: '#007AFF',
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  phone: {
    fontSize: 13,
    color: '#666',
  },

  plan: {
    fontSize: 13,
    color: '#666',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },

  label: {
    fontSize: 13,
    color: '#555',
  },

  value: {
    fontSize: 13,
    fontWeight: '600',
  },
});
