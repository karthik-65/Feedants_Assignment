import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

export default function Header({ onBack, onDeveloperGesture }) {
  const { language, toggleLanguage, t } = useLanguage();
  const tapCountRef = React.useRef(0);
  const lastTapRef = React.useRef(0);

  const handleBackPress = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 450) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapRef.current = now;

    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      if (onDeveloperGesture) {
        onDeveloperGesture();
      }
      return;
    }

    if (onBack) {
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button: Arrow + "Go back" (Triple-tap triggers Reviewer Dock) */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress} activeOpacity={0.7}>
        <Feather name="arrow-left" size={21} color="#0B192C" style={styles.arrowIcon} />
        <Text style={styles.backText}>{t.goBack}</Text>
      </TouchableOpacity>

      {/* Language Toggle Pill: [ ENG | हिंदी ] */}
      <View style={styles.langPillWrapper}>
        <TouchableOpacity
          style={[styles.langOption, language === 'en' && styles.langOptionActive]}
          onPress={() => toggleLanguage('en')}
          activeOpacity={0.8}
        >
          <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>
            ENG
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.langOption, language === 'hi' && styles.langOptionActive]}
          onPress={() => toggleLanguage('hi')}
          activeOpacity={0.8}
        >
          <Text style={[styles.langText, language === 'hi' && styles.langTextActive]}>
            हिंदी
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4
  },
  arrowIcon: {
    strokeWidth: 2.2
  },
  backText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B192C',
    letterSpacing: -0.2
  },
  langPillWrapper: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 2,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    overflow: 'hidden'
  },
  langOption: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 18
  },
  langOptionActive: {
    backgroundColor: '#005F73', // Exact rich deep teal from design
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B'
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  }
});
