import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNavBar({ activeTab = 'competitions' }) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      {/* 1: Home */}
      <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
        <Feather name="home" size={18} color="#94A3B8" />
        <Text style={styles.navLabel}>{t.nav.home}</Text>
      </TouchableOpacity>

      {/* 2: Explore */}
      <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
        <Feather name="search" size={18} color="#94A3B8" />
        <Text style={styles.navLabel}>{t.nav.explore}</Text>
      </TouchableOpacity>

      {/* 3: Center + Circle Button */}
      <TouchableOpacity style={styles.centerButton} activeOpacity={0.8}>
        <View style={styles.tealCircle}>
          <Feather name="plus" size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* 4: Competitions (Active) */}
      <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
        <MaterialCommunityIcons name="trophy" size={20} color="#007A78" />
        <Text style={[styles.navLabel, styles.activeNavLabel]}>{t.nav.competitions}</Text>
      </TouchableOpacity>

      {/* 5: Profile */}
      <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }}
          style={styles.profileAvatar}
        />
        <Text style={styles.navLabel}>{t.nav.profile}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingBottom: 4
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  navLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 3
  },
  activeNavLabel: {
    color: '#007A78',
    fontWeight: '800'
  },
  centerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  tealCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#007A78',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007A78',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3
  },
  profileAvatar: {
    width: 19,
    height: 19,
    borderRadius: 9.5,
    borderWidth: 1,
    borderColor: '#94A3B8'
  }
});
