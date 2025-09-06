import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { 
  LayoutDashboard,
  ScanLine, 
  Bot,
  History, 
  TrendingUp, 
  Shield, 
  Settings, 
  X,
  Database,
  Search,
  FileText,
  Users,
  Zap,
  Lock,
  Link,
  Sparkles,
  MapPin,
  PenTool,
  Layers
} from 'lucide-react-native';
import { Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  isDesktop: boolean;
}

const categories = [
  { id: 'assistant', label: 'المساعد الذكي' },
  { id: 'minutes', label: 'كتابة المحاضر' },
  { id: 'detection', label: 'كشف الأخبار المزيفة' },
  { id: 'reports', label: 'كتابة التقارير' },
  { id: 'platform', label: 'إدارة المنصة' },
  { id: 'system', label: 'النظام' },
];

const navigationItems = [
  // Main AI Assistant
  { id: 'chat', label: 'مساعد الذكاء الاصطناعي', icon: Bot, category: 'assistant' },
  
  // Minutes Writing & Content Creation
  { id: 'minutes-writer', label: 'كاتب المحاضر', icon: PenTool, category: 'minutes' },
  { id: 'minutes-content-generator', label: 'منشئ محتوى المحاضر', icon: Sparkles, category: 'minutes' },
  { id: 'minutes-templates', label: 'قوالب المحاضر', icon: Layers, category: 'minutes' },
  { id: 'minutes-drafts', label: 'مسودات المحاضر', icon: FileText, category: 'minutes' },
  // Saved Mahader moved here
  { id: 'mahader', label: 'المحاضر المحفوظة', icon: FileText, category: 'minutes' },
  
  // Fake News Detection
  { id: 'overview', label: 'لوحة التحكم', icon: LayoutDashboard, category: 'detection' },
  { id: 'scanner', label: 'تحليل سريع', icon: ScanLine, category: 'detection' },
  { id: 'history', label: 'سجل التحليل', icon: History, category: 'detection' },
  { id: 'sources', label: 'المصادر الموثوقة', icon: Shield, category: 'detection' },
  { id: 'analytics', label: 'تحليلات الكشف', icon: TrendingUp, category: 'detection' },
  
  // Report Writing & Content Creation
  { id: 'report-writer', label: 'كاتب التقارير', icon: PenTool, category: 'reports' },
  { id: 'content-generator', label: 'منشئ المحتوى', icon: Sparkles, category: 'reports' },
  { id: 'templates', label: 'قوالب التقارير', icon: Layers, category: 'reports' },
  { id: 'drafts', label: 'المسودات', icon: FileText, category: 'reports' },
  
  // Advanced Platform Features
  { id: 'comprehensive-map', label: 'الخريطة الشاملة', icon: MapPin, category: 'platform' },
  { id: 'data-sources', label: 'مصادر البيانات', icon: Database, category: 'platform' },
  { id: 'ai-models', label: 'نماذج الذكاء الاصطناعي', icon: Bot, category: 'platform' },
  { id: 'data-connection-models', label: 'نماذج ترابط البيانات', icon: Link, category: 'platform' },
  { id: 'stats', label: 'إحصائيات', icon: TrendingUp, category: 'platform' },
  { id: 'search', label: 'البحث المتقدم', icon: Search, category: 'platform' },
  { id: 'collaboration', label: 'التعاون', icon: Users, category: 'platform' },
  { id: 'automation', label: 'الأتمتة', icon: Zap, category: 'platform' },
  { id: 'security', label: 'الأمان', icon: Lock, category: 'platform' },
  { id: 'integrations', label: 'التكاملات', icon: Link, category: 'platform' },
  
  // System
  { id: 'settings', label: 'الإعدادات', icon: Settings, category: 'system' },
];

