import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
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
  Palette as PaletteIcon,
  Mic,
} from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';

import { SpeechToText } from '@/components/SpeechToText';
import { Colors, Spacing, BorderRadius, Typography, TextStyles, Shadows } from '@/constants/theme';
import { ThemeMode, useTheme } from '@/context/ThemeContext';

const templates = [
  { id: 'news-analysis', name: 'تحليل الأخبار', description: 'قالب لتحليل مصداقية الأخبار' },
  { id: 'investigation', name: 'تقرير تحقيق', description: 'قالب للتحقيقات الصحفية' },
  { id: 'fact-check', name: 'تدقيق الحقائق', description: 'قالب لتدقيق المعلومات' },
  { id: 'summary', name: 'ملخص إخباري', description: 'قالب لتلخيص الأحداث' },
];

type PaletteShape = ReturnType<typeof useTheme>['palette'];

export function ReportWriterPage() {
  const { palette, mode } = useTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const styles = useMemo(() => createStyles(mode, palette, isDesktop), [mode, palette, isDesktop]);
  const markdownStyles = useMemo(() => createMarkdownStyles(mode), [mode]);

  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('news-analysis');
  const [showSpeechToText, setShowSpeechToText] = useState(false);

  const handleGenerateContent = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setReportContent(`# تقرير تحليل الأخبار\n\n## الملخص التنفيذي\nتم تحليل المحتوى المقدم باستخدام تقنيات الذكاء الاصطناعي المتقدمة لتحديد مستوى المصداقية والموثوقية.\n\n## النتائج الرئيسية\n- **مستوى المصداقية**: عالي (85%)\n- **المصادر المتحققة**: 3 مصادر موثوقة\n- **علامات التحذير**: لا توجد\n\n## التوصيات\n1. يُنصح بالاعتماد على هذا المحتوى\n2. مراجعة دورية للمصادر المرجعية\n3. متابعة التطورات الجديدة\n\n## الخلاصة\nالمحتوى المحلل يظهر مؤشرات إيجابية للمصداقية ويمكن الاعتماد عليه كمصدر موثوق للمعلومات.`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleTranscriptionComplete = (transcribedText: string) => {
    setReportContent((prev) => prev + (prev ? '\n\n' : '') + transcribedText);
    setShowSpeechToText(false);
  };

  const renderPreview = () => {
    if (!reportContent.trim()) {
      return (
        <View style={styles.previewPlaceholder}>
          <FileText size={24} color={Colors.text.tertiary} />
          <Text style={styles.previewPlaceholderText}>سيظهر هنا عرض منسق للتقرير عند كتابة المحتوى.</Text>
        </View>
      );
    }

    return (
      <Markdown style={markdownStyles}>
        {reportContent}
      </Markdown>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>كاتب التقارير الذكي</Text>
            <Text style={styles.subtitle}>إنشاء تقارير احترافية بمساعدة الذكاء الاصطناعي</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.secondaryAction}>
              <Download size={18} color={Colors.text.tertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryAction}>
              <Share size={18} color={Colors.text.tertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryAction} onPress={() => setShowPreviewModal(true)}>
              <Eye size={18} color={Colors.text.tertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryAction}>
              <Save size={18} color={Colors.text.inverse} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.templateSection}>
          <Text style={styles.sectionTitle}>اختر قالب التقرير</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templatesRow}
          >
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateCard,
                  selectedTemplate === template.id && styles.templateCardActive,
                ]}
                onPress={() => setSelectedTemplate(template.id)}
              >
                <FileText
                  size={24}
                  color={selectedTemplate === template.id ? palette.primary[500] : Colors.text.tertiary}
                />
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDescription}>{template.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.aiToolsSection}>
          <Text style={styles.sectionTitle}>أدوات الذكاء الاصطناعي</Text>
          <View style={styles.aiToolsGrid}>
            <TouchableOpacity
              style={styles.aiTool}
              onPress={handleGenerateContent}
              disabled={isGenerating}
            >
              <Sparkles size={20} color={isGenerating ? Colors.text.muted : palette.primary[500]} />
              <Text style={[styles.aiToolText, isGenerating && styles.aiToolTextDisabled]}>
                {isGenerating ? 'جاري الإنشاء...' : 'إنشاء محتوى'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.aiTool}>
              <Copy size={20} color={palette.primary[500]} />
              <Text style={styles.aiToolText}>تحسين النص</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.aiTool}>
              <RotateCcw size={20} color={palette.primary[500]} />
              <Text style={styles.aiToolText}>إعادة صياغة</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.aiTool}>
              <PaletteIcon size={20} color={palette.primary[500]} />
              <Text style={styles.aiToolText}>تنسيق</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.aiTool} onPress={() => setShowSpeechToText(true)}>
              <Mic size={20} color={palette.primary[500]} />
              <Text style={styles.aiToolText}>تسجيل صوتي</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.editorPreviewRow}>
          <View style={styles.editorCard}>
            <Text style={styles.cardLabel}>عنوان التقرير</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="أدخل عنوان التقرير..."
              placeholderTextColor={Colors.text.muted}
              value={reportTitle}
              onChangeText={setReportTitle}
              textAlign="right"
            />

            <Text style={[styles.cardLabel, styles.editorLabel]}>محرر المحتوى</Text>
            <View style={styles.editorContainer}>
              <TextInput
                style={styles.contentEditor}
                multiline
                placeholder="ابدأ في كتابة تقريرك هنا أو استخدم أدوات الذكاء الاصطناعي لإنشاء المحتوى..."
                placeholderTextColor={Colors.text.muted}
                value={reportContent}
                onChangeText={setReportContent}
                textAlign="right"
                textAlignVertical="top"
              />
              {reportContent.length > 0 && (
                <Text style={styles.wordCount}>
                  عدد الكلمات: {reportContent.split(' ').filter((word) => word.length > 0).length}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>معاينة مباشرة</Text>
              <TouchableOpacity style={styles.previewExpand} onPress={() => setShowPreviewModal(true)}>
                <Eye size={16} color={palette.primary[500]} />
                <Text style={styles.previewExpandText}>تكبير</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.previewScroll} contentContainerStyle={styles.previewScrollContent}>
              {renderPreview()}
            </ScrollView>
          </View>
        </View>

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
      </ScrollView>

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

      <Modal visible={showPreviewModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPreviewModal(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>إغلاق</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>معاينة التقرير</Text>
          </View>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.previewScrollContent}
          >
            {renderPreview()}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const hexToRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace('#', '');
  const full = sanitized.length === 3 ? sanitized.split('').map((c) => c + c).join('') : sanitized;
  const intVal = parseInt(full, 16);
  const r = (intVal >> 16) & 255;
  const g = (intVal >> 8) & 255;
  const b = intVal & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createStyles = (mode: ThemeMode, palette: PaletteShape, isDesktop: boolean) => {
  const surface = Colors.background.primary;
  const accent = palette.primary[500];
  const divider = Colors.border.default;
  const rowDirection = isDesktop ? 'row-reverse' : 'column';

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: Colors.background.secondary,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing[6],
      paddingTop: Spacing[6],
      paddingBottom: Spacing[10],
      gap: Spacing[6],
    },
    header: {
      flexDirection: rowDirection,
      alignItems: isDesktop ? 'center' : 'flex-end',
      justifyContent: 'space-between',
      gap: Spacing[4],
    },
    headerInfo: {
      alignItems: 'flex-end',
      gap: Spacing[1],
    },
    title: {
      ...TextStyles.heading2,
      color: Colors.text.primary,
      textAlign: 'right',
    },
    subtitle: {
      ...TextStyles.body,
      color: Colors.text.tertiary,
      textAlign: 'right',
    },
    headerActions: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: Spacing[2],
    },
    secondaryAction: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: divider,
      backgroundColor: Colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryAction: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      backgroundColor: accent,
      alignItems: 'center',
      justifyContent: 'center',
      ...Shadows.default,
    },
    templateSection: {
      gap: Spacing[3],
    },
    sectionTitle: {
      ...TextStyles.heading4,
      color: Colors.text.primary,
      textAlign: 'right',
    },
    templatesRow: {
      gap: Spacing[3],
      paddingHorizontal: Spacing[1],
    },
    templateCard: {
      width: 180,
      backgroundColor: surface,
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing[4],
      paddingHorizontal: Spacing[3],
      borderWidth: 1,
      borderColor: divider,
      alignItems: 'center',
      gap: Spacing[2],
      ...Shadows.sm,
    },
    templateCardActive: {
      borderColor: accent,
      backgroundColor: hexToRgba(accent, mode === 'dark' ? 0.18 : 0.08),
    },
    templateName: {
      fontSize: Typography.sizes.base,
      fontFamily: Typography.weights.semibold,
      color: Colors.text.primary,
      textAlign: 'center',
    },
    templateDescription: {
      fontSize: Typography.sizes.sm,
      fontFamily: Typography.weights.regular,
      color: Colors.text.tertiary,
      textAlign: 'center',
      lineHeight: Typography.lineHeights.relaxed * Typography.sizes.sm,
    },
    aiToolsSection: {
      gap: Spacing[3],
    },
    aiToolsGrid: {
      flexDirection: rowDirection,
      flexWrap: 'wrap',
      gap: Spacing[3],
    },
    aiTool: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: Spacing[2],
      backgroundColor: surface,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing[3],
      paddingVertical: Spacing[2],
      borderWidth: 1,
      borderColor: divider,
    },
    aiToolText: {
      fontSize: Typography.sizes.sm,
      fontFamily: Typography.weights.medium,
      color: Colors.text.primary,
    },
    aiToolTextDisabled: {
      color: Colors.text.muted,
    },
    editorPreviewRow: {
      flexDirection: rowDirection,
      gap: Spacing[4],
    },
    editorCard: {
      flex: isDesktop ? 1 : undefined,
      backgroundColor: surface,
      borderRadius: BorderRadius['2xl'],
      borderWidth: 1,
      borderColor: divider,
      padding: Spacing[4],
      gap: Spacing[3],
    },
    cardLabel: {
      fontSize: Typography.sizes.sm,
      fontFamily: Typography.weights.semibold,
      color: Colors.text.secondary,
      textAlign: 'right',
    },
    editorLabel: {
      marginTop: Spacing[1],
    },
    titleInput: {
      backgroundColor: Colors.background.secondary,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: divider,
      paddingVertical: Spacing[3],
      paddingHorizontal: Spacing[3],
      fontSize: Typography.sizes.base,
      fontFamily: Typography.weights.regular,
      color: Colors.text.primary,
      textAlign: 'right',
    },
    editorContainer: {
      backgroundColor: Colors.background.secondary,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: divider,
      overflow: 'hidden',
    },
    contentEditor: {
      minHeight: isDesktop ? 460 : 320,
      padding: Spacing[4],
      fontSize: Typography.sizes.base,
      fontFamily: Typography.weights.regular,
      color: Colors.text.primary,
      textAlign: 'right',
    },
    wordCount: {
      fontSize: Typography.sizes.xs,
      fontFamily: Typography.weights.regular,
      color: Colors.text.muted,
      paddingHorizontal: Spacing[3],
      paddingVertical: Spacing[2],
      borderTopWidth: 1,
      borderTopColor: divider,
      textAlign: 'right',
    },
    previewCard: {
      flex: isDesktop ? 1 : undefined,
      backgroundColor: surface,
      borderRadius: BorderRadius['2xl'],
      borderWidth: 1,
      borderColor: divider,
      padding: Spacing[4],
      gap: Spacing[3],
    },
    previewHeader: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    previewTitle: {
      fontSize: Typography.sizes.lg,
      fontFamily: Typography.weights.semibold,
      color: Colors.text.primary,
    },
    previewExpand: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: Spacing[1],
    },
    previewExpandText: {
      fontSize: Typography.sizes.sm,
      fontFamily: Typography.weights.semibold,
      color: accent,
    },
    previewScroll: {
      flex: 1,
      maxHeight: isDesktop ? 520 : 360,
    },
    previewScrollContent: {
      paddingBottom: Spacing[2],
      alignItems: 'flex-end',
      gap: Spacing[2],
    },
    previewPlaceholder: {
      flex: 1,
      minHeight: 180,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing[2],
    },
    previewPlaceholderText: {
      fontSize: Typography.sizes.sm,
      fontFamily: Typography.weights.regular,
      color: Colors.text.tertiary,
      textAlign: 'center',
    },
    quickActionsSection: {
      gap: Spacing[3],
    },
    quickActions: {
      flexDirection: rowDirection,
      flexWrap: 'wrap',
      gap: Spacing[3],
    },
    quickAction: {
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: hexToRgba(accent, 0.2),
      backgroundColor: hexToRgba(accent, mode === 'dark' ? 0.15 : 0.08),
      paddingHorizontal: Spacing[3],
      paddingVertical: Spacing[2],
    },
    quickActionText: {
      fontSize: Typography.sizes.sm,
      fontFamily: Typography.weights.semibold,
      color: accent,
      textAlign: 'right',
    },
    speechToTextOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: hexToRgba(palette.background.primary, 0.75),
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing[5],
      zIndex: 1000,
    },
    speechToTextContainer: {
      backgroundColor: surface,
      borderRadius: BorderRadius['2xl'],
      width: '100%',
      maxWidth: 520,
      maxHeight: '85%',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: divider,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: Colors.background.secondary,
    },
    modalHeader: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing[4],
      paddingVertical: Spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: divider,
      backgroundColor: surface,
    },
    modalTitle: {
      fontSize: Typography.sizes.lg,
      fontFamily: Typography.weights.semibold,
      color: Colors.text.primary,
    },
    modalCloseButton: {
      paddingHorizontal: Spacing[3],
      paddingVertical: Spacing[1],
    },
    modalCloseText: {
      fontSize: Typography.sizes.base,
      fontFamily: Typography.weights.semibold,
      color: accent,
    },
    modalScroll: {
      flex: 1,
      paddingHorizontal: Spacing[4],
      paddingVertical: Spacing[3],
    },
  });
};

