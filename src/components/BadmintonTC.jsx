import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Header from './Header';

const TC_DATA = [
  {
    id: 1,
    title: 'Admission & Registration',
    icon: '👤',
    content:
      'Admission is confirmed only after submission of the completed registration form and payment of applicable fees. All personal information provided must be accurate and updated. The academy reserves the right to accept or reject any application without assigning reasons.',
  },
  {
    id: 2,
    title: 'Fee Policy',
    icon: '💰',
    content:
      'Fees must be paid in advance as per the selected training plan. Fees once paid are non-refundable and non-transferable. Late payment may result in suspension of training sessions. The academy reserves the right to revise fees with prior notice.',
  },
  {
    id: 3,
    title: 'Training Schedule',
    icon: '📅',
    content:
      'Players must strictly follow allotted batch timings. Missed sessions due to personal reasons will not be compensated. Schedule changes may occur due to tournaments, maintenance, or unforeseen circumstances.',
  },
  {
    id: 4,
    title: 'Attendance & Discipline',
    icon: '✅',
    content:
      'Players must report at least 10 minutes before session time. Proper sports discipline and respectful behavior toward coaches and fellow players is mandatory. Misconduct may lead to termination without refund.',
  },
  {
    id: 5,
    title: 'Dress Code & Equipment',
    icon: '👕',
    content:
      'Proper sports attire and non-marking badminton shoes are compulsory. Players are responsible for their personal equipment. The academy is not responsible for loss or damage of personal belongings.',
  },
  {
    id: 6,
    title: 'Health & Fitness',
    icon: '❤️',
    content:
      'Players must be medically fit to participate in training. Any injury, medical condition, or allergy must be disclosed during registration. Training is undertaken at the participant’s own risk.',
  },
  {
    id: 7,
    title: 'Injury & Liability',
    icon: '⚠️',
    content:
      'The academy and coaches shall not be held liable for injuries sustained during training or matches. Basic first aid may be provided but further treatment is the responsibility of the player or guardian.',
  },
  {
    id: 8,
    title: 'Code of Conduct',
    icon: '📋',
    content:
      'Respect toward coaches, staff, and fellow players is mandatory. Parents or guardians are not allowed inside training courts unless permitted. Mobile disturbances during sessions are prohibited.',
  },
  {
    id: 9,
    title: 'Holidays & Closures',
    icon: '🏖️',
    content:
      'The academy will remain closed on declared public holidays or maintenance days. No fee adjustment will be made for official holidays.',
  },
  {
    id: 10,
    title: 'Photography & Media Consent',
    icon: '📸',
    content:
      'The academy may use photographs or videos of training sessions or tournaments for promotional purposes unless written objection is submitted.',
  },
  {
    id: 11,
    title: 'Termination of Membership',
    icon: '❌',
    content:
      'The academy reserves the right to terminate membership for violation of rules or indiscipline. No refund will be provided upon termination due to misconduct.',
  },
  {
    id: 12,
    title: 'Safety & Facility Rules',
    icon: '🦺',
    content:
      'Players must follow all safety instructions issued by coaches. Food, chewing gum, or beverages except water are not allowed on courts. Any damage caused intentionally will be chargeable.',
  },
  {
    id: 13,
    title: 'Amendments',
    icon: 'ℹ️',
    content:
      'The academy reserves the right to modify terms and conditions at any time with prior notice.',
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

export default function BadmintonTC() {
  return (
    <>
      <Header title="Terms & Conditions" />

      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.headerArea}>
          <Text style={styles.mainTitle}>Academy Rules</Text>
          <Text style={styles.tagline}>🏸 Discipline • Excellence</Text>
        </View>

        <ScrollView style={{ padding: 15, marginBottom: 90 }}>
          {TC_DATA.map(item => (
            <AccordionItem key={item.id} item={item} />
          ))}

          {/* <View style={styles.footer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Accept & Continue</Text>
          </TouchableOpacity>
        </View> */}
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

  footer: {
    marginTop: 20,
    marginBottom: 40,
  },

  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
