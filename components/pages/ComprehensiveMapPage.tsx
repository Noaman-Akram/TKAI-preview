import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MapPin, TrendingUp, TrendingDown, TriangleAlert as AlertTriangle, Shield, Eye, Filter, Calendar, ChartBar as BarChart3, Users, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface CrimeData {
  governorate: string;
  coordinates: { x: number; y: number };
  totalCrimes: number;
  trend: 'up' | 'down' | 'stable';
  riskLevel: 'low' | 'medium' | 'high';
  categories: {
    theft: number;
    fraud: number;
    assault: number;
    cybercrime: number;
  };
  prediction: {
    nextMonth: number;
    confidence: number;
  };
}

export function ComprehensiveMapPage() {
  const [selectedGovernorate, setSelectedGovernorate] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('current');
  const [filteredData, setFilteredData] = useState<CrimeData[]>([]);

  const crimeData: CrimeData[] = [
    {
      governorate: 'القاهرة',
      coordinates: { x: 50, y: 45 },
      totalCrimes: 1247,
      trend: 'down',
      riskLevel: 'medium',
      categories: { theft: 456, fraud: 234, assault: 123, cybercrime: 434 },
      prediction: { nextMonth: 1180, confidence: 87 }
    },
    {
      governorate: 'الجيزة',
      coordinates: { x: 45, y: 48 },
      totalCrimes: 892,
      trend: 'up',
      riskLevel: 'medium',
      categories: { theft: 345, fraud: 178, assault: 89, cybercrime: 280 },
      prediction: { nextMonth: 950, confidence: 82 }
    },
    {
      governorate: 'الإسكندرية',
      coordinates: { x: 35, y: 25 },
      totalCrimes: 634,
      trend: 'stable',
      riskLevel: 'low',
      categories: { theft: 234, fraud: 145, assault: 67, cybercrime: 188 },
      prediction: { nextMonth: 640, confidence: 91 }
    },
    {
      governorate: 'أسوان',
      coordinates: { x: 55, y: 85 },
      totalCrimes: 156,
      trend: 'down',
      riskLevel: 'low',
      categories: { theft: 67, fraud: 34, assault: 23, cybercrime: 32 },
      prediction: { nextMonth: 145, confidence: 89 }
    },
    {
      governorate: 'الأقصر',
      coordinates: { x: 52, y: 80 },
      totalCrimes: 203,
      trend: 'stable',
      riskLevel: 'low',
      categories: { theft: 89, fraud: 45, assault: 34, cybercrime: 35 },
      prediction: { nextMonth: 205, confidence: 85 }
    },
    {
      governorate: 'بورسعيد',
      coordinates: { x: 45, y: 20 },
      totalCrimes: 287,
      trend: 'up',
      riskLevel: 'medium',
      categories: { theft: 123, fraud: 67, assault: 45, cybercrime: 52 },
      prediction: { nextMonth: 310, confidence: 78 }
    },
    {
      governorate: 'الإسماعيلية',
      coordinates: { x: 48, y: 22 },
      totalCrimes: 234,
      trend: 'down',
      riskLevel: 'low',
      categories: { theft: 98, fraud: 56, assault: 34, cybercrime: 46 },
      prediction: { nextMonth: 220, confidence: 83 }
    },
    {
      governorate: 'المنيا',
      coordinates: { x: 48, y: 65 },
      totalCrimes: 345,
      trend: 'up',
      riskLevel: 'medium',
      categories: { theft: 145, fraud: 78, assault: 56, cybercrime: 66 },
      prediction: { nextMonth: 370, confidence: 80 }
    }
  ];

  // Update filtered data when filters change
  useEffect(() => {
    let filtered = [...crimeData];

    // Apply timeframe filter
    if (selectedTimeframe !== 'current') {
      // Simulate different data for different timeframes
      filtered = filtered.map(data => ({
        ...data,
        totalCrimes: selectedTimeframe === 'last3months' ? Math.floor(data.totalCrimes * 2.8) :
                    selectedTimeframe === 'last6months' ? Math.floor(data.totalCrimes * 5.2) :
                    selectedTimeframe === 'lastyear' ? Math.floor(data.totalCrimes * 11.5) :
                    data.totalCrimes,
        categories: {
          theft: selectedTimeframe === 'last3months' ? Math.floor(data.categories.theft * 2.8) :
                selectedTimeframe === 'last6months' ? Math.floor(data.categories.theft * 5.2) :
                selectedTimeframe === 'lastyear' ? Math.floor(data.categories.theft * 11.5) :
                data.categories.theft,
          fraud: selectedTimeframe === 'last3months' ? Math.floor(data.categories.fraud * 2.8) :
                selectedTimeframe === 'last6months' ? Math.floor(data.categories.fraud * 5.2) :
                selectedTimeframe === 'lastyear' ? Math.floor(data.categories.fraud * 11.5) :
                data.categories.fraud,
          assault: selectedTimeframe === 'last3months' ? Math.floor(data.categories.assault * 2.8) :
                  selectedTimeframe === 'last6months' ? Math.floor(data.categories.assault * 5.2) :
                  selectedTimeframe === 'lastyear' ? Math.floor(data.categories.assault * 11.5) :
                  data.categories.assault,
          cybercrime: selectedTimeframe === 'last3months' ? Math.floor(data.categories.cybercrime * 2.8) :
                     selectedTimeframe === 'last6months' ? Math.floor(data.categories.cybercrime * 5.2) :
                     selectedTimeframe === 'lastyear' ? Math.floor(data.categories.cybercrime * 11.5) :
                     data.categories.cybercrime,
        }
      }));
    }

    setFilteredData(filtered);
  }, [selectedFilter, selectedTimeframe]);

  const filters = [
    { id: 'all', name: 'جميع الجرائم' },
    { id: 'theft', name: 'السرقة' },
    { id: 'fraud', name: 'الاحتيال' },
    { id: 'assault', name: 'الاعتداء' },
    { id: 'cybercrime', name: 'الجرائم الإلكترونية' },
  ];

  const timeframes = [
    { id: 'current', name: 'الشهر الحالي' },
    { id: 'last3months', name: 'آخر 3 أشهر' },
    { id: 'last6months', name: 'آخر 6 أشهر' },
    { id: 'lastyear', name: 'العام الماضي' },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return BarChart3;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#EF4444';
      case 'down': return '#10B981';
      default: return '#6B7280';
    }
  };

  const selectedData = selectedGovernorate 
    ? filteredData.find(data => data.governorate === selectedGovernorate)
    : null;

  // Get filtered crime count based on selected filter
  const getFilteredCrimeCount = (data: CrimeData) => {
    if (selectedFilter === 'all') return data.totalCrimes;
    if (selectedFilter === 'theft') return data.categories.theft;
    if (selectedFilter === 'fraud') return data.categories.fraud;
    if (selectedFilter === 'assault') return data.categories.assault;
    if (selectedFilter === 'cybercrime') return data.categories.cybercrime;
    return data.totalCrimes;
  };

  // Get map point size based on crime count
  const getMapPointSize = (data: CrimeData) => {
    const count = getFilteredCrimeCount(data);
    const maxCount = Math.max(...filteredData.map(d => getFilteredCrimeCount(d)));
    const minSize = 24;
    const maxSize = 40;
    return minSize + ((count / maxCount) * (maxSize - minSize));
  };

  // Get total crimes for current filter
  const getTotalFilteredCrimes = () => {
    return filteredData.reduce((sum, data) => sum + getFilteredCrimeCount(data), 0);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>الخريطة الشاملة للجرائم في مصر</Text>
          <Text style={styles.subtitle}>
            خريطة تفاعلية تُظهر السجلات الجنائية والتاريخ والتنبؤات
          </Text>
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>نوع الجريمة:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterChip,
                    selectedFilter === filter.id && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedFilter(filter.id)}
                >
                  <Text style={[
                    styles.filterText,
                    selectedFilter === filter.id && styles.filterTextActive
                  ]}>
                    {filter.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>الفترة الزمنية:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {timeframes.map((timeframe) => (
                <TouchableOpacity
                  key={timeframe.id}
                  style={[
                    styles.filterChip,
                    selectedTimeframe === timeframe.id && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedTimeframe(timeframe.id)}
                >
                  <Text style={[
                    styles.filterText,
                    selectedTimeframe === timeframe.id && styles.filterTextActive
                  ]}>
                    {timeframe.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Interactive Map */}
        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>خريطة مصر التفاعلية</Text>
          <View style={styles.mapContainer}>
            {/* Egypt Map Outline */}
            <View style={styles.egyptMap}>
              {filteredData.map((data) => {
                const TrendIcon = getTrendIcon(data.trend);
                const pointSize = getMapPointSize(data);
                const crimeCount = getFilteredCrimeCount(data);
                return (
                  <TouchableOpacity
                    key={data.governorate}
                    style={[
                      styles.mapPoint,
                      {
                        left: `${data.coordinates.x}%`,
                        top: `${data.coordinates.y}%`,
                        backgroundColor: getRiskColor(data.riskLevel),
                        width: pointSize,
                        height: pointSize,
                        borderRadius: pointSize / 2,
                      },
                      selectedGovernorate === data.governorate && styles.mapPointSelected
                    ]}
                    onPress={() => setSelectedGovernorate(
                      selectedGovernorate === data.governorate ? null : data.governorate
                    )}
                  >
                    <MapPin size={Math.max(12, pointSize * 0.4)} color="#FFFFFF" />
                    <View style={styles.crimeCountBadge}>
                      <Text style={styles.crimeCountText}>
                        {crimeCount > 999 ? `${Math.floor(crimeCount/1000)}k` : crimeCount}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Legend */}
            <View style={styles.mapLegend}>
              <Text style={styles.legendTitle}>مستوى المخاطر:</Text>
              <View style={styles.legendItems}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.legendText}>منخفض</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.legendText}>متوسط</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.legendText}>عالي</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Statistics Overview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>إحصائيات عامة</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <BarChart3 size={24} color="#10B981" />
              </View>
              <Text style={styles.statValue}>
                {getTotalFilteredCrimes().toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>
                {selectedFilter === 'all' ? 'إجمالي الجرائم' :
                 selectedFilter === 'theft' ? 'جرائم السرقة' :
                 selectedFilter === 'fraud' ? 'جرائم الاحتيال' :
                 selectedFilter === 'assault' ? 'جرائم الاعتداء' :
                 selectedFilter === 'cybercrime' ? 'الجرائم الإلكترونية' :
                 'إجمالي الجرائم'}
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                {selectedTimeframe === 'current' ? 
                  <TrendingDown size={24} color="#10B981" /> :
                  <TrendingUp size={24} color="#3B82F6" />
                }
              </View>
              <Text style={styles.statValue}>
                {selectedTimeframe === 'current' ? '-12%' :
                 selectedTimeframe === 'last3months' ? '+8%' :
                 selectedTimeframe === 'last6months' ? '+15%' :
                 '+23%'}
              </Text>
              <Text style={styles.statLabel}>
                {selectedTimeframe === 'current' ? 'انخفاض هذا الشهر' :
                 selectedTimeframe === 'last3months' ? 'زيادة آخر 3 أشهر' :
                 selectedTimeframe === 'last6months' ? 'زيادة آخر 6 أشهر' :
                 'زيادة العام الماضي'}
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Shield size={24} color="#3B82F6" />
              </View>
              <Text style={styles.statValue}>94.2%</Text>
              <Text style={styles.statLabel}>معدل الحل</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <AlertTriangle size={24} color="#F59E0B" />
              </View>
              <Text style={styles.statValue}>23</Text>
              <Text style={styles.statLabel}>مناطق عالية المخاطر</Text>
            </View>
          </View>
        </View>

        {/* Selected Governorate Details */}
        {selectedData && (
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>تفاصيل {selectedData.governorate}</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailsHeader}>
                <View style={styles.trendIndicator}>
                  {React.createElement(getTrendIcon(selectedData.trend), {
                    size: 20,
                    color: getTrendColor(selectedData.trend)
                  })}
                  <Text style={[
                    styles.trendText,
                    { color: getTrendColor(selectedData.trend) }
                  ]}>
                    {selectedData.trend === 'up' ? 'ارتفاع' : 
                     selectedData.trend === 'down' ? 'انخفاض' : 'مستقر'}
                  </Text>
                </View>
                <Text style={styles.governorateName}>{selectedData.governorate}</Text>
              </View>

              <View style={styles.crimeStats}>
                <View style={styles.mainStat}>
                  <Text style={styles.mainStatValue}>{selectedData.totalCrimes.toLocaleString()}</Text>
                  <Text style={styles.mainStatLabel}>إجمالي الجرائم</Text>
                </View>

                <View style={styles.categoryStats}>
                  {Object.entries(selectedData.categories).map(([category, count]) => {
                    const categoryNames: Record<string, string> = {
                      theft: 'السرقة',
                      fraud: 'الاحتيال',
                      assault: 'الاعتداء',
                      cybercrime: 'الجرائم الإلكترونية'
                    };
                    
                    const isHighlighted = selectedFilter === category || selectedFilter === 'all';
                    
                    return (
                      <TouchableOpacity 
                        key={category} 
                        style={[
                          styles.categoryStat,
                          isHighlighted && styles.categoryStatHighlighted,
                          selectedFilter === category && styles.categoryStatActive
                        ]}
                        onPress={() => setSelectedFilter(selectedFilter === category ? 'all' : category)}
                      >
                        <Text style={styles.categoryCount}>{count}</Text>
                        <Text style={styles.categoryName}>{categoryNames[category]}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.predictionSection}>
                <Text style={styles.predictionTitle}>التنبؤ للشهر القادم</Text>
                <View style={styles.predictionData}>
                  <View style={styles.predictionValue}>
                    <Text style={styles.predictionNumber}>
                      {selectedData.prediction.nextMonth.toLocaleString()}
                    </Text>
                    <Text style={styles.predictionLabel}>جريمة متوقعة</Text>
                  </View>
                  <View style={styles.confidenceIndicator}>
                    <Text style={styles.confidenceLabel}>
                      دقة التنبؤ: {selectedData.prediction.confidence}%
                    </Text>
                    <View style={styles.confidenceBar}>
                      <View 
                        style={[
                          styles.confidenceFill,
                          { width: `${selectedData.prediction.confidence}%` }
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.riskAssessment}>
                <Text style={styles.riskTitle}>تقييم المخاطر</Text>
                <View style={[
                  styles.riskBadge,
                  { backgroundColor: getRiskColor(selectedData.riskLevel) + '20' }
                ]}>
                  <Text style={[
                    styles.riskText,
                    { color: getRiskColor(selectedData.riskLevel) }
                  ]}>
                    {selectedData.riskLevel === 'high' ? 'مخاطر عالية' :
                     selectedData.riskLevel === 'medium' ? 'مخاطر متوسطة' : 'مخاطر منخفضة'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Top Governorates List */}
        <View style={styles.rankingSection}>
          <Text style={styles.sectionTitle}>ترتيب المحافظات حسب معدل الجرائم</Text>
          <View style={styles.rankingList}>
            {filteredData
              .sort((a, b) => getFilteredCrimeCount(b) - getFilteredCrimeCount(a))
              .map((data, index) => {
                const TrendIcon = getTrendIcon(data.trend);
                const crimeCount = getFilteredCrimeCount(data);
                return (
                  <TouchableOpacity
                    key={data.governorate}
                    style={[
                      styles.rankingItem,
                      selectedGovernorate === data.governorate && styles.rankingItemSelected
                    ]}
                    onPress={() => setSelectedGovernorate(
                      selectedGovernorate === data.governorate ? null : data.governorate
                    )}
                  >
                    <View style={styles.rankingRight}>
                      <View style={styles.rankingTrend}>
                        <TrendIcon size={16} color={getTrendColor(data.trend)} />
                      </View>
                      <View style={[
                        styles.rankingRisk,
                        { backgroundColor: getRiskColor(data.riskLevel) }
                      ]} />
                    </View>
                    
                    <View style={styles.rankingContent}>
                      <Text style={styles.rankingGovernorate}>{data.governorate}</Text>
                      <Text style={styles.rankingCount}>
                        {crimeCount.toLocaleString()} 
                        {selectedFilter === 'all' ? ' جريمة' :
                         selectedFilter === 'theft' ? ' سرقة' :
                         selectedFilter === 'fraud' ? ' احتيال' :
                         selectedFilter === 'assault' ? ' اعتداء' :
                         selectedFilter === 'cybercrime' ? ' جريمة إلكترونية' :
                         ' جريمة'}
                      </Text>
                    </View>
                    
                    <View style={styles.rankingNumber}>
                      <Text style={styles.rankingNumberText}>{index + 1}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>رؤى ذكية</Text>
          <Text style={styles.insightsSubtitle}>
            تحليلات مبنية على {selectedTimeframe === 'current' ? 'البيانات الحالية' :
            selectedTimeframe === 'last3months' ? 'آخر 3 أشهر' :
            selectedTimeframe === 'last6months' ? 'آخر 6 أشهر' : 'العام الماضي'}
          </Text>
          <View style={styles.insightsList}>
            <View style={styles.insightCard}>
              <View style={styles.insightIcon}>
                <TrendingDown size={20} color="#10B981" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>
                  {selectedFilter === 'theft' ? 'تركيز على جرائم السرقة' :
                   selectedFilter === 'fraud' ? 'تركيز على جرائم الاحتيال' :
                   selectedFilter === 'assault' ? 'تركيز على جرائم الاعتداء' :
                   selectedFilter === 'cybercrime' ? 'تركيز على الجرائم الإلكترونية' :
                   'انخفاض في جرائم السرقة'}
                </Text>
                <Text style={styles.insightText}>
                  {selectedFilter === 'theft' ? 'جرائم السرقة تمثل أكبر نسبة في المحافظات الحضرية' :
                   selectedFilter === 'fraud' ? 'جرائم الاحتيال في ازدياد مع التطور التكنولوجي' :
                   selectedFilter === 'assault' ? 'جرائم الاعتداء تتركز في المناطق المكتظة بالسكان' :
                   selectedFilter === 'cybercrime' ? 'الجرائم الإلكترونية تشهد نمواً سريعاً في جميع المحافظات' :
                   'انخفضت جرائم السرقة بنسبة 15% في القاهرة والجيزة خلال الشهر الماضي'}
                </Text>
              </View>
            </View>

            <View style={styles.insightCard}>
              <View style={styles.insightIcon}>
                {selectedTimeframe === 'current' ? 
                  <AlertTriangle size={20} color="#F59E0B" /> :
                  <BarChart3 size={20} color="#3B82F6" />
                }
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>
                  {selectedTimeframe === 'current' ? 'ارتفاع الجرائم الإلكترونية' :
                   'اتجاهات تاريخية'}
                </Text>
                <Text style={styles.insightText}>
                  {selectedTimeframe === 'current' ? 
                    'زيادة ملحوظة في الجرائم الإلكترونية بنسبة 23% في المحافظات الحضرية' :
                    `البيانات التاريخية تُظهر اتجاهات مختلفة عبر ${selectedTimeframe === 'last3months' ? '3 أشهر' :
                    selectedTimeframe === 'last6months' ? '6 أشهر' : 'عام كامل'}`}
                </Text>
              </View>
            </View>

            <View style={styles.insightCard}>
              <View style={styles.insightIcon}>
                <Shield size={20} color="#3B82F6" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>تحسن في معدلات الحل</Text>
                <Text style={styles.insightText}>
                  ارتفع معدل حل القضايا إلى 94.2% بفضل التقنيات الحديثة
                </Text>
              </View>
            </View>
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
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'right',
  },
  filtersSection: {
    marginBottom: 24,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'right',
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  mapSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'right',
  },
  mapContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  egyptMap: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  mapPoint: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPointSelected: {
    transform: [{ scale: 1.2 }],
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  crimeCountBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  crimeCountText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  mapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  legendItems: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 6,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  detailsSection: {
    marginBottom: 32,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  governorateName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    textAlign: 'right',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginRight: 6,
  },
  crimeStats: {
    marginBottom: 24,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainStatValue: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  mainStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  categoryStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryStat: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryStatHighlighted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  categoryStatActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  categoryCount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  predictionSection: {
    marginBottom: 20,
  },
  predictionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'right',
  },
  predictionData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  predictionValue: {
    alignItems: 'flex-end',
  },
  predictionNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  predictionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  confidenceIndicator: {
    flex: 1,
    marginRight: 20,
  },
  confidenceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'right',
  },
  confidenceBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  riskAssessment: {
    alignItems: 'flex-end',
  },
  riskTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'right',
  },
  riskBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  riskText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  rankingSection: {
    marginBottom: 32,
  },
  rankingList: {
    gap: 8,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rankingItemSelected: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  rankingNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  rankingNumberText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#6B7280',
  },
  rankingContent: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  rankingGovernorate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
    textAlign: 'right',
  },
  rankingCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'right',
  },
  rankingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankingTrend: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankingRisk: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  insightsSection: {
    marginBottom: 32,
  },
  insightsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'right',
  },
  insightsList: {
    gap: 16,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  insightContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'right',
  },
  insightText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'right',
  },
});