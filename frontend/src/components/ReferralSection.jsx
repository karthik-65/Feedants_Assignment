import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import MegaphoneIcon from './MegaphoneIcon';

export default function ReferralSection({ referralInfo }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const link = 'https://feedants.com/r/referral123';

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mintCard}>
        {/* Exact mint megaphone icon from user image */}
        <View style={styles.megaphoneContainer}>
          <MegaphoneIcon size={34} />
        </View>

        {/* Center Content */}
        <View style={styles.centerContent}>
          <Text style={styles.title}>{t.referEarnTitle}</Text>

          {/* Link + Copy Button Row */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkText} numberOfLines={1}>
              {link}
            </Text>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.7}>
              <Text style={styles.copyBtnText}>{copied ? t.copied : t.copyLink}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right CTA */}
        <View style={styles.rightContent}>
          <TouchableOpacity style={styles.referNowBtn} onPress={handleCopy} activeOpacity={0.8}>
            <Text style={styles.referNowBtnText}>{t.referNow}</Text>
          </TouchableOpacity>
          <Text style={styles.earnSubtext}>
            {t.earnSub(10)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12
  },
  mintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7F5', // Soft exact mint green
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#B2DFDB'
  },
  megaphoneContainer: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  centerContent: {
    flex: 1.5,
    paddingRight: 6
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0A192F',
    marginBottom: 6
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B2DFDB',
    paddingLeft: 8,
    paddingRight: 2,
    paddingVertical: 2
  },
  linkText: {
    flex: 1,
    fontSize: 10,
    color: '#007A78',
    fontWeight: '600'
  },
  copyBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  copyBtnText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0A192F'
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6
  },
  referNowBtn: {
    backgroundColor: '#005C53',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 4
  },
  referNowBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  earnSubtext: {
    fontSize: 8.5,
    color: '#007A78',
    fontWeight: '500',
    textAlign: 'center'
  },
  earnBold: {
    fontWeight: '800'
  }
});
