// نظام الألوان والتصميم العالمي المتطور
export const Colors = {
  // الألوان الأساسية - مستوحاة من Palantir
  primary: {
    50: '#F0F9FF',
    100: '#E0F2FE', 
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9', // اللون الأساسي
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
    950: '#082F49',
  },

  // الألوان الثانوية
  secondary: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  // ألوان النجاح
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // ألوان التحذير
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // ألوان الخطر
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // ألوان المعلومات
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // الألوان المحايدة
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },

  // ألوان خاصة
  brand: {
    primary: '#0EA5E9',
    secondary: '#1E293B',
    accent: '#22C55E',
    muted: '#64748B',
  },

  // خلفيات
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#F1F5F9',
    muted: '#E2E8F0',
  },

  // نصوص
  text: {
    primary: '#0F172A',
    secondary: '#334155',
    tertiary: '#64748B',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
    accent: '#0EA5E9',
  },

  // حدود
  border: {
    light: '#F1F5F9',
    default: '#E2E8F0',
    medium: '#CBD5E1',
    dark: '#94A3B8',
  },
};

type PaletteLike = {
  background: { primary: string; secondary: string; tertiary: string };
  text: { primary: string; secondary: string; inverse: string; muted: string };
  border: { default: string; light: string };
  primary: { 500: string; 600: string };
  success: { 500: string };
};

export const applyPaletteToColors = (palette: PaletteLike) => {
  Colors.background.primary = palette.background.primary;
  Colors.background.secondary = palette.background.secondary;
  Colors.background.tertiary = palette.background.tertiary;
  Colors.background.muted = palette.border.light;

  Colors.text.primary = palette.text.primary;
  Colors.text.secondary = palette.text.secondary;
  Colors.text.tertiary = palette.text.muted;
  Colors.text.muted = palette.text.muted;
  Colors.text.inverse = palette.text.inverse;
  Colors.text.accent = palette.primary[500];

  Colors.border.light = palette.border.light;
  Colors.border.default = palette.border.default;
  Colors.border.medium = palette.border.default;
  Colors.border.dark = palette.text.muted;

  Colors.brand.primary = palette.primary[500];
  Colors.brand.secondary = palette.background.secondary;
  Colors.brand.accent = palette.success[500];
  Colors.brand.muted = palette.text.muted;
};

export const Typography = {
  // أحجام الخطوط
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
    '7xl': 48,
    '8xl': 64,
  },

  // أوزان الخطوط
  weights: {
    light: 'Inter-Regular',
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },

  // ارتفاع الأسطر
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // تباعد الأحرف
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
};

export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  default: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: Colors.secondary[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  default: {
    shadowColor: Colors.secondary[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.secondary[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.secondary[900],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.secondary[900],
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 12,
  },
};

// أنماط الأزرار العامة
export const ButtonStyles = {
  primary: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    ...Shadows.default,
  },
  secondary: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border.default,
    ...Shadows.sm,
  },
  success: {
    backgroundColor: Colors.success[500],
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    ...Shadows.default,
  },
  danger: {
    backgroundColor: Colors.danger[500],
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    ...Shadows.default,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
};

// أنماط البطاقات العامة
export const CardStyles = {
  default: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing[5],
    borderWidth: 1,
    borderColor: Colors.border.default,
    ...Shadows.default,
  },
  elevated: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing[6],
    ...Shadows.lg,
  },
  flat: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing[5],
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
};

// أنماط المدخلات العامة
export const InputStyles = {
  default: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.regular,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  large: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.weights.regular,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
};

