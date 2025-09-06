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
  Mic
} from 'lucide-react-native';
import { SpeechToText } from '@/components/SpeechToText';

export function MinutesWriterPage() {
  const [minutesTitle, setMinutesTitle] = useState('');
  const [minutesContent, setMinutesContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('theft');
  const [showSpeechToText, setShowSpeechToText] = useState(false);
  // Police report specific fields
  const [department, setDepartment] = useState('قسم مصر الجديدة');
  const [reporterName, setReporterName] = useState('');
  const [reporterNID, setReporterNID] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toLocaleDateString('ar-EG'));
  const [incidentTime, setIncidentTime] = useState(new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }));
  const [incidentPlace, setIncidentPlace] = useState('');
  const [caseSummary, setCaseSummary] = useState('');
  const [witnesses, setWitnesses] = useState('');
  const [seizedItems, setSeizedItems] = useState('');
  const [actionsTaken, setActionsTaken] = useState('');

  const templates = [
    { id: 'theft', name: 'محضر سرقة', description: 'إثبات واقعة سرقة منقولات/نقود/سيارة' },
    { id: 'public-funds', name: 'محضر أموال عامة', description: 'بلاغات تتعلق بالمال العام والاختلاس' },
    { id: 'fraud', name: 'محضر نصب/احتيال', description: 'التدليس والاستيلاء على أموال الغير' },
    { id: 'assault', name: 'محضر مشاجرة/اعتداء', description: 'إصابات وجروح وتقرير طبي' },
    { id: 'traffic', name: 'محضر مرور', description: 'تصادم/هروب/إتلاف ممتلكات' },
    { id: 'missing', name: 'محضر غياب/فقد', description: 'بلاغ عن شخص مفقود' },
    { id: 'cybercrime', name: 'محضر جرائم إلكترونية', description: 'ابتزاز/اختراق/نشر غير مشروع' },
  ];

  const handleGenerateContent = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const dept = department || 'قسم الشرطة';
      const name = reporterName || '—';
      const nid = reporterNID || '—';
      const phone = reporterPhone || '—';
      const date = incidentDate || new Date().toLocaleDateString('ar-EG');
      const time = incidentTime || new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
      const place = incidentPlace || '—';
      const summary = caseSummary || '—';
      const wit = witnesses || 'لا يوجد';
      const seized = seizedItems || 'لا يوجد';
      const acts = actionsTaken || 'جارٍ العرض لاتخاذ اللازم قانونًا';

      const header = `محضر رقم [____] لسنة [20__] — إداري ${dept}`;
      const complainant = `المبلغ: السيد/ ${name} — رقم قومي: ${nid} — هاتف: ${phone}`;
      const incident = `بتاريخ ${date} وفي تمام الساعة ${time} بدائرة ${dept} وبمكان الواقعة: ${place}، قرر المبلغ الآتي:\n${summary}`;
      const extras: Record<string, string> = {
        theft: 'موضوع البلاغ: واقعة سرقة (منقولات/نقود/سيارة). تم توجيه المبلغ لبيان المفقودات على وجه الدقة، وإرفاق ما يثبت الملكية إن وجد.',
        'public-funds': 'موضوع البلاغ: شبهة اعتداء على المال العام/اختلاس. تم إحالة الأوراق للإدارة العامة لمباحث الأموال العامة للفحص.',
        fraud: 'موضوع البلاغ: واقعة نصب/احتيال بطريق التدليس والاستيلاء. جارٍ تحديد الوسائل والأدلة الرقمية الداعمة.',
        assault: 'موضوع البلاغ: مشاجرة/اعتداء بالضرب نتج عنه إصابات. أُخطرت الإسعاف وتم طلب تقرير طبي مبدئي لتحديد مدة العجز.',
        traffic: 'موضوع البلاغ: حادث مروري (تصادم/هروب/إتلاف ممتلكات). تم إخطار مرور القطاع وتحديد اتجاه السير ومكان الكاميرات القريبة.',
        missing: 'موضوع البلاغ: غياب/فقد شخص. تم تدوين أوصاف المفقود وملابسه الأخيرة، وإخطار الأقسام والمستشفيات والنيابات المختصة.',
        cybercrime: 'موضوع البلاغ: جريمة إلكترونية (ابتزاز/اختراق/نشر). تم توجيه المبلغ لحفظ الأدلة الرقمية، وإخطار مباحث الإنترنت لاتخاذ اللازم.',
      };
      const witnessesBlock = `الشهود: ${wit}`;
      const seizedBlock = `المضبوطات/الأحراز: ${seized}`;
      const actions = `الإجراءات المتخذة: ${acts}`;
      const footer = `تحرر عن ذلك المحضر لعرضه على النيابة العامة المختصة.\nاسم مُحرر المحضر: [ـــــ] — الوظيفة: [ـــــ]`;
      const body = [header, '', complainant, incident, extras[selectedTemplate] || '', witnessesBlock, seizedBlock, actions, '', footer].join('\n');
      setMinutesContent(body);
      setIsGenerating(false);
    }, 700);
  };

  const handleTranscriptionComplete = (transcribedText: string) => {
    setMinutesContent(prev => prev + (prev ? '\n\n' : '') + transcribedText);
    setShowSpeechToText(false);
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowPreview(true)}>
              {Eye ? <Eye size={18} color="#6B7280" /> : <Text>معاينة</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.primaryAction]}>
              {Save ? <Save size={18} color="#FFFFFF" /> : <Text style={{color:'#fff'}}>حفظ</Text>}
            </TouchableOpacity>
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.title}>كاتب محاضر الشرطة الذكي</Text>
            <Text style={styles.subtitle}>نماذج جاهزة لمحاضر أقسام الشرطة المصرية — واجهة بسيطة وواضحة</Text>
          </View>
        </View>

        {/* Police Categories */}
        <View style={styles.templateSection}>
          <Text style={styles.sectionTitle}>نوع المحضر</Text>
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
                {FileText ? <FileText size={24} color={selectedTemplate === template.id ? '#10B981' : '#6B7280'} /> : null}
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

        {/* Minimal Form */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>القسم</Text>
          <TextInput style={styles.titleInput} placeholder="مثال: قسم مصر الجديدة" placeholderTextColor="#9CA3AF" value={department} onChangeText={setDepartment} textAlign="right" />
        </View>
        <View style={styles.formGrid}>
          <View style={styles.formItem}> 
            <Text style={styles.inputLabel}>اسم المبلغ</Text>
            <TextInput style={styles.input} placeholder="الاسم الثلاثي" placeholderTextColor="#9CA3AF" value={reporterName} onChangeText={setReporterName} textAlign="right" />
          </View>
          <View style={styles.formItem}> 
            <Text style={styles.inputLabel}>الرقم القومي</Text>
            <TextInput style={styles.input} placeholder="14 رقمًا" placeholderTextColor="#9CA3AF" value={reporterNID} onChangeText={setReporterNID} textAlign="right" keyboardType="number-pad" />
          </View>
          <View style={styles.formItem}> 
            <Text style={styles.inputLabel}>الهاتف</Text>
            <TextInput style={styles.input} placeholder="01XXXXXXXXX" placeholderTextColor="#9CA3AF" value={reporterPhone} onChangeText={setReporterPhone} textAlign="right" keyboardType="phone-pad" />
          </View>
          <View style={styles.formItem}> 
            <Text style={styles.inputLabel}>تاريخ الواقعة</Text>
            <TextInput style={styles.input} placeholder="اليوم/الشهر/السنة" placeholderTextColor="#9CA3AF" value={incidentDate} onChangeText={setIncidentDate} textAlign="right" />
          </View>
          <View style={styles.formItem}> 
            <Text style={styles.inputLabel}>وقت الواقعة</Text>
            <TextInput style={styles.input} placeholder="الساعة:الدقيقة" placeholderTextColor="#9CA3AF" value={incidentTime} onChangeText={setIncidentTime} textAlign="right" />
          </View>
          <View style={[styles.formItem, { flexBasis: '100%' }]}> 
            <Text style={styles.inputLabel}>مكان الواقعة</Text>
            <TextInput style={styles.input} placeholder="العنوان/المَعْلَم" placeholderTextColor="#9CA3AF" value={incidentPlace} onChangeText={setIncidentPlace} textAlign="right" />
          </View>
        </View>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>ملخص الواقعة</Text>
          <TextInput style={[styles.titleInput, { minHeight: 90 }]} placeholder="أكتب ملخصًا واضحًا للواقعة" placeholderTextColor="#9CA3AF" value={caseSummary} onChangeText={setCaseSummary} textAlign="right" multiline />
        </View>

        {/* AI Generation Tools */}
        <View style={styles.aiToolsSection}>
          <Text style={styles.sectionTitle}>إنشاء المحضر</Text>
          <View style={styles.aiToolsGrid}>
            <TouchableOpacity 
              style={styles.aiTool}
              onPress={handleGenerateContent}
              disabled={isGenerating}
            >
              <Sparkles size={20} color={isGenerating ? '#9CA3AF' : '#10B981'} />
              <Text style={[styles.aiToolText, isGenerating && styles.aiToolTextDisabled]}>
                {isGenerating ? 'جاري الإنشاء...' : 'إنشاء محضر'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.aiTool}
              onPress={() => setShowSpeechToText(!showSpeechToText)}
            >
              {Mic ? <Mic size={20} color="#10B981" /> : null}
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
          <Text style={styles.sectionTitle}>محرر المحضر</Text>
          <View style={styles.editorContainer}>
            <TextInput
              style={styles.contentEditor}
              multiline
              placeholder="ابدأ في كتابة المحضر هنا أو استخدم أدوات الذكاء الاصطناعي لإنشاء المحتوى..."
              placeholderTextColor="#9CA3AF"
              value={minutesContent}
              onChangeText={setMinutesContent}
              textAlign="right"
              textAlignVertical="top"
            />
            {minutesContent.length > 0 && (
              <Text style={styles.wordCount}>
                عدد الكلمات: {minutesContent.split(' ').filter(word => word.length > 0).length}
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
              <Text style={styles.previewTitle}>معاينة المحضر</Text>
            </View>
            <ScrollView style={styles.previewContent}>
              <Text style={styles.previewText}>{minutesContent || 'لا يوجد محتوى للمعاينة'}</Text>
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
  formGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 },
  formItem: { flexGrow: 1, flexBasis: '48%' },
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
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
