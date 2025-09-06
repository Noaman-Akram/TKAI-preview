import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export function StatsPage() {
  const { palette } = useTheme();

  const mockStats = [
    { title: 'إجمالي المستخدمين', value: '12,847', change: '+15.2%', trend: 'up' },
    { title: 'الطلبات اليومية', value: '2,341', change: '+8.7%', trend: 'up' },
    { title: 'معدل النجاح', value: '94.3%', change: '+2.1%', trend: 'up' },
    { title: 'وقت الاستجابة', value: '1.2s', change: '-12.5%', trend: 'down' },
    { title: 'العمليات المكتملة', value: '8,923', change: '+23.4%', trend: 'up' },
    { title: 'معدل الخطأ', value: '0.8%', change: '-5.2%', trend: 'down' },
  ];

  const chartData = [
    { label: 'يناير', value: 85 },
    { label: 'فبراير', value: 92 },
    { label: 'مارس', value: 78 },
    { label: 'أبريل', value: 96 },
    { label: 'مايو', value: 88 },
    { label: 'يونيو', value: 94 },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.background.secondary }]}>
      <View style={styles.section}>
        <Text style={[styles.title, { color: palette.text.primary }]}>لوحة الإحصائيات</Text>
        <Text style={[styles.subtitle, { color: palette.text.secondary }]}>نظرة شاملة على الأداء والمؤشرات الرئيسية</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {mockStats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { backgroundColor: palette.background.primary, borderColor: palette.border.default }]}>
            <Text style={[styles.statTitle, { color: palette.text.secondary }]}>{stat.title}</Text>
            <Text style={[styles.statValue, { color: palette.text.primary }]}>{stat.value}</Text>
            <View style={styles.statChange}>
              <Text style={[styles.changeText, { color: stat.trend === 'up' ? '#10B981' : '#EF4444' }]}>
                {stat.change}
              </Text>
              <Text style={[styles.changeLabel, { color: palette.text.secondary }]}>من الشهر الماضي</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Chart Section */}
      <View style={styles.chartSection}>
        <View style={[styles.chartCard, { backgroundColor: palette.background.primary, borderColor: palette.border.default }]}>
          <Text style={[styles.chartTitle, { color: palette.text.primary }]}>اتجاه الأداء الشهري</Text>
          <View style={styles.chartContainer}>
            {chartData.map((item, index) => (
              <View key={index} style={styles.chartBar}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: (item.value / 100) * 120,
                      backgroundColor: palette.primary[500] 
                    }
                  ]} 
                />
                <Text style={[styles.barLabel, { color: palette.text.secondary }]}>{item.label}</Text>
                <Text style={[styles.barValue, { color: palette.text.primary }]}>{item.value}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Additional Info Cards */}
      <View style={styles.infoSection}>
        <View style={[styles.infoCard, { backgroundColor: palette.background.primary, borderColor: palette.border.default }]}>
          <Text style={[styles.infoTitle, { color: palette.text.primary }]}>ملخص الأداء</Text>
          <Text style={[styles.infoText, { color: palette.text.secondary }]}>
            • تحسن الأداء العام بنسبة 18.5% هذا الشهر
          </Text>
          <Text style={[styles.infoText, { color: palette.text.secondary }]}>
            • انخفاض وقت الاستجابة بمعدل 12.5%
          </Text>
          <Text style={[styles.infoText, { color: palette.text.secondary }]}>
            • زيادة رضا العملاء إلى 94.3%
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: palette.background.primary, borderColor: palette.border.default }]}>
          <Text style={[styles.infoTitle, { color: palette.text.primary }]}>الأهداف القادمة</Text>
          <Text style={[styles.infoText, { color: palette.text.secondary }]}>
            • الوصول إلى 15,000 مستخدم نشط
          </Text>
          <Text style={[styles.infoText, { color: palette.text.secondary }]}>
            • تقليل وقت الاستجابة إلى أقل من 1 ثانية
          </Text>
          <Text style={[styles.infoText, { color: palette.text.secondary }]}>
            • تحقيق معدل نجاح 98%+
          </Text>
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
  
  // Stats Grid
  statsGrid: { 
    padding: 16, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12 
  },
  statCard: { 
    borderRadius: 12, 
    borderWidth: 1, 
    padding: 16, 
    width: '48%',
    minHeight: 120
  },
  statTitle: { 
    fontSize: 12, 
    fontFamily: 'Inter-Regular', 
    textAlign: 'right',
    marginBottom: 8
  },
  statValue: { 
    fontSize: 24, 
    fontFamily: 'Inter-Bold', 
    textAlign: 'right',
    marginBottom: 8
  },
  statChange: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-end',
    gap: 4
  },
  changeText: { 
    fontSize: 12, 
    fontFamily: 'Inter-SemiBold' 
  },
  changeLabel: { 
    fontSize: 10, 
    fontFamily: 'Inter-Regular' 
  },

  // Chart Section
  chartSection: { 
    padding: 16 
  },
  chartCard: { 
    borderRadius: 16, 
    borderWidth: 1, 
    padding: 16 
  },
  chartTitle: { 
    fontSize: 16, 
    fontFamily: 'Inter-SemiBold', 
    textAlign: 'right',
    marginBottom: 16
  },
  chartContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'flex-end',
    height: 160,
    paddingVertical: 16
  },
  chartBar: { 
    alignItems: 'center',
    flex: 1
  },
  bar: { 
    width: 20, 
    borderRadius: 10,
    marginBottom: 8,
    minHeight: 4
  },
  barLabel: { 
    fontSize: 10, 
    fontFamily: 'Inter-Regular',
    textAlign: 'center'
  },
  barValue: { 
    fontSize: 10, 
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginTop: 4
  },

  // Info Section
  infoSection: { 
    padding: 16, 
    gap: 16 
  },
  infoCard: { 
    borderRadius: 16, 
    borderWidth: 1, 
    padding: 16 
  },
  infoTitle: { 
    fontSize: 16, 
    fontFamily: 'Inter-SemiBold', 
    textAlign: 'right',
    marginBottom: 12
  },
  infoText: { 
    fontSize: 14, 
    fontFamily: 'Inter-Regular', 
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 20
  },
});

