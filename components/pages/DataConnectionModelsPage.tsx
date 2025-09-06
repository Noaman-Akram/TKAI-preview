import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Line, Path, Rect, Text as SvgText, Defs, Marker, Circle } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';
import { Link, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react-native';

type Node = {
  id: string;
  x: number;
  y: number;
  label: string;
  group: 'ingest' | 'process' | 'enrich' | 'output';
};

type Edge = { from: string; to: string };

const { width } = Dimensions.get('window');

export function DataConnectionModelsPage() {
  const { palette } = useTheme();
  const [active, setActive] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const colors = {
    ingest: '#10B981',
    process: '#3B82F6',
    enrich: '#F59E0B',
    output: '#EF4444',
  } as const;

  const nodes: Node[] = useMemo(() => [
    { id: 'n1', x: 60, y: 60, label: 'مستودع الوثائق', group: 'ingest' },
    { id: 'n2', x: 60, y: 160, label: 'بثّ اجتماعي', group: 'ingest' },
    { id: 'n3', x: 60, y: 260, label: 'كاميرات مراقبة', group: 'ingest' },
    { id: 'n4', x: 220, y: 110, label: 'معالجة لغوية', group: 'process' },
    { id: 'n5', x: 220, y: 210, label: 'رؤية حاسوبية', group: 'process' },
    { id: 'n6', x: 380, y: 160, label: 'دمج + \'كيان\'', group: 'enrich' },
    { id: 'n7', x: 540, y: 100, label: 'لوحة جرائم', group: 'output' },
    { id: 'n8', x: 540, y: 220, label: 'تنبيه عملياتي', group: 'output' },
  ], []);

  const edges: Edge[] = useMemo(() => [
    { from: 'n1', to: 'n4' },
    { from: 'n2', to: 'n4' },
    { from: 'n2', to: 'n5' },
    { from: 'n3', to: 'n5' },
    { from: 'n4', to: 'n6' },
    { from: 'n5', to: 'n6' },
    { from: 'n6', to: 'n7' },
    { from: 'n6', to: 'n8' },
  ], []);

  const getNode = (id: string) => nodes.find(n => n.id === id)!;

  const viewW = Math.min(800, width - 40);
  const viewH = 420;

  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.background.secondary }]} contentContainerStyle={{ padding: 16 }}>
      <View style={[styles.header, { borderColor: palette.border.default }] }>
        <View style={styles.headerRight}>
          <Link size={18} color={palette.primary[600]} />
          <Text style={[styles.title, { color: palette.text.primary }]}>نماذج ترابط البيانات</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.iconBtn, { borderColor: palette.border.default, backgroundColor: palette.background.primary }]} onPress={() => setScale(s => Math.min(1.5, +(s + 0.1).toFixed(2)))}>
            <ZoomIn size={16} color={palette.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { borderColor: palette.border.default, backgroundColor: palette.background.primary }]} onPress={() => setScale(s => Math.max(0.7, +(s - 0.1).toFixed(2)))}>
            <ZoomOut size={16} color={palette.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { borderColor: palette.border.default, backgroundColor: palette.background.primary }]} onPress={() => { setActive(null); setScale(1); }}>
            <RefreshCw size={16} color={palette.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.canvasCard, { backgroundColor: palette.background.primary, borderColor: palette.border.default }] }>
        <Svg width={viewW} height={viewH}>
          {/* Edges */}
          {edges.map((e, idx) => {
            const a = getNode(e.from);
            const b = getNode(e.to);
            const x1 = a.x * scale, y1 = a.y * scale;
            const x2 = b.x * scale, y2 = b.y * scale;
            const mx = (x1 + x2) / 2;
            const path = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
            const isActive = active && (active === a.id || active === b.id);
            return (
              <Path
                key={idx}
                d={path}
                stroke={isActive ? palette.primary[500] : '#94A3B8'}
                strokeDasharray={4}
                strokeWidth={isActive ? 2.5 : 1.5}
                fill="none"
                opacity={active && !isActive ? 0.35 : 1}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((n) => {
            const x = n.x * scale, y = n.y * scale;
            const w = 140 * scale, h = 48 * scale;
            const activeNode = active === n.id;
            return (
              <React.Fragment key={n.id}>
                <Rect
                  x={x - w / 2}
                  y={y - h / 2}
                  rx={10}
                  width={w}
                  height={h}
                  fill={activeNode ? colors[n.group] : palette.background.secondary}
                  stroke={colors[n.group]}
                  strokeWidth={activeNode ? 3 : 2}
                />
                <SvgText
                  x={x}
                  y={y + 4}
                  fill={activeNode ? palette.text.inverse : palette.text.primary}
                  fontSize={12 * scale}
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {n.label}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Tap overlays */}
          {nodes.map((n) => {
            const x = n.x * scale, y = n.y * scale; const w = 140 * scale, h = 48 * scale;
            return (
              <Rect
                key={`tap_${n.id}`}
                x={x - w / 2}
                y={y - h / 2}
                width={w}
                height={h}
                fill={'transparent'}
                onPress={() => setActive(prev => (prev === n.id ? null : n.id))}
              />
            );
          })}
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        {[{k:'ingest',t:'مصادر الإدخال'},{k:'process',t:'المعالجة'},{k:'enrich',t:'الدمج والإثراء'},{k:'output',t:'المخرجات'}].map((g) => (
          <View key={g.k} style={[styles.legendItem, { borderColor: palette.border.default, backgroundColor: palette.background.primary }]}>
            <View style={[styles.legendDot, { backgroundColor: (colors as any)[g.k] }]} />
            <Text style={[styles.legendText, { color: palette.text.secondary }]}>{g.t}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, marginBottom: 8, borderBottomWidth: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title: { fontSize: 18, fontFamily: 'Inter-Bold' },
  canvasCard: { alignSelf: 'center', borderWidth: 1, borderRadius: 16, padding: 8 },
  legendRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontFamily: 'Inter-Medium', fontSize: 12 },
});

