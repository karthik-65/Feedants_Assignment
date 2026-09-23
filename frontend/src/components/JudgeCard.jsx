import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

const defaultTraditionalAvatar = require('../../assets/judge_traditional_girl.jpg');

export default function JudgeCard({ judge, onOpenVideo }) {
  const { language, t } = useLanguage();

  const name = language === 'hi' ? t.judgeName : (judge?.name || 'Manju Dubey');
  const role = language === 'hi' ? t.judgeRole : (judge?.role || 'Professional Kathak Dancer');
  const experience = language === 'hi' ? t.judgeExp : (judge?.experience || '12+ Years of Experience');
  const avatarSource = defaultTraditionalAvatar;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.contentRow}>
        {/* Judge Avatar */}
        <Image
          source={avatarSource}
          style={styles.avatar}
          resizeMode="cover"
        />

        {/* Info Column */}
        <View style={styles.infoCol}>
          <Text style={styles.judgeLabel}>{t.judgeLabel}</Text>
          <Text style={styles.judgeName}>{name}</Text>
          <Text style={styles.judgeRole}>{role}</Text>
          <Text style={styles.expText}>{experience}</Text>
        </View>

        {/* Intro Video Button */}
        <TouchableOpacity style={styles.videoButton} onPress={onOpenVideo} activeOpacity={0.8}>
          <View style={styles.playCircle}>
            <FontAwesome5 name="play" size={12} color="#007A78" style={{ marginLeft: 3 }} />
          </View>
          <Text style={styles.videoButtonText}>{t.introVideo}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#EEF2F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29
  },
  infoCol: {
    flex: 1,
    marginLeft: 14
  },
  judgeLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 1
  },
  judgeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A192F'
  },
  judgeRole: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2
  },
  expText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  videoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8
  },
  playCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E6F7F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  videoButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B'
  }
});