export function Sidebar({ activeSection, onSectionChange, isOpen, onToggle, isDesktop }: SidebarProps) {
  const { palette } = useTheme();
  if (!isOpen) {
    return null;
  }

  const handleSectionChange = (sectionId: string) => {
    onSectionChange(sectionId);
    if (!isDesktop) {
      onToggle(); // Close sidebar on mobile/tablet after selection
    }
  };

  return (
    <>
      {!isDesktop && (
        <TouchableOpacity 
          style={styles.overlay} 
          onPress={onToggle}
          activeOpacity={1}
        />
      )}
      
      <View style={[
        styles.container,
        isDesktop ? styles.containerDesktop : styles.containerMobile,
        { backgroundColor: palette.background.primary, borderLeftColor: palette.border.default }
      ]}>
        <View style={styles.header}>
          {!isDesktop && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onToggle}
            >
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          )}
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Text style={styles.logoText}>TK</Text>
            </View>
          </View>
        </View>

        <View style={[styles.appTitle, { backgroundColor: palette.background.secondary, borderBottomColor: palette.border.default }]}>
              <Text style={[styles.appTitleText, { color: palette.text.primary }]}>منصة تكرونيكس للذكاء الاصطناعي</Text>
              <Text style={[styles.appSubtitle, { color: palette.text.muted }]}>تحليلات وذكاء متقدم</Text>
        </View>

        <ScrollView style={[styles.navigation, { backgroundColor: palette.background.primary }]} showsVerticalScrollIndicator={false}>
          {categories.map((category) => (
            <View key={category.id} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category.label}</Text>
              {navigationItems
                .filter(item => item.category === category.id)
                .map((item) => {
                  const isActive = activeSection === item.id;
                  const IconComponent = item.icon;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.navItem,
                        isActive && styles.navItemActive,
                      ]}
                      onPress={() => handleSectionChange(item.id)}
                    >
                      <View style={styles.navItemContent}>
                        <Text style={[
                          styles.navItemText,
                          { color: isActive ? '#FFFFFF' : palette.text.secondary },
                          isActive && styles.navItemTextActive,
                        ]}>
                          {item.label}
                        </Text>
                        <View style={[
                          styles.iconContainer,
                          { backgroundColor: isActive ? palette.primary[500] : palette.background.secondary, borderColor: isActive ? palette.primary[500] : palette.border.default }
                        ]}>
                          <IconComponent
                            size={16}
                            color={isActive ? '#FFFFFF' : palette.text.secondary}
                            strokeWidth={2}
                          />
                        </View>
                      </View>
                      {isActive && <View style={[styles.activeIndicator, { backgroundColor: palette.primary[500] }]} />}
                    </TouchableOpacity>
                  );
                })}
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
            <Text style={[styles.statusText, { color: palette.text.muted }]}>متصل الآن</Text>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>المستخدم الرئيسي</Text>
              <Text style={styles.userRole}>محلل أمني</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    zIndex: 998,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {
      width: -8,
      height: 0,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 12,
  },
  containerDesktop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 280,
    zIndex: 999,
  },
  containerMobile: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: Math.min(280, width * 0.85),
    zIndex: 999,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FAFBFC',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  logoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  logoImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    letterSpacing: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  appTitle: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FAFBFC',
  },
  appTitleText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'right',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  appSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'right',
    letterSpacing: 0.3,
  },
  navigation: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingHorizontal: 20,
    marginBottom: 8,
    textAlign: 'right',
  },
  navItem: {
    position: 'relative',
    marginHorizontal: 12,
    marginVertical: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  navItemActive: {
    backgroundColor: '#1E293B',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  navItemText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#475569',
    textAlign: 'right',
    letterSpacing: 0.2,
    flex: 1,
    marginLeft: 24,
  },
  navItemTextActive: {
    color: '#FFFFFF',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconContainerActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#3B82F6',
    borderRadius: 0,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FAFBFC',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginLeft: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    letterSpacing: 0.3,
    marginRight: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  userDetails: {
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    textAlign: 'right',
    letterSpacing: 0.3,
  },
  userRole: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'right',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
