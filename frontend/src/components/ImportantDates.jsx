import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

const formatMilestoneDate = (dateVal, defaultDate, defaultTime, lang = 'en') => {
  if (!dateVal) return { date: defaultDate, time: defaultTime };
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return { date: defaultDate, time: defaultTime };

  const day = d.getDate();
  const year = String(d.getFullYear()).slice(-2);

  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const monthsHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];

  const monthStr = lang === 'hi' ? monthsHi[d.getMonth()] : monthsEn[d.getMonth()];
  const dateStr = `${day} ${monthStr} ${year}`;

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  let periodEn = 'AM';
  let periodHi = 'सुबह';

  if (hours >= 12) {
    periodEn = 'PM';
    periodHi = hours >= 17 ? 'रात' : 'दोपहर';
    if (hours > 12) hours -= 12;
  } else {
    if (hours === 0) hours = 12;
    if (hours < 4) periodHi = 'रात';
  }

  const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${lang === 'hi' ? periodHi : periodEn}`;

  return { date: dateStr, time: timeStr };
};

export default function ImportantDates({ competition }) {
  const { language, t } = useLanguage();

  const regBefore = formatMilestoneDate(
    competition?.registrationDeadline,
    t.dates.regBeforeDate,
    t.dates.regBeforeTime,
    language
  );

  const subStarts = formatMilestoneDate(
    competition?.submissionStartDate,
    t.dates.subStartsDate,
    t.dates.subStartsTime,
    language
  );

  const subEnds = formatMilestoneDate(
    competition?.submissionEndDate,
    t.dates.subEndsDate,
    t.dates.subEndsTime,
    language
  );

  const resDate = formatMilestoneDate(
    competition?.resultDate,
    t.dates.resDate,
    t.dates.resTime,
    language
  );

  return (
    <View style={styles.cardContainer}>
      {/* Title placed INSIDE the card */}
      <Text style={styles.cardTitle}>{t.importantDates}</Text>

      {/* 2x2 Grid inside the card */}
      <View style={styles.gridBox}>
        {/* Row 1 */}
        <View style={styles.gridRow}>
          {/* Top-Left: Register Before */}
          <View style={[styles.gridItem, styles.rightBorder, styles.bottomBorder]}>
            <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#007A78" style={styles.iconStyle} />
            <View style={styles.itemContent}>
              <Text style={styles.dateLabel}>{t.registerBefore}</Text>
              <Text style={styles.dateValue}>{regBefore.date}</Text>
              <Text style={styles.timeValue}>{regBefore.time}</Text>
            </View>
          </View>

          {/* Top-Right: Submission Starts */}
          <View style={[styles.gridItem, styles.bottomBorder]}>
            <Feather name="send" size={21} color="#007A78" style={styles.iconStyle} />
            <View style={styles.itemContent}>
              <Text style={styles.dateLabel}>{t.submissionStarts}</Text>
              <Text style={styles.dateValue}>{subStarts.date}</Text>
              <Text style={styles.timeValue}>{subStarts.time}</Text>
            </View>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.gridRow}>
          {/* Bottom-Left: Submission Ends */}
          <View style={[styles.gridItem, styles.rightBorder]}>
            <Feather name="upload" size={22} color="#007A78" style={styles.iconStyle} />
            <View style={styles.itemContent}>
              <Text style={styles.dateLabel}>{t.submissionEnds}</Text>
              <Text style={styles.dateValue}>{subEnds.date}</Text>
              <Text style={styles.timeValue}>{subEnds.time}</Text>
            </View>
          </View>

          {/* Bottom-Right: Result Date */}
          <View style={styles.gridItem}>
            <MaterialCommunityIcons name="trophy-outline" size={24} color="#007A78" style={styles.iconStyle} />
            <View style={styles.itemContent}>
              <Text style={styles.dateLabel}>{t.resultDate}</Text>
              <Text style={styles.dateValue}>{resDate.date}</Text>
              <Text style={styles.timeValue}>{resDate.time}</Text>
            </View>
          </View>
        </View>
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
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A192F',
    marginBottom: 10
  },
  gridBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    overflow: 'hidden'
  },
  gridRow: {
    flexDirection: 'row'
  },
  gridItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  rightBorder: {
    borderRightWidth: 1,
    borderRightColor: '#EEF2F6'
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6'
  },
  iconStyle: {
    marginRight: 10
  },
  itemContent: {
    flex: 1
  },
  dateLabel: {
    fontSize: 9.5,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 1
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#005C53'
  },
  timeValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0A192F',
    marginTop: 1
  }
});
