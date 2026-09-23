import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

export default function VideoModal({ visible, onClose, videoData, judge }) {
  // Support custom video data or fallback to judge intro
  const title = videoData?.title || `Judge Introduction: ${judge?.name || 'Manju Dubey'}`;
  const subtitle = videoData?.subtitle || `${judge?.name || 'Manju Dubey'} (${judge?.role || 'Professional Kathak Dancer'})`;
  const videoUrl = videoData?.videoUrl || judge?.introVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  const notes = videoData?.notes || '"Best of luck to all participants! Focus on rhythm (Laya) and emotional expression (Bhava)."';

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.videoContainer}>
        {/* Modal Header */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Video Player Area */}
        <View style={styles.playerWrapper}>
          {Platform.OS === 'web' ? (
            // On Web / Website: Real HTML5 Video Player with controls, play, pause, volume, fullscreen
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: 230,
                backgroundColor: '#000000',
                objectFit: 'cover'
              }}
            />
          ) : (
            // On Android / iOS Native: Clean native media preview
            <View style={styles.nativePlayerPlaceholder}>
              <FontAwesome5 name="play-circle" size={48} color="#2EC4B6" />
              <Text style={styles.nativePlayerTitle}>{title}</Text>
              <Text style={styles.nativePlayerSub}>{subtitle}</Text>
            </View>
          )}
        </View>

        {/* Video Description Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerSub}>{subtitle}</Text>
          <Text style={styles.footerNotes}>{notes}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 999
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  videoContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#0A0F1D'
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
    flex: 1,
    marginRight: 10
  },
  closeBtn: {
    padding: 4
  },
  playerWrapper: {
    width: '100%',
    height: 230,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  nativePlayerPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  nativePlayerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center'
  },
  nativePlayerSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4
  },
  footer: {
    padding: 14,
    backgroundColor: '#1E293B'
  },
  footerSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2EC4B6',
    marginBottom: 4
  },
  footerNotes: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#CBD5E1',
    lineHeight: 16
  }
});
