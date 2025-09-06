import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Shield, Smartphone, Globe, CircleHelp as HelpCircle, LogOut, ChevronLeft, Moon, Zap, Key, Mic } from 'lucide-react-native';
import { ApiKeyConfig } from '@/components/ApiKeyConfig';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CardStyles, ButtonStyles, TextStyles, LayoutStyles, StatusStyles, ModalStyles } from '@/constants/theme';

export function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [autoScan, setAutoScan] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [openAiApiKey, setOpenAiApiKey] = useState(process.env.EXPO_PUBLIC_OPENAI_API_KEY || '');
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState(process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || '');
  const [showElevenLabsModal, setShowElevenLabsModal] = useState(false);

  const settingsSections = [
    {
      title: 'إعدادات الحساب',
      items: [
        { icon: User, label: 'الملف الشخصي والبيانات', hasArrow: true },
        { icon: Shield, label: 'الخصوصية والحماية', hasArrow: true },
        { icon: Bell, label: 'إعدادات الإشعارات', toggle: notifications, onToggle: setNotifications },
      ]
    },
    {
      title: 'إعدادات الذكاء الاصطناعي',
      items: [
        { icon: Key, label: 'مفتاح OpenAI API', hasArrow: true, onPress: () => setShowApiKeyModal(true) },
        { icon: Mic, label: 'مفتاح ElevenLabs API', hasArrow: true, onPress: () => setShowElevenLabsModal(true) },
        { icon: Zap, label: 'التحليل عالي الدقة', toggle: highAccuracy, onToggle: setHighAccuracy },
        { icon: Smartphone, label: 'المسح التلقائي للروابط', toggle: autoScan, onToggle: setAutoScan },
      ]
    },
    {
      title: 'إعدادات التطبيق',
      items: [
        { icon: Moon, label: 'المظهر المظلم', toggle: darkMode, onToggle: setDarkMode },
        { icon: Globe, label: 'اللغة والمنطقة', hasArrow: true },
      ]
    },
    {
      title: 'المساعدة والدعم',
      items: [
        { icon: HelpCircle, label: 'الأسئلة الشائعة والمساعدة', hasArrow: true },
        { icon: Globe, label: 'معلومات حول TEKRONYX', hasArrow: true },
      ]
    }
  ];

  const renderSettingItem = (item: any, index: number, isLast: boolean) => (
    <TouchableOpacity
      key={index}
      style={[styles.settingItem, isLast && styles.lastItem]}
      onPress={item.onPress}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingLabel}>{item.label}</Text>
        <View style={styles.iconContainer}>
          <item.icon size={18} color={Colors.primary[600]} />
        </View>
      </View>
      <View style={styles.settingRight}>
        {item.toggle !== undefined ? (
          <Switch
            value={item.toggle}
            onValueChange={item.onToggle}
            trackColor={{ false: Colors.background.muted, true: Colors.primary[200] }}
            thumbColor={item.toggle ? Colors.primary[600] : Colors.text.muted}
          />
        ) : item.hasArrow ? (
          <ChevronLeft size={20} color={Colors.text.muted} />
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>إعدادات المنصة</Text>
            <Text style={styles.subtitle}>تخصيص وإدارة إعدادات منصة كشف الأخبار المُضللة</Text>
          </View>

          <View style={styles.profileCard}>
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeText}>ترقية الحساب</Text>
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>المستخدم الرئيسي</Text>
                <Text style={styles.userEmail}>user@example.com</Text>
                <Text style={styles.userPlan}>الخطة المجانية • 247 تحليل هذا الشهر</Text>
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>م</Text>
              </View>
            </View>
          </View>

          <View style={styles.apiStatusCard}>
            <View style={styles.apiStatusContent}>
              <Text style={styles.apiStatusTitle}>حالة نظام الذكاء الاصطناعي</Text>
              <Text style={[
                styles.apiStatusText,
                { color: (openAiApiKey || elevenLabsApiKey) ? Colors.success[600] : Colors.danger[600] }
              ]}>
                {(openAiApiKey || elevenLabsApiKey) ? 'متصل ويعمل بكفاءة عالية' : 'غير مُفعل - يتطلب إعداد مفاتيح API'}
              </Text>
            </View>
            <View style={[
              styles.apiStatusIndicator,
              { backgroundColor: (openAiApiKey || elevenLabsApiKey) ? Colors.success[500] : Colors.danger[500] }
            ]} />
          </View>

          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.settingsGroup}>
                {section.items.map((item, itemIndex) =>
                  renderSettingItem(item, itemIndex, itemIndex === section.items.length - 1)
                )}
              </View>
            </View>
          ))}

          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>إحصائيات الاستخدام</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>1,247</Text>
                <Text style={styles.statLabel}>إجمالي التحليلات</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>89</Text>
                <Text style={styles.statLabel}>المحتوى المُضلل المُكتشف</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>94.8%</Text>
                <Text style={styles.statLabel}>دقة التحليل</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>8.7/10</Text>
                <Text style={styles.statLabel}>تقييم الموثوقية</Text>
              </View>
            </View>
          </View>

          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>إجراءات متقدمة</Text>
            <TouchableOpacity style={styles.dangerButton}>
              <Text style={styles.dangerText}>تسجيل الخروج من النظام</Text>
              <LogOut size={20} color={Colors.danger[600]} />
            </TouchableOpacity>
          </View>

          <View style={styles.appInfo}>
            <Text style={styles.appVersion}>منصة TEKRONYX للذكاء الاصطناعي - الإصدار 1.0.0</Text>
            <Text style={styles.appCopyright}>© 2025 TEKRONYX. جميع الحقوق محفوظة.</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showApiKeyModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowApiKeyModal(false)}
            >
              <Text style={styles.modalCloseText}>إغلاق</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>إعداد مفتاح الذكاء الاصطناعي</Text>
          </View>
          <ApiKeyConfig
            apiKey={openAiApiKey}
            onApiKeyChange={setOpenAiApiKey}
            onClose={() => setShowApiKeyModal(false)}
          />
        </SafeAreaView>
      </Modal>

      <Modal
        visible={showElevenLabsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowElevenLabsModal(false)}
            >
              <Text style={styles.modalCloseText}>إغلاق</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>إعداد مفتاح ElevenLabs</Text>
          </View>
          <ApiKeyConfig
            apiKey={elevenLabsApiKey}
            onApiKeyChange={setElevenLabsApiKey}
            onClose={() => setShowElevenLabsModal(false)}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...CardStyles.elevated,
    marginBottom: Spacing[5],
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 30,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing[4],
    ...Shadows.md,
  },
  avatarText: {
    fontSize: Typography.sizes['3xl'],
    fontFamily: Typography.weights.bold,
    color: Colors.text.inverse,
  },
  userDetails: {
    flex: 1,
    alignItems: 'flex-end',
  },
  userName: {
    ...TextStyles.heading4,
    marginBottom: Spacing[1],
    textAlign: 'right',
  },
  userEmail: {
    ...TextStyles.body,
    marginBottom: Spacing[1],
    textAlign: 'right',
  },
  userPlan: {
    ...TextStyles.caption,
    textAlign: 'right',
  },
  upgradeButton: {
    ...ButtonStyles.primary,
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
  },
  upgradeText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.semibold,
    color: Colors.text.inverse,
  },
  apiStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...CardStyles.default,
    marginBottom: Spacing[5],
  },
  apiStatusContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  apiStatusTitle: {
    ...TextStyles.heading4,
    marginBottom: Spacing[1],
    textAlign: 'right',
  },
  apiStatusText: {
    ...TextStyles.body,
    textAlign: 'right',
  },
  apiStatusIndicator: {
    width: Spacing[3],
    height: Spacing[3],
    borderRadius: 6,
    marginLeft: Spacing[3],
  },
  section: {
    ...LayoutStyles.section,
  },
  sectionTitle: {
    ...TextStyles.heading4,
    marginBottom: Spacing[3],
    textAlign: 'right',
  },
  settingsGroup: {
    ...CardStyles.default,
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: Spacing[8],
    height: Spacing[8],
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing[3],
  },
  settingLabel: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.weights.medium,
    color: Colors.text.primary,
    textAlign: 'right',
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    ...CardStyles.elevated,
    marginBottom: Spacing[5],
  },
  statsTitle: {
    ...TextStyles.heading3,
    marginBottom: Spacing[4],
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  statValue: {
    fontSize: Typography.sizes['3xl'],
    fontFamily: Typography.weights.bold,
    color: Colors.primary[600],
    marginBottom: Spacing[1],
  },
  statLabel: {
    ...TextStyles.caption,
    textAlign: 'center',
  },
  dangerZone: {
    marginBottom: Spacing[8],
  },
  dangerTitle: {
    ...TextStyles.heading4,
    color: Colors.danger[600],
    marginBottom: Spacing[3],
    textAlign: 'right',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...StatusStyles.danger,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing[4],
    borderWidth: 1,
  },
  dangerText: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.weights.semibold,
    color: Colors.danger[700],
    marginLeft: Spacing[2],
  },
  appInfo: {
    alignItems: 'center',
    paddingBottom: Spacing[10],
  },
  appVersion: {
    ...TextStyles.caption,
    marginBottom: Spacing[1],
    textAlign: 'center',
  },
  appCopyright: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.weights.regular,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  modalContainer: {
    ...ModalStyles.container,
    margin: 0,
    borderRadius: 0,
  },
  modalHeader: {
    ...ModalStyles.header,
  },
  modalTitle: {
    ...ModalStyles.title,
  },
  modalCloseButton: {
    ...ModalStyles.closeButton,
  },
  modalCloseText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.medium,
    color: Colors.primary[600],
  },
});
