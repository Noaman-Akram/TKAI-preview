import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
  Switch,
} from 'react-native';
import { Search, Menu, Plus, Bell, Command, Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface TopBarProps {
  activeSection: string;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onLogoPress?: () => void;
  onGoToChat?: () => void;
}

const sectionTitles: Record<string, string> = {
  'chat': 'المساعد الذكي',
  'overview': 'لوحة التحكم الذكية',
  'scanner': 'تحليل المحتوى',
  'history': 'سجل التحليل',
  'analytics': 'تحليلات الكشف',
  'sources': 'المصادر الموثوقة',
  'report-writer': 'كاتب التقارير',
  'content-generator': 'منشئ المحتوى',
  'templates': 'قوالب التقارير',
  'drafts': 'المسودات',
  'minutes-writer': 'كاتب المحاضر',
  'minutes-content-generator': 'منشئ محتوى المحاضر',
  'minutes-templates': 'قوالب المحاضر',
  'minutes-drafts': 'مسودات المحاضر',
  'comprehensive-map': 'الخريطة الشاملة للجرائم',
  'data-sources': 'مصادر البيانات',
  'ai-models': 'نماذج الذكاء الاصطناعي',
  'search': 'البحث المتقدم',
  'collaboration': 'التعاون',
  'automation': 'الأتمتة',
  'security': 'الأمان',
  'integrations': 'التكاملات',
  'settings': 'الإعدادات',
};

const { width } = Dimensions.get('window');

export function TopBar({ activeSection, onToggleSidebar, sidebarOpen, onLogoPress, onGoToChat }: TopBarProps) {
  const { palette, mode, toggle } = useTheme();
  const isTablet = width >= 768;
  const isDesktop = width >= 1200;
  const isMobile = width < 768;
  const isDark = mode === 'dark';

  return (
    <View style={[styles.container, isMobile && styles.containerMobile, { backgroundColor: palette.background.primary, borderBottomColor: palette.border.default }]}>
      {/* Left Section - Menu toggle at far left + Search */}
      <View style={[styles.leftSection, isMobile && styles.leftSectionMobile]}>

        {!isMobile && (
          <View style={[styles.searchContainer, { backgroundColor: palette.background.secondary, borderColor: palette.border.default }] }>
            <Search size={16} color={palette.text.muted} strokeWidth={2} />
            <TextInput
              style={[styles.searchInput, { color: palette.text.primary }]}
              placeholder="البحث في المنصة..."
              placeholderTextColor={palette.text.muted}
            />
            <View style={styles.searchShortcut}>
              <Command size={12} color={palette.text.muted} />
              <Text style={[styles.shortcutText, { color: palette.text.muted }]}>K</Text>
            </View>
          </View>
        )}
        {!sidebarOpen && (
          <View style={styles.logoWrapper}>
            <Image
              source={require('../assets/images/Black.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        )}
      </View>

      {/* Center Section - Page Title */}
      <View style={styles.centerSection}>
        <Text style={[styles.title, isMobile && styles.titleMobile, { color: palette.text.primary }]}>
          {sectionTitles[activeSection] || 'AI Platform'}
        </Text>
      </View>

      {/* Right Section - Actions & User */}
      <View style={[styles.rightSection, isMobile && styles.rightSectionMobile]}>
        {!isMobile && (
          <>
            <TouchableOpacity style={[styles.actionButton, { borderColor: palette.border.default, backgroundColor: palette.background.secondary }]}>
              <Bell size={18} color={palette.text.secondary} strokeWidth={2} />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton, { backgroundColor: palette.primary[500] }]} onPress={onGoToChat}>
              <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.primaryButtonText}>محادثة جديدة</Text>
            </TouchableOpacity>
          </>
        )}
        
        <View style={styles.userSection}>
          <View style={[styles.userAvatar, { backgroundColor: palette.text.primary, borderColor: palette.border.default }]}>
            <Text style={[styles.userAvatarText, { color: palette.background.primary }]}>A</Text>
          </View>
          {!isMobile && (
            <View style={styles.userInfo}>
              <Text style={[styles.userNameText, { color: palette.text.primary }]}>المدير</Text>
              <Text style={[styles.userStatusText, { color: palette.primary[500] }]}>متصل</Text>
            </View>
          )}
        </View>
        <View style={[styles.themeToggle, { borderColor: palette.border.default, backgroundColor: palette.background.secondary }]}> 
          <Sun size={14} color={palette.text.muted} style={styles.themeIcon} />
          <Switch
            value={isDark}
            onValueChange={toggle}
            trackColor={{ false: palette.border.default, true: palette.primary[500] }}
            thumbColor={isDark ? palette.text.inverse : '#FFFFFF'}
            ios_backgroundColor={palette.border.default}
          />
          <Moon size={14} color={palette.text.muted} style={styles.themeIcon} />
        </View>
        <TouchableOpacity
          style={[styles.menuButton, isMobile && styles.menuButtonMobile, { backgroundColor: palette.background.secondary, borderColor: palette.border.default }]}
          onPress={onToggleSidebar}
        >
          <Menu size={18} color={palette.text.secondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>
      {/* Mobile Actions Row */}
      {isMobile && (
        <View style={styles.mobileActionsRow}>
          <TouchableOpacity style={styles.mobileSearchButton}>
            <Search size={16} color="#64748B" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileActionButton}>
            <Bell size={16} color="#64748B" strokeWidth={2} />
            <View style={styles.mobileNotificationBadge}>
              <Text style={styles.mobileBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mobileActionButton, styles.mobilePrimaryButton]} onPress={onGoToChat}>
            <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    minHeight: 72,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  containerMobile: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 64,
    flexWrap: 'wrap',
  },
  
  // Left Section
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  leftSectionMobile: {
    flex: 0,
  },
  
  menuButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginLeft: 12,
  },
  menuButtonMobile: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },

  logoWrapper: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  logoImage: {
    width: 32,
    height: 32,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 240,
    maxWidth: 320,
    flex: 1,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#0F172A',
    marginLeft: 8,
    marginRight: 8,
    letterSpacing: 0.2,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  
  searchShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  
  shortcutText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#94A3B8',
    marginLeft: 2,
    letterSpacing: 0.5,
  },
  
  // Center Section
  centerSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.3,
    writingDirection: 'rtl',
  },
  titleMobile: {
    fontSize: 14,
  },
  
  // Right Section
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  rightSectionMobile: {
    flex: 0,
  },
  
  actionButton: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  
  primaryButton: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
    paddingHorizontal: 16,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  
  primaryButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  
  badgeText: {
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  
  userAvatar: {
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
  
  userAvatarText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  
  userInfo: {
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  
  userNameText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    letterSpacing: 0.2,
    textAlign: 'right',
  },
  
  userStatusText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginTop: 1,
    letterSpacing: 0.3,
    textAlign: 'right',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginLeft: 12,
    gap: 6,
  },
  themeIcon: {
    opacity: 0.7,
  },

  // Mobile Actions Row
  mobileActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  
  mobileSearchButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  
  mobileActionButton: {
    position: 'relative',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  
  mobilePrimaryButton: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  
  mobileNotificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  
  mobileBadgeText: {
    fontSize: 8,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});
