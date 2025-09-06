import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CardStyles, ButtonStyles, TextStyles, InputStyles } from '@/constants/theme';

type Source = {
  id: string;
  name: string;
  type: 'API' | 'Database' | 'CSV' | 'RSS' | 'Custom';
  status: 'connected' | 'degraded' | 'disconnected';
  lastSync: string;
  records: number;
  tags: string[];
};

const sources: Source[] = [
  { id: 's1', name: 'وزارة الداخلية - بيانات الجرائم', type: 'API', status: 'connected', lastSync: 'قبل 5 دقائق', records: 125430, tags: ['رسمي', 'حكومي'] },
  { id: 's2', name: 'النيابة العامة - سجلات القضايا', type: 'Database', status: 'degraded', lastSync: 'قبل 42 دقيقة', records: 80412, tags: ['حساس', 'قانوني'] },
  { id: 's3', name: 'الرعاية الصحية - تقارير المستشفيات', type: 'CSV', status: 'connected', lastSync: 'قبل 2 دقيقة', records: 22314, tags: ['طبي', 'تقارير'] },
  { id: 's4', name: 'وكالة الأنباء الرسمية', type: 'RSS', status: 'connected', lastSync: 'الآن', records: 9712, tags: ['إعلام', 'أخبار'] },
  { id: 's5', name: 'مركز البلاغات 122', type: 'API', status: 'disconnected', lastSync: 'قبل 3 ساعات', records: 0, tags: ['بلاغات', 'اتصال'] },
  { id: 's6', name: 'المراقبة الإلكترونية - كاميرات المدن', type: 'Custom', status: 'connected', lastSync: 'قبل 10 دقائق', records: 542_000, tags: ['映像', 'ذكاء اصطناعي'] },
];

const health = {
  uptimePct: 99.2,
  avgLatencyMs: 420,
  throughputRps: 186,
  errors24h: 7,
};

