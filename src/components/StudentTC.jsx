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

const TC_DATA = [
  {
    id: 1,
    title: 'Student Registration',
    icon: '👤',
    content:
      'Students must complete the registration form with accurate personal details before joining training sessions.',
  },
  {
    id: 2,
    title: 'Training Discipline',
    icon: '🏸',
    content:
      'Students must follow coach instructions and maintain discipline during training sessions.',
  },
  {
    id: 3,
    title: 'Attendance Policy',
    icon: '📅',
    content:
      'Students must attend sessions regularly. Missed sessions will not be compensated.',
  },
  {
    id: 4,
    title: 'Dress Code',
    icon: '👕',
    content:
      'Proper sports attire and badminton shoes are mandatory during training.',
  },
  {
    id: 5,
    title: 'Health Responsibility',
    icon: '❤️',
    content:
      'Students must inform coaches about any medical condition or injury before participating in training.',
  },
  {
    id: 6,
    title: 'Code of Conduct',
    icon: '📋',
    content:
      'Students must respect coaches, staff, and fellow players. Misconduct may lead to suspension.',
  },
  {
    id: 7,
    title: 'Safety Rules',
    icon: '🦺',
    content:
      'Students must follow all safety guidelines provided by the academy.',
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

        <Text>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.body}>
          <Text style={styles.text}>{item.content}</Text>
        </View>
      )}
    </View>
  );
};

export default function StudentTC() {
  return (
    <>
      <Header title="Student Training Terms" />

      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.headerArea}>
          <Text style={styles.mainTitle}>Student Training Rules</Text>
          <Text style={styles.tagline}>
            🏸 Discipline • Practice • Progress
          </Text>
        </View>

        <ScrollView style={{ padding: 15 }}>
          {TC_DATA.map(item => (
            <AccordionItem key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  headerArea: { padding: 20, backgroundColor: '#fff' },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  tagline: { color: '#2563eb', marginTop: 4 },

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

  left: { flexDirection: 'row', alignItems: 'center' },

  icon: { fontSize: 18 },

  title: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },

  body: { paddingHorizontal: 15, paddingBottom: 15 },

  text: { color: '#555', lineHeight: 20 },
});
