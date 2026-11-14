import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { addFocusSession, getProgressStats } from '../database/database';
import { timerLabel, studyDuration } from '../utils/time';
import { colors } from '../theme/colors';

const FOCUS_SECONDS = 25 * 60;

export default function FocusScreen() {
  const db = useSQLiteContext();
  const [remaining, setRemaining] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSessions, setSavedSessions] = useState(0);
  const endsAt = useRef(null);

  useFocusEffect(useCallback(() => {
    let isActive = true;
    getProgressStats(db)
      .then((stats) => { if (isActive) setSavedSessions(stats.focusSessions); })
      .catch((error) => console.error('Could not load session count:', error));
    return () => { isActive = false; };
  }, [db]));

  // Use the clock instead of counting interval callbacks. The countdown stays
  // accurate even when Android pauses JavaScript while the app is backgrounded.
  useEffect(() => {
    if (!running) return undefined;
    const updateClock = () => {
      const secondsLeft = Math.max(0, Math.ceil((endsAt.current - Date.now()) / 1000));
      setRemaining(secondsLeft);
      if (secondsLeft === 0) {
        endsAt.current = null;
        setRunning(false);
      }
    };
    const interval = setInterval(updateClock, 300);
    updateClock();
    return () => clearInterval(interval);
  }, [running]);

  const elapsed = FOCUS_SECONDS - remaining;
  const percentage = Math.round((elapsed / FOCUS_SECONDS) * 100);

  function startOrPause() {
    if (saving) return;
    if (running) {
      setRemaining(Math.max(0, Math.ceil((endsAt.current - Date.now()) / 1000)));
      endsAt.current = null;
      setRunning(false);
      return;
    }
    if (remaining === 0) return;
    endsAt.current = Date.now() + remaining * 1000;
    setRunning(true);
  }

  function reset() {
    if (saving) return;
    setRunning(false);
    endsAt.current = null;
    setRemaining(FOCUS_SECONDS);
  }

  async function finishAndSave() {
    if (saving) return;
    const secondsLeft = running && endsAt.current
      ? Math.max(0, Math.ceil((endsAt.current - Date.now()) / 1000))
      : remaining;
    const secondsStudied = FOCUS_SECONDS - secondsLeft;
    if (secondsStudied <= 0) return;
    setSaving(true);
    setRunning(false);
    endsAt.current = null;
    setRemaining(secondsLeft);
    try {
      await addFocusSession(db, secondsStudied);
      setSavedSessions((value) => value + 1);
      setRemaining(FOCUS_SECONDS);
      Alert.alert('Session saved! 💙', `You studied for ${studyDuration(secondsStudied)}. Keep going!`);
    } catch (error) {
      console.error('Could not save focus session:', error);
      Alert.alert('Could not save', 'Your study time was not saved. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>YOUR FOCUS CORNER</Text>
        <Text style={styles.heading}>Time to focus</Text>
        <Text style={styles.subtitle}>Give yourself a quiet moment to learn. 💙</Text>

        <View style={styles.timerPanel}>
          <View style={styles.timerCircle}>
            <Ionicons name="leaf-outline" size={30} color={colors.mint} />
            <Text style={styles.timer}>{timerLabel(remaining)}</Text>
            <Text style={styles.timerCaption}>
              {remaining === 0 ? 'Session complete!' : running ? 'You are doing great' : elapsed ? 'Ready when you are' : 'A gentle 25-minute session'}
            </Text>
          </View>
          <View style={styles.track}><View style={[styles.fill, { width: `${percentage}%` }]} /></View>
          <Text style={styles.helper}>{percentage}% of your session</Text>

          <View style={styles.actionRow}>
            <Pressable
              style={[styles.primaryButton, (remaining === 0 || saving) && styles.disabled]}
              disabled={remaining === 0 || saving}
              onPress={startOrPause}
              accessibilityRole="button"
            >
              <Ionicons name={running ? 'pause' : 'play'} size={18} color={colors.background} />
              <Text style={styles.primaryText}>{running ? 'Pause' : elapsed ? 'Continue' : 'Start focus'}</Text>
            </Pressable>
            <Pressable style={styles.resetButton} onPress={reset} disabled={saving} accessibilityRole="button">
              <Ionicons name="refresh" size={20} color={colors.primary} />
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          </View>

          <Pressable
            style={[styles.saveButton, (!elapsed || saving) && styles.disabled]}
            onPress={finishAndSave}
            disabled={!elapsed || saving}
            accessibilityRole="button"
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.mint} />
            <Text style={styles.saveText}>{saving ? 'Saving session...' : 'Finish & save study time'}</Text>
          </Pressable>
        </View>

        <View style={styles.infoPanel}>
          <View style={styles.infoIcon}><Ionicons name="book-outline" color={colors.primary} size={23} /></View>
          <View style={styles.infoCopy}>
            <Text style={styles.infoTitle}>{savedSessions} saved study {savedSessions === 1 ? 'session' : 'sessions'}</Text>
            <Text style={styles.infoText}>You can finish early and save the time you actually studied. See your total in Progress.</Text>
          </View>
        </View>
        <Text style={styles.footer}>Your sessions are saved locally and work offline.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 38 },
  eyebrow: { color: colors.mint, fontSize: 11, letterSpacing: 1.8, fontWeight: '800', marginBottom: 10 },
  heading: { color: colors.text, fontSize: 30, fontWeight: '800' },
  subtitle: { color: colors.muted, marginTop: 8, fontSize: 14, lineHeight: 20, marginBottom: 25 },
  timerPanel: { borderRadius: 26, backgroundColor: colors.raised, padding: 20, alignItems: 'center' },
  timerCircle: {
    width: 242, height: 242, borderRadius: 121, borderColor: colors.primary, borderWidth: 7,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 26,
  },
  timer: { fontSize: 49, fontWeight: '800', color: colors.text, marginTop: 8, fontVariant: ['tabular-nums'] },
  timerCaption: { color: colors.muted, fontSize: 12, marginTop: 5, textAlign: 'center' },
  track: { height: 8, borderRadius: 8, backgroundColor: colors.border, overflow: 'hidden', width: '100%' },
  fill: { height: '100%', backgroundColor: colors.mint },
  helper: { color: colors.muted, fontSize: 12, marginTop: 11, marginBottom: 22 },
  actionRow: { flexDirection: 'row', gap: 10, width: '100%' },
  primaryButton: {
    flex: 2, paddingVertical: 15, borderRadius: 15, backgroundColor: colors.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  primaryText: { color: colors.background, fontSize: 15, fontWeight: '800' },
  resetButton: {
    flex: 1, borderRadius: 15, backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
  },
  resetText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  saveButton: {
    marginTop: 12, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    width: '100%', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  saveText: { color: colors.mint, fontSize: 14, fontWeight: '700' },
  disabled: { opacity: 0.45 },
  infoPanel: { flexDirection: 'row', padding: 20, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, marginTop: 18 },
  infoIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.raised },
  infoCopy: { flex: 1, marginLeft: 12 },
  infoTitle: { color: colors.text, fontWeight: '800', fontSize: 16, marginBottom: 7 },
  infoText: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  footer: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 20 },
});
