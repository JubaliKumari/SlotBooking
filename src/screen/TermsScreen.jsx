import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const COLORS = {
  navy: '#0B1D3A',
  navyCard: '#112040',
  navyBorder: '#1E3560',
  orange: '#F97316',
  orangeDim: 'rgba(249,115,22,0.15)',
  orangeFaint: 'rgba(249,115,22,0.08)',
  white: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.55)',
  textDim: 'rgba(255,255,255,0.30)',
};

const sections = [
  {
    num: '01',
    title: 'Admission & Registration',
    icon: '🎫',
    points: [
      'Admission is confirmed only after submission of the completed registration form and payment of applicable fees.',
      'All personal information provided must be accurate and updated.',
      'The academy reserves the right to accept or reject any application without assigning reasons.',
    ],
  },
  {
    num: '02',
    title: 'Fee Policy',
    icon: '💳',
    points: [
      'Fees must be paid in advance as per the selected training plan.',
      'Fees once paid are non-refundable and non-transferable under any circumstances.',
      'Late payment may result in suspension of training sessions.',
      'The academy reserves the right to revise fees with prior notice.',
    ],
  },
  {
    num: '03',
    title: 'Training Schedule',
    icon: '📅',
    points: [
      'Players must strictly follow allotted batch timings.',
      'Missed sessions due to personal reasons will not be compensated.',
      'Schedule changes may occur due to tournaments, maintenance, or unforeseen circumstances.',
    ],
  },
  {
    num: '04',
    title: 'Attendance & Discipline',
    icon: '✅',
    points: [
      'Players must report at least 10 minutes before session time.',
      'Proper sports discipline and respectful behavior toward coaches and fellow players is mandatory.',
      'Misconduct, abusive language, or damage to property may lead to termination without refund.',
    ],
  },
  {
    num: '05',
    title: 'Dress Code & Equipment',
    icon: '👟',
    points: [
      'Proper sports attire and non-marking badminton shoes are compulsory.',
      'Players are responsible for their personal equipment (racket, shoes, grip, etc.).',
      'The academy is not responsible for loss or damage of personal belongings.',
    ],
  },
  {
    num: '06',
    title: 'Health & Fitness',
    icon: '🏥',
    points: [
      'Players must be medically fit to participate in training.',
      'Any injury, medical condition, or allergy must be disclosed at the time of registration.',
      "Training is undertaken at the participant's own risk.",
    ],
  },
  {
    num: '07',
    title: 'Injury & Liability',
    icon: '⚠️',
    points: [
      'The academy and coaches shall not be held liable for injuries sustained during training or matches.',
      'Basic first aid may be provided; further medical treatment will be the responsibility of the player/guardian.',
    ],
  },
  {
    num: '08',
    title: 'Code of Conduct',
    icon: '🤝',
    points: [
      'Respect toward coaches, staff, and fellow players is mandatory.',
      'Parents/guardians are not allowed inside training courts unless permitted.',
      'Mobile warnings, disturbances, or interference during sessions are prohibited.',
    ],
  },
  {
    num: '09',
    title: 'Holidays & Closures',
    icon: '📆',
    points: [
      'The academy will remain closed on declared public holidays or maintenance days.',
      'No fee adjustment will be made for official holidays.',
    ],
  },
  {
    num: '10',
    title: 'Photography & Media Consent',
    icon: '📸',
    points: [
      'The academy may use photographs/videos of training sessions or tournaments for promotional purposes unless written objection is submitted.',
    ],
  },
  {
    num: '11',
    title: 'Termination of Membership',
    icon: '🚫',
    points: [
      'The academy reserves the right to terminate membership for violation of rules or indiscipline.',
      'No refund will be provided upon termination due to misconduct.',
    ],
  },
  {
    num: '12',
    title: 'Safety & Facility Rules',
    icon: '🛡️',
    points: [
      'Players must follow all safety instructions issued by coaches.',
      'Food, chewing gum, or beverages (except water/energy drinks) are not allowed on courts.',
      'Any damage caused intentionally will be chargeable.',
    ],
  },
  {
    num: '13',
    title: 'Amendments',
    icon: '📝',
    points: [
      'The academy reserves the right to modify terms and conditions at any time with prior notice.',
    ],
  },
];

