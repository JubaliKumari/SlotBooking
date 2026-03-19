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

const slotBookingTc = [
  {
    id: 1,
    title: 'Slot Confirmation',
    icon: '📅',
    content:
      'Slots are confirmed only after successful payment through the application.',
  },
  {
    id: 2,
    title: 'Slot Timing',
    icon: '⏰',
    content:
      'Players must arrive before the booked slot time. Late arrival may reduce playing time.',
  },
  {
    id: 3,
    title: 'Cancellation Policy',
    icon: '❌',
    content: 'Booked slots cannot be cancelled or refunded once confirmed.',
  },
  {
    id: 4,
    title: 'Court Discipline',
    icon: '📋',
    content:
      'Players must maintain discipline and respect other players while using academy facilities.',
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

export default function SlotTc() {
  return (
    <>
      <Header title="Slot Booking Terms & Conditions" />

      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.headerArea}>
          <Text style={styles.mainTitle}>Court Booking Rules</Text>
          <Text style={styles.tagline}>🏸 Fair Play • Discipline</Text>
        </View>

        <ScrollView style={{ padding: 15, marginBottom: 90 }}>
          {slotBookingTc.map(item => (
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
