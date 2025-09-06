import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { 
  FileText, 
  Save, 
  Download, 
  Share, 
  Eye, 
  Sparkles, 
  Copy,
  RotateCcw,
  Settings,
  Palette,
  Mic
} from 'lucide-react-native';
import { SpeechToText } from '@/components/SpeechToText';

export function ReportWriterPage() {
  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('news-analysis');
  const [showSpeechToText, setShowSpeechToText] = useState(false);

  const templates = [
    { id: 'news-analysis', name: 'تحليل الأخبار', description: 'قالب لتحليل مصداقية الأخبار' },
    { id: 'investigation', name: 'تقرير تحقيق', description: 'قالب للتحقيقات الصحفية' },
    { id: 'fact-check', name: 'تدقيق الحقائق', description: 'قالب لتدقيق المعلومات' },
    { id: 'summary', name: 'ملخص إخباري', description: 'قالب لتلخيص الأحداث' },
  ];

  const handleGenerateContent = () => {
    setIsGenerating(true);
    // Simulate AI content generation
    setTimeout(() => {
      setReportContent(`# تقرير تحليل الأخبار

## الملخص التنفيذي
تم تحليل المحتوى المقدم باستخدام تقنيات الذكاء الاصطناعي المتقدمة لتحديد مستوى المصداقية والموثوقية.

## النتائج الرئيسية
- **مستوى المصداقية**: عالي (85%)
- **المصادر المتحققة**: 3 مصادر موثوقة
- **علامات التحذير**: لا توجد

## التوصيات
1. يُنصح بالاعتماد على هذا المحتوى
2. مراجعة دورية للمصادر المرجعية
3. متابعة التطورات الجديدة

## الخلاصة
المحتوى المحلل يظهر مؤشرات إيجابية للمصداقية ويمكن الاعتماد عليه كمصدر موثوق للمعلومات.`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleTranscriptionComplete = (transcribedText: string) => {
    setReportContent(prev => prev + (prev ? '\n\n' : '') + transcribedText);
    setShowSpeechToText(false);
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Download size={18} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share size={18} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowPreview(true)}
            >
              <Eye size={18} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.primaryAction]}>
              <Save size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.title}>كاتب التقارير الذكي</Text>
            <Text style={styles.subtitle}>إنشاء تقارير احترافية بمساعدة الذكاء الاصطناعي</Text>
          </View>
        </View>

        {/* Template Selection */}
        <View style={styles.templateSection}>
          <Text style={styles.sectionTitle}>اختر قالب التقرير</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateCard,
                  selectedTemplate === template.id && styles.templateCardActive
                ]}
                onPress={() => setSelectedTemplate(template.id)}
              >
                <FileText 
                  size={24} 
                  color={selectedTemplate === template.id ? '#10B981' : '#6B7280'} 
                />
                <Text style={[
                  styles.templateName,
                  selectedTemplate === template.id && styles.templateNameActive
                ]}>
                  {template.name}
                </Text>
                <Text style={styles.templateDescription}>{template.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Report Title */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>عنوان التقرير</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="أدخل عنوان التقرير..."
            placeholderTextColor="#9CA3AF"
            value={reportTitle}
            onChangeText={setReportTitle}
            textAlign="right"
          />
        </View>

        {/* AI Generation Tools */}
        <View style={styles.aiToolsSection}>
          <Text style={styles.sectionTitle}>أدوات الذكاء الاصطناعي</Text>
          <View style={styles.aiToolsGrid}>
            <TouchableOpacity 
              style={styles.aiTool}
              onPress={handleGenerateContent}
              disabled={isGenerating}
            >
              <Sparkles size={20} color={isGenerating ? '#9CA3AF' : '#10B981'} />
              <Text style={[styles.aiToolText, isGenerating && styles.aiToolTextDisabled]}>
                {isGenerating ? 'جاري الإنشاء...' : 'إنشاء محتوى'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.aiTool}>
              <Copy size={20} color="#10B981" />
              <Text style={styles.aiToolText}>تحسين النص</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.aiTool}>
              <RotateCcw size={20} color="#10B981" />
              <Text style={styles.aiToolText}>إعادة صياغة</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.aiTool}>
              <Palette size={20} color="#10B981" />
              <Text style={styles.aiToolText}>تنسيق</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.aiTool}
              onPress={() => setShowSpeechToText(!showSpeechToText)}
            >
              <Mic size={20} color="#10B981" />
              <Text style={styles.aiToolText}>تسجيل صوتي</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Speech to Text Component */}
        {showSpeechToText && (
          <View style={styles.speechToTextOverlay}>
            <View style={styles.speechToTextContainer}>
              <SpeechToText
                onTranscriptionComplete={handleTranscriptionComplete}
                onClose={() => setShowSpeechToText(false)}
              />
            </View>
          </View>
        )}
        {/* Content Editor */}
        <View style={styles.editorSection}>
          <Text style={styles.sectionTitle}>محرر المحتوى</Text>
          <View style={styles.editorContainer}>
            <TextInput
              style={styles.contentEditor}
              multiline
              placeholder="ابدأ في كتابة تقريرك هنا أو استخدم أدوات الذكاء الاصطناعي لإنشاء المحتوى..."
              placeholderTextColor="#9CA3AF"
              value={reportContent}
              onChangeText={setReportContent}
              textAlign="right"
              textAlignVertical="top"
            />
            {reportContent.length > 0 && (
              <Text style={styles.wordCount}>
                عدد الكلمات: {reportContent.split(' ').filter(word => word.length > 0).length}
              </Text>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionText}>حفظ كمسودة</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionText}>إضافة إلى القوالب</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionText}>مشاركة للمراجعة</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preview Modal */}
        <Modal
          visible={showPreview}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.previewModal}>
            <View style={styles.previewHeader}>
              <TouchableOpacity
                style={styles.previewCloseButton}
                onPress={() => setShowPreview(false)}
              >
                <Text style={styles.previewCloseText}>إغلاق</Text>
              </TouchableOpacity>
              <Text style={styles.previewTitle}>معاينة التقرير</Text>
            </View>
            <ScrollView style={styles.previewContent}>
              <Text style={styles.previewText}>{reportContent || 'لا يوجد محتوى للمعاينة'}</Text>
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryAction: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  templateSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'right',
  },
  templatesScroll: {
    marginHorizontal: -12,
  },
  templateCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  templateCardActive: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  templateName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  templateNameActive: {
    color: '#10B981',
  },
  templateDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'right',
  },
  titleInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'right',
  },
  aiToolsSection: {
    marginBottom: 24,
  },
  aiToolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  aiTool: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 140,
  },
  speechToTextSection: {
    marginBottom: 24,
  },
  speechToTextOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  speechToTextContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    maxHeight: '85%',
    width: '95%',
    maxWidth: 500,
    overflow: 'hidden',
  },
  aiToolText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginRight: 8,
  },
  aiToolTextDisabled: {
    color: '#9CA3AF',
  },
  editorSection: {
    marginBottom: 24,
  },
  editorContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  contentEditor: {
    padding: 20,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    minHeight: 400,
    textAlign: 'right',
  },
  wordCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    textAlign: 'left',
  },
  quickActionsSection: {
    marginBottom: 32,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  previewModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  previewTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'right',
  },
  previewCloseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  previewCloseText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  previewContent: {
    flex: 1,
    padding: 20,
  },
  previewText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    lineHeight: 24,
    textAlign: 'right',
  },
});