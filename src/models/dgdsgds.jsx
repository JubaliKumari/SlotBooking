import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MembershipListModel = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Local Membership Plans (No API)
  const planList = [
    {
      id: 1,
      title: 'Gold Plan',
      price: 999,
      duration: '1 Month',
    },
    {
      id: 2,
      title: 'Silver Plan',
      price: 699,
      duration: '1 Month',
    },
    {
      id: 3,
      title: 'Basic Plan',
      price: 399,
      duration: '1 Month',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Membership Icon */}
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => setShowModal(true)}
      >
        <Icon name="card-membership" size={35} color="#000" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Membership Plans</Text>

          <ScrollView>
            {planList.map(plan => {
              const isSelected = selectedPlan?.id === plan.id;

              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[styles.planCard, isSelected && styles.selectedCard]}
                  onPress={() => setSelectedPlan(plan)}
                >
                  <Text style={styles.planTitle}>{plan.title}</Text>

                  <Text style={styles.planPrice}>₹{plan.price}</Text>

                  <Text style={styles.planDuration}>{plan.duration}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {selectedPlan && (
            <Text style={styles.selectedText}>
              Selected Plan: {selectedPlan.title}
            </Text>
          )}

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setShowModal(false)}
          >
            <Text style={{ color: '#fff' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default MembershipListModel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconBtn: {
    padding: 15,
    borderRadius: 50,
    backgroundColor: '#eee',
  },

  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  planCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  selectedCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },

  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  planPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
  },

  planDuration: {
    color: '#777',
    marginTop: 5,
  },

  selectedText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },

  closeBtn: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
});
