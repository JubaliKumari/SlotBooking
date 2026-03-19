import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Header from './Header';

const MEMBERSHIP_TC = [
  {
    id: 1,
    title: 'Admission & Registration',
    icon: '👤',
    content:
      'Admission is confirmed only after submission of the completed registration form and payment of applicable fees. All personal information provided must be accurate and updated.',
  },
  {
    id: 2,
    title: 'Fee Policy',
    icon: '💰',
    content:
      'Fees must be paid in advance as per the selected training plan. Fees once paid are non-refundable and non-transferable.',
  },
  {
    id: 3,
    title: 'Training Schedule',
    icon: '📅',
    content:
      'Players must strictly follow allotted batch timings. Missed sessions due to personal reasons will not be compensated.',
  },
];

const AccordionItem = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={() => setOpen(!open)}>
        <View style={styles.left}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>

        <Text style={styles.arrow}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.body}>
          <Text style={styles.text}>{item.content}</Text>
        </View>
      )}
    </View>
  );
};

export default function MemberShipTc() {
  return (
    <>
      <Header title="Membership Terms & Conditions" />

      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.headerArea}>
          <Text style={styles.mainTitle}>Academy Membership Rules</Text>
          <Text style={styles.tagline}>🏸 Discipline • Excellence</Text>
        </View>

        <ScrollView style={{ padding: 15, marginBottom: 90 }}>
          {MEMBERSHIP_TC.map(item => (
            <AccordionItem key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },

  headerArea: {
    padding: 20,
    backgroundColor: '#fff',
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },

  tagline: {
    color: '#2563eb',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    fontSize: 18,
  },

  title: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },

  arrow: {
    fontSize: 16,
  },

  body: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },

  text: {
    color: '#555',
    lineHeight: 20,
  },
});