// أنماط النصوص العامة
export const TextStyles = {
  heading1: {
    fontSize: Typography.sizes['6xl'],
    fontFamily: Typography.weights.bold,
    color: Colors.text.primary,
    letterSpacing: Typography.letterSpacing.tight,
    lineHeight: Typography.lineHeights.tight * Typography.sizes['6xl'],
  },
  heading2: {
    fontSize: Typography.sizes['5xl'],
    fontFamily: Typography.weights.bold,
    color: Colors.text.primary,
    letterSpacing: Typography.letterSpacing.tight,
    lineHeight: Typography.lineHeights.tight * Typography.sizes['5xl'],
  },
  heading3: {
    fontSize: Typography.sizes['3xl'],
    fontFamily: Typography.weights.semibold,
    color: Colors.text.primary,
    letterSpacing: Typography.letterSpacing.normal,
    lineHeight: Typography.lineHeights.snug * Typography.sizes['3xl'],
  },
  heading4: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.weights.semibold,
    color: Colors.text.primary,
    letterSpacing: Typography.letterSpacing.normal,
    lineHeight: Typography.lineHeights.normal * Typography.sizes.xl,
  },
  body: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.regular,
    color: Colors.text.secondary,
    letterSpacing: Typography.letterSpacing.normal,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
  },
  caption: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.medium,
    color: Colors.text.muted,
    letterSpacing: Typography.letterSpacing.wide,
    lineHeight: Typography.lineHeights.normal * Typography.sizes.sm,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.semibold,
    color: Colors.text.primary,
    letterSpacing: Typography.letterSpacing.wide,
    lineHeight: Typography.lineHeights.normal * Typography.sizes.sm,
  },
};

// أنماط الحالات
export const StatusStyles = {
  success: {
    backgroundColor: Colors.success[50],
    borderColor: Colors.success[200],
    textColor: Colors.success[700],
  },
  warning: {
    backgroundColor: Colors.warning[50],
    borderColor: Colors.warning[200],
    textColor: Colors.warning[700],
  },
  danger: {
    backgroundColor: Colors.danger[50],
    borderColor: Colors.danger[200],
    textColor: Colors.danger[700],
  },
  info: {
    backgroundColor: Colors.info[50],
    borderColor: Colors.info[200],
    textColor: Colors.info[700],
  },
};

// أنماط التخطيط العامة
export const LayoutStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  content: {
    padding: Spacing[6],
  },
  header: {
    marginBottom: Spacing[8],
  },
  section: {
    marginBottom: Spacing[8],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
};

// أنماط الشبكة
export const GridStyles = {
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing[2],
  },
  gridItem2: {
    width: '50%',
    paddingHorizontal: Spacing[2],
    marginBottom: Spacing[4],
  },
  grid3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing[2],
  },
  gridItem3: {
    width: '33.33%',
    paddingHorizontal: Spacing[2],
    marginBottom: Spacing[4],
  },
  grid4: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing[2],
  },
  gridItem4: {
    width: '25%',
    paddingHorizontal: Spacing[2],
    marginBottom: Spacing[4],
  },
};

// أنماط الرسوم المتحركة
export const AnimationStyles = {
  transition: {
    duration: 200,
    easing: 'ease-in-out',
  },
  spring: {
    tension: 100,
    friction: 8,
  },
};

