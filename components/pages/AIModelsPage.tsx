import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, CardStyles, ButtonStyles, TextStyles } from '@/constants/theme';

type Model = {
  id: string;
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'Local' | 'Other';
  family: string;
  status: 'active' | 'paused' | 'preview';
  contextK: number;
  maxOutput: number;
  modalities: Array<'text'|'vision'|'audio'|'tools'>;
  latencyMs: number;
  tps: number; // tokens per second
  costRel: 'low' | 'med' | 'high';
  version: string;
};

const models: Model[] = [
  { id:'m1', name:'GPT‑4.1', provider:'OpenAI', family:'gpt-4', status:'active', contextK:128, maxOutput:8, modalities:['text','vision','tools'], latencyMs:520, tps:130, costRel:'high', version:'2025-05-01' },
  { id:'m2', name:'GPT‑4o-mini', provider:'OpenAI', family:'gpt-4o', status:'active', contextK:128, maxOutput:8, modalities:['text','vision'], latencyMs:260, tps:220, costRel:'med', version:'2025-05-01' },
  { id:'m3', name:'Claude 3.7 Sonnet', provider:'Anthropic', family:'claude-3', status:'preview', contextK:200, maxOutput:8, modalities:['text','vision','tools'], latencyMs:480, tps:150, costRel:'high', version:'2025-04-18' },
  { id:'m4', name:'Gemini 2.0 Flash', provider:'Google', family:'gemini', status:'active', contextK:100, maxOutput:8, modalities:['text','vision','audio','tools'], latencyMs:240, tps:260, costRel:'med', version:'2025-03-30' },
  { id:'m5', name:'Local LLM (Q8)', provider:'Local', family:'llama-3.1', status:'paused', contextK:16, maxOutput:4, modalities:['text'], latencyMs:900, tps:40, costRel:'low', version:'3.1-70B-Q8' },
];

const usage = {
  invocations24h: 18420,
  tokensIn24h: 72_340_000,
  tokensOut24h: 19_880_000,
  errorRate: 0.6,
};

