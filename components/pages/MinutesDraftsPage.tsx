import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { FileText, CreditCard as Edit, Trash2, Share, Clock, Search, Filter, Plus, Eye, Calendar, User, MapPin, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export function MinutesDraftsPage() {
  const { palette } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const drafts = [
    {
      id: 101,
      title: 'إداري قسم مصر الجديدة — محضر سرقة منقولات',
      content: 'المبلغ: السيد/ م.أ، قرر بسرقة حقيبته من داخل سيارته أثناء التوقف أمام مول سيتي ستارز، وبداخلها هاتف محمول ومبلغ نقدي 4200 جنيه وبطاقة رقم قومي. تم توجيهه لحصر المفقودات وتقديم ما يثبت الملكية، وجارِ تفريغ كاميرات المراقبة بالمنطقة.',
      lastModified: '2025-09-05T10:30:00',
      wordCount: 210,
      status: 'draft',
      category: 'theft'
    },
    {
      id: 102,
      title: 'جنح قسم الدقي — محضر نصب عبر تحويلات بنكية',
      content: 'قررت السيدة/ ن.س أنها تعرضت لواقعة نصب من حساب عبر تطبيق مراسلة ادعى توظيف الأموال بعائد شهري، وتم تحويل مبالغ بإجمالي 65 ألف جنيه. جارٍ فحص الأرقام والحسابات وإخطار مباحث الأموال العامة لاتخاذ اللازم.',
      lastModified: '2025-09-04T18:15:00',
      wordCount: 180,
      status: 'review',
      category: 'fraud'
    },
    {
      id: 103,
      title: 'إداري قسم شبرا — محضر مشاجرة وإصابة',
      content: 'تحرير محضر بالمشاجرة بين طرفين أمام محطة مترو شبرا، نتج عنها إصابة سطحية باليد اليمنى لأحد الأطراف. تم طلب تقرير طبي مبدئي وتحديد مدة العجز وإرفاق بيانات الشهود.',
      lastModified: '2025-09-03T22:40:00',
      wordCount: 140,
      status: 'draft',
      category: 'assault'
    },
    {
      id: 104,
      title: 'إداري قسم المعادي — محضر جرائم إلكترونية (ابتزاز)',
      content: 'قرر المبلغ/ ع.ع بتعرضه لابتزاز إلكتروني عبر منصة اجتماعية وتهديد بنشر صور خاصة. تم توجيهه لحفظ الأدلة الرقمية (رسائل/روابط/سكرين شوت)، وجارٍ إخطار مباحث الإنترنت واتخاذ الإجراءات القانونية.',
      lastModified: '2025-09-02T11:20:00',
      wordCount: 165,
      status: 'completed',
      category: 'cybercrime'
    },
    {
      id: 105,
      title: 'إداري قسم مدينة نصر أول — محضر فقد بطاقة رقم قومي',
      content: 'أبلغ السيد/ ك.م عن فقد بطاقة الرقم القومي بمحطة الحافلات بمدينة نصر. تم إثبات الحالة وإفهامه بالإجراءات اللازمة لاستخراج بدل فاقد وإخطار الجهات المعنية حال العثور.',
      lastModified: '2025-09-01T09:05:00',
      wordCount: 110,
      status: 'draft',
      category: 'missing'
    },
    {
      id: 106,
      title: 'مرور مصر الجديدة — محضر تصادم بسيط دون إصابات',
      content: 'وقع تصادم بين سيارتين بشارع الثورة دون إصابات، وحدث تلفيات طفيفة بالمصد الخلفي. تم عمل معاينة مكانية وإفادة السائقين بإجراءات التأمين والإصلاح، وجارٍ مراجعة كاميرات الإشارة.',
      lastModified: '2025-08-30T16:25:00',
      wordCount: 120,
      status: 'review',
      category: 'traffic'
    },
  ];

  const filters = [
    { id: 'all', name: 'الكل' },
    { id: 'draft', name: 'مسودات' },
    { id: 'review', name: 'قيد المراجعة' },
    { id: 'completed', name: 'مكتملة' },
    { id: 'theft', name: 'سرقة' },
    { id: 'fraud', name: 'نصب' },
    { id: 'assault', name: 'اعتداء' },
    { id: 'traffic', name: 'مرور' },
    { id: 'missing', name: 'غياب/فقد' },
    { id: 'cybercrime', name: 'إلكترونية' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#F59E0B';
      case 'review': return '#3B82F6';
      case 'completed': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'review': return 'قيد المراجعة';
      case 'completed': return 'مكتمل';
      default: return 'غير محدد';
    }
  };

  const filteredDrafts = drafts.filter(draft => {
    const matchesSearch = draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         draft.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = ['all','draft','review','completed'].includes(selectedFilter) ? (selectedFilter === 'all' || draft.status === selectedFilter) : true;
    const matchesCategory = ['theft','fraud','assault','traffic','missing','cybercrime'].includes(selectedFilter) ? draft.category === selectedFilter : true;
    const matchesFilter = matchesStatus && matchesCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={[styles.container, { backgroundColor: palette.background.secondary }]}>
      {/* Header Section */}
      <View style={[styles.headerSection, { backgroundColor: palette.background.primary }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={[styles.newDraftButton, { backgroundColor: palette.primary[500] }]}>
            <Plus size={18} color="#FFFFFF" />
            <Text style={styles.newDraftButtonText}>مسودة جديدة</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.pageTitle, { color: palette.text.primary }]}>مسودات المحاضر</Text>
            <Text style={[styles.pageSubtitle, { color: palette.text.secondary }]}>
              إدارة وتنظيم مسودات المحاضر القانونية
            </Text>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsOverview}>
          <View style={[styles.statItem, { backgroundColor: palette.background.secondary }]}>
            <Text style={[styles.statNumber, { color: palette.primary[500] }]}>6</Text>
            <Text style={[styles.statLabel, { color: palette.text.secondary }]}>إجمالي المسودات</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: palette.background.secondary }]}>
            <Text style={[styles.statNumber, { color: palette.success[500] }]}>2</Text>
            <Text style={[styles.statLabel, { color: palette.text.secondary }]}>مكتملة</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: palette.background.secondary }]}>
            <Text style={[styles.statNumber, { color: "#F59E0B" }]}>3</Text>
            <Text style={[styles.statLabel, { color: palette.text.secondary }]}>مسودات</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: palette.background.secondary }]}>
            <Text style={[styles.statNumber, { color: palette.primary[600] }]}>1</Text>
            <Text style={[styles.statLabel, { color: palette.text.secondary }]}>قيد المراجعة</Text>
          </View>
        </View>
      </View>

      {/* Search and Filter Bar */}
      <View style={[styles.searchBar, { backgroundColor: palette.background.primary, borderBottomColor: palette.border.default }]}>
        <View style={[styles.searchContainer, { backgroundColor: palette.background.secondary, borderColor: palette.border.default }]}>
          <Search size={18} color={palette.text.muted} />
          <TextInput
            style={[styles.searchInput, { color: palette.text.primary }]}
            placeholder="البحث في المسودات..."
            placeholderTextColor={palette.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                { 
                  backgroundColor: selectedFilter === filter.id ? palette.primary[500] : palette.background.secondary,
                  borderColor: selectedFilter === filter.id ? palette.primary[500] : palette.border.default
                }
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterText,
                { color: selectedFilter === filter.id ? '#FFFFFF' : palette.text.secondary }
              ]}>
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Grid Layout */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {filteredDrafts.map((draft) => (
            <View key={draft.id} style={[styles.draftCard, { backgroundColor: palette.background.primary, borderColor: palette.border.default }]}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(draft.status) }]} />
                <View style={styles.cardActions}>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: palette.background.secondary }]}>
                    <Eye size={14} color={palette.text.muted} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: palette.background.secondary }]}>
                    <Share size={14} color={palette.text.muted} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: palette.background.secondary }]}>
                    <Trash2 size={14} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Card Content */}
              <View style={styles.cardContent}>
                <Text style={[styles.draftTitle, { color: palette.text.primary }]} numberOfLines={2}>
                  {draft.title}
                </Text>
                <Text style={[styles.draftPreview, { color: palette.text.secondary }]} numberOfLines={3}>
                  {draft.content}
                </Text>
              </View>

              {/* Card Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.draftMeta}>
                  <View style={styles.metaItem}>
                    <Calendar size={12} color={palette.text.muted} />
                    <Text style={[styles.metaText, { color: palette.text.muted }]}>
                      {new Date(draft.lastModified).toLocaleDateString('ar-SA')}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <FileText size={12} color={palette.text.muted} />
                    <Text style={[styles.metaText, { color: palette.text.muted }]}>
                      {draft.wordCount} كلمة
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity style={[styles.editButton, { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" }]}>
                  <Edit size={14} color="#10B981" />
                  <Text style={[styles.editButtonText, { color: "#10B981" }]}>تحرير</Text>
                </TouchableOpacity>
              </View>

              {/* Status Badge */}
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(draft.status) + '15' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(draft.status) }]}>
                  {getStatusText(draft.status)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header Section
  headerSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
    textAlign: 'right',
  },
  pageSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
  },
  newDraftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  newDraftButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 6,
  },
  
  // Stats Overview
  statsOverview: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  
  // Search Bar
  searchBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    marginLeft: 10,
  },
  filtersContainer: {
    marginHorizontal: -4,
  },
  filterChip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  
  // Grid Layout
  scrollContainer: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  draftCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    position: 'relative',
    minHeight: 280,
  },
  
  // Card Header
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Card Content
  cardContent: {
    flex: 1,
    marginBottom: 12,
  },
  draftTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    textAlign: 'right',
    lineHeight: 20,
  },
  draftPreview: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
    textAlign: 'right',
  },
  
  // Card Footer
  cardFooter: {
    alignItems: 'flex-end',
  },
  draftMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    gap: 4,
  },
  editButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  
  // Status Badge
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
});
