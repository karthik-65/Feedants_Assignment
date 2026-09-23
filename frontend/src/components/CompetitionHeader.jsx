import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

export default function CompetitionHeader({ competition, onDeveloperGesture }) {
  const { t, language } = useLanguage();
  const currentStatus = competition?.computedStatus || competition?.status || 'REGISTRATION_OPEN';
  const isRegistered = competition?.userState?.isRegistered;
  const isFull = competition?.spotsLeft === 0;

  const totalSpots = competition?.totalSpots || 20;
  const bookedSpots = competition?.bookedSpots || 0;
  const spotsLeft = competition?.spotsLeft !== undefined ? competition.spotsLeft : Math.max(0, totalSpots - bookedSpots);
  const progressRatio = Math.min(1, Math.max(0, bookedSpots / totalSpots));

  return (
    <View style={styles.cardContainer}>
      {/* Title & Status Badge Row (Long-press title triggers Reviewer Dock) */}
      <View style={styles.titleRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          onLongPress={onDeveloperGesture}
          delayLongPress={500}
          style={{ flex: 1, marginRight: 8 }}
        >
          <Text style={styles.title}>{t.competitionTitle || competition?.title || 'Feedants Classical Dance'}</Text>
        </TouchableOpacity>

        {currentStatus === 'COMPLETED' ? (
          <View style={[styles.registeredBadge, styles.completedBadge]}>
            <Feather name="award" size={13} color="#D97706" />
            <Text style={[styles.registeredText, styles.completedText]}>
              {language === 'hi' ? 'परिणाम घोषित' : 'Results Declared'}
            </Text>
          </View>
        ) : currentStatus === 'UNDER_REVIEW' ? (
          <View style={[styles.registeredBadge, styles.reviewBadge]}>
            <Feather name="clock" size={13} color="#7C3AED" />
            <Text style={[styles.registeredText, styles.reviewText]}>
              {language === 'hi' ? 'निर्णय मोड' : 'Judging Mode'}
            </Text>
          </View>
        ) : currentStatus === 'SUBMISSION_OPEN' ? (
          <View style={[styles.registeredBadge, styles.submissionBadge]}>
            <Feather name="upload-cloud" size={13} color="#0D9488" />
            <Text style={[styles.registeredText, styles.submissionText]}>
              {isRegistered
                ? (language === 'hi' ? 'प्रस्तुति खुली' : 'Submissions Open')
                : (language === 'hi' ? 'पंजीकरण बंद' : 'Submissions Mode')}
            </Text>
          </View>
        ) : isFull ? (
          <View style={[styles.registeredBadge, styles.fullBadge]}>
            <Text style={[styles.registeredText, styles.fullText]}>{t.housefull}</Text>
          </View>
        ) : isRegistered ? (
          <View style={styles.registeredBadge}>
            <Feather name="check-circle" size={13} color="#007A78" />
            <Text style={styles.registeredText}>{t.registeredBadge}</Text>
          </View>
        ) : (
          <View style={[styles.registeredBadge, styles.openBadge]}>
            <Text style={[styles.registeredText, styles.openText]}>{t.registerNowBadge}</Text>
          </View>
        )}
      </View>

      {/* Tags Row */}
      <View style={styles.tagsRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{t.tagDance}</Text>
        </View>

        <View style={styles.tag}>
          <Text style={styles.tagText}>{t.tagMultiWin}</Text>
        </View>

        <View style={styles.certificateTag}>
          <MaterialCommunityIcons name="trophy-outline" size={14} color="#007A78" style={{ marginRight: 4 }} />
          <Text style={styles.certificateTagText}>
            {t.tagCertificate}
          </Text>
        </View>
      </View>

      {/* Metrics Row: Prize Pool, Entry Fee, Spots Left */}
      <View style={styles.metricsRow}>
        {/* Prize Pool */}
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>{t.prizePool}</Text>
          <Text style={styles.prizePoolValue}>
            ₹ {competition?.prizePool?.toLocaleString('en-IN') || '1,500'}
          </Text>
        </View>

        {/* Entry Fee */}
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>{t.entryFee}</Text>
          <Text style={styles.entryFeeValue}>
            ₹ {competition?.entryFee || '99'}
          </Text>
        </View>

        {/* Spots Left Column */}
        <View style={styles.spotsCol}>
          <View style={styles.spotsHeader}>
            <MaterialCommunityIcons name="account-group-outline" size={15} color="#007A78" style={{ marginRight: 4 }} />
            <Text style={styles.spotsLeftText}>
              {t.spotsLeftText(spotsLeft)}
            </Text>
          </View>

          {/* Thin Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.max(5, progressRatio * 100)}%` }
              ]}
            />
          </View>

          <Text style={styles.bookedText}>
            {t.spotsBookedText(bookedSpots, totalSpots)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#EEF2F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0A192F',
    flex: 1,
    letterSpacing: -0.3
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1', // Clean mint teal pill
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 16,
    gap: 4
  },
  registeredText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#007A78'
  },
  fullBadge: {
    backgroundColor: '#FEE2E2'
  },
  fullText: {
    color: '#DC2626'
  },
  openBadge: {
    backgroundColor: '#E0F2FE'
  },
  openText: {
    color: '#0284C7'
  },
  completedBadge: {
    backgroundColor: '#FEF3C7'
  },
  completedText: {
    color: '#D97706'
  },
  reviewBadge: {
    backgroundColor: '#EDE9FE'
  },
  reviewText: {
    color: '#7C3AED'
  },
  submissionBadge: {
    backgroundColor: '#CCFBF1'
  },
  submissionText: {
    color: '#0D9488'
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16
  },
  tag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569'
  },
  certificateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3
  },
  certificateTagText: {
    fontSize: 11,
    color: '#007A78',
    fontWeight: '700'
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 4
  },
  metricCol: {
    alignItems: 'flex-start',
    marginRight: 10
  },
  spotsCol: {
    flex: 1.3,
    alignItems: 'flex-end'
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 2
  },
  prizePoolValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#007A78', // Bold prominent teal
    letterSpacing: -0.5
  },
  entryFeeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0A192F', // Bold dark navy/black
    letterSpacing: -0.5
  },
  spotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  spotsLeftText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#007A78'
  },
  progressBarTrack: {
    width: '100%',
    height: 4.5,
    backgroundColor: '#EEF2F6',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 3
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#20B2AA', // Teal progress fill
    borderRadius: 3
  },
  bookedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1
  }
});
