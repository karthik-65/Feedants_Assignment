import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

export default function CountdownTimer({ targetDate, initialTimeLeftMs, label }) {
  const { language, t } = useLanguage();

  const [timeLeft, setTimeLeft] = useState(() => {
    if (initialTimeLeftMs !== undefined && initialTimeLeftMs !== null) {
      return initialTimeLeftMs;
    }
    if (targetDate) {
      return Math.max(0, new Date(targetDate).getTime() - Date.now());
    }
    return (1 * 86400 + 6 * 3600 + 28 * 60 + 32) * 1000;
  });

  useEffect(() => {
    if (targetDate) {
      const calc = Math.max(0, new Date(targetDate).getTime() - Date.now());
      setTimeLeft(calc);
    } else {
      setTimeLeft(0);
    }
  }, [targetDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, '0');

  let displayLabel = label || t.regClosesIn;
  if (label === 'Competition Ended') {
    displayLabel = language === 'hi' ? 'प्रतियोगिता समाप्त' : 'Competition Ended';
  } else if (label === 'Results announcement in') {
    displayLabel = language === 'hi' ? 'परिणाम घोषणा में' : 'Results announcement in';
  } else if (label === 'Submission closes in') {
    displayLabel = language === 'hi' ? 'प्रस्तुति समाप्त होने में' : 'Submission closes in';
  } else if (label === 'Submission starts in') {
    displayLabel = language === 'hi' ? 'प्रस्तुति शुरू होने में' : 'Submission starts in';
  } else if (language === 'hi') {
    displayLabel = t.regClosesIn;
  }

  const isCompleted = !targetDate || label === 'Competition Ended' || timeLeft === 0;
  const isEvaluating = label === 'Results announcement in';

  return (
    <View style={styles.container}>
      {/* Left: Hourglass + Label */}
      <View style={styles.leftRow}>
        <MaterialCommunityIcons name="timer-sand" size={15} color="#007A78" style={styles.iconStyle} />
        <Text style={styles.labelText}>{displayLabel}</Text>
      </View>

      {/* Center: Live Digits with generous natural gap */}
      <View style={styles.centerBox}>
        <Text style={styles.digitsText}>
          {pad(days)}d : {pad(hours)}h : {pad(minutes)}m : {pad(seconds)}s
        </Text>
      </View>

      {/* Right: Dynamic Badge */}
      {isCompleted ? (
        <View style={[styles.hurryUpBadge, { backgroundColor: '#FEF3C7' }]}>
          <Feather name="award" size={13} color="#D97706" style={styles.iconStyle} />
          <Text style={[styles.hurryUpText, { color: '#B45309' }]}>
            {language === 'hi' ? 'समाप्त' : 'Concluded'}
          </Text>
        </View>
      ) : isEvaluating ? (
        <View style={[styles.hurryUpBadge, { backgroundColor: '#EDE9FE' }]}>
          <Feather name="clock" size={13} color="#7C3AED" style={styles.iconStyle} />
          <Text style={[styles.hurryUpText, { color: '#6D28D9' }]}>
            {language === 'hi' ? 'समीक्षा' : 'Evaluating'}
          </Text>
        </View>
      ) : (
        <View style={styles.hurryUpBadge}>
          <Feather name="clock" size={13} color="#007A78" style={styles.iconStyle} />
          <Text style={styles.hurryUpText}>{t.hurryUp}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#E6F7F5', // Soft exact mint background
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Maximizes equal space and gap between all 3 sections
    borderWidth: 1,
    borderColor: '#B2DFDB'
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconStyle: {
    marginRight: 4
  },
  labelText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0A192F'
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  digitsText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#005C53',
    letterSpacing: 0.2
  },
  hurryUpBadge: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  hurryUpText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#007A78'
  }
});