function AccordionItem({ section, index, isOpen, onToggle, isFirst, isLast }) {
  return (
    <View
      style={[
        styles.card,
        isOpen && styles.cardOpen,
        isFirst && styles.cardFirst,
        isLast && styles.cardLast,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onToggle}
        style={styles.cardHeader}
      >
        <Text style={styles.cardNum}>{section.num}</Text>

        <View style={styles.iconWrap}>
          <Text style={{ fontSize: 18 }}>{section.icon}</Text>
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>
          {section.title}
        </Text>

        <View style={[styles.chevron, isOpen && styles.chevronOpen]} />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.cardBody}>
          {section.points.map((pt, i) => (
            <View key={i} style={styles.pointRow}>
              <View style={styles.bullet} />
              <Text style={styles.pointText}>{pt}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function TermsScreen() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = i => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>OFFICIAL DOCUMENT</Text>
          </View>

          <Text style={styles.heroTitle}>
            Terms & <Text style={styles.heroAccent}>Conditions</Text>
          </Text>

          <Text style={styles.heroSub}>
            99Gsports — Member Agreement & Code of Conduct
          </Text>

          <View style={styles.heroDivider} />
        </View>

        {/* ── Accordion ── */}
        <View style={styles.accordionWrap}>
          {sections.map((sec, i) => (
            <AccordionItem
              key={i}
              section={sec}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
              isFirst={i === 0}
              isLast={i === sections.length - 1}
            />
          ))}
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>
            By registering with the academy, you confirm that you have read,
            understood, and agreed to all terms listed above.
          </Text>
          <Text style={styles.footerDate}>Last updated: March 2026</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },

  // Hero
  hero: {
    paddingTop: 56,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.navyBorder,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.orangeFaint,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.35)',
    borderRadius: 40,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.orange,
  },
  badgeText: {
    color: COLORS.orange,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 50,
    letterSpacing: -1,
  },
  heroAccent: {
    color: COLORS.orange,
  },
  heroSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 20,
  },
  heroDivider: {
    width: 48,
    height: 3,
    backgroundColor: COLORS.orange,
    borderRadius: 2,
    marginTop: 24,
  },

  // Accordion wrapper
  accordionWrap: {
    marginHorizontal: 16,
    marginTop: 28,
    gap: 2,
  },

  // Card
  card: {
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderWidth: 1,
    borderColor: COLORS.navyBorder,
    borderRadius: 0,
    overflow: 'hidden',
  },
  cardOpen: {
    backgroundColor: COLORS.orangeFaint,
    borderColor: 'rgba(249,115,22,0.3)',
  },
  cardFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardLast: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 14,
  },
  cardNum: {
    fontSize: 22,
    fontWeight: '700',
    color: 'rgba(249,115,22,0.28)',
    minWidth: 32,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.orangeFaint,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
  },
  chevron: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.orange,
    transform: [{ rotate: '45deg' }],
    marginTop: -3,
    opacity: 0.75,
  },
  chevronOpen: {
    transform: [{ rotate: '-135deg' }],
    marginTop: 3,
  },

  // Card body
  cardBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingLeft: 74,
    gap: 10,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 8,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.orange,
    opacity: 0.7,
    marginTop: 7,
    flexShrink: 0,
  },
  pointText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 20,
  },

  // Footer
  footer: {
    marginHorizontal: 24,
    marginTop: 40,
    alignItems: 'center',
  },
  footerLine: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.navyBorder,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textDim,
    textAlign: 'center',
    lineHeight: 20,
  },
  footerDate: {
    fontSize: 12,
    color: 'rgba(249,115,22,0.6)',
    fontWeight: '500',
    marginTop: 8,
  },
});
