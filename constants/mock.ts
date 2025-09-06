export const mockReportStats = {
  totalReports: 248,
  completed: 172,
  inReview: 44,
  drafts: 32,
  avgLengthWords: 1280,
  avgGenerationTimeSec: 18,
  verification: { verified: 134, misleading: 58, uncertain: 24, pending: 32 },
};

export const mockWeeklyReports = Array.from({ length: 12 }).map((_, i) => ({
  week: `الأسبوع ${i + 1}`,
  reports: Math.floor(10 + Math.random() * 40),
  completed: Math.floor(6 + Math.random() * 28),
}));

export const mockReportTypes = [
  { id: 'analysis', name: 'تحليل', value: 42 },
  { id: 'investigation', name: 'تحقيق', value: 28 },
  { id: 'fact-check', name: 'تدقيق', value: 18 },
  { id: 'summary', name: 'ملخص', value: 12 },
];

export const mockRecentReports = [
  { id: 'r1', title: 'تحليل تغطية حدث اقتصادي', status: 'completed', date: '2025-07-03T01:58:00Z' },
  { id: 'r2', title: 'تقرير تحقيق حول شائعة طبية', status: 'review', date: '2025-07-02T12:12:00Z' },
  { id: 'r3', title: 'تدقيق ادعاء سياسي', status: 'draft', date: '2025-07-02T08:40:00Z' },
  { id: 'r4', title: 'ملخص أسبوعي للأخبار', status: 'completed', date: '2025-07-01T18:21:00Z' },
  { id: 'r5', title: 'تحليل مصداقية مصدر إعلامي', status: 'review', date: '2025-07-01T10:03:00Z' },
];

