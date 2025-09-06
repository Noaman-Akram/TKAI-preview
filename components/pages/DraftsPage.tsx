import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { FileText, CreditCard as Edit, Trash2, Share, Clock, Search, Filter, Plus, Eye } from 'lucide-react-native';

export function DraftsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const drafts = [
    {
      id: 1,
      title: 'تحليل أخبار الاقتصاد المصري',
      content: 'تحليل شامل للوضع الاقتصادي الحالي في مصر...',
      lastModified: '2024-01-15T10:30:00',
      wordCount: 1250,
      status: 'draft',
      category: 'analysis'
    },
    {
      id: 2,
      title: 'تقرير عن انتشار المعلومات المضللة',
      content: 'دراسة حول انتشار الأخبار المزيفة على وسائل التواصل...',
      lastModified: '2024-01-14T15:45:00',
      wordCount: 890,
      status: 'review',
      category: 'investigation'
    },
    {
      id: 3,
      title: 'ملخص أحداث الأسبوع',
      content: 'ملخص شامل لأهم الأحداث التي شهدها الأسبوع...',
      lastModified: '2024-01-13T09:15:00',
      wordCount: 650,
      status: 'draft',
      category: 'summary'
    },
    {
      id: 4,
      title: 'تدقيق حقائق: ادعاءات صحية',
      content: 'تدقيق للادعاءات الصحية المنتشرة مؤخراً...',
      lastModified: '2024-01-12T14:20:00',
      wordCount: 420,
      status: 'completed',
      category: 'fact-check'
    },
  ];

  const filters = [
    { id: 'all', name: 'الكل' },
    { id: 'draft', name: 'مسودات' },
    { id: 'review', name: 'قيد المراجعة' },
    { id: 'completed', name: 'مكتملة' },
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
    const matchesFilter = selectedFilter === 'all' || draft.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.newDraftButton}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.newDraftButtonText}>مسودة جديدة</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>المسودات</Text>
            <Text style={styles.subtitle}>إدارة وتنظيم مسودات التقارير والمحتوى</Text>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="البحث في المسودات..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              textAlign="right"
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
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

        {/* Drafts List */}
        <View style={styles.draftsList}>
          {filteredDrafts.map((draft) => (
            <View key={draft.id} style={styles.draftCard}>
              <View style={styles.draftHeader}>
                <View style={styles.draftActions}>
                  <TouchableOpacity style={styles.draftAction}>
                    <Eye size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.draftAction}>
                    <Share size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.draftAction}>
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(draft.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(draft.status) }]}>
                    {getStatusText(draft.status)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.draftTitle}>{draft.title}</Text>
              <Text style={styles.draftPreview} numberOfLines={2}>
                {draft.content}
              </Text>
              
              <View style={styles.draftMeta}>
                <Text style={styles.wordCount}>{draft.wordCount} كلمة</Text>
                <View style={styles.lastModified}>
                  <Clock size={14} color="#9CA3AF" />
                  <Text style={styles.lastModifiedText}>
                    {new Date(draft.lastModified).toLocaleDateString('ar-SA')}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.editButton}>
                <Edit size={18} color="#10B981" />
                <Text style={styles.editButtonText}>تحرير</Text>
              </TouchableOpacity>
            </View>
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  headerContent: {
    flex: 1,
    alignItems: 'flex-end',
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
  newDraftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  newDraftButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginLeft: 12,
  },
  filtersScroll: {
    marginHorizontal: -12,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 6,
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
  draftsList: {
    gap: 16,
  },
  draftCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  draftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  draftActions: {
    flexDirection: 'row',
    gap: 8,
  },
  draftAction: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'right',
  },
  draftPreview: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'right',
  },
  draftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  wordCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  lastModified: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastModifiedText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginRight: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginRight: 8,
  },
});