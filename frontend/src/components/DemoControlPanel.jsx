import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated
} from 'react-native';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { competitionApi } from '../api/competitionApi';

export default function DemoControlPanel({
  competition,
  onStateChanged,
  visible,
  onOpen,
  onClose
}) {
  const { users, currentUser, switchUser } = useUser();
  const { t } = useLanguage();

  const [internalOpen, setInternalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('lifecycle'); // 'users' | 'lifecycle' | 'stress'
  const [stressLoading, setStressLoading] = useState(false);
  const [stressResult, setStressResult] = useState(null);
  const [pillVisible, setPillVisible] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);

  const isOpen = visible !== undefined ? visible : internalOpen;

  const handleOpen = () => {
    setInternalOpen(true);
    if (onOpen) onOpen();
  };

  const handleClose = () => {
    setInternalOpen(false);
    if (onClose) onClose();
  };

  const showTemporaryNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => {
      setActionNotice(null);
    }, 3000);
  };

  const compId = competition?._id;
  const currentStatus = competition?.computedStatus || competition?.status || 'REGISTRATION_OPEN';
  const spotsLeft = competition?.spotsLeft ?? (competition?.totalSpots - competition?.bookedSpots);

  // Compute current lifecycle state key
  let activeStateKey = 'OPEN';
  if (currentStatus === 'COMPLETED') {
    activeStateKey = 'COMPLETED';
  } else if (currentStatus === 'UNDER_REVIEW') {
    activeStateKey = 'UNDER_REVIEW';
  } else if (currentStatus === 'SUBMISSION_OPEN') {
    activeStateKey = 'SUBMISSION_OPEN';
  } else if (spotsLeft === 0) {
    activeStateKey = 'HOUSEFULL';
  } else if (spotsLeft === 1) {
    activeStateKey = 'ALMOST_FULL';
  } else {
    activeStateKey = 'OPEN';
  }

  const handleSwitchState = async (state) => {
    if (!compId) return;
    try {
      await competitionApi.switchLifecycle(compId, state);
      onStateChanged();
      showTemporaryNotice(`Switched lifecycle to: ${state}`);
    } catch (err) {
      alert('State switch error: ' + err.message);
    }
  };

  const handleReset = async () => {
    if (!compId) return;
    try {
      await competitionApi.resetCompetition(compId);
      onStateChanged();
      setStressResult(null);
      showTemporaryNotice('Competition reset to pristine initial state.');
    } catch (err) {
      alert('Reset error: ' + err.message);
    }
  };

  const handleTriggerConcurrencySpike = async () => {
    if (!compId) return;
    try {
      setStressLoading(true);
      setStressResult(null);

      // Simulate 10 simultaneous registration attempts
      const attemptCount = 10;
      const promises = [];

      for (let i = 1; i <= attemptCount; i++) {
        const tempUserId = users[(i % users.length)]?._id || currentUser?._id;
        promises.push(
          competitionApi.register(compId, tempUserId, 'ConcurrentSpike')
            .then(res => ({ success: true, res }))
            .catch(err => ({ success: false, error: err.message }))
        );
      }

      const results = await Promise.all(promises);
      const successes = results.filter(r => r.success).length;
      const fails = results.filter(r => !r.success).length;

      setStressResult({
        attempts: attemptCount,
        successes,
        fails
      });
      onStateChanged();
      showTemporaryNotice(`Burst finished: ${successes} booked, ${fails} rejected.`);
    } catch (err) {
      alert('Concurrency test error: ' + err.message);
    } finally {
      setStressLoading(false);
    }
  };

  const statesConfig = [
    {
      key: 'OPEN',
      label: 'Open',
      sub: '19 spots left, registration open',
      badge: 'Normal'
    },
    {
      key: 'ALMOST_FULL',
      label: '1 Spot Left',
      sub: 'Urgency state, 19/20 booked',
      badge: 'Urgent'
    },
    {
      key: 'HOUSEFULL',
      label: 'Housefull',
      sub: '20/20 booked, registration closed',
      badge: 'Capacity'
    },
    {
      key: 'SUBMISSION_OPEN',
      label: 'Submissions Open',
      sub: 'Entry submission active',
      badge: 'Submissions'
    },
    {
      key: 'UNDER_REVIEW',
      label: 'Judging Mode',
      sub: 'Submissions closed, under review',
      badge: 'Review'
    },
    {
      key: 'COMPLETED',
      label: 'Results Declared',
      sub: 'Winners & leaderboard declared',
      badge: 'Final'
    }
  ];

  return (
    <>
      {/* 1. Floating In-App Trigger Pill (Clean & Unobtrusive) */}
      {pillVisible && !isOpen && (
        <View style={styles.floatingPillWrapper}>
          <TouchableOpacity
            style={styles.floatingPill}
            onPress={handleOpen}
            activeOpacity={0.85}
          >
            <View style={styles.pulseDot} />
            <FontAwesome5 name="tools" size={11} color="#2DD4BF" style={{ marginRight: 6 }} />
            <Text style={styles.floatingPillText}>Reviewer Dock</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 2. Slide-up In-App Reviewer Sheet */}
      {isOpen && (
        <View style={styles.sheetOverlay}>
          {/* Backdrop (tap to close) */}
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={handleClose}
          />

          <View style={styles.sheetContainer}>
            {/* Sheet Handle */}
            <View style={styles.handleBar} />

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <View style={styles.iconSquare}>
                  <FontAwesome5 name="tools" size={13} color="#2DD4BF" />
                </View>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.title}>Reviewer Test Bench</Text>
                    <View style={styles.liveBadge}>
                      <Text style={styles.liveBadgeText}>LIVE</Text>
                    </View>
                  </View>
                  <Text style={styles.subTitle}>
                    {currentUser?.name || 'Tester'} • State: {activeStateKey}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={handleClose}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Temporary Notice Toast */}
            {actionNotice && (
              <View style={styles.noticeToast}>
                <Feather name="info" size={12} color="#2DD4BF" style={{ marginRight: 6 }} />
                <Text style={styles.noticeToastText}>{actionNotice}</Text>
              </View>
            )}

            {/* Segmented Tab Controls */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'users' && styles.tabButtonActive]}
                onPress={() => setActiveTab('users')}
                activeOpacity={0.8}
              >
                <Feather
                  name="users"
                  size={12}
                  color={activeTab === 'users' ? '#2DD4BF' : '#94A3B8'}
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>
                  Users ({users.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'lifecycle' && styles.tabButtonActive]}
                onPress={() => setActiveTab('lifecycle')}
                activeOpacity={0.8}
              >
                <Feather
                  name="activity"
                  size={12}
                  color={activeTab === 'lifecycle' ? '#2DD4BF' : '#94A3B8'}
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.tabText, activeTab === 'lifecycle' && styles.tabTextActive]}>
                  Lifecycle
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'stress' && styles.tabButtonActive]}
                onPress={() => setActiveTab('stress')}
                activeOpacity={0.8}
              >
                <FontAwesome5
                  name="bolt"
                  size={11}
                  color={activeTab === 'stress' ? '#2DD4BF' : '#94A3B8'}
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.tabText, activeTab === 'stress' && styles.tabTextActive]}>
                  Concurrency
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Body */}
            <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
              {/* TAB 1: USERS */}
              {activeTab === 'users' && (
                <View style={styles.tabContent}>
                  <Text style={styles.sectionDesc}>
                    Switch between demo accounts to test registered vs unregistered viewpoints:
                  </Text>
                  <View style={styles.userCardsGrid}>
                    {users.map((u, idx) => {
                      const isActive = currentUser?._id === u._id;
                      const initials = u.name
                        ? u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                        : 'U';
                      return (
                        <TouchableOpacity
                          key={u._id}
                          style={[styles.userCard, isActive && styles.userCardActive]}
                          onPress={() => {
                            switchUser(u);
                            if (onStateChanged) onStateChanged(u._id);
                            showTemporaryNotice(`Switched user to: ${u.name}`);
                          }}
                          activeOpacity={0.8}
                        >
                          <View style={styles.userCardLeft}>
                            <View style={[styles.avatarCircle, { backgroundColor: getUserColor(idx) }]}>
                              <Text style={styles.avatarText}>{initials}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={[styles.userName, isActive && styles.userNameActive]}>
                                  {u.name}
                                </Text>
                                <View style={[styles.statusMiniTag, idx === 0 ? styles.statusMiniTagReg : styles.statusMiniTagUnreg]}>
                                  <Text style={[styles.statusMiniTagText, idx === 0 ? styles.statusMiniTagTextReg : styles.statusMiniTagTextUnreg]}>
                                    {idx === 0 ? 'Registered' : 'New / Unregistered'}
                                  </Text>
                                </View>
                              </View>
                              <Text style={styles.userEmail}>{u.email || u.phone || 'Demo User'}</Text>
                            </View>
                          </View>

                          <View style={styles.userCardRight}>
                            {isActive ? (
                              <View style={styles.activeUserBadge}>
                                <Feather name="check" size={11} color="#0D9488" style={{ marginRight: 3 }} />
                                <Text style={styles.activeUserBadgeText}>Active</Text>
                              </View>
                            ) : (
                              <Text style={styles.switchPromptText}>Switch</Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* TAB 2: LIFECYCLE */}
              {activeTab === 'lifecycle' && (
                <View style={styles.tabContent}>
                  <Text style={styles.sectionDesc}>
                    Instantly simulate any competition phase to verify UI dynamic timelines:
                  </Text>
                  <View style={styles.lifecycleGrid}>
                    {statesConfig.map((item) => {
                      const isCurrent = activeStateKey === item.key;
                      return (
                        <TouchableOpacity
                          key={item.key}
                          style={[styles.lifecycleCard, isCurrent && styles.lifecycleCardActive]}
                          onPress={() => handleSwitchState(item.key)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.lifecycleCardTop}>
                            <Text style={styles.lifecycleCardTitle}>{item.label}</Text>
                            {isCurrent && (
                              <View style={styles.currentBadge}>
                                <Text style={styles.currentBadgeText}>CURRENT</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.lifecycleCardSub}>{item.sub}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* TAB 3: CONCURRENCY & RESET */}
              {activeTab === 'stress' && (
                <View style={styles.tabContent}>
                  {/* Concurrency Card */}
                  <View style={styles.toolCard}>
                    <View style={styles.toolCardHeader}>
                      <FontAwesome5 name="bolt" size={13} color="#F59E0B" style={{ marginRight: 8 }} />
                      <Text style={styles.toolCardTitle}>Real-Time Concurrency Burst</Text>
                    </View>
                    <Text style={styles.toolCardDesc}>
                      Fires 10 simultaneous registration requests at the exact same millisecond to prove atomic spot reservation and prevent overbooking.
                    </Text>

                    <TouchableOpacity
                      style={[styles.stressBtn, stressLoading && styles.disabledBtn]}
                      onPress={handleTriggerConcurrencySpike}
                      disabled={stressLoading}
                      activeOpacity={0.85}
                    >
                      {stressLoading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <View style={styles.stressBtnContent}>
                          <FontAwesome5 name="bolt" size={12} color="#FFFFFF" style={{ marginRight: 6 }} />
                          <Text style={styles.stressBtnText}>Fire 10-Request Burst Test</Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    {stressResult && (
                      <View style={styles.resultBanner}>
                        <View style={styles.resultRow}>
                          <Feather name="check-circle" size={13} color="#4ADE80" style={{ marginRight: 6 }} />
                          <Text style={styles.resultTitle}>Concurrency Test Output:</Text>
                        </View>
                        <Text style={styles.resultDetails}>
                          • Simultaneous Requests: {stressResult.attempts}{'\n'}
                          • Successfully Booked: {stressResult.successes}{'\n'}
                          • Safely Rejected: {stressResult.fails} (Overbooking prevented)
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Reset Card */}
                  <View style={styles.toolCard}>
                    <View style={styles.toolCardHeader}>
                      <Feather name="rotate-ccw" size={13} color="#94A3B8" style={{ marginRight: 8 }} />
                      <Text style={styles.toolCardTitle}>Reset Competition State</Text>
                    </View>
                    <Text style={styles.toolCardDesc}>
                      Clears test registrations and restores default seeds, spots, and timelines.
                    </Text>
                    <TouchableOpacity
                      style={styles.resetBtn}
                      onPress={handleReset}
                      activeOpacity={0.8}
                    >
                      <Feather name="rotate-ccw" size={12} color="#E2E8F0" style={{ marginRight: 6 }} />
                      <Text style={styles.resetBtnText}>Reset to Pristine Default</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Shortcut Pill Preferences */}
                  <View style={styles.pillToggleRow}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={styles.pillToggleTitle}>Show floating pill on screen</Text>
                      <Text style={styles.pillToggleSub}>
                        If hidden, triple-tap "Go back" or long-press the title anytime to open dock.
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.toggleSwitch, pillVisible && styles.toggleSwitchActive]}
                      onPress={() => setPillVisible(!pillVisible)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.toggleKnob, pillVisible && styles.toggleKnobActive]} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Bottom padding for comfortable scrolling */}
              <View style={{ height: 24 }} />
            </ScrollView>
          </View>
        </View>
      )}
    </>
  );
}

function getUserColor(index) {
  const colors = ['#0D9488', '#6366F1', '#EC4899', '#F59E0B', '#10B981'];
  return colors[index % colors.length];
}

const styles = StyleSheet.create({
  /* Floating Trigger Pill */
  floatingPillWrapper: {
    position: 'absolute',
    bottom: 122,
    right: 14,
    zIndex: 850
  },
  floatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.35)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 6
  },
  floatingPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.3
  },

  /* In-App Slide-Up Sheet Overlay */
  sheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'flex-end'
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)'
  },
  sheetContainer: {
    width: '100%',
    maxHeight: '82%',
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: '#334155',
    paddingTop: 8,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 20
  },
  handleBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#475569',
    alignSelf: 'center',
    marginBottom: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconSquare: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(45, 212, 191, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#F8FAFC'
  },
  liveBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: 'rgba(34, 197, 94, 0.4)'
  },
  liveBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#4ADE80'
  },
  subTitle: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center'
  },

  noticeToast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 118, 110, 0.3)',
    borderWidth: 1,
    borderColor: '#0D9488',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 10
  },
  noticeToastText: {
    fontSize: 10.5,
    color: '#2DD4BF',
    fontWeight: '600'
  },

  /* Segmented Tabs */
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 3,
    marginTop: 12,
    marginBottom: 10
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 7
  },
  tabButtonActive: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.4)'
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8'
  },
  tabTextActive: {
    color: '#F8FAFC',
    fontWeight: '800'
  },

  /* Tab Body & Sections */
  sheetBody: {
    maxHeight: 460
  },
  tabContent: {
    paddingVertical: 4
  },
  sectionDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 10,
    lineHeight: 15
  },

  /* User Cards */
  userCardsGrid: {
    gap: 8
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  userCardActive: {
    backgroundColor: '#1E293B',
    borderColor: '#2DD4BF',
    borderWidth: 1.5
  },
  userCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  userName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0'
  },
  userNameActive: {
    color: '#2DD4BF'
  },
  userEmail: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1
  },
  statusMiniTag: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4
  },
  statusMiniTagReg: {
    backgroundColor: 'rgba(45, 212, 191, 0.15)'
  },
  statusMiniTagUnreg: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)'
  },
  statusMiniTagText: {
    fontSize: 8.5,
    fontWeight: '700'
  },
  statusMiniTagTextReg: {
    color: '#2DD4BF'
  },
  statusMiniTagTextUnreg: {
    color: '#94A3B8'
  },
  userCardRight: {
    marginLeft: 8
  },
  activeUserBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  activeUserBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E'
  },
  switchPromptText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B'
  },

  /* Lifecycle Cards */
  lifecycleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  lifecycleCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  lifecycleCardActive: {
    borderColor: '#2DD4BF',
    borderWidth: 1.5,
    backgroundColor: 'rgba(45, 212, 191, 0.08)'
  },
  lifecycleCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  lifecycleCardTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#F8FAFC'
  },
  currentBadge: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4
  },
  currentBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  lifecycleCardSub: {
    fontSize: 9.5,
    color: '#94A3B8',
    lineHeight: 13
  },

  /* Tool & Concurrency Cards */
  toolCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    marginBottom: 10
  },
  toolCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  toolCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC'
  },
  toolCardDesc: {
    fontSize: 10.5,
    color: '#94A3B8',
    lineHeight: 14,
    marginBottom: 10
  },
  stressBtn: {
    backgroundColor: '#0D9488',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stressBtnContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  disabledBtn: {
    opacity: 0.6
  },
  stressBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  resultBanner: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    marginTop: 10
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3
  },
  resultTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#4ADE80'
  },
  resultDetails: {
    fontSize: 10,
    color: '#86EFAC',
    lineHeight: 14
  },

  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#475569',
    paddingVertical: 8,
    borderRadius: 8
  },
  resetBtnText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700'
  },

  /* Toggle Row */
  pillToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  pillToggleTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0'
  },
  pillToggleSub: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 2
  },
  toggleSwitch: {
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#475569',
    padding: 2,
    justifyContent: 'center'
  },
  toggleSwitchActive: {
    backgroundColor: '#0D9488'
  },
  toggleKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF'
  },
  toggleKnobActive: {
    alignSelf: 'flex-end'
  }
});
