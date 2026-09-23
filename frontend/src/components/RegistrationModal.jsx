import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

export default function RegistrationModal({ visible, onClose, competition, currentUser, onRegisterSuccess }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('upi');

  const handlePay = async () => {
    try {
      setLoading(true);
      setError(null);
      await onRegisterSuccess(selectedMethod);
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.modalSheet}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t.confirmRegistration}</Text>
          <TouchableOpacity onPress={onClose} disabled={loading}>
            <Feather name="x" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

          {/* User & Competition Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t.participant}</Text>
              <Text style={styles.infoVal}>{currentUser?.name || 'Participant'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t.email}</Text>
              <Text style={styles.infoVal}>{currentUser?.email || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t.competitionLabel}</Text>
              <Text style={styles.infoVal}>{t.competitionTitle || competition?.title}</Text>
            </View>
            <View style={[styles.infoRow, styles.priceRow]}>
              <Text style={styles.priceLabel}>{t.entryFee}:</Text>
              <Text style={styles.priceVal}>₹ {competition?.entryFee || 99}</Text>
            </View>
          </View>

          {/* Payment Method Selector */}
          <Text style={styles.methodHeader}>{t.selectPaymentMethod}</Text>

          <TouchableOpacity
            style={[styles.methodOption, selectedMethod === 'upi' && styles.methodOptionActive]}
            onPress={() => setSelectedMethod('upi')}
          >
            <FontAwesome5 name="mobile-alt" size={16} color={selectedMethod === 'upi' ? '#0F766E' : '#64748B'} />
            <Text style={[styles.methodText, selectedMethod === 'upi' && styles.methodTextActive]}>
              {t.instantUpi}
            </Text>
            {selectedMethod === 'upi' && <Feather name="check" size={16} color="#0F766E" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.methodOption, selectedMethod === 'card' && styles.methodOptionActive]}
            onPress={() => setSelectedMethod('card')}
          >
            <Feather name="credit-card" size={16} color={selectedMethod === 'card' ? '#0F766E' : '#64748B'} />
            <Text style={[styles.methodText, selectedMethod === 'card' && styles.methodTextActive]}>
              {t.cardPayment}
            </Text>
            {selectedMethod === 'card' && <Feather name="check" size={16} color="#0F766E" />}
          </TouchableOpacity>

          {/* Error display */}
          {error && (
            <View style={styles.errorBox}>
              <Feather name="alert-triangle" size={14} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={handlePay}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.payButtonText}>
                {t.payAndRegister(competition?.entryFee || 99)}
              </Text>
            )}
          </TouchableOpacity>

          {/* Guarantee */}
          <View style={styles.trustFooter}>
            <MaterialIcons name="security" size={13} color="#0D9488" />
            <Text style={styles.trustText}>{t.razorpaySecurityText}</Text>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 999
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  modalSheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B'
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B'
  },
  priceRow: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    marginTop: 4,
    marginBottom: 0
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },
  priceVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F766E'
  },
  methodHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8
  },
  methodOptionActive: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA'
  },
  methodText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    marginLeft: 10
  },
  methodTextActive: {
    color: '#0F766E',
    fontWeight: '700'
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10
  },
  errorText: {
    fontSize: 11.5,
    color: '#DC2626',
    flex: 1,
    fontWeight: '600'
  },
  payButton: {
    backgroundColor: '#0F766E',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  payButtonDisabled: {
    opacity: 0.7
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800'
  },
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12
  },
  trustText: {
    fontSize: 10.5,
    color: '#0F766E'
  }
});