export function DataSourcesPage() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>مصادر البيانات</Text>
          <Text style={styles.subtitle}>إدارة وربط المصادر وتتبع الصحة والجودة وتدفقات الإدخال</Text>
        </View>

        {/* Actions and Filters */}
        <View style={styles.toolbar}>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث باسم المصدر أو الوسم..."
              placeholderTextColor={Colors.text.muted}
              textAlign="right"
            />
          </View>
          <View style={styles.filters}>
            {['الكل', 'متصل', 'متدهور', 'منقطع', 'رسمي', 'أخبار', 'حساس'].map((f) => (
              <View key={f} style={styles.chip}><Text style={styles.chipText}>{f}</Text></View>
            ))}
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ إضافة مصدر</Text>
          </TouchableOpacity>
        </View>

        {/* KPI cards */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}><Text style={styles.kpiLabel}>إجمالي المصادر</Text><Text style={styles.kpiValue}>{sources.length}</Text></View>
          <View style={styles.kpiCard}><Text style={styles.kpiLabel}>متصلة</Text><Text style={[styles.kpiValue,{color:Colors.success[600]}]}>{sources.filter(s=>s.status==='connected').length}</Text></View>
          <View style={styles.kpiCard}><Text style={styles.kpiLabel}>متدهورة</Text><Text style={[styles.kpiValue,{color:Colors.warning[600]}]}>{sources.filter(s=>s.status==='degraded').length}</Text></View>
          <View style={styles.kpiCard}><Text style={styles.kpiLabel}>منقطعة</Text><Text style={[styles.kpiValue,{color:Colors.danger[600]}]}>{sources.filter(s=>s.status==='disconnected').length}</Text></View>
        </View>

        {/* Health snapshot */}
        <View style={styles.healthCard}>
          <View style={styles.healthRow}>
            <View style={styles.healthItem}><Text style={styles.healthLabel}>التوافر</Text><Text style={styles.healthValue}>{health.uptimePct}%</Text><View style={styles.bar}><View style={[styles.fill,{backgroundColor:Colors.success[500],width:`${health.uptimePct}%`}]} /></View></View>
            <View style={styles.healthItem}><Text style={styles.healthLabel}>متوسط الكمون</Text><Text style={styles.healthValue}>{health.avgLatencyMs} مللي</Text><View style={styles.bar}><View style={[styles.fill,{backgroundColor:Colors.info[500],width:`${Math.min(100,health.avgLatencyMs/10)}%`}]} /></View></View>
            <View style={styles.healthItem}><Text style={styles.healthLabel}>معدل الإدخال</Text><Text style={styles.healthValue}>{health.throughputRps}‪/ث</Text><View style={styles.bar}><View style={[styles.fill,{backgroundColor:Colors.primary[500],width:`${Math.min(100,health.throughputRps/3)}%`}]} /></View></View>
            <View style={styles.healthItem}><Text style={styles.healthLabel}>أخطاء (24س)</Text><Text style={styles.healthValue}>{health.errors24h}</Text><View style={styles.bar}><View style={[styles.fill,{backgroundColor:Colors.danger[500],width:`${Math.min(100,health.errors24h*10)}%`}]} /></View></View>
          </View>
        </View>

        {/* Sources grid */}
        <View style={styles.grid}>
          {sources.map((s) => (
            <View key={s.id} style={styles.sourceCard}>
              <View style={styles.sourceHeader}>
                <View style={[styles.badge, s.status==='connected'?styles.badgeOk:s.status==='degraded'?styles.badgeWarn:styles.badgeErr]}>
                  <Text style={styles.badgeText}>
                    {s.status==='connected'?'متصل':s.status==='degraded'?'متدهور':'منقطع'}
                  </Text>
                </View>
                <Text style={styles.sourceType}>{s.type}</Text>
              </View>
              <Text style={styles.sourceName}>{s.name}</Text>
              <Text style={styles.meta}>آخر مزامنة: {s.lastSync}</Text>
              <Text style={styles.meta}>السجلات: {s.records.toLocaleString('ar-EG')}</Text>
              <View style={styles.tagRow}>
                {s.tags.map(t => (
                  <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
                ))}
              </View>
              <View style={styles.sourceActions}>
                <TouchableOpacity style={styles.actionGhost}><Text style={styles.actionGhostText}>تفاصيل</Text></TouchableOpacity>
                <TouchableOpacity style={styles.actionPrimary}><Text style={styles.actionPrimaryText}>مزامنة الآن</Text></TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Recent events */}
        <View style={styles.eventsCard}>
          <Text style={styles.sectionTitle}>أحداث حديثة</Text>
          {[
            {t:'إعادة مصادقة ناجحة لمصدر وزارة الداخلية', k:'نجاح', c:Colors.success[600]},
            {t:'ارتفاع كمون مصدر النيابة العامة', k:'تحذير', c:Colors.warning[700]},
            {t:'انقطاع اتصال مركز البلاغات 122', k:'فشل', c:Colors.danger[700]},
            {t:'إضافة وسوم جديدة لمصدر الأخبار', k:'تحديث', c:Colors.info[700]},
          ].map((e,i)=> (
            <View key={i} style={styles.eventRow}>
              <View style={[styles.eventDot,{backgroundColor:e.c}]} />
              <Text style={styles.eventText} numberOfLines={1}>• {e.t}</Text>
              <View style={styles.eventTag}><Text style={styles.eventTagText}>{e.k}</Text></View>
            </View>
          ))}
        </View>

        {/* Sync schedule */}
        <View style={styles.scheduleCard}>
          <Text style={styles.sectionTitle}>جدولة المزامنة</Text>
          {[
            {n:'وزارة الداخلية - بيانات الجرائم', s:'كل 5 دقائق'},
            {n:'النيابة العامة - سجلات القضايا', s:'كل 30 دقيقة'},
            {n:'وكالة الأنباء الرسمية', s:'كل 1 دقيقة'},
          ].map((r,i)=>(
            <View key={i} style={styles.scheduleRow}>
              <Text style={styles.scheduleName} numberOfLines={1}>{r.n}</Text>
              <Text style={styles.scheduleWhen}>{r.s}</Text>
              <TouchableOpacity style={styles.actionGhostSm}><Text style={styles.actionGhostSmText}>تعديل</Text></TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.secondary },
  content: { padding: Spacing[6] },
  header: { marginBottom: Spacing[6] },
  title: { fontSize: Typography.sizes['5xl'], fontFamily: Typography.weights.bold, color: Colors.text.primary, marginBottom: Spacing[2], textAlign: 'right' },
  subtitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.weights.regular, color: Colors.text.tertiary, textAlign: 'right' },

  toolbar: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], marginBottom: Spacing[6], flexWrap: 'wrap' as const },
  searchBox: { flexGrow: 1, minWidth: 240 },
  searchInput: { ...InputStyles.default, backgroundColor: Colors.background.primary },
  filters: { flexDirection: 'row', gap: Spacing[2], flexWrap: 'wrap' as const },
  chip: { backgroundColor: Colors.background.tertiary, borderWidth: 1, borderColor: Colors.border.default, borderRadius: BorderRadius.full, paddingHorizontal: Spacing[3], paddingVertical: Spacing[2] },
  chipText: { fontSize: Typography.sizes.sm, fontFamily: Typography.weights.medium, color: Colors.text.secondary },
  addButton: { ...ButtonStyles.primary },
  addButtonText: { color: Colors.text.inverse, fontFamily: Typography.weights.semibold, fontSize: Typography.sizes.base },

  kpiRow: { flexDirection: 'row', gap: Spacing[3], flexWrap: 'wrap' as const, marginBottom: Spacing[6] },
  kpiCard: { ...CardStyles.default, flexGrow: 1, flexBasis: 160 },
  kpiLabel: { fontSize: Typography.sizes.sm, color: Colors.text.tertiary, textAlign: 'right', marginBottom: Spacing[1], fontFamily: Typography.weights.medium },
  kpiValue: { fontSize: Typography.sizes['3xl'], color: Colors.text.primary, textAlign: 'right', fontFamily: Typography.weights.bold },

  healthCard: { ...CardStyles.default, marginBottom: Spacing[6] },
  healthRow: { flexDirection: 'row', gap: Spacing[4], flexWrap: 'wrap' as const },
  healthItem: { flexGrow: 1, flexBasis: 150 },
  healthLabel: { ...TextStyles.label, textAlign: 'right' as const, color: Colors.text.secondary },
  healthValue: { ...TextStyles.heading3, textAlign: 'right' as const, marginBottom: Spacing[2] },
  bar: { height: 8, borderRadius: 8, backgroundColor: Colors.background.tertiary, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 8 },

  grid: { flexDirection: 'row', flexWrap: 'wrap' as const, gap: Spacing[3], marginBottom: Spacing[6] },
  sourceCard: { ...CardStyles.default, flexGrow: 1, flexBasis: 280 },
  sourceHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing[2] },
  badge: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing[3], paddingVertical: Spacing[1], borderWidth: 1 },
  badgeOk: { backgroundColor: Colors.success[50], borderColor: Colors.success[200] },
  badgeWarn: { backgroundColor: Colors.warning[50], borderColor: Colors.warning[200] },
  badgeErr: { backgroundColor: Colors.danger[50], borderColor: Colors.danger[200] },
  badgeText: { fontSize: Typography.sizes.sm, fontFamily: Typography.weights.semibold, color: Colors.text.secondary },
  sourceType: { fontSize: Typography.sizes.sm, color: Colors.text.tertiary },
  sourceName: { ...TextStyles.heading4, textAlign: 'right' as const, marginBottom: Spacing[1] },
  meta: { ...TextStyles.body, textAlign: 'right' as const, color: Colors.text.tertiary },
  tagRow: { flexDirection: 'row', gap: Spacing[2], flexWrap: 'wrap' as const, marginTop: Spacing[3], marginBottom: Spacing[4], justifyContent: 'flex-end' },
  tag: { backgroundColor: Colors.background.tertiary, borderWidth: 1, borderColor: Colors.border.default, borderRadius: BorderRadius.full, paddingHorizontal: Spacing[3], paddingVertical: Spacing[1] },
  tagText: { fontSize: Typography.sizes.sm, color: Colors.text.secondary },
  sourceActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing[2], marginTop: Spacing[2] },
  actionGhost: { ...ButtonStyles.ghost },
  actionGhostText: { color: Colors.text.secondary, fontFamily: Typography.weights.semibold },
  actionPrimary: { ...ButtonStyles.primary },
  actionPrimaryText: { color: Colors.text.inverse, fontFamily: Typography.weights.semibold },

  eventsCard: { ...CardStyles.default, marginBottom: Spacing[6] },
  sectionTitle: { ...TextStyles.heading4, textAlign: 'right' as const, marginBottom: Spacing[3] },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], marginBottom: Spacing[2] },
  eventDot: { width: 10, height: 10, borderRadius: 5 },
  eventText: { ...TextStyles.body, flex: 1, textAlign: 'right' as const },
  eventTag: { backgroundColor: Colors.background.tertiary, borderWidth: 1, borderColor: Colors.border.default, borderRadius: BorderRadius.full, paddingHorizontal: Spacing[3], paddingVertical: Spacing[1] },
  eventTagText: { fontSize: Typography.sizes.sm, color: Colors.text.secondary },

  scheduleCard: { ...CardStyles.default, marginBottom: Spacing[8] },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], paddingVertical: Spacing[2], borderBottomWidth: 1, borderBottomColor: Colors.border.light },
  scheduleName: { flex: 1, ...TextStyles.body, textAlign: 'right' as const },
  scheduleWhen: { ...TextStyles.label, color: Colors.text.secondary },
  actionGhostSm: { ...ButtonStyles.ghost, paddingVertical: Spacing[2], paddingHorizontal: Spacing[3] },
  actionGhostSmText: { color: Colors.text.secondary, fontFamily: Typography.weights.semibold },
});