// أنماط الأيقونات
export const IconStyles = {
  small: {
    width: Spacing[4],
    height: Spacing[4],
  },
  medium: {
    width: Spacing[5],
    height: Spacing[5],
  },
  large: {
    width: Spacing[6],
    height: Spacing[6],
  },
  container: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// أنماط الشارات
export const BadgeStyles = {
  default: {
    backgroundColor: Colors.secondary[100],
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
  success: {
    backgroundColor: Colors.success[100],
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
  warning: {
    backgroundColor: Colors.warning[100],
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
  danger: {
    backgroundColor: Colors.danger[100],
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
};

// أنماط النماذج
export const FormStyles = {
  fieldGroup: {
    marginBottom: Spacing[5],
  },
  label: {
    ...TextStyles.label,
    marginBottom: Spacing[2],
    textAlign: 'right' as const,
  },
  input: {
    ...InputStyles.default,
    textAlign: 'right' as const,
  },
  textarea: {
    ...InputStyles.default,
    minHeight: 120,
    textAlignVertical: 'top' as const,
    textAlign: 'right' as const,
  },
  error: {
    ...TextStyles.caption,
    color: Colors.danger[600],
    marginTop: Spacing[1],
    textAlign: 'right' as const,
  },
  helper: {
    ...TextStyles.caption,
    marginTop: Spacing[1],
    textAlign: 'right' as const,
  },
};

// أنماط التنقل
export const NavigationStyles = {
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.md,
    marginBottom: Spacing[1],
  },
  itemActive: {
    backgroundColor: Colors.primary[500],
    ...Shadows.sm,
  },
  itemText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.medium,
    color: Colors.text.secondary,
    flex: 1,
    textAlign: 'right' as const,
    letterSpacing: Typography.letterSpacing.normal,
  },
  itemTextActive: {
    color: Colors.text.inverse,
    fontFamily: Typography.weights.semibold,
  },
  icon: {
    marginLeft: Spacing[3],
  },
};

// أنماط الجداول
export const TableStyles = {
  container: {
    ...CardStyles.default,
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: Colors.background.tertiary,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  headerText: {
    ...TextStyles.label,
    textAlign: 'right' as const,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  cell: {
    flex: 1,
  },
  cellText: {
    ...TextStyles.body,
    textAlign: 'right' as const,
  },
};

// أنماط الإشعارات
export const NotificationStyles = {
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[4],
    borderWidth: 1,
  },
  success: {
    backgroundColor: Colors.success[50],
    borderColor: Colors.success[200],
  },
  warning: {
    backgroundColor: Colors.warning[50],
    borderColor: Colors.warning[200],
  },
  danger: {
    backgroundColor: Colors.danger[50],
    borderColor: Colors.danger[200],
  },
  info: {
    backgroundColor: Colors.info[50],
    borderColor: Colors.info[200],
  },
  title: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.semibold,
    marginBottom: Spacing[1],
    textAlign: 'right' as const,
  },
  message: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.regular,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.sm,
    textAlign: 'right' as const,
  },
};

// أنماط الشرائح
export const ChipStyles = {
  default: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  active: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  text: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  textActive: {
    color: Colors.text.inverse,
    fontFamily: Typography.weights.semibold,
  },
};

// أنماط الإحصائيات
export const StatStyles = {
  card: {
    ...CardStyles.default,
    alignItems: 'center',
    minWidth: 140,
  },
  value: {
    fontSize: Typography.sizes['3xl'],
    fontFamily: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing[1],
    letterSpacing: Typography.letterSpacing.tight,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.medium,
    color: Colors.text.muted,
    textAlign: 'center' as const,
    letterSpacing: Typography.letterSpacing.wide,
  },
  change: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.semibold,
    letterSpacing: Typography.letterSpacing.wide,
  },
  changePositive: {
    color: Colors.success[600],
  },
  changeNegative: {
    color: Colors.danger[600],
  },
};

// أنماط الفلاتر
export const FilterStyles = {
  container: {
    marginBottom: Spacing[6],
  },
  group: {
    marginBottom: Spacing[4],
  },
  label: {
    ...TextStyles.label,
    marginBottom: Spacing[2],
    textAlign: 'right' as const,
  },
  scroll: {
    marginHorizontal: -Spacing[3],
  },
  chip: {
    ...ChipStyles.default,
    marginHorizontal: Spacing[1],
  },
  chipActive: {
    ...ChipStyles.active,
  },
  chipText: {
    ...ChipStyles.text,
  },
  chipTextActive: {
    ...ChipStyles.textActive,
  },
};

// أنماط البحث
export const SearchStyles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderWidth: 1,
    borderColor: Colors.border.default,
    marginBottom: Spacing[4],
    ...Shadows.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.regular,
    color: Colors.text.primary,
    marginLeft: Spacing[3],
    textAlign: 'right' as const,
  },
  icon: {
    color: Colors.text.muted,
  },
};

// أنماط القوائم
export const ListStyles = {
  container: {
    gap: Spacing[4],
  },
  item: {
    ...CardStyles.default,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemActive: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[200],
  },
  itemContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  itemTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing[1],
    textAlign: 'right' as const,
  },
  itemSubtitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.regular,
    color: Colors.text.secondary,
    textAlign: 'right' as const,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
  },
  itemMeta: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.regular,
    color: Colors.text.muted,
    textAlign: 'right' as const,
  },
};

// أنماط الأشرطة التقدمية
export const ProgressStyles = {
  container: {
    height: 8,
    backgroundColor: Colors.background.muted,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  success: {
    backgroundColor: Colors.success[500],
  },
  warning: {
    backgroundColor: Colors.warning[500],
  },
  danger: {
    backgroundColor: Colors.danger[500],
  },
  info: {
    backgroundColor: Colors.info[500],
  },
};

// أنماط النوافذ المنبثقة
export const ModalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[5],
  },
  container: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[6],
    maxWidth: 500,
    width: '100%',
    ...Shadows.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[5],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  title: {
    ...TextStyles.heading4,
    textAlign: 'right' as const,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginBottom: Spacing[5],
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing[3],
  },
};
