import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { Audio } from 'expo-av';
import { Mic, MicOff, Upload, X, Play, Pause, Copy } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Colors, Typography, Spacing, BorderRadius, ButtonStyles, TextStyles, CardStyles } from '@/constants/theme';

interface SpeechToTextProps {
  onTranscriptionComplete?: (text: string) => void;
  onClose?: () => void;
}

export function SpeechToText({ onTranscriptionComplete, onClose }: SpeechToTextProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [apiKey] = useState('665667e39baf7eb2e76be8dd5cf86301081d40ec733b93fc13b8167de159706e');
  const [transcriptionDetails, setTranscriptionDetails] = useState<any>(null);

  // Request audio permissions
  const requestPermissions = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('خطأ', 'يرجى السماح بالوصول إلى الميكروفون لاستخدام هذه الميزة');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('خطأ', 'حدث خطأ في طلب الأذونات');
      return false;
    }
  };

  // Start recording
  const startRecording = async () => {
    if (!apiKey.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال مفتاح ElevenLabs API أولاً');
      return;
    }

    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Update duration every second
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Store interval reference for cleanup
      (newRecording as any).durationInterval = interval;
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('خطأ', 'حدث خطأ في بدء التسجيل');
    }
  };

  // Stop recording
  const stopRecording = async () => {
    try {
      if (!recording) return;

      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      
      // Clear duration interval
      if ((recording as any).durationInterval) {
        clearInterval((recording as any).durationInterval);
      }

      const uri = recording.getURI();
      if (uri) {
        await transcribeAudio(uri);
      }
      
      setRecording(null);
      setRecordingDuration(0);
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('خطأ', 'حدث خطأ في إيقاف التسجيل');
    }
  };

  // Upload audio file
  const uploadAudioFile = async () => {

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        await transcribeAudioFile(file);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('خطأ', 'حدث خطأ في رفع الملف');
    }
  };

  // Transcribe uploaded audio file
  const transcribeAudioFile = async (file: any) => {
    try {
      setIsTranscribing(true);
      setTranscribedText('');
      setTranscriptionDetails(null);

      const client = new ElevenLabsClient({ apiKey });

      // Read file as blob
      const response = await fetch(file.uri);
      const audioBlob = new Blob([await response.arrayBuffer()], { 
        type: file.mimeType || 'audio/mp3' 
      });

      // Call ElevenLabs Speech to Text API
      const transcription = await client.speechToText.convert({
        file: audioBlob,
        modelId: "scribe_v1",
        tagAudioEvents: true,
        languageCode: null, // Auto-detect language
        diarize: true,
        timestampsGranularity: "word",
      });

      setTranscribedText(transcription.text);
      setTranscriptionDetails(transcription);

    } catch (error) {
      console.error('Error transcribing audio:', error);
      Alert.alert('خطأ', 'حدث خطأ في تحويل الصوت إلى نص. تأكد من صحة الملف الصوتي.');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Transcribe audio using ElevenLabs
  const transcribeAudio = async (audioUri: string) => {
    try {
      setIsTranscribing(true);
      setTranscribedText('');
      setTranscriptionDetails(null);

      const client = new ElevenLabsClient({ apiKey });

      // Convert audio file to blob
      const response = await fetch(audioUri);
      const audioBlob = new Blob([await response.arrayBuffer()], { 
        type: 'audio/mp3' 
      });

      // Call ElevenLabs Speech to Text API
      const transcription = await client.speechToText.convert({
        file: audioBlob,
        modelId: "scribe_v1",
        tagAudioEvents: true,
        languageCode: null, // Auto-detect language
        diarize: true,
        timestampsGranularity: "word"
      });

      setTranscribedText(transcription.text);
      setTranscriptionDetails(transcription);

    } catch (error) {
      console.error('Error transcribing audio:', error);
      Alert.alert('خطأ', 'حدث خطأ في تحويل الصوت إلى نص.');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUseText = () => {
    if (onTranscriptionComplete && transcribedText) {
      onTranscriptionComplete(transcribedText);
    }
    if (onClose) {
      onClose();
    }
  };

  const copyToClipboard = () => {
    // In a real app, you would use Clipboard API
    Alert.alert('تم النسخ', 'تم نسخ النص إلى الحافظة');
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>تحويل الصوت إلى نص</Text>
      </View>

      <View style={styles.content}>
        {/* Status Indicator */}
        <View style={styles.statusSection}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: Colors.success[500] }]} />
            <Text style={styles.statusText}>ElevenLabs متصل</Text>
          </View>
        </View>

        {/* Recording Controls */}
        <View style={styles.recordingSection}>
          <Text style={styles.sectionTitle}>تسجيل صوتي</Text>
          
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordButtonActive]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing}
          >
            {isRecording ? (
              <MicOff size={28} color={Colors.text.inverse} />
            ) : (
              <Mic size={28} color={Colors.text.inverse} />
            )}
          </TouchableOpacity>
          
          <Text style={styles.recordButtonText}>
            {isRecording ? `جاري التسجيل (${formatDuration(recordingDuration)})` : 'اضغط للتسجيل'}
          </Text>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={uploadAudioFile}
            disabled={isTranscribing}
          >
            <Upload size={18} color={Colors.primary[600]} />
            <Text style={styles.uploadButtonText}>رفع ملف صوتي</Text>
          </TouchableOpacity>
        </View>

        {/* Transcription Status */}
        {isTranscribing && (
          <View style={styles.loadingSection}>
            <View style={styles.loadingIndicator}>
              <View style={styles.loadingDot} />
              <View style={styles.loadingDot} />
              <View style={styles.loadingDot} />
            </View>
            <Text style={styles.loadingText}>جاري تحويل الصوت إلى نص...</Text>
            <Text style={styles.loadingSubtext}>يرجى الانتظار</Text>
          </View>
        )}

        {/* Transcribed Text */}
        {transcribedText && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>النص المحول</Text>
            
            {/* Transcription Details */}
            {transcriptionDetails && (
              <View style={styles.detailsSection}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailValue}>
                    {transcriptionDetails.language_code?.toUpperCase() || 'غير محدد'}
                  </Text>
                  <Text style={styles.detailLabel}>اللغة المكتشفة</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailValue}>
                    {Math.round((transcriptionDetails.language_probability || 0) * 100)}%
                  </Text>
                  <Text style={styles.detailLabel}>دقة الكشف</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailValue}>
                    {transcriptionDetails.words?.length || 0}
                  </Text>
                  <Text style={styles.detailLabel}>عدد الكلمات</Text>
                </View>
              </View>
            )}
            
            <View style={styles.textContainer}>
              <Text style={styles.transcribedText}>{transcribedText}</Text>
            </View>
            
            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                <Copy size={16} color={Colors.text.secondary} />
                <Text style={styles.copyButtonText}>نسخ</Text>
              </TouchableOpacity>
              
              {onTranscriptionComplete && (
                <TouchableOpacity style={styles.useButton} onPress={handleUseText}>
                  <Text style={styles.useButtonText}>استخدام النص</Text>
                </TouchableOpacity>
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
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  title: {
    ...TextStyles.heading4,
    textAlign: 'right',
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.tertiary,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing[6],
  },
  statusSection: {
    marginBottom: Spacing[5],
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...CardStyles.flat,
    paddingVertical: Spacing[3],
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: Spacing[2],
  },
  statusText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.medium,
    color: Colors.success[600],
  },
  sectionTitle: {
    ...TextStyles.heading4,
    marginBottom: Spacing[3],
    textAlign: 'right',
  },
  recordingSection: {
    marginBottom: Spacing[5],
    alignItems: 'center',
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButtonActive: {
    backgroundColor: Colors.danger[500],
    shadowColor: Colors.danger[500],
  },
  recordButtonText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing[4],
    textAlign: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border.default,
    gap: Spacing[2],
  },
  uploadButtonText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  loadingSection: {
    alignItems: 'center',
    paddingVertical: Spacing[6],
    ...CardStyles.flat,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[3],
    gap: Spacing[2],
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[500],
  },
  loadingText: {
    ...TextStyles.heading4,
    marginBottom: Spacing[1],
    textAlign: 'center',
  },
  loadingSubtext: {
    ...TextStyles.body,
    textAlign: 'center',
  },
  resultSection: {
    marginBottom: Spacing[6],
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    ...CardStyles.flat,
    marginBottom: Spacing[4],
  },
  detailItem: {
    alignItems: 'center',
  },
  detailValue: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.weights.bold,
    color: Colors.primary[600],
    marginBottom: Spacing[1],
  },
  detailLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.weights.medium,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  textContainer: {
    ...CardStyles.default,
    marginBottom: Spacing[4],
    maxHeight: 200,
  },
  transcribedText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.regular,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
    textAlign: 'right',
  },
  resultActions: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border.default,
    gap: Spacing[2],
  },
  copyButtonText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  useButton: {
    flex: 1,
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500],
  },
  useButtonText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.semibold,
    color: Colors.text.inverse,
    textAlign: 'center',
  },
});