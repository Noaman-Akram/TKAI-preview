import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { FileText, Eye } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';

interface ReportDoc {
  id: string;
  title: string;
  status: 'draft'|'final';
  persona?: 'legal'|'fake_news'|'general';
  updatedAt?: any;
  createdAt?: any;
  stats?: { missingCount?: number; wordCount?: number };
  content?: string;
}

export function MahaderPage() {
  const [reports, setReports] = useState<ReportDoc[]>([]);
  const [active, setActive] = useState<ReportDoc | null>(null);
  const [filter, setFilter] = useState<'all'|'draft'|'final'>('all');

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const arr: ReportDoc[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setReports(arr);
    });
    return () => unsub();
  }, []);

  const list = reports.filter(r => filter==='all' || r.status === filter);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>المحاضر</Text>
        <View style={styles.chipsRow}>
          {(['all','draft','final'] as const).map(k => (
            <TouchableOpacity key={k} style={[styles.chip, filter===k && styles.chipActive]} onPress={() => setFilter(k)}>
              <Text style={[styles.chipText, filter===k && styles.chipTextActive]}>
                {k==='all'?'الكل':k==='draft'?'مسودات':'نهائي'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.layoutRow}>
        <ScrollView style={styles.listPane}>
          {list.map((r) => (
            <TouchableOpacity key={r.id} style={[styles.row, active?.id===r.id && styles.rowActive]} onPress={() => setActive(r)}>
              <View style={styles.rowIcon}><FileText size={16} color={r.status==='final'? '#10B981':'#64748B'} /></View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.rowTitle} numberOfLines={1}>{r.title || 'محضر بدون عنوان'}</Text>
                <Text style={styles.rowMeta} numberOfLines={1}>
                  {r.persona==='legal'?'قانوني': r.persona==='fake_news'?'تحقق محتوى':'عام'} • {r.status==='final'?'نهائي':'مسودة'} • {r.stats?.missingCount ?? 0} نواقص
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {list.length===0 && (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Text style={{ color:'#64748B' }}>لا توجد محاضر في هذا التصنيف</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.viewerPane}>
          {active ? (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
              <View style={{ flexDirection:'row-reverse', alignItems:'center', justifyContent:'space-between', marginBottom: 8 }}>
                <Text style={styles.viewerTitle}>{active.title}</Text>
                <View style={[styles.statusBadge, active.status==='final'? styles.badgeFinal : styles.badgeDraft]}>
                  <Text style={styles.badgeText}>{active.status==='final'?'نهائي':'مسودة'}</Text>
                </View>
              </View>
              {!!active.content ? (
                <Markdown style={viewerMd}>{active.content}</Markdown>
              ) : (
                <Text style={{ color:'#64748B' }}>لا يوجد محتوى محفوظ.</Text>
              )}
            </ScrollView>
          ) : (
            <View style={styles.placeholder}> 
              <Eye size={18} color="#94A3B8" />
              <Text style={styles.placeholderText}>اختر محضراً لعرضه</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  title: { fontSize: 20, fontFamily: 'Inter-Bold', color: '#0F172A', textAlign: 'right', marginBottom: 8 },
  chipsRow: { flexDirection: 'row-reverse', gap: 8 },
  chip: { backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#E2E8F0', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  chipActive: { backgroundColor:'#0EA5E9', borderColor:'#0EA5E9' },
  chipText: { color:'#334155', fontFamily:'Inter-Medium' },
  chipTextActive: { color:'#FFFFFF', fontFamily:'Inter-SemiBold' },
  layoutRow: { flex:1, flexDirection: 'row' },
  listPane: { width: 320, backgroundColor: '#FFFFFF', borderRightWidth:1, borderRightColor:'#E2E8F0' },
  viewerPane: { flex: 1, backgroundColor: '#FFFFFF' },
  row: { flexDirection:'row-reverse', alignItems:'center', gap: 12, padding: 12, borderBottomWidth:1, borderBottomColor:'#F1F5F9' },
  rowActive: { backgroundColor:'#F0F9FF' },
  rowIcon: { width:30, height:30, borderRadius:15, backgroundColor:'#F1F5F9', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#E2E8F0' },
  rowTitle: { fontSize:14, color:'#0F172A', fontFamily:'Inter-SemiBold' },
  rowMeta: { fontSize:12, color:'#64748B', fontFamily:'Inter-Regular' },
  viewerTitle: { fontSize:16, color:'#0F172A', fontFamily:'Inter-Bold' },
  statusBadge: { borderRadius:999, paddingHorizontal:10, paddingVertical:4 },
  badgeDraft: { backgroundColor:'#FEF3C7' },
  badgeFinal: { backgroundColor:'#ECFDF5' },
  badgeText: { color:'#0F172A', fontFamily:'Inter-Medium' },
  placeholder: { flex:1, alignItems:'center', justifyContent:'center', gap:8 },
  placeholderText: { color:'#64748B', fontFamily:'Inter-Regular' },
});

const viewerMd = {
  body: { color:'#0F172A', fontFamily:'Inter-Regular', fontSize:14, lineHeight:22, textAlign:'right' as const, writingDirection:'rtl' as const },
  heading1: { color:'#0F172A', fontFamily:'Inter-Bold', fontSize:18, textAlign:'right' as const },
  heading2: { color:'#0F172A', fontFamily:'Inter-Bold', fontSize:16, textAlign:'right' as const },
  paragraph: { marginBottom: 8 },
};

