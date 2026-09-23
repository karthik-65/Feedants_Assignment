import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import SpeechBubbleFaceIcon from './SpeechBubbleFaceIcon';

export default function ReviewsSection() {
  const { language, t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const reviews = language === 'hi' ? [
    {
      name: 'रिया शाह',
      rating: 5,
      comment: 'फ़ीडएंट्स शास्त्रीय प्रतियोगिता में भाग लेना बहुत सरल और पारदर्शी था। समय पर पुरस्कार राशि का भुगतान मिला!'
    },
    {
      name: 'आरव मेहता',
      rating: 5,
      comment: 'शास्त्रीय कलाकारों के लिए बेहतरीन मंच। निर्णायकों की प्रतिक्रिया बेहद रचनात्मक थी।'
    }
  ] : [
    {
      name: 'Riya Shah',
      rating: 5,
      comment: 'Participating in the Feedants dance contest was seamless. Clear judging rubrics and prompt cash transfer!'
    },
    {
      name: 'Aarav Mehta',
      rating: 5,
      comment: 'Great platform for classical performers. The feedback from the judges was genuinely constructive.'
    }
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.leftRow}>
          {/* Circular container with speech bubble face icon matching reference */}
          <View style={styles.iconCircle}>
            <SpeechBubbleFaceIcon size={20} />
          </View>

          <View style={styles.textBox}>
            <Text style={styles.title}>{t.hearUsers}</Text>
            <Text style={styles.subText}>{t.hearUsersSub}</Text>
          </View>
        </View>

        <Feather name="chevron-right" size={18} color="#64748B" />
      </TouchableOpacity>

      {/* Reviews Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.reviewsModalTitle}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {reviews.map((rev, idx) => (
              <View key={idx} style={styles.reviewItem}>
                <View style={styles.reviewTopRow}>
                  <Text style={styles.reviewerName}>{rev.name}</Text>
                  <View style={styles.starsRow}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <FontAwesome5 key={i} name="star" size={10} solid color="#EAB308" />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{rev.comment}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>{t.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.2,
    borderColor: '#EEF2F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9', // Soft light circle
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  textBox: {
    flex: 1
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0A192F'
  },
  subText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A192F'
  },
  reviewItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  reviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B'
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2
  },
  reviewComment: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16
  },
  closeBtn: {
    backgroundColor: '#007A78',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    marginTop: 6
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12
  }
});
