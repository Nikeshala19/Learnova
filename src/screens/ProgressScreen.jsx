import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { getProgressStats, getRecentFocusSessions } from '../database/database';
import { studyDuration } from '../utils/time';
import { colors } from '../theme/colors';

const zeroStats = {
  totalTasks: 0, completedTasks: 0, totalGoals: 0,
  achievedGoals: 0, focusSessions: 0, focusSeconds: 0,
};

function StatCard({ icon, number, label, tint = colors.primary }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} color={tint} size={23} />
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ProgressMeter({ label, count, total, tint }) {
  const percent = total ? Math.round((count / total) * 100) : 0;
  return (
    <View style={styles.meterBlock}>
      <View style={styles.meterHeading}>
        <Text style={styles.meterTitle}>{label}</Text>
        <Text style={[styles.meterPercent, { color: tint }]}>{percent}%</Text>
      </View>
      <Text style={styles.meterSubtitle}>{count} of {total} completed</Text>
      <View style={styles.track}><View style={[styles.fill, { backgroundColor: tint, width: `${percent}%` }]} /></View>
    </View>
  );
}

export default function ProgressScreen() {
  const db = useSQLiteContext();
  const [stats, setStats] = useState(zeroStats);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reload = useCallback(async (isActive = () => true) => {
    try {
      const [nextStats, nextRecent] = await Promise.all([
        getProgressStats(db), getRecentFocusSessions(db),
      ]);
      if (isActive()) {
        setStats(nextStats);
        setRecent(nextRecent);
        setError(false);
      }
    } catch (err) {
      console.error('Could not load progress:', err);
      if (isActive()) setError(true);
    } finally {
      if (isActive()) setLoading(false);
    }
  }, [db]);

  useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true);
    reload(() => active);
    return () => { active = false; };
  }, [reload]));

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>YOUR LEARNOVA JOURNEY</Text>
        <Text style={styles.heading}>My Progress</Text>
        <Text style={styles.subtitle}>Every little achievement matters. 💙</Text>

        {loading ? (
          <View style={styles.messagePanel}><ActivityIndicator color={colors.primary} /><Text style={styles.messageText}>Loading your progress...</Text></View>
        ) : error ? (
          <View style={styles.messagePanel}>
            <Text style={styles.messageText}>Your progress could not be loaded.</Text>
            <Pressable onPress={() => { setLoading(true); reload(); }} style={styles.retryButton} accessibilityRole="button">
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.statGrid}>
              <StatCard icon="checkbox-outline" label="Tasks completed" number={stats.completedTasks} />
              <StatCard icon="list-outline" label="Tasks remaining" number={stats.totalTasks - stats.completedTasks} tint={colors.mint} />
              <StatCard icon="flag-outline" label="Goals achieved" number={stats.achievedGoals} tint={colors.mint} />
              <StatCard icon="time-outline" label="Focus time" number={studyDuration(stats.focusSeconds)} />
            </View>

            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>Your milestones</Text>
              <ProgressMeter label="Task completion" count={stats.completedTasks} total={stats.totalTasks} tint={colors.primary} />
              <ProgressMeter label="Goals achieved" count={stats.achievedGoals} total={stats.totalGoals} tint={colors.mint} />
            </View>

            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>Focus history</Text>
              <Text style={styles.secondary}>{stats.focusSessions} saved {stats.focusSessions === 1 ? 'session' : 'sessions'} in total</Text>
              {recent.length ? recent.map((session) => (
                <View style={styles.sessionRow} key={session.id}>
                  <Ionicons name="checkmark-circle-outline" size={21} color={colors.mint} />
                  <View style={styles.sessionCopy}>
                    <Text style={styles.sessionTitle}>{studyDuration(session.duration_seconds)} studied</Text>
                    <Text style={styles.secondary}>{new Date(session.created_at).toLocaleDateString()}</Text>
                  </View>
                </View>
              )) : (
                <Text style={styles.emptyText}>No focus sessions yet. Start a little session in Focus and save it here!</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 23, paddingBottom: 35 },
  eyebrow: { fontSize: 11, letterSpacing: 1.8, fontWeight: '800', color: colors.mint, marginBottom: 10 },
  heading: { fontSize: 30, fontWeight: '800', color: colors.text },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 7, marginBottom: 22 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  statCard: { width: '48%', minHeight: 140, backgroundColor: colors.raised, borderRadius: 20, padding: 17, justifyContent: 'center' },
  statNumber: { fontSize: 25, color: colors.text, fontWeight: '800', marginTop: 12 },
  statLabel: { fontSize: 12, color: colors.muted, marginTop: 5 },
  panel: { marginTop: 18, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, padding: 20 },
  sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '800', marginBottom: 16 },
  meterBlock: { marginBottom: 21 },
  meterHeading: { flexDirection: 'row', justifyContent: 'space-between' },
  meterTitle: { fontSize: 14, color: colors.text, fontWeight: '700' },
  meterPercent: { fontSize: 15, fontWeight: '800' },
  meterSubtitle: { marginTop: 7, fontSize: 12, color: colors.muted },
  track: { height: 8, borderRadius: 8, backgroundColor: colors.border, overflow: 'hidden', marginTop: 12 },
  fill: { height: '100%', borderRadius: 8 },
  secondary: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  sessionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopColor: colors.border, borderTopWidth: 1 },
  sessionCopy: { marginLeft: 10 },
  sessionTitle: { color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  emptyText: { fontSize: 13, lineHeight: 21, color: colors.muted },
  messagePanel: { backgroundColor: colors.surface, borderRadius: 20, padding: 25, alignItems: 'center', gap: 12 },
  messageText: { color: colors.muted, fontSize: 14, textAlign: 'center' },
  retryButton: { backgroundColor: colors.raised, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  retryText: { color: colors.primary, fontWeight: '800' },
});
