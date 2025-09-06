import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { mockReportStats, mockWeeklyReports, mockReportTypes, mockRecentReports } from '@/constants/mock';

export function AnalyticsPage() {
  const total = mockReportStats.totalReports;
  const pct = (n: number) => Math.round((n / total) * 100);
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>لوحة التحليلات</Text>
          <Text style={styles.subtitle}>مؤشرات الأداء والتوجهات للتقارير وكشف التضليل</Text>
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>إجمالي التقارير</Text>
            <Text style={styles.kpiValue}>{mockReportStats.totalReports}</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>مكتملة</Text>
            <Text style={styles.kpiValue}>{mockReportStats.completed}</Text>
            <View style={styles.progress}><View style={[styles.fillSuccess,{width:`${pct(mockReportStats.completed)}%`}]} /></View>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>قيد المراجعة</Text>
            <Text style={styles.kpiValue}>{mockReportStats.inReview}</Text>
            <View style={styles.progress}><View style={[styles.fillInfo,{width:`${pct(mockReportStats.inReview)}%`}]} /></View>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>مسودات</Text>
            <Text style={styles.kpiValue}>{mockReportStats.drafts}</Text>
            <View style={styles.progress}><View style={[styles.fillWarn,{width:`${pct(mockReportStats.drafts)}%`}]} /></View>
          </View>
        </View>

        {/* Secondary KPIs */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCardWide}>
            <Text style={styles.kpiLabel}>متوسط طول التقرير (كلمة)</Text>
            <Text style={styles.kpiValue}>{mockReportStats.avgLengthWords}</Text>
          </View>
          <View style={styles.kpiCardWide}>
            <Text style={styles.kpiLabel}>متوسط زمن التوليد (ث)</Text>
            <Text style={styles.kpiValue}>{mockReportStats.avgGenerationTimeSec}</Text>
          </View>
        </View>

        {/* Weekly Trend (bars) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الاتجاه الأسبوعي</Text>
          <View style={styles.chartRow}>
            {mockWeeklyReports.map((w, i) => (
              <View key={i} style={styles.barCol}>
                <View style={styles.barStack}>
                  <View style={[styles.barCompleted,{height: 4 + w.completed}]} />
                  <View style={[styles.barTotal,{height: 4 + (w.reports - w.completed)}]} />
                </View>
                <Text style={styles.barLabel}>{i+1}</Text>
              </View>
            ))}
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}><View style={[styles.legendDot,{backgroundColor:'#10B981'}]} /><Text style={styles.legendText}>مكتملة</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendDot,{backgroundColor:'#3B82F6'}]} /><Text style={styles.legendText}>إجمالي</Text></View>
          </View>
        </View>

        {/* Types Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>أنواع التقارير</Text>
          {mockReportTypes.map((t) => (
            <View key={t.id} style={styles.typeRow}>
              <Text style={styles.typeName}>{t.name}</Text>
              <View style={styles.typeBar}><View style={[styles.typeFill,{width:`${t.value}%`}]} /></View>
              <Text style={styles.typePct}>{t.value}%</Text>
            </View>
          ))}
        </View>

        {/* Verification mix */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>نتائج التحقق</Text>
          <View style={styles.pillsRow}>
            <View style={[styles.pill,{backgroundColor:'#ECFDF5',borderColor:'#A7F3D0'}]}><Text style={[styles.pillText,{color:'#059669'}]}>موثّق: {mockReportStats.verification.verified}</Text></View>
            <View style={[styles.pill,{backgroundColor:'#EFF6FF',borderColor:'#BFDBFE'}]}><Text style={[styles.pillText,{color:'#2563EB'}]}>غير مؤكد: {mockReportStats.verification.uncertain}</Text></View>
            <View style={[styles.pill,{backgroundColor:'#FEF3C7',borderColor:'#FDE68A'}]}><Text style={[styles.pillText,{color:'#D97706'}]}>قيد المراجعة: {mockReportStats.verification.pending}</Text></View>
            <View style={[styles.pill,{backgroundColor:'#FEE2E2',borderColor:'#FECACA'}]}><Text style={[styles.pillText,{color:'#DC2626'}]}>مضلل: {mockReportStats.verification.misleading}</Text></View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>النشاط الأخير</Text>
          <View style={styles.list}>
            {mockRecentReports.map((r) => (
              <View key={r.id} style={styles.listItem}>
                <Text style={styles.listTitle} numberOfLines={1}>{r.title}</Text>
                <Text style={styles.listMeta}>{new Date(r.date).toLocaleString('ar-SA')}</Text>
                <View style={[styles.status, styles[`st_${r.status}` as const]]}><Text style={styles.statusText}>
                  {r.status === 'completed' ? 'مكتمل' : r.status === 'review' ? 'قيد المراجعة' : 'مسودة'}
                </Text></View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  kpiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  kpiCard: { flexGrow: 1, flexBasis: 160, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  kpiCardWide: { flexGrow: 1, flexBasis: 240, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  kpiLabel: { fontSize: 12, color: '#6B7280', textAlign: 'right', marginBottom: 6, fontFamily: 'Inter-Medium' },
  kpiValue: { fontSize: 24, color: '#111827', textAlign: 'right', fontFamily: 'Inter-Bold' },
  progress: { height: 6, backgroundColor: '#EEF2F7', borderRadius: 6, overflow: 'hidden', marginTop: 8 },
  fillSuccess: { height: '100%', backgroundColor: '#10B981' },
  fillInfo: { height: '100%', backgroundColor: '#3B82F6' },
  fillWarn: { height: '100%', backgroundColor: '#F59E0B' },
  section: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#111827', marginBottom: 12, textAlign: 'right' },
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 140 },
  barCol: { width: 18, alignItems: 'center', justifyContent: 'flex-end' },
  barStack: { width: 14, alignItems: 'stretch', justifyContent: 'flex-end' },
  barCompleted: { backgroundColor: '#10B981', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  barTotal: { backgroundColor: '#3B82F6', borderBottomLeftRadius: 6, borderBottomRightRadius: 6, marginTop: 2 },
  barLabel: { fontSize: 10, color: '#6B7280', marginTop: 6 },
  legendRow: { flexDirection: 'row', gap: 12, marginTop: 12, justifyContent: 'flex-end' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: '#6B7280' },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  typeName: { width: 70, fontSize: 12, color: '#111827', textAlign: 'right', fontFamily: 'Inter-Medium' },
  typeBar: { flex: 1, height: 8, backgroundColor: '#F3F4F6', borderRadius: 8, overflow: 'hidden' },
  typeFill: { height: '100%', backgroundColor: '#0EA5E9' },
  typePct: { width: 40, textAlign: 'left', fontSize: 12, color: '#6B7280' },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  pillText: { fontSize: 12, fontFamily: 'Inter-Medium' },
  list: { gap: 8 },
  listItem: { backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', padding: 12 },
  listTitle: { fontSize: 14, color: '#111827', textAlign: 'right', fontFamily: 'Inter-SemiBold' },
  listMeta: { fontSize: 12, color: '#6B7280', textAlign: 'right', marginTop: 4 },
  status: { marginTop: 8, alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  st_completed: { backgroundColor: '#ECFDF5' },
  st_review: { backgroundColor: '#EFF6FF' },
  st_draft: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 12, fontFamily: 'Inter-Medium', color: '#111827' },
});