export function AIModelsPage() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}> 
          <Text style={styles.title}>نماذج الذكاء الاصطناعي</Text>
          <Text style={styles.subtitle}>نشر وإدارة ومراقبة النماذج الرائدة مع مقاييس الأداء والاستهلاك</Text>
        </View>

        {/* KPIs */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}><Text style={styles.kpiLabel}>نماذج مفعّلة</Text><Text style={[styles.kpiValue,{color:Colors.success[700]}]}>{models.filter(m=>m.status==='active').length}</Text></View>
          <View style={styles.kpiCard}><Text style={styles.kpiLabel}>استدعاءات (24س)</Text><Text style={styles.kpiValue}>{usage.invocations24h.toLocaleString('ar-EG')}</Text></View>
          <View style={styles.kpiCard}><Text style={styles.kpiLabel}>رموز داخلة (24س)</Text><Text style={styles.kpiValue}>{usage.tokensIn24h.toLocaleString('ar-EG')}</Text></View>
          <View style={styles.kpiCard}><Text style={styles.kpiLabel}>معدّل الأخطاء</Text><Text style={[styles.kpiValue,{color:Colors.danger[700]}]}>{usage.errorRate}%</Text></View>
        </View>

        {/* Models grid */}
        <View style={styles.grid}>
          {models.map((m)=> (
            <View key={m.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.badge, m.status==='active'?styles.badgeOk:m.status==='preview'?styles.badgeInfo:styles.badgeMuted]}>
                  <Text style={styles.badgeText}>{m.status==='active'?'نشط':m.status==='preview'?'تجريبي':'موقوف'}</Text>
                </View>
                <Text style={styles.provider}>{m.provider}</Text>
              </View>
              <Text style={styles.modelName}>{m.name}</Text>
              <Text style={styles.meta}>العائلة: {m.family} • الإصدار: {m.version}</Text>
              <View style={styles.chipsRow}>
                {m.modalities.map(mod => (
                  <View key={mod} style={styles.chip}><Text style={styles.chipText}>{mod==='text'?'نص':mod==='vision'?'رؤية':mod==='audio'?'صوت':'أدوات'}</Text></View>
                ))}
              </View>
              <View style={styles.metricsRow}>
                <View style={styles.metric}><Text style={styles.metricLabel}>السياق</Text><Text style={styles.metricValue}>{m.contextK}K</Text></View>
                <View style={styles.metric}><Text style={styles.metricLabel}>الإخراج</Text><Text style={styles.metricValue}>{m.maxOutput}K</Text></View>
                <View style={styles.metric}><Text style={styles.metricLabel}>الكمون</Text><Text style={styles.metricValue}>{m.latencyMs} مللي</Text></View>
                <View style={styles.metric}><Text style={styles.metricLabel}>TPS</Text><Text style={styles.metricValue}>{m.tps}</Text></View>
                <View style={styles.metric}><Text style={styles.metricLabel}>الكلفة</Text><Text style={[styles.metricValue, m.costRel==='low'?styles.good:m.costRel==='med'?styles.warn:styles.bad]}>{m.costRel==='low'?'منخفضة':m.costRel==='med'?'متوسطة':'مرتفعة'}</Text></View>
              </View>
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.ghostBtn}><Text style={styles.ghostText}>تفاصيل</Text></TouchableOpacity>
                <TouchableOpacity style={styles.secondaryBtn}><Text style={styles.secondaryText}>اختبار</Text></TouchableOpacity>
                <TouchableOpacity style={styles.primaryBtn}><Text style={styles.primaryText}>{m.status==='paused'?'تفعيل':'نشر نسخة'}</Text></TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Experiments / AB tests */}
        <View style={styles.expCard}>
          <Text style={styles.sectionTitle}>تجارب A/B</Text>
          {[{n:'GPT‑4o-mini vs Gemini Flash', p1:52, p2:48, m1:'GPT‑4o-mini', m2:'Gemini 2.0 Flash'},
            {n:'Claude Sonnet vs GPT‑4.1', p1:49, p2:51, m1:'Claude 3.7 Sonnet', m2:'GPT‑4.1'}].map((e,i)=> (
            <View key={i} style={styles.expRow}>
              <Text style={styles.expName}>{e.n}</Text>
              <View style={styles.expBar}><View style={[styles.expFill,{width:`${e.p1}%`, backgroundColor: Colors.primary[500]}]} /></View>
              <Text style={styles.expPct}>{e.p1}% {e.m1}</Text>
              <Text style={styles.expPct}>{e.p2}% {e.m2}</Text>
            </View>
          ))}
        </View>

        {/* Recent events */}
        <View style={styles.eventsCard}>
          <Text style={styles.sectionTitle}>آخر الأحداث</Text>
          {[
            'نشر نسخة جديدة من GPT‑4.1 للإنتاج',
            'إيقاف مؤقت للنموذج المحلي للصيانة',
            'انخفاض ملحوظ في الكمون لـ Gemini Flash',
            'تحسين دقة Claude Sonnet في مهام الاستخراج بنسبة 3%'
          ].map((t,i)=> (
            <View key={i} style={styles.eventRow}>
              <View style={styles.dot} />
              <Text style={styles.eventText} numberOfLines={1}>• {t}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: Colors.background.secondary },
  content: { padding: Spacing[6] },
  header: { marginBottom: Spacing[6] },
  title: { fontSize: Typography.sizes['5xl'], fontFamily: Typography.weights.bold, color: Colors.text.primary, marginBottom: Spacing[2], textAlign: 'right' },
  subtitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.weights.regular, color: Colors.text.tertiary, textAlign: 'right' },

  kpiRow: { flexDirection:'row', gap:Spacing[3], flexWrap:'wrap' as const, marginBottom: Spacing[6] },
  kpiCard: { ...CardStyles.default, flexGrow:1, flexBasis:160 },
  kpiLabel: { fontSize: Typography.sizes.sm, color: Colors.text.tertiary, textAlign:'right', marginBottom: Spacing[1], fontFamily: Typography.weights.medium },
  kpiValue: { fontSize: Typography.sizes['3xl'], color: Colors.text.primary, textAlign:'right', fontFamily: Typography.weights.bold },

  grid: { flexDirection:'row', flexWrap:'wrap' as const, gap: Spacing[3], marginBottom: Spacing[6] },
  card: { ...CardStyles.default, flexGrow:1, flexBasis:300 },
  cardHeader: { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  badge: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing[3], paddingVertical: Spacing[1], borderWidth:1 },
  badgeOk: { backgroundColor: Colors.success[50], borderColor: Colors.success[200] },
  badgeInfo: { backgroundColor: Colors.info[50], borderColor: Colors.info[200] },
  badgeMuted: { backgroundColor: Colors.background.tertiary, borderColor: Colors.border.default },
  badgeText: { fontSize: Typography.sizes.sm, fontFamily: Typography.weights.semibold, color: Colors.text.secondary },
  provider: { fontSize: Typography.sizes.sm, color: Colors.text.tertiary },
  modelName: { ...TextStyles.heading4, textAlign: 'right' as const, marginTop: Spacing[2], marginBottom: Spacing[1] },
  meta: { ...TextStyles.body, textAlign: 'right' as const, color: Colors.text.tertiary },
  chipsRow: { flexDirection:'row', gap: Spacing[2], flexWrap:'wrap' as const, justifyContent:'flex-end', marginTop: Spacing[3], marginBottom: Spacing[3] },
  chip: { backgroundColor: Colors.background.tertiary, borderWidth:1, borderColor: Colors.border.default, borderRadius: BorderRadius.full, paddingHorizontal: Spacing[3], paddingVertical: Spacing[1] },
  chipText: { fontSize: Typography.sizes.sm, color: Colors.text.secondary },
  metricsRow: { flexDirection:'row', gap: Spacing[3], flexWrap:'wrap' as const, marginTop: Spacing[2], marginBottom: Spacing[3] },
  metric: { flexGrow:1, flexBasis: 100 },
  metricLabel: { ...TextStyles.label, textAlign:'right' as const, color: Colors.text.secondary },
  metricValue: { ...TextStyles.heading4, textAlign:'right' as const },
  good: { color: Colors.success[700] },
  warn: { color: Colors.warning[700] },
  bad: { color: Colors.danger[700] },
  actionsRow: { flexDirection:'row', justifyContent:'flex-end', gap: Spacing[2], marginTop: Spacing[2] },
  ghostBtn: { ...ButtonStyles.ghost },
  ghostText: { color: Colors.text.secondary, fontFamily: Typography.weights.semibold },
  secondaryBtn: { ...ButtonStyles.secondary },
  secondaryText: { color: Colors.text.secondary, fontFamily: Typography.weights.semibold },
  primaryBtn: { ...ButtonStyles.primary },
  primaryText: { color: Colors.text.inverse, fontFamily: Typography.weights.semibold },

  expCard: { ...CardStyles.default, marginBottom: Spacing[6] },
  sectionTitle: { ...TextStyles.heading4, textAlign:'right' as const, marginBottom: Spacing[3] },
  expRow: { flexDirection:'row', alignItems:'center', gap: Spacing[2], marginBottom: Spacing[2] },
  expName: { flex: 1, ...TextStyles.body, textAlign:'right' as const },
  expBar: { flex: 1, height: 10, borderRadius: 8, backgroundColor: Colors.background.tertiary, overflow:'hidden' },
  expFill: { height: '100%', borderRadius: 8 },
  expPct: { ...TextStyles.label, color: Colors.text.secondary },

  eventsCard: { ...CardStyles.default, marginBottom: Spacing[8] },
  eventRow: { flexDirection:'row', alignItems:'center', gap: Spacing[2], marginBottom: Spacing[2] },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary[500] },
  eventText: { ...TextStyles.body, flex: 1, textAlign:'right' as const },
});
