import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { ScanLine, Upload, Link, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CardStyles, ButtonStyles, LayoutStyles, TextStyles, InputStyles, ProgressStyles } from '@/constants/theme';

export function HistoryPage() {
  const [inputText, setInputText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>سجل التحليل</Text>
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
              {Link ? <Link size={20} color="#6B7280" /> : null}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadText}>رفع ملف للتحليل</Text>
              {Upload ? <Upload size={20} color="#6B7280" /> : null}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
            onPress={handleScan}
            disabled={isScanning || !inputText.trim()}
          >
            <Text style={[styles.scanButtonText, isScanning && styles.scanButtonTextDisabled]}>
              {isScanning ? 'جاري التحليل المتقدم...' : 'بدء التحليل الذكي'}
            </Text>
            {ScanLine ? (
              <ScanLine size={20} color={isScanning ? Colors.text.muted : Colors.text.inverse} />
            ) : null}
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
                CheckCircle ? <CheckCircle size={24} color={Colors.success[600]} /> : null
              ) : (
                AlertTriangle ? <AlertTriangle size={24} color={Colors.danger[600]} /> : null
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
});
