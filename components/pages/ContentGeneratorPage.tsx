import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Mic,
  Copy,
  Download,
  RefreshCw,
  Settings
} from 'lucide-react-native';

export function ContentGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState('article');

  const contentTypes = [
    { id: 'article', name: 'مقال', icon: FileText, description: 'مقال إخباري أو تحليلي' },
    { id: 'social', name: 'منشور اجتماعي', icon: ImageIcon, description: 'محتوى لوسائل التواصل' },
    { id: 'summary', name: 'ملخص', icon: FileText, description: 'ملخص للأحداث أو المعلومات' },
    { id: 'analysis', name: 'تحليل', icon: Sparkles, description: 'تحليل معمق للموضوع' },
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI content generation
    setTimeout(() => {
      setGeneratedContent(`# ${contentType === 'article' ? 'مقال' : 'محتوى'} مُولد بالذكاء الاصطناعي

## المقدمة
تم إنشاء هذا المحتوى بناءً على الطلب: "${prompt}"

## المحتوى الرئيسي
هذا نص تجريبي يوضح كيفية عمل منشئ المحتوى بالذكاء الاصطناعي. سيتم استبدال هذا النص بمحتوى حقيقي مُولد بناءً على المدخلات المقدمة.

### النقاط الرئيسية:
- نقطة مهمة أولى
- نقطة مهمة ثانية  
- نقطة مهمة ثالثة

## الخلاصة
هذا المحتوى المُولد يوفر نظرة شاملة على الموضوع المطلوب ويمكن استخدامه كنقطة انطلاق للتطوير والتحسين.`);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>منشئ المحتوى الذكي</Text>
          <Text style={styles.subtitle}>
            إنشاء محتوى عالي الجودة بمساعدة الذكاء الاصطناعي
          </Text>
        </View>

        {/* Content Type Selection */}
        <View style={styles.typeSection}>
          <Text style={styles.sectionTitle}>نوع المحتوى</Text>
          <View style={styles.typeGrid}>
            {contentTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeCard,
                    contentType === type.id && styles.typeCardActive
                  ]}
                  onPress={() => setContentType(type.id)}
                >
                  <IconComponent 
                    size={24} 
                    color={contentType === type.id ? '#10B981' : '#6B7280'} 
                  />
                  <Text style={[
                    styles.typeName,
                    contentType === type.id && styles.typeNameActive
                  ]}>
                    {type.name}
                  </Text>
                  <Text style={styles.typeDescription}>{type.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Prompt Input */}
        <View style={styles.promptSection}>
          <Text style={styles.sectionTitle}>وصف المحتوى المطلوب</Text>
          <TextInput
            style={styles.promptInput}
            multiline
            numberOfLines={4}
            placeholder="اكتب وصفاً مفصلاً للمحتوى الذي تريد إنشاءه..."
            placeholderTextColor="#9CA3AF"
            value={prompt}
            onChangeText={setPrompt}
            textAlign="right"
          />
          
          <TouchableOpacity 
            style={[styles.generateButton, (!prompt.trim() || isGenerating) && styles.generateButtonDisabled]}
            onPress={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            <Text style={[styles.generateButtonText, (!prompt.trim() || isGenerating) && styles.generateButtonTextDisabled]}>
              {isGenerating ? 'جاري الإنشاء...' : 'إنشاء المحتوى'}
            </Text>
            <Sparkles size={20} color={(!prompt.trim() || isGenerating) ? '#9CA3AF' : '#FFFFFF'} />
          </TouchableOpacity>
        </View>

        {/* Generated Content */}
        {generatedContent && (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <View style={styles.resultActions}>
                <TouchableOpacity style={styles.resultAction}>
                  <Copy size={18} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.resultAction}>
                  <Download size={18} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.resultAction}>
                  <RefreshCw size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <Text style={styles.resultTitle}>المحتوى المُولد</Text>
            </View>
            
            <View style={styles.contentContainer}>
              <Text style={styles.generatedText}>{generatedContent}</Text>
            </View>
          </View>
        )}
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
  typeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'right',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  typeCardActive: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  typeName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  typeNameActive: {
    color: '#10B981',
  },
  typeDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  promptSection: {
    marginBottom: 24,
  },
  promptInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlignVertical: 'top',
    marginBottom: 16,
    minHeight: 120,
    textAlign: 'right',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  generateButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  generateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  generateButtonTextDisabled: {
    color: '#9CA3AF',
  },
  resultSection: {
    marginBottom: 32,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'right',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 8,
  },
  resultAction: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  generatedText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    lineHeight: 24,
    textAlign: 'right',
  },
});