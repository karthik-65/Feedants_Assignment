import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

export default function SubmissionModal({ visible, onClose, competition, currentUser, onSubmitSuccess }) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('Kathak Tarana Performance');
  const [mediaUrl, setMediaUrl] = useState('https://youtu.be/example-kathak-dance');
  const [description, setDescription] = useState('Teentaal composition with chakkars and footwork showcase.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!title.trim() || !mediaUrl.trim()) {
      setError('Please provide a performance title and video link.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmitSuccess({
        title,
        mediaUrl,
        description,
        mediaType: 'video'
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.modalSheet}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t.submissionModalTitle}</Text>
          <TouchableOpacity onPress={onClose} disabled={loading} style={styles.closeBtn}>
            <Feather name="x" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

          <Text style={styles.inputLabel}>{t.performanceTitle}</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder={t.performanceTitlePlaceholder}
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.inputLabel}>{t.videoUrlLabel}</Text>
          <TextInput
            style={styles.textInput}
            value={mediaUrl}
            onChangeText={setMediaUrl}
            placeholder={t.videoUrlPlaceholder}
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.inputLabel}>{t.descriptionLabel}</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder={t.descriptionPlaceholder}
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
          />

          {error && (
            <View style={styles.errorBox}>
              <Feather name="alert-triangle" size={14} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>{t.submitButton}</Text>
            )}
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 999
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  modalSheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '88%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    marginTop: 8
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 12.5,
    color: '#0F172A'
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top'
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginTop: 10
  },
  errorText: {
    fontSize: 11.5,
    color: '#DC2626',
    flex: 1
  },
  submitButton: {
    backgroundColor: '#0F766E',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  buttonDisabled: {
    opacity: 0.7
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800'
  }
});
