import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MapboxEgyptCrimeMock } from '@/components/MapboxEgyptCrimeMock';
import { D3EgyptCircles } from '@/components/D3EgyptCircles';

export function StatsPage() {
  const { palette } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.background.secondary }]}>
      <View style={styles.section}>
        <Text style={[styles.title, { color: palette.text.primary }]}>إحصائيات الخرائط - مصر</Text>
        <Text style={[styles.subtitle, { color: palette.text.secondary }]}>لوحات تفاعلية متعددة لتمثيل البيانات جغرافياً</Text>
      </View>

      <View style={styles.cardRow}>
        <View style={[styles.card, { backgroundColor: palette.background.primary, borderColor: palette.border.default }]}>
          <Text style={[styles.cardTitle, { color: palette.text.primary }]}>خريطة تفاعلية (Mapbox)</Text>
          <MapboxEgyptCrimeMock height={360} />
        </View>

        <View style={[styles.card, { backgroundColor: palette.background.primary, borderColor: palette.border.default }]}>
          <Text style={[styles.cardTitle, { color: palette.text.primary }]}>دوائر كثافة (D3)</Text>
          <D3EgyptCircles height={360} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 20, fontFamily: 'Inter-Bold', textAlign: 'right' },
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'right' },
  cardRow: { padding: 16, gap: 16 },
  card: { borderRadius: 16, borderWidth: 1, padding: 12 },
  cardTitle: { fontSize: 16, fontFamily: 'Inter-SemiBold', marginBottom: 8, textAlign: 'right' },
});

