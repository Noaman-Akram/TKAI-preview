import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { ScanLine, Upload, Link, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Mic } from 'lucide-react-native';
import { SpeechToText } from '@/components/SpeechToText';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CardStyles, ButtonStyles, LayoutStyles, TextStyles, InputStyles, ProgressStyles } from '@/constants/theme';

export function ScannerPage() {
  const [inputText, setInputText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showSpeechToText, setShowSpeechToText] = useState(false);

  const handleScan = () => {
    if (!inputText.trim()) return;
    
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setScanResult({
        credibility: Math.random() > 0.5 ? 'reliable' : 'suspicious',
        confidence: Math.floor(Math.random() * 30) + 70,
        sources: ['رويترز', 'وكالة الأنباء المرتبطة', 'بي بي سي'],
        flags: Math.random() > 0.7 ? ['ادعاءات غير موثقة', 'لغة متحيزة'] : [],
      });
      setIsScanning(false);
    }, 2000);
  };

  const handleTranscriptionComplete = (transcribedText: string) => {
    setInputText(prev => prev + (prev ? ' ' : '') + transcribedText);
    setShowSpeechToText(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>محلل المحتوى الذكي</Text>
          <Text style={styles.subtitle}>
            تحليل المقالات والروابط والنصوص لكشف المعلومات المُضللة بدقة عالية
          </Text>
        </View>

        <View style={styles.scannerCard}>
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>أدخل نص المقال أو الرابط للتحليل</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={8}
              placeholder="الصق نص المقال أو الرابط هنا للحصول على تحليل شامل ودقيق..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              textAlign="right"
            />
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.urlButton}>
              <Text style={styles.urlText}>تحليل الرابط</Text>
              <Link size={20} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadText}>رفع ملف للتحليل</Text>
              <Upload size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.speechButton}
            onPress={() => setShowSpeechToText(true)}
          >
            <Text style={styles.speechText}>تسجيل صوتي</Text>
            <Mic size={20} color="#10B981" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
            onPress={handleScan}
            disabled={isScanning || !inputText.trim()}
          >
            <Text style={[styles.scanButtonText, isScanning && styles.scanButtonTextDisabled]}>
              {isScanning ? 'جاري التحليل المتقدم...' : 'بدء التحليل الذكي'}
            </Text>
            <ScanLine size={20} color={isScanning ? Colors.text.muted : Colors.text.inverse} />
          </TouchableOpacity>
        </View>

        {scanResult && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={[
                styles.resultTitle,
                { color: scanResult.credibility === 'reliable' ? Colors.success[600] : Colors.danger[600] }
              ]}>
                {scanResult.credibility === 'reliable' ? 'محتوى موثوق وآمن' : 'محتوى مشكوك فيه - يتطلب مراجعة'}
              </Text>
              {scanResult.credibility === 'reliable' ? (
                <CheckCircle size={24} color={Colors.success[600]} />
              ) : (
                <AlertTriangle size={24} color={Colors.danger[600]} />
              )}
            </View>

            <View style={styles.confidenceBar}>
              <Text style={styles.confidenceLabel}>مستوى الثقة في التحليل: {scanResult.confidence}%</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${scanResult.confidence}%`,
                      backgroundColor: scanResult.credibility === 'reliable' ? Colors.success[500] : Colors.danger[500]
                    }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.resultDetails}>
              <Text style={styles.detailTitle}>المصادر الموثوقة المُتحقق منها:</Text>
              {scanResult.sources.map((source: string, index: number) => (
                <Text key={index} style={styles.sourceItem}>• {source}</Text>
              ))}

              {scanResult.flags.length > 0 && (
                <>
                  <Text style={styles.flagTitle}>مؤشرات التحذير المُكتشفة:</Text>
                  {scanResult.flags.map((flag: string, index: number) => (
                    <Text key={index} style={styles.flagItem}>⚠ {flag}</Text>
                  ))}
                </>
              )}
            </View>
          </View>
        )}

        {/* Speech to Text Modal */}
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...LayoutStyles.container,
  },
  content: {
    ...LayoutStyles.content,
  },
  header: {
    ...LayoutStyles.header,
  },
  title: {
    ...TextStyles.heading2,
    marginBottom: Spacing[2],
    textAlign: 'right',
  },
  subtitle: {
    ...TextStyles.body,
    textAlign: 'right',
  },
  scannerCard: {
    ...CardStyles.elevated,
    marginBottom: Spacing[6],
  },
  inputSection: {
    marginBottom: Spacing[5],
  },
  inputLabel: {
    ...TextStyles.heading4,
    marginBottom: Spacing[3],
    textAlign: 'right',
  },
  textInput: {
    ...InputStyles.large,
    backgroundColor: Colors.background.tertiary,
    textAlignVertical: 'top',
    minHeight: 140,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: Spacing[5],
    gap: Spacing[3],
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...ButtonStyles.secondary,
  },
  uploadText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.medium,
    color: Colors.text.secondary,
    marginRight: Spacing[2],
  },
  urlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...ButtonStyles.secondary,
  },
  urlText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.medium,
    color: Colors.text.secondary,
    marginRight: Spacing[2],
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...ButtonStyles.primary,
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing[4],
  },
  scanButtonDisabled: {
    backgroundColor: Colors.background.muted,
  },
  scanButtonText: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.weights.semibold,
    color: Colors.text.inverse,
    marginRight: Spacing[2],
  },
  scanButtonTextDisabled: {
    color: Colors.text.muted,
  },
  resultCard: {
    ...CardStyles.elevated,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[5],
    justifyContent: 'space-between',
  },
  resultTitle: {
    ...TextStyles.heading3,
    textAlign: 'right',
  },
  confidenceBar: {
    marginBottom: Spacing[5],
  },
  confidenceLabel: {
    ...TextStyles.label,
    marginBottom: Spacing[2],
    textAlign: 'right',
  },
  progressBar: {
    ...ProgressStyles.container,
  },
  progressFill: {
    ...ProgressStyles.fill,
  },
  resultDetails: {
    marginTop: Spacing[4],
  },
  detailTitle: {
    ...TextStyles.heading4,
    marginBottom: Spacing[2],
    textAlign: 'right',
  },
  sourceItem: {
    ...TextStyles.body,
    marginBottom: Spacing[1],
    textAlign: 'right',
  },
  flagTitle: {
    ...TextStyles.heading4,
    color: Colors.danger[600],
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
    textAlign: 'right',
  },
  flagItem: {
    ...TextStyles.body,
    color: Colors.danger[600],
    marginBottom: Spacing[1],
    textAlign: 'right',
  },
  speechButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success[50],
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.success[200],
    marginBottom: Spacing[5],
  },
  speechText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.medium,
    color: Colors.success[700],
    marginRight: Spacing[2],
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
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius['2xl'],
    margin: Spacing[5],
    maxHeight: '85%',
    width: '95%',
    maxWidth: 500,
    overflow: 'hidden',
  },
});