import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

export default function StickyBottomBar({ competition, onRegisterPress, onSubmitPress, onViewSubmissionPress }) {
  const { t, language } = useLanguage();

  const isRegistered = competition?.userState?.isRegistered;
  const hasSubmitted = competition?.userState?.hasSubmitted;
  const isFull = competition?.spotsLeft === 0;
  const status = competition?.computedStatus || competition?.status || 'REGISTRATION_OPEN';

  let buttonText = t.registerCTA;
  let subText = `₹ ${competition?.entryFee || 99}`;
  let isDisabled = false;
  let onPress = onRegisterPress;
  let buttonColor = '#005C53'; // Exact rich dark teal

  // 1. Concluded / Results declared (for all users)
  if (status === 'COMPLETED') {
    buttonText = language === 'hi' ? 'परिणाम देखें' : 'View Results';
    subText = language === 'hi' ? 'प्रतियोगिता समाप्त हुई' : 'Competition Concluded';
    isDisabled = false;
    buttonColor = '#D97706'; // Trophy Amber
    onPress = onViewSubmissionPress;
  }
  // 2. Judging Mode (for all users)
  else if (status === 'UNDER_REVIEW') {
    buttonText = language === 'hi' ? 'निर्णय प्रगति पर है' : 'Judging in Progress';
    subText = language === 'hi' ? 'प्रस्तुतियाँ बंद हैं' : 'Submissions Closed';
    isDisabled = true;
    buttonColor = '#64748B'; // Muted Slate
  }
  // 3. User is already registered
  else if (isRegistered) {
    if (hasSubmitted) {
      buttonText = t.viewMySubmission;
      subText = t.entrySubmitted;
      onPress = onViewSubmissionPress;
      buttonColor = '#005C53';
    } else {
      buttonText = t.uploadSubmission;
      subText = t.registeredSub;
      onPress = onSubmitPress;
      buttonColor = '#005C53';
    }
  }
  // 4. User is NOT registered
  else {
    if (status === 'SUBMISSION_OPEN') {
      buttonText = language === 'hi' ? 'पंजीकरण बंद' : 'Registration Closed';
      subText = language === 'hi' ? 'प्रस्तुतियाँ प्रगति पर हैं' : 'Submissions In Progress';
      isDisabled = true;
      buttonColor = '#94A3B8';
    } else if (isFull) {
      buttonText = t.housefullCTA;
      subText = t.allSpotsBooked;
      isDisabled = true;
      buttonColor = '#94A3B8';
    } else if (status === 'REGISTRATION_CLOSED') {
      buttonText = t.regClosedCTA;
      subText = t.deadlinePassed;
      isDisabled = true;
      buttonColor = '#94A3B8';
    } else {
      // REGISTRATION_OPEN
      buttonText = t.registerCTA;
      subText = `₹ ${competition?.entryFee || 99}`;
      isDisabled = false;
      buttonColor = '#005C53';
      onPress = onRegisterPress;
    }
  }

  return (
    <View style={styles.container}>
      {/* "Ad Here" card banner matching screenshot */}
      <View style={styles.adCard}>
        <MaterialCommunityIcons name="bullhorn-outline" size={15} color="#94A3B8" style={{ marginRight: 6 }} />
        <Text style={styles.adText}>{t.adHere}</Text>
      </View>

      {/* Main Action Button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: buttonColor },
          isDisabled && styles.disabledButton
        ]}
        disabled={isDisabled}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Text style={styles.actionButtonText}>{buttonText}</Text>
        {subText ? <Text style={styles.subText}>{subText}</Text> : null}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 6
  },
  adCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 7,
    marginBottom: 8
  },
  adText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600'
  },
  actionButton: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#005C53',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0
  },
  actionButtonText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2
  },
  subText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B2DFDB',
    marginTop: 2
  }
});
