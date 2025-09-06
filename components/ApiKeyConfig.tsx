import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Key, Eye, EyeOff, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, ExternalLink } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, ButtonStyles, TextStyles, CardStyles, InputStyles } from '@/constants/theme';

interface ApiKeyConfigProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onClose: () => void;
}

export function ApiKeyConfig({ apiKey, onApiKeyChange, onClose }: ApiKeyConfigProps) {
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const validateApiKey = async (key: string) => {
    if (!key.trim()) {
      setValidationStatus('idle');
      return;
    }

    setIsValidating(true);
    try {
      // Simple validation - check if key starts with expected format
      if (key.startsWith('sk-') && key.length > 20) {
        setValidationStatus('valid');
      } else {
        setValidationStatus('invalid');
      }
    } catch (error) {
      setValidationStatus('invalid');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    if (!tempApiKey.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال مفتاح API صالح');
      return;
    }

    onApiKeyChange(tempApiKey);
    Alert.alert('تم الحفظ', 'تم حفظ مفتاح API بنجاح');
    onClose();
  };

  const handleKeyChange = (key: string) => {
    setTempApiKey(key);
    setValidationStatus('idle');
    
    // Debounced validation
    setTimeout(() => {
      validateApiKey(key);
    }, 500);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>إعداد مفتاح ElevenLabs API</Text>
          <Text style={styles.subtitle}>
            أدخل مفتاح API الخاص بك لتفعيل ميزة تحويل الصوت إلى نص
          </Text>
        </View>

        {/* Instructions Card */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>كيفية الحصول على مفتاح API:</Text>
          <View style={styles.stepsList}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                قم بزيارة موقع ElevenLabs وإنشاء حساب جديد أو تسجيل الدخول
              </Text>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                انتقل إلى صفحة الملف الشخصي واختر "API Keys"
              </Text>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                انقر على "Create API Key" وانسخ المفتاح الجديد
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.linkButton}>
            <ExternalLink size={16} color="#10B981" />
            <Text style={styles.linkText}>فتح موقع ElevenLabs</Text>
          </TouchableOpacity>
        </View>

        {/* API Key Input */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>مفتاح ElevenLabs API</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.visibilityButton}
              onPress={() => setShowKey(!showKey)}
            >
              {showKey ? (
                <EyeOff size={20} color="#6B7280" />
              ) : (
                <Eye size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
            
            <TextInput
              style={[
                styles.apiKeyInput,
                validationStatus === 'valid' && styles.inputValid,
                validationStatus === 'invalid' && styles.inputInvalid,
              ]}
              placeholder="sk-..."
              placeholderTextColor="#9CA3AF"
              value={tempApiKey}
              onChangeText={handleKeyChange}
              secureTextEntry={!showKey}
              autoCapitalize="none"
              autoCorrect={false}
              textAlign="left"
            />
            
            <View style={styles.keyIcon}>
              <Key size={20} color="#6B7280" />
            </View>
          </View>

          {/* Validation Status */}
          {validationStatus !== 'idle' && (
            <View style={styles.validationContainer}>
              {validationStatus === 'valid' ? (
                <View style={styles.validationSuccess}>
                  <CheckCircle size={16} color="#10B981" />
                  <Text style={styles.validationSuccessText}>مفتاح API صالح</Text>
                </View>
              ) : (
                <View style={styles.validationError}>
                  <AlertTriangle size={16} color="#EF4444" />
                  <Text style={styles.validationErrorText}>مفتاح API غير صالح</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Features Info */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>الميزات المتاحة:</Text>
          <View style={styles.featuresList}>
            <View style={styles.feature}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.featureText}>دعم 99 لغة مختلفة</Text>
            </View>
            <View style={styles.feature}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.featureText}>دقة عالية في التحويل</Text>
            </View>
            <View style={styles.feature}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.featureText}>تحديد المتحدثين المختلفين</Text>
            </View>
            <View style={styles.feature}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.featureText}>توقيتات دقيقة للكلمات</Text>
            </View>
            <View style={styles.feature}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.featureText}>كشف الأحداث الصوتية</Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!tempApiKey.trim() || validationStatus === 'invalid') && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!tempApiKey.trim() || validationStatus === 'invalid'}
        >
          <Text style={[
            styles.saveButtonText,
            (!tempApiKey.trim() || validationStatus === 'invalid') && styles.saveButtonTextDisabled
          ]}>
            حفظ المفتاح
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  content: {
    padding: Spacing[5],
  },
  header: {
    marginBottom: Spacing[6],
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
  instructionsCard: {
    ...CardStyles.default,
    marginBottom: Spacing[5],
  },
  instructionsTitle: {
    ...TextStyles.heading4,
    marginBottom: Spacing[4],
    textAlign: 'right',
  },
  stepsList: {
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing[3],
  },
  stepNumberText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.bold,
    color: Colors.text.inverse,
  },
  stepText: {
    ...TextStyles.body,
    flex: 1,
    textAlign: 'right',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...ButtonStyles.ghost,
    borderColor: Colors.primary[200],
    gap: Spacing[2],
  },
  linkText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.medium,
    color: Colors.primary[600],
  },
  inputCard: {
    ...CardStyles.default,
    marginBottom: Spacing[5],
  },
  inputLabel: {
    ...TextStyles.label,
    marginBottom: Spacing[3],
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  keyIcon: {
    paddingHorizontal: Spacing[3],
  },
  apiKeyInput: {
    flex: 1,
    ...InputStyles.default,
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontFamily: Typography.weights.regular,
    fontSize: Typography.sizes.base,
  },
  inputValid: {
    borderColor: Colors.success[300],
  },
  inputInvalid: {
    borderColor: Colors.danger[300],
  },
  visibilityButton: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
  },
  validationContainer: {
    marginTop: Spacing[2],
  },
  validationSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  validationSuccessText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.medium,
    color: Colors.success[600],
  },
  validationError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  validationErrorText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.medium,
    color: Colors.danger[600],
  },
  featuresCard: {
    ...CardStyles.default,
    marginBottom: Spacing[6],
  },
  featuresTitle: {
    ...TextStyles.heading4,
    marginBottom: Spacing[4],
    textAlign: 'right',
  },
  featuresList: {
    gap: Spacing[3],
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  featureText: {
    ...TextStyles.body,
    flex: 1,
    textAlign: 'right',
  },
  saveButton: {
    ...ButtonStyles.primary,
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing[4],
  },
  saveButtonDisabled: {
    backgroundColor: Colors.background.muted,
  },
  saveButtonText: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.weights.semibold,
    color: Colors.text.inverse,
    textAlign: 'center',
  },
  saveButtonTextDisabled: {
    color: Colors.text.muted,
  },
});