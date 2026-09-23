import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

export default function RewardsSection({ rewards, disclaimer }) {
  const { language, t } = useLanguage();

  const defaultRewards = [
    { rank: 1, title: '1st Winner', amount: 550, icon: 'trophy' },
    { rank: 2, title: '2nd Winner', amount: 300, icon: 'medal-silver' },
    { rank: 3, title: '3rd Winner', amount: 240, icon: 'medal-bronze' },
    { rank: 4, title: '4th Winner', amount: 200, icon: 'star' },
    { rank: 5, title: '5th Winner', amount: 130, icon: 'star' },
    { rank: 6, title: '6th Winner', amount: 80, icon: 'star' }
  ];

  const rewardList = rewards && rewards.length > 0 ? rewards : defaultRewards;

  const getTranslatedRank = (rankTitle) => {
    if (language !== 'hi') return rankTitle;
    if (rankTitle.includes('1st')) return t.ranks.first;
    if (rankTitle.includes('2nd')) return t.ranks.second;
    if (rankTitle.includes('3rd')) return t.ranks.third;
    if (rankTitle.includes('4th')) return t.ranks.fourth;
    if (rankTitle.includes('5th')) return t.ranks.fifth;
    if (rankTitle.includes('6th')) return t.ranks.sixth;
    return rankTitle;
  };

  return (
    <View style={styles.container}>
      {/* Title with (All Positions) */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{t.rewardsTitle}</Text>
        <Text style={styles.subTitle}>{t.allPositions}</Text>
      </View>

      {/* Rewards Card */}
      <View style={styles.rewardsCard}>
        {rewardList.map((item, idx) => {
          return (
            <View
              key={idx}
              style={[
                styles.rewardRow,
                idx !== rewardList.length - 1 && styles.rowBorder
              ]}
            >
              <View style={styles.leftRow}>
                {idx === 0 ? (
                  <FontAwesome5 name="trophy" size={14} color="#F59E0B" style={styles.starIcon} />
                ) : idx === 1 ? (
                  <FontAwesome5 name="medal" size={14} color="#94A3B8" style={styles.starIcon} />
                ) : idx === 2 ? (
                  <FontAwesome5 name="medal" size={14} color="#D97706" style={styles.starIcon} />
                ) : (
                  <Feather name="star" size={15} color="#007A78" style={styles.starIcon} />
                )}

                <Text style={styles.rewardRankTitle}>
                  {getTranslatedRank(item.title)}
                </Text>
              </View>

              <Text style={styles.rewardAmount}>
                ₹ {item.amount}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Mint Disclaimer Banner */}
      <View style={styles.disclaimerBanner}>
        <Feather name="info" size={13} color="#007A78" style={{ marginRight: 6, marginTop: 1 }} />
        <Text style={styles.disclaimerText}>
          <Text style={styles.disclaimerBold}>{t.disclaimerPrefix}</Text>
          {disclaimer || t.disclaimerText.replace('Disclaimer: ', '').replace('अस्वीकरण: ', '')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A192F'
  },
  subTitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500'
  },
  rewardsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#EEF2F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC'
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  starIcon: {
    marginRight: 12,
    width: 20,
    textAlign: 'center'
  },
  rewardRankTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0A192F'
  },
  rewardAmount: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#007A78' // Bold teal
  },
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E6F7F5', // Soft mint background
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B2DFDB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10
  },
  disclaimerText: {
    fontSize: 10.5,
    color: '#005C53',
    lineHeight: 15,
    flex: 1
  },
  disclaimerBold: {
    fontWeight: '800',
    color: '#007A78'
  }
});