const createMarkdownStyles = (mode: ThemeMode) => ({
  body: {
    color: Colors.text.primary,
    fontFamily: Typography.weights.regular,
    fontSize: Typography.sizes.base,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
    textAlign: 'right' as const,
    writingDirection: 'rtl' as const,
  },
  heading1: {
    color: Colors.text.primary,
    fontFamily: Typography.weights.semibold,
    fontSize: Typography.sizes['2xl'],
    marginBottom: Spacing[2],
    textAlign: 'right' as const,
  },
  heading2: {
    color: Colors.text.primary,
    fontFamily: Typography.weights.semibold,
    fontSize: Typography.sizes.xl,
    marginBottom: Spacing[2],
    textAlign: 'right' as const,
  },
  heading3: {
    color: Colors.text.primary,
    fontFamily: Typography.weights.semibold,
    fontSize: Typography.sizes.lg,
    marginBottom: Spacing[1],
    textAlign: 'right' as const,
  },
  paragraph: {
    marginBottom: Spacing[2],
  },
  bullet_list: {
    marginBottom: Spacing[2],
  },
  ordered_list: {
    marginBottom: Spacing[2],
  },
  list_item: {
    textAlign: 'right' as const,
  },
  code_inline: {
    backgroundColor: mode === 'dark' ? hexToRgba('#FFFFFF', 0.08) : Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing[1],
    paddingVertical: 2,
  },
});
