import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { FileText, Plus, CreditCard as Edit, Trash2, Copy, Star, Search, Filter, Eye } from 'lucide-react-native';

export function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  const templates = [
    {
      id: 1,
      name: 'تحليل الأخبار الأساسي',
      category: 'analysis',
      description: 'قالب أساسي لتحليل مصداقية الأخبار',
      lastUsed: '2024-01-15',
      isStarred: true,
      content: '# تحليل الخبر\n\n## الملخص\n...'
    },
    {
      id: 2,
      name: 'تقرير تحقيق صحفي',
      category: 'investigation',
      description: 'قالب شامل للتحقيقات الصحفية',
      lastUsed: '2024-01-14',
      isStarred: false,
      content: '# تقرير التحقيق\n\n## المقدمة\n...'
    },
    {
      id: 3,
      name: 'تدقيق الحقائق السريع',
      category: 'fact-check',
      description: 'قالب مختصر لتدقيق المعلومات',
      lastUsed: '2024-01-13',
      isStarred: true,
      content: '# تدقيق الحقائق\n\n## النتيجة\n...'
    },
    {
      id: 4,
      name: 'ملخص إخباري يومي',
      category: 'summary',
      description: 'قالب لتلخيص الأحداث اليومية',
      lastUsed: '2024-01-12',
      isStarred: false,
      content: '# الملخص اليومي\n\n## أهم الأحداث\n...'
    },
  ];

  const categories = [
    { id: 'all', name: 'الكل' },
    { id: 'analysis', name: 'تحليل' },
    { id: 'investigation', name: 'تحقيق' },
    { id: 'fact-check', name: 'تدقيق' },
    { id: 'summary', name: 'ملخص' },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = () => {
    // Here you would save the new template
    setShowCreateModal(false);
    setNewTemplateName('');
    setNewTemplateContent('');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.createButtonText}>قالب جديد</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>قوالب التقارير</Text>
            <Text style={styles.subtitle}>إدارة وتنظيم قوالب التقارير والمحتوى</Text>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="البحث في القوالب..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              textAlign="right"
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Templates Grid */}
        <View style={styles.templatesGrid}>
          {filteredTemplates.map((template) => (
            <View key={template.id} style={styles.templateCard}>
              <View style={styles.templateHeader}>
                <View style={styles.templateActions}>
                  <TouchableOpacity style={styles.templateAction}>
                    <Eye size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.templateAction}>
                    <Copy size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.templateAction}>
                    <Edit size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.templateAction}>
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.starButton}>
                  <Star 
                    size={20} 
                    color={template.isStarred ? "#F59E0B" : "#D1D5DB"}
                    fill={template.isStarred ? "#F59E0B" : "none"}
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.templateContent}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDescription}>{template.description}</Text>
                <Text style={styles.templateLastUsed}>
                  آخر استخدام: {new Date(template.lastUsed).toLocaleDateString('ar-SA')}
                </Text>
              </View>

              <TouchableOpacity style={styles.useTemplateButton}>
                <Text style={styles.useTemplateText}>استخدام القالب</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Create Template Modal */}
        <Modal
          visible={showCreateModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.modalCloseText}>إلغاء</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>إنشاء قالب جديد</Text>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.modalInputSection}>
                <Text style={styles.modalInputLabel}>اسم القالب</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="أدخل اسم القالب..."
                  placeholderTextColor="#9CA3AF"
                  value={newTemplateName}
                  onChangeText={setNewTemplateName}
                  textAlign="right"
                />
              </View>

              <View style={styles.modalInputSection}>
                <Text style={styles.modalInputLabel}>محتوى القالب</Text>
                <TextInput
                  style={styles.modalTextArea}
                  multiline
                  numberOfLines={10}
                  placeholder="أدخل محتوى القالب..."
                  placeholderTextColor="#9CA3AF"
                  value={newTemplateContent}
                  onChangeText={setNewTemplateContent}
                  textAlign="right"
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity 
                style={[styles.createTemplateButton, (!newTemplateName.trim() || !newTemplateContent.trim()) && styles.createTemplateButtonDisabled]}
                onPress={handleCreateTemplate}
                disabled={!newTemplateName.trim() || !newTemplateContent.trim()}
              >
                <Text style={[styles.createTemplateText, (!newTemplateName.trim() || !newTemplateContent.trim()) && styles.createTemplateTextDisabled]}>
                  إنشاء القالب
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  createButtonText: {
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
  categoriesScroll: {
    marginHorizontal: -12,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  templatesGrid: {
    gap: 16,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  templateAction: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateContent: {
    marginBottom: 16,
  },
  templateName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'right',
  },
  templateDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'right',
    lineHeight: 20,
  },
  templateLastUsed: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'right',
  },
  useTemplateButton: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    alignItems: 'center',
  },
  useTemplateText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'right',
  },
  modalCloseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalCloseText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalInputSection: {
    marginBottom: 20,
  },
  modalInputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'right',
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'right',
  },
  modalTextArea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 200,
    textAlign: 'right',
  },
  createTemplateButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  createTemplateButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  createTemplateText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  createTemplateTextDisabled: {
    color: '#9CA3AF',
  },
});