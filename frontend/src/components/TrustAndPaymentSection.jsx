import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import RazorpayLogo from './RazorpayLogo';
import ShieldCheckIcon from './ShieldCheckIcon';

export default function TrustAndPaymentSection() {
  const { t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.twoColumnCard}>
        {/* Left Column: How will you receive prize money? */}
        <TouchableOpacity
          style={styles.leftCol}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.playIconSquare}>
            <View style={styles.darkTealCircle}>
              <FontAwesome5 name="play" size={8} color="#FFFFFF" style={{ marginLeft: 2 }} />
            </View>
          </View>

          <View style={styles.leftColText}>
            <Text style={styles.prizeQuestionTitle}>
              {t.prizeReceiveQuestion}
            </Text>
            <Text style={styles.prizeQuestionSub}>
              {t.prizeReceiveSub}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Vertical Hairline Divider */}
        <View style={styles.verticalDivider} />

        {/* Right Column: Refund policy & Razorpay */}
        <View style={styles.rightCol}>
          {/* Row 1: Refund policy with Shield Checkmark icon */}
          <View style={styles.trustRow}>
            <View style={styles.shieldWrapper}>
              <ShieldCheckIcon size={15} />
            </View>
            <Text style={styles.trustTitle}>{t.refundPolicy}</Text>
          </View>

          {/* Row 2: Secure payments powered by + Exact Razorpay logo */}
          <View style={styles.paymentPoweredRow}>
            <View style={styles.trustRow}>
              <View style={styles.shieldWrapper}>
                <ShieldCheckIcon size={15} />
              </View>
              <Text style={styles.trustSub}>{t.securePayments}</Text>
            </View>

            {/* Exact two-tone Razorpay emblem + text */}
            <View style={styles.razorpayLogoBox}>
              <RazorpayLogo showText={true} width={78} height={16} />
            </View>
          </View>
        </View>
      </View>

      {/* Info Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.prizeDistributionModalTitle}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalBody}>
              {t.prizeDistributionModalBody}
            </Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>{t.understood}</Text>
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
  twoColumnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#EEF2F6',
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1
  },
  leftCol: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8
  },
  playIconSquare: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: '#E6F7F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  darkTealCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007A78',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftColText: {
    flex: 1
  },
  prizeQuestionTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0A192F',
    lineHeight: 14
  },
  prizeQuestionSub: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2
  },
  verticalDivider: {
    width: 1,
    height: 48,
    backgroundColor: '#EEF2F6',
    marginHorizontal: 4
  },
  rightCol: {
    flex: 1.2,
    paddingLeft: 6,
    justifyContent: 'center'
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  shieldWrapper: {
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  trustTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0A192F'
  },
  paymentPoweredRow: {
    marginTop: 6
  },
  trustSub: {
    fontSize: 9,
    color: '#475569',
    fontWeight: '600'
  },
  razorpayLogoBox: {
    marginLeft: 21,
    marginTop: 3,
    alignItems: 'flex-start'
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
    marginBottom: 12
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A192F'
  },
  modalBody: {
    fontSize: 12,
    lineHeight: 18,
    color: '#334155',
    marginBottom: 16
  },
  closeBtn: {
    backgroundColor: '#007A78',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12
  }
});
