import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

export default function PreviousWinners({ winners, onWinnerPress }) {
  const { language, t } = useLanguage();

  const defaultWinners = [
    {
      name: 'Riya Shah',
      rank: '1st Winner',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200'
    },
    {
      name: 'Aarav Mehta',
      rank: '1st Winner',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200'
    },
    {
      name: 'Neha Verma',
      rank: '2nd Winner',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200'
    },
    {
      name: 'Ishita Ch...',
      rank: '3rd Winner',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200'
    }
  ];

  const list = winners && winners.length > 0 ? winners : defaultWinners;

  const getTranslatedRank = (rank) => {
    if (language !== 'hi') return rank;
    if (rank.includes('1st')) return t.ranks.first;
    if (rank.includes('2nd')) return t.ranks.second;
    if (rank.includes('3rd')) return t.ranks.third;
    if (rank.includes('4th')) return t.ranks.fourth;
    if (rank.includes('5th')) return t.ranks.fifth;
    if (rank.includes('6th')) return t.ranks.sixth;
    return rank;
  };

  return (
    <View style={styles.cardContainer}>
      {/* Title inside the card */}
      <Text style={styles.cardTitle}>{t.previousWinners}</Text>

      {/* Horizontal Scroll of Winners */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {list.map((winner, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.winnerCard}
              activeOpacity={0.8}
              onPress={onWinnerPress || (() => {})}
            >
              {/* Thumbnail with overlay play icon */}
              <View style={styles.thumbnailWrapper}>
                <Image
                  source={{ uri: winner.avatarUrl }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                {/* Play icon overlay at bottom-right */}
                <View style={styles.playOverlay}>
                  <FontAwesome5 name="play" size={7} color="#FFFFFF" style={{ marginLeft: 1 }} />
                </View>
              </View>

              {/* Text Info */}
              <View style={styles.textContainer}>
                <Text style={styles.winnerName} numberOfLines={1}>
                  {winner.name}
                </Text>
                <Text style={styles.winnerRank}>
                  {getTranslatedRank(winner.rank)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A192F',
    marginBottom: 10
  },
  scrollContainer: {
    gap: 10
  },
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    padding: 5,
    paddingRight: 8
  },
  thumbnailWrapper: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#1E293B'
  },
  thumbnail: {
    width: '100%',
    height: '100%'
  },
  playOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#007A78',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF'
  },
  textContainer: {
    marginLeft: 7,
    justifyContent: 'center'
  },
  winnerName: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0A192F',
    marginBottom: 1
  },
  winnerRank: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#007A78'
  }
});
