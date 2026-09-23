import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { UserProvider, useUser } from './src/context/UserContext';
import { competitionApi } from './src/api/competitionApi';

// Components
import Header from './src/components/Header';
import CompetitionHeader from './src/components/CompetitionHeader';
import JudgeCard from './src/components/JudgeCard';
import CountdownTimer from './src/components/CountdownTimer';
import ImportantDates from './src/components/ImportantDates';
import PreviousWinners from './src/components/PreviousWinners';
import ContentTabs from './src/components/ContentTabs';
import RewardsSection from './src/components/RewardsSection';
import TrustAndPaymentSection from './src/components/TrustAndPaymentSection';
import ReferralSection from './src/components/ReferralSection';
import ReviewsSection from './src/components/ReviewsSection';
import StickyBottomBar from './src/components/StickyBottomBar';
import BottomNavBar from './src/components/BottomNavBar';
import DemoControlPanel from './src/components/DemoControlPanel';

// Modals
import RegistrationModal from './src/components/RegistrationModal';
import SubmissionModal from './src/components/SubmissionModal';
import VideoModal from './src/components/VideoModal';

function CompetitionScreen() {
  const { currentUser } = useUser();
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Modals state
  const [showRegModal, setShowRegModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showReviewerDock, setShowReviewerDock] = useState(false);
  const [activeVideoData, setActiveVideoData] = useState(null);

  const fetchCompetition = useCallback(async (targetUserId) => {
    try {
      const activeId = targetUserId !== undefined ? targetUserId : currentUser?._id;
      const data = await competitionApi.getFeaturedCompetition(activeId);
      setCompetition(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Unable to connect to backend server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCompetition();
  }, [fetchCompetition]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCompetition();
  };

  const handleRegisterSuccess = async (paymentMethod) => {
    if (!competition?._id || !currentUser?._id) return;
    await competitionApi.register(competition._id, currentUser._id, paymentMethod);
    await fetchCompetition();
  };

  const handleSubmitSuccess = async (payload) => {
    if (!competition?._id || !currentUser?._id) return;
    await competitionApi.submitEntry(competition._id, {
      ...payload,
      userId: currentUser._id
    });
    await fetchCompetition();
  };

  const handleOpenJudgeVideo = () => {
    setActiveVideoData({
      title: `Judge Introduction: ${competition?.judge?.name || 'Manju Dubey'}`,
      subtitle: `${competition?.judge?.name || 'Manju Dubey'} (${competition?.judge?.role || 'Kathak Dancer'})`,
      videoUrl: competition?.judge?.introVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      notes: '"Best of luck to all participants! Focus on rhythm (Laya) and honest emotional expression (Bhava)."'
    });
    setShowVideoModal(true);
  };

  const handleOpenWinnerVideo = (winner) => {
    setActiveVideoData({
      title: `${winner.name} - Winning Performance`,
      subtitle: `${winner.rank} • Feedants Classical Dance 2025`,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      notes: `Watch ${winner.name}'s prize-winning Kathak performance.`
    });
    setShowVideoModal(true);
  };

  return (
    <View style={styles.appShell}>
      {/* Centered Mobile Device Frame for Web */}
      <View style={styles.phoneFrame}>
        {/* Screen Header (Go Back & Language Pill) */}
        <Header onDeveloperGesture={() => setShowReviewerDock(prev => !prev)} />

        {/* Main Content Area */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007A78" />
            <Text style={styles.loadingText}>Loading competition details...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={32} color="#DC2626" />
            <Text style={styles.errorTitle}>Connection Notice</Text>
            <Text style={styles.errorSub}>{error}</Text>
          </View>
        ) : (
          <View style={styles.contentWrapper}>
            <ScrollView
              style={styles.scrollArea}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007A78']} />
              }
            >
              {/* Competition Header: Title, Registered Badge, Tags, Prize Pool, Entry Fee, Spots Left */}
              <CompetitionHeader
                competition={competition}
                onDeveloperGesture={() => setShowReviewerDock(prev => !prev)}
              />

              {/* Judge Profile Card */}
              <JudgeCard
                judge={competition?.judge}
                onOpenVideo={handleOpenJudgeVideo}
              />

              {/* Live Real-time Countdown Timer */}
              <CountdownTimer
                targetDate={competition?.targetCountdownDate}
                initialTimeLeftMs={competition?.timeLeftMs}
                label={competition?.countdownLabel}
              />

              {/* Important Dates in a Card */}
              <ImportantDates competition={competition} />

              {/* Previous Winners in a Card */}
              <PreviousWinners
                winners={competition?.previousWinners}
                onWinnerPress={handleOpenWinnerVideo}
              />

              {/* Expandable Content 3 Tabs in a Card */}
              <ContentTabs tabContent={competition?.tabContent} />

              {/* Rewards Breakdown & Disclaimer */}
              <RewardsSection
                rewards={competition?.rewards}
                disclaimer={competition?.disclaimer}
              />

              {/* Trust, Guarantee & Razorpay Badges */}
              <TrustAndPaymentSection />

              {/* Referral & Discount Box */}
              <ReferralSection referralInfo={competition?.referralInfo} />

              {/* Hear From Our Users */}
              <ReviewsSection />

              {/* Spacer before sticky bottom bar */}
              <View style={{ height: 10 }} />
            </ScrollView>

            {/* Dynamic Sticky Bottom Action Bar with "Ad Here" */}
            <StickyBottomBar
              competition={competition}
              onRegisterPress={() => setShowRegModal(true)}
              onSubmitPress={() => setShowSubModal(true)}
              onViewSubmissionPress={() => setShowSubModal(true)}
            />

            {/* App Bottom Navigation Bar (Home, Explore, +, Competitions, Profile) */}
            <BottomNavBar activeTab="competitions" />
          </View>
        )}

        {/* Modals (strictly constrained inside phone frame) */}
        <RegistrationModal
          visible={showRegModal}
          onClose={() => setShowRegModal(false)}
          competition={competition}
          currentUser={currentUser}
          onRegisterSuccess={handleRegisterSuccess}
        />

        <SubmissionModal
          visible={showSubModal}
          onClose={() => setShowSubModal(false)}
          competition={competition}
          currentUser={currentUser}
          onSubmitSuccess={handleSubmitSuccess}
        />

        {/* Real Playable Video Modal */}
        <VideoModal
          visible={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          videoData={activeVideoData}
          judge={competition?.judge}
        />

        {/* Clean In-App Reviewer Dock (Floating trigger pill + slide-up sheet) */}
        <DemoControlPanel
          competition={competition}
          onStateChanged={fetchCompetition}
          visible={showReviewerDock}
          onOpen={() => setShowReviewerDock(true)}
          onClose={() => setShowReviewerDock(false)}
        />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <CompetitionScreen />
        </SafeAreaView>
      </UserProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  appShell: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    backgroundColor: '#0F172A',
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
      paddingVertical: 20,
      paddingHorizontal: 20
    })
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 412,
    height: Platform.OS === 'web' ? 880 : '100%',
    maxHeight: '98vh',
    backgroundColor: '#FFFFFF',
    borderRadius: Platform.OS === 'web' ? 32 : 0,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'web' ? 6 : 0,
    borderColor: '#1E293B',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 16,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  contentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600'
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10
  },
  errorSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4
  }
});
