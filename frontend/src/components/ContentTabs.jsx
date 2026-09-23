import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

export default function ContentTabs({ tabContent }) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0); // 0: About, 1: Judging, 2: Rules
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = [
    { key: 'about', label: t.tabAbout },
    { key: 'judging', label: t.tabJudging },
    { key: 'rules', label: t.tabRules }
  ];

  return (
    <View style={styles.cardContainer}>
      {/* 3 Tab Headers evenly spaced inside the Card */}
      <View style={styles.tabsHeader}>
        {tabs.map((tab, idx) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === idx && styles.activeTabButton]}
            onPress={() => {
              setActiveTab(idx);
              setIsExpanded(false);
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.tabButtonText, activeTab === idx && styles.activeTabText]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Body Content inside the Card */}
      <View style={styles.contentBody}>
        {activeTab === 0 && (
          <View>
            {t.aboutParagraphs.map((para, i) => (
              <Text key={i} style={styles.paragraph}>{para}</Text>
            ))}
            {isExpanded && (
              <Text style={[styles.paragraph, { marginTop: 4 }]}>
                {t.aboutExpanded}
              </Text>
            )}
          </View>
        )}

        {activeTab === 1 && (
          <View>
            {t.judgingParagraphs.map((para, i) => (
              <Text key={i} style={styles.paragraph}>{para}</Text>
            ))}
            {isExpanded && (
              <Text style={[styles.paragraph, { marginTop: 4 }]}>
                {t.judgingExpanded}
              </Text>
            )}
          </View>
        )}

        {activeTab === 2 && (
          <View>
            {t.rulesParagraphs.map((para, i) => (
              <Text key={i} style={styles.paragraph}>{para}</Text>
            ))}
            {isExpanded && (
              <Text style={[styles.paragraph, { marginTop: 4 }]}>
                {t.rulesExpanded}
              </Text>
            )}
          </View>
        )}

        {/* View more / View less button centered at bottom of card */}
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.expandText}>
            {isExpanded ? t.viewLess : t.viewMore}
          </Text>
        </TouchableOpacity>
      </View>
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
  tabsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: '#EEF2F6',
    marginBottom: 12
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
    marginBottom: -1.5
  },
  activeTabButton: {
    borderBottomColor: '#007A78'
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B'
  },
  activeTabText: {
    color: '#007A78',
    fontWeight: '800'
  },
  contentBody: {
    paddingTop: 2
  },
  paragraph: {
    fontSize: 11.5,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 2
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 4
  },
  expandText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007A78'
  }
});
