import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Mic, Bot, User, Paperclip, FileText, Image as ImageIcon, Search as SearchIcon, ChevronDown, ChevronUp, Trash2, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Pencil, X, Check, Plus } from 'lucide-react-native';
import { db } from '@/firebaseConfig';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import Markdown from 'react-native-markdown-display';
// Storage is not configured; images are embedded as data URLs
import * as ImagePicker from 'expo-image-picker';
// Removed PDF document picker in favor of a single image attach button
import * as WebBrowser from 'expo-web-browser';
import * as FileSystem from 'expo-file-system';
import { SpeechToText } from '@/components/SpeechToText';
import { Colors, Typography, Spacing, BorderRadius, TextStyles, InputStyles, applyPaletteToColors } from '@/constants/theme';
import { ThemeMode, useTheme } from '@/context/ThemeContext';

type PersonaId = 'legal' | 'fake_news' | 'general';

interface Conversation {
  id: string;
  title: string;
  persona: PersonaId;
  locked?: boolean;
  lastMessage?: string;
  createdAt?: any;
  updatedAt?: any;
  customTitle?: string;
  caseNumber?: string;
}

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  attachment?: {
    url: string;
    name: string;
    contentType: string;
    size?: number;
  };
}

const DEFAULT_CONVERSATION_TITLE = 'محادثة جديدة';

const isMeaningfulValue = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return false;
  return trimmed !== 'غير متوفر';
};

const composeConversationTitle = (customTitle: string, caseNumber?: string | null) => {
  const base = customTitle?.trim() || DEFAULT_CONVERSATION_TITLE;
  const caseTrimmed = caseNumber?.trim();
  if (isMeaningfulValue(caseTrimmed)) {
    if (base.startsWith(caseTrimmed!)) return base;
    return `${caseTrimmed} - ${base}`;
  }
  return base;
};

const stripCaseNumberFromTitle = (title: string, caseNumber?: string | null) => {
  const trimmedTitle = title?.trim();
  if (!trimmedTitle) return DEFAULT_CONVERSATION_TITLE;
  const caseTrimmed = caseNumber?.trim();
  if (isMeaningfulValue(caseTrimmed) && trimmedTitle.startsWith(caseTrimmed!)) {
    const remainder = trimmedTitle.slice(caseTrimmed!.length).replace(/^[\s\-:|]+/, '').trim();
    return remainder || DEFAULT_CONVERSATION_TITLE;
  }
  return trimmedTitle;
};

const cleanCaseNumberValue = (value: string) => {
  return value
    .replace(/[*`_]/g, '')
    .replace(/[|].*$/, '')
    .replace(/^[-–—]+\s*/, '')
    .replace(/[،.,؛:]+$/, '')
    .trim();
};

const extractCaseNumberFromText = (text?: string | null) => {
  if (!text) return undefined;
  const lines = text.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.replace(/^[-•▪●▸]+\s*/, '').trim();
    const match = line.match(/رقم\s*المحضر\s*[\/\-]?\s*القضية\s*[:：]\s*(.+)$/i);
    if (match) {
      const candidate = cleanCaseNumberValue(match[1]);
      if (isMeaningfulValue(candidate)) {
        return candidate;
      }
    }
  }
  return undefined;
};

const extractCaseNumberFromStructured = (structured: any, fallbackText?: string) => {
  if (structured?.type === 'legal') {
    const fromStructured = extractCaseNumberFromText(structured.general);
    if (fromStructured) return fromStructured;
  }
  return extractCaseNumberFromText(fallbackText);
};

export function ChatPage() {
  const { palette, mode } = useTheme();
  const themedStyles = useMemo(() => {
    applyPaletteToColors(palette);
    return {
      styles: createStyles(mode, palette),
      liveDraftMarkdownStyles: createLiveDraftMarkdownStyles(),
      chatMarkdownUserStyles: createChatMarkdownUserStyles(),
      chatMarkdownAssistantStyles: createChatMarkdownAssistantStyles(),
    };
  }, [palette, mode]);
  const styles = themedStyles.styles;
  const liveDraftMarkdownStyles = themedStyles.liveDraftMarkdownStyles;
  const chatMarkdownUserStyles = themedStyles.chatMarkdownUserStyles;
  const chatMarkdownAssistantStyles = themedStyles.chatMarkdownAssistantStyles;
  // Persona prompts (Arabic)
  const personaPrompts: Record<PersonaId, { label: string; system: string; intake: string } > = {
    legal: {
      label: 'كاتب التقارير القانونية',
      system: `
أنت "كاتب تقارير قانونية" تابع لوزارة الداخلية المصرية. دورك إعداد محاضر وتقارير قانونية رسمية بصياغة عربية فصحى واضحة ومحايدة، مع الالتزام بالأطر القانونية المصرية، مراعاة الدقة، وترتيب المعلومات.

المبادئ:
1) الصياغة: رسمية، موجزة، خالية من الآراء والانحياز، وواضحة للفِرَق القانونية والقيادة.
2) التحقق: اطلب التوضيح عند نقص البيانات، ولا تفترض حقائق غير مذكورة.
3) البنية: عند توفر بيانات كافية، قدّم تقريراً منسقاً بالعناوين التالية (مع الترتيب):
   - البيانات العامة (رقم المحضر/القضية، الجهة المُحرِّرة، اسم ورتبة مُحرر المحضر، التاريخ والوقت، مكان الواقعة/القسم/المحافظة)
   - الأطراف (المُبلغ، المجني عليه/الجهة المتضررة، المتهم/المشتبه به، بيانات تعريفية مختصرة)
   - وقائع الحادث (وصف زمني موجز للواقعة مع تحديد الأدوات/الوسائل)
   - الشهود (الأسماء ووسائل التواصل والملخصات)
   - الأدلة والمضبوطات (الوصف، طريقة الضبط، أرقام المحاضر/الأحراز إن وجدت)
   - الإجراءات المتخذة (المعاينة، الاستدعاء، التحفظ، الإخطار، الإجراءات الفنية)
   - التكييف القانوني (المواد القانونية المُحتملة من قانون العقوبات/الإجراءات أو القوانين الخاصة)
   - الطلبات والتوصيات (الإجراءات المطلوبة من النيابة/الجهات المختصة)
   - المرفقات (صور، تقارير فنية، إفادات، تسجيلات، إيصالات، إلخ)
   - التوقيعات (محرر المحضر، الشهود إن لزم)
4) السلامة: لا تُدرج معلومات حساسة إلا إذا قدمها المستخدم صراحة.
5) في حال غياب معلومة: استخدم "غير متوفر" بدل الافتراض.
`,
      intake: `مرحباً، سأساعدك في إعداد تقرير قانوني/محضر رسمي. من فضلك زوِّدني بالمعلومات التالية (يمكنك الرد بنقاط متتابعة؛ اكتب "غير متوفر" عند غياب أي بند):

1) البيانات العامة:
   - رقم المحضر/القضية (إن وجد)
   - الجهة المُحرِّرة/اسم القسم
   - اسم ورتبة مُحرر المحضر
   - التاريخ والوقت
   - مكان الواقعة (العنوان/القسم/المحافظة)

2) الأطراف:
   - بيانات المُبلغ
   - بيانات المجني عليه/الجهة المتضررة
   - بيانات المتهم/المُشتبه به (إن وجد)

3) وصف موجز للواقعة زمنيّاً (كيف بدأت، ماذا حدث، بمشاركة من، أدوات/وسائل مستخدمة)

4) الشهود (الأسماء ووسائل التواصل والملخص)

5) الأدلة والمضبوطات (الوصف، طريقة الضبط، رقم الحرز إن وجد)

6) الإجراءات المتخذة (معاينة، استدعاء، تحفظ، إخطار، إجراءات فنية)

7) التكييف القانوني المتوقع (إن توفر)

8) الطلبات/التوصيات المرجو اتخاذها

9) المرفقات (صور، تقارير فنية، إفادات، تسجيلات، إيصالات)

بعد تزويدي بالمعلومات، سأقوم بصياغة تقرير منسّق وجاهز.\n`,
    },
    fake_news: {
      label: 'مُحلل الأخبار المُضلِّلة',
      system: `
أنت مساعد متخصص في تحليل الأخبار والمحتوى لكشف التضليل. هدفك تقييم المصداقية، تحديد المغالطات، والتحقق من الأدلة والمصادر بلغة عربية فصحى واضحة ومحايدة.

التعليمات:
1) اطلب من المستخدم: نص الادّعاء/الخبر، الروابط/المصادر، سياق النشر (تاريخ/منصة)، وأي قرائن داعمة.
2) التحليل المنهجي:
   - تفكيك الادّعاءات إلى نقاط قابلة للتحقق
   - البحث في المصادر الموثوقة (موسوعية/مؤسسات صحفية معروفة/تقارير رسمية) إن كانت متاحة للمستخدم
   - رصد المغالطات والأساليب البلاغية التضليلية
   - تقييم مصداقية المصادر والسجل التاريخي للناشر
3) قدّم نتيجة مختصرة: موثوق/مضلل/غير مؤكد، مع مستوى ثقة، وأذكر مواطن عدم اليقين.
4) لا تخترع مصادر. إن غابت الروابط قل "غير متوفر" واطلبها.
5) تنسيق الخلاصة:
   - خلاصة الحكم
   - الأدلة الداعمة/الناقضة
   - الثغرات وما يلزم لاستكمال التحقق
   - توصية المتابعة
`,
      intake: `مرحباً، سأساعدك في تحليل خبر/ادّعاء لكشف مدى مصداقيته. تكرماً زوِّدني بما يلي:

1) نص الادّعاء/الخبر كاملاً
2) الروابط/المصادر الأصلية (إن توفرت)
3) سياق النشر (التاريخ/المنصة/الناشر)
4) أي قرائن/لقطات شاشة/توثيقات إضافية

سأعيد لك تحليلاً مُنظماً بالحكم والخلاصة والأدلة والفجوات.\n`,
    },
    general: {
      label: 'مساعد عام',
      system: `أنت مساعد عربي مهذب ودقيق. أجب بإيجاز ووضوح وبلا معلومات مختلَقة.`,
      intake: 'مرحباً! كيف يمكنني مساعدتك اليوم؟\n',
    },
  };

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingAttachmentUri, setPendingAttachmentUri] = useState<string | null>(null);
  const [conversationsCollapsed, setConversationsCollapsed] = useState(false);
  const [showSpeechToText, setShowSpeechToText] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [liveDraft, setLiveDraft] = useState('');
  const [autoDraft, setAutoDraft] = useState(true);
  const [savingDraft, setSavingDraft] = useState(false);
  const [reportStatus, setReportStatus] = useState<'idle'|'draft'|'final'>('idle');
  const [draftCollapsed, setDraftCollapsed] = useState(true);
  const flatListRef = useRef<FlatList<Message>>(null);
  const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [savingTitle, setSavingTitle] = useState(false);

  // Subscribe to conversations list
  useEffect(() => {
    const q = query(collection(db, 'conversations'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const items: Conversation[] = snap.docs.map((d) => {
        const raw = d.data() as any;
        const caseNumber = isMeaningfulValue(raw?.caseNumber) ? String(raw.caseNumber).trim() : undefined;
        const rawTitle = typeof raw?.title === 'string' && raw.title.trim() ? raw.title.trim() : DEFAULT_CONVERSATION_TITLE;
        const inferredCustomTitle = typeof raw?.customTitle === 'string' && raw.customTitle.trim()
          ? raw.customTitle.trim()
          : stripCaseNumberFromTitle(rawTitle, caseNumber);
        const persona = (raw?.persona || 'general') as PersonaId;
        const title = composeConversationTitle(inferredCustomTitle, caseNumber);
        return {
          id: d.id,
          title,
          persona,
          locked: raw?.locked,
          lastMessage: raw?.lastMessage,
          createdAt: raw?.createdAt,
          updatedAt: raw?.updatedAt,
          customTitle: inferredCustomTitle,
          caseNumber,
        } as Conversation;
      });
      setConversations(items);
      setSelectedConversation((prev) => {
        if (!prev) return prev;
        const updated = items.find((c) => c.id === prev.id);
        return updated ? { ...prev, ...updated } : prev;
      });
    });
    return () => unsub();
  }, []);

  // Subscribe to messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) { setMessages([]); return; }
    const q = query(collection(db, 'conversations', selectedConversation.id, 'messages'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const msgs: Message[] = snap.docs.map((d) => {
        const data = d.data() as any;
        const created = data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : new Date();
        const msg: Message = {
          id: d.id,
          content: data.content || '',
          type: data.type,
          timestamp: created,
        };
        if (data.attachment) msg.attachment = data.attachment;
        return msg;
      });
      setMessages(msgs);
    });
    return () => unsub();
  }, [selectedConversation?.id, selectedConversation?.customTitle, selectedConversation?.caseNumber, selectedConversation?.title]);

  useEffect(() => {
    if (selectedConversation) {
      const baseTitle = selectedConversation.customTitle
        ? selectedConversation.customTitle
        : stripCaseNumberFromTitle(selectedConversation.title || DEFAULT_CONVERSATION_TITLE, selectedConversation.caseNumber);
      setTitleDraft(baseTitle);
    } else {
      setTitleDraft('');
    }
    setIsEditingTitle(false);
    setSavingTitle(false);
  }, [selectedConversation?.id, selectedConversation?.customTitle, selectedConversation?.caseNumber, selectedConversation?.title]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Auto-generate live draft when messages change
  useEffect(() => {
    const shouldDraft = !!selectedConversation && autoDraft && messages.length > 0;
    if (!shouldDraft) return;
    const t = setTimeout(() => {
      generateLiveDraft().catch(() => {});
    }, 400); // small debounce
    return () => clearTimeout(t);
  }, [messages, autoDraft, selectedConversation?.id]);

  const buildDraftSystemPrompt = (personaId: PersonaId) => {
    if (personaId === 'legal') {
      return `
أنت منشئ تقارير قانونية بصياغة عربية احترافية. ابنِ تقريراً موجزاً من المحادثة الحالية بصيغة Markdown، مع هذه العناوين: 
- البيانات العامة
- الأطراف
- وقائع الحادث
- الشهود
- الأدلة والمضبوطات
- الإجراءات المتخذة
- التكييف القانوني
- الطلبات والتوصيات
- المرفقات

إن وُجدت معلومات ناقصة أو غير مؤكدة، أضف قسماً في الأسفل بعنوان "المعلومات الناقصة" بنقاط قصيرة. استخدم "غير متوفر" عند الحاجة. تجنب الحشو وركّز على الوضوح.`;
    }
    // fake_news and general -> analytical report style
    return `
أنت منشئ تقارير تحليلية لكشف التضليل. لخص الحوار الحالي في تقرير عربي واضح بصيغة Markdown يتضمن:
- الملخص التنفيذي
- الادعاءات المفككة
- الأدلة الداعمة والناقضة (مع الإشارة إلى الروابط إن ذُكرت)
- تقييم المصداقية ومستوى الثقة
- الفجوات اللازمة لاستكمال التحقق
- التوصيات
إن كانت هناك معلومات ناقصة، أضف قسماً بعنوان "المعلومات الناقصة".`;
  };

  const generateLiveDraft = async () => {
    if (!selectedConversation) return;
    const personaId = (selectedConversation.persona || 'general') as PersonaId;
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) return;

    const system = buildDraftSystemPrompt(personaId);
    const apiMessages = [
      { role: 'system', content: system },
      ...messages.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content || (m.attachment ? `مرفق: ${m.attachment.name}` : '') })),
      { role: 'user', content: 'أنشئ مسودة تقرير محدثة بناءً على المحادثة أعلاه.' },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: apiMessages, temperature: 0.2 }),
    });
    if (!response.ok) return;
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (content) setLiveDraft(content);
  };

  const extractTitleFromMarkdown = (md: string) => {
    const m = md.match(/^#\s+(.+)/m);
    if (m) return m[1].trim();
    return `تقرير ${new Date().toLocaleString('ar-SA')}`;
  };

  const saveReport = async (status: 'draft'|'final') => {
    if (!selectedConversation || !liveDraft.trim()) return;
    setSavingDraft(true);
    try {
      const reportId = selectedConversation.id; // 1:1 with conversation
      const refDoc = doc(db, 'reports', reportId);
      const snap = await getDoc(refDoc);
      const structured = buildStructuredReport(liveDraft, (selectedConversation.persona || 'general') as PersonaId);
      const payload: any = {
        conversationId: selectedConversation.id,
        persona: selectedConversation.persona,
        title: extractTitleFromMarkdown(liveDraft),
        content: liveDraft,
        structured,
        stats: {
          missingCount: structured?.missingFields?.length || 0,
          wordCount: liveDraft.split(/\s+/).filter(Boolean).length,
        },
        status,
        updatedAt: serverTimestamp(),
      };
      if (!snap.exists()) payload.createdAt = serverTimestamp();
      await setDoc(refDoc, payload, { merge: true });
      setReportStatus(status);
      // Also mirror minimal info on conversation for quick linking
      const inferredCustomTitle = selectedConversation.customTitle
        ? selectedConversation.customTitle
        : stripCaseNumberFromTitle(selectedConversation.title || DEFAULT_CONVERSATION_TITLE, selectedConversation.caseNumber);
      const detectedCaseNumber = extractCaseNumberFromStructured(structured, liveDraft);
      const conversationUpdate: Record<string, any> = {
        reportId,
        updatedAt: serverTimestamp(),
      };
      if (detectedCaseNumber) {
        const baseCustomTitle = stripCaseNumberFromTitle(inferredCustomTitle, detectedCaseNumber);
        const composedTitle = composeConversationTitle(baseCustomTitle, detectedCaseNumber);
        conversationUpdate.caseNumber = detectedCaseNumber;
        conversationUpdate.customTitle = baseCustomTitle;
        conversationUpdate.title = composedTitle;
        setSelectedConversation((prev) => {
          if (!prev || prev.id !== selectedConversation.id) return prev;
          return { ...prev, caseNumber: detectedCaseNumber, customTitle: baseCustomTitle, title: composedTitle };
        });
        setConversations((prev) => prev.map((conv) => (
          conv.id === selectedConversation.id ? { ...conv, caseNumber: detectedCaseNumber, customTitle: baseCustomTitle, title: composedTitle } : conv
        )));
        setTitleDraft(baseCustomTitle);
      }
      await updateDoc(doc(db, 'conversations', selectedConversation.id), conversationUpdate);
      // Feedback as assistant message
      setMessages(prev => [...prev, { id: Date.now().toString(), content: status==='final'? 'تم حفظ التقرير النهائي في قسم التقارير.' : 'تم حفظ المسودة. يمكنك المتابعة لاحقاً من نفس المحادثة.', type: 'assistant', timestamp: new Date() }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), content: 'تعذر حفظ التقرير. تحقق من الصلاحيات ثم أعد المحاولة.', type: 'assistant', timestamp: new Date() }]);
    } finally {
      setSavingDraft(false);
    }
  };

  // Minimal parser to structure the report sections for storage
  const buildStructuredReport = (md: string, personaId: PersonaId) => {
    const between = (needle: RegExp, source: string) => {
      const m = source.match(needle);
      if (!m) return '';
      const idx = m.index ?? 0;
      const after = source.slice(idx + m[0].length);
      const next = after.search(/^#{1,6}\s+/m);
      return next === -1 ? after.trim() : after.slice(0, next).trim();
    };
    const bullets = (block: string) => block.split(/\n/).filter(l => /^-\s+/.test(l)).map(l => l.replace(/^-\s+/, '').trim());

    if (personaId === 'legal') {
      const general = between(/^#{1,6}\s*البيانات العامة:?/mi, md);
      const parties = between(/^#{1,6}\s*الأطراف:?/mi, md);
      const incident = between(/^#{1,6}\s*وقائع الحادث:?/mi, md);
      const witnesses = between(/^#{1,6}\s*الشهود:?/mi, md);
      const evidence = between(/^#{1,6}\s*الأدلة والمضبوطات:?/mi, md);
      const actions = between(/^#{1,6}\s*الإجراءات المتخذة:?/mi, md);
      const legalQ = between(/^#{1,6}\s*التكييف القانوني:?/mi, md);
      const recs = between(/^#{1,6}\s*الطلبات والتوصيات:?/mi, md);
      const attach = between(/^#{1,6}\s*المرفقات:?/mi, md);
      const missingBlock = between(/^#{1,6}\s*المعلومات الناقصة:?/mi, md);
      const missing = bullets(missingBlock);
      return {
        type: 'legal',
        general, parties, incident, witnesses, evidence, actions, legalQualification: legalQ, recommendations: recs, attachments: attach,
        missingFields: missing,
      };
    }
    // default analytical structure
    const exec = between(/^#{1,6}\s*الملخص التنفيذي:?/mi, md);
    const claims = between(/^#{1,6}\s*الادعاءات المفككة:?/mi, md);
    const proofs = between(/^#{1,6}\s*الأدلة الداعمة والناقضة:?/mi, md);
    const credibility = between(/^#{1,6}\s*تقييم المصداقية:?/mi, md);
    const gaps = between(/^#{1,6}\s*الفجوات:?/mi, md);
    const recs = between(/^#{1,6}\s*التوصيات:?/mi, md);
    const missingBlock = between(/^#{1,6}\s*المعلومات الناقصة:?/mi, md);
    const missing = bullets(missingBlock);
    return { type: 'analysis', executive: exec, claims, proofs, credibility, gaps, recommendations: recs, missingFields: missing };
  };

  // Transform certain sections into simple RTL tables for readability
  const transformDraftForDisplay = (md: string, personaId: PersonaId) => {
    const toTable = (title: string, block: string) => {
      const rows = block
        .split(/\n/)
        .filter(l => /^-\s+/.test(l))
        .map(l => l.replace(/^-\s+/, '').trim())
        .filter(Boolean);
      if (!rows.length) return null;
      const header = `| البند | التفاصيل |\n| --- | --- |`;
      const body = rows.map(r => {
        const parts = r.split(/[:：-]\s*/, 2);
        const k = parts[0] || 'بند';
        const v = parts[1] || parts[0];
        return `| ${k} | ${v} |`;
      }).join('\n');
      return `\n\n### ${title}\n${header}\n${body}\n`;
    };
    const between = (needle: RegExp, source: string) => {
      const m = source.match(needle); if (!m) return { start: -1, end: -1, content: '' };
      const start = m.index ?? 0;
      const hdrLen = m[0].length;
      const after = source.slice(start + hdrLen);
      const relEnd = after.search(/^#{1,6}\s+/m);
      const end = relEnd === -1 ? source.length : start + hdrLen + relEnd;
      const content = source.slice(start + hdrLen, end).trim();
      return { start, end, content };
    };
    try {
      let out = md
        // remove empty bullet lines (just a dash or dot)
        .replace(/\n-\s*(?:[•\-]?\s*)?(?=\n)/g, '\n')
        .replace(/\n\s*•\s*(?=\n)/g, '\n');

      const targets = [
        { key: 'الأطراف', rx: /^#{1,6}\s*الأطراف:?/mi },
        { key: 'الأدلة والمضبوطات', rx: /^#{1,6}\s*الأدلة والمضبوطات:?/mi },
        { key: 'الإجراءات المتخذة', rx: /^#{1,6}\s*الإجراءات المتخذة:?/mi },
      ];
      for (const t of targets) {
        const seg = between(t.rx, out);
        if (seg.start !== -1 && /(^|\n)-\s+/.test(seg.content)) {
          const tbl = toTable(t.key, seg.content);
          if (tbl) {
            out = out.slice(0, seg.start) + `### ${t.key}\n` + tbl + out.slice(seg.end);
          }
        }
      }

      // Structure "البيانات العامة" by converting key:value lines into a table
      const general = between(/^#{1,6}\s*البيانات\s*العامة:?/mi, out);
      if (general.start !== -1) {
        const lines = general.content
          .split(/\n/)
          .map(s => s.replace(/^[-•]\s*/, '').trim())
          .filter(Boolean);
        const kv = lines
          .map(l => {
            const m2 = l.match(/^([^:：\-]+)[:：\-]\s*(.*)$/);
            if (!m2) return null;
            return { k: m2[1].trim(), v: m2[2].trim() || 'غير متوفر' };
          })
          .filter(Boolean) as {k:string;v:string}[];
        if (kv.length) {
          const header = `| البند | التفاصيل |\n| --- | --- |`;
          const body = kv.map(({k,v}) => `| ${k} | ${v} |`).join('\n');
          const tbl = `\n\n### البيانات العامة\n${header}\n${body}\n`;
          out = out.slice(0, general.start) + `### البيانات العامة\n` + tbl + out.slice(general.end);
        }
      }
      return out;
    } catch {
      return md;
    }
  };

  // No modal anymore; we keep inline start panel when no conversation selected

  const embedImageAsDataUrl = async (uri: string, contentType: string, fileName: string): Promise<{ url: string; name: string; contentType: string; size?: number; }> => {
    let base64: string | undefined;
    try {
      base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    } catch {}
    if (!base64 && Platform.OS === 'web') {
      const res = await fetch(uri);
      const blob = await res.blob();
      base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          resolve(dataUrl.split(',')[1] || '');
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    const url = `data:${contentType};base64,${base64 || ''}`;
    let size: number | undefined;
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists && info.size) size = info.size as number;
    } catch {}
    return { url, name: fileName, contentType, size };
  };

  const handleAttachImage = async () => {
    if (!selectedConversation) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7, base64: true });
    if (res.canceled || !res.assets?.length) return;
    const asset = res.assets[0];
    const uri = asset.uri;
    const name = (asset as any).fileName || `image_${Date.now()}.jpg`;
    const contentType = (asset as any).mimeType || 'image/jpeg';

    setPendingAttachmentUri(uri);
    setUploading(true);
    try {
      const dataUrl = (asset as any).base64 ? `data:${contentType};base64,${(asset as any).base64}` : undefined;
      const attachment = dataUrl ? { url: dataUrl, name, contentType } : await embedImageAsDataUrl(uri, contentType, name);
      const localId = `local-${Date.now()}`;
      setMessages(prev => [...prev, { id: localId, content: '', type: 'user', timestamp: new Date(), attachment }]);
    } catch (e) {
      const assistantMessage: Message = {
        id: (Date.now() + 4).toString(),
        content: `تعذر رفع الملف: ${e instanceof Error ? e.message : ''}`,
        type: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setUploading(false);
      setPendingAttachmentUri(null);
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !selectedConversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      type: 'user',
      timestamp: new Date(),
    };

    // Optimistic UI
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Persist user message
      await addDoc(collection(db, 'conversations', selectedConversation.id, 'messages'), {
        content: text,
        type: 'user',
        createdAt: serverTimestamp(),
      });

      // Lock persona after first user message and update title/lastMessage
      if (!selectedConversation.locked) {
        const fallbackTitle = text.slice(0, 40) || DEFAULT_CONVERSATION_TITLE;
        const existingCustomTitle = selectedConversation.customTitle
          ? selectedConversation.customTitle
          : stripCaseNumberFromTitle(selectedConversation.title || DEFAULT_CONVERSATION_TITLE, selectedConversation.caseNumber);
        const newCustomTitle = existingCustomTitle === DEFAULT_CONVERSATION_TITLE ? fallbackTitle : existingCustomTitle;
        const composedTitle = composeConversationTitle(newCustomTitle, selectedConversation.caseNumber);
        await updateDoc(doc(db, 'conversations', selectedConversation.id), {
          locked: true,
          customTitle: newCustomTitle,
          title: composedTitle,
          lastMessage: text.slice(0, 120),
          updatedAt: serverTimestamp(),
        });
        setSelectedConversation((prev) => {
          if (!prev || prev.id !== selectedConversation.id) return prev;
          return { ...prev, locked: true, customTitle: newCustomTitle, title: composedTitle };
        });
        setConversations((prev) => prev.map((conv) => (
          conv.id === selectedConversation.id
            ? { ...conv, locked: true, customTitle: newCustomTitle, title: composedTitle, lastMessage: text.slice(0, 120) }
            : conv
        )));
      } else {
        await updateDoc(doc(db, 'conversations', selectedConversation.id), {
          lastMessage: text.slice(0, 120),
          updatedAt: serverTimestamp(),
        });
        setConversations((prev) => prev.map((conv) => (
          conv.id === selectedConversation.id ? { ...conv, lastMessage: text.slice(0, 120) } : conv
        )));
      }

      const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'لم يتم ضبط مفتاح واجهة OpenAI. رجاءً أضف المتغير EXPO_PUBLIC_OPENAI_API_KEY إلى ملف .env ثم أعد التشغيل.',
          type: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        return;
      }

      // Build chat history for the API
      const personaId = (selectedConversation.persona || 'general') as PersonaId;
      const systemPrompt = personaPrompts[personaId]?.system || personaPrompts.general.system;
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => {
          const parts: any[] = [];
          if (m.content) parts.push({ type: 'text', text: m.content });
          if (m.attachment && m.attachment.contentType?.startsWith('image/')) {
            parts.push({ type: 'image_url', image_url: { url: m.attachment.url } });
          }
          return { role: m.type === 'user' ? 'user' : 'assistant', content: parts.length ? parts : [{ type: 'text', text: '' }] };
        }),
        { role: 'user', content: [{ type: 'text', text }] },
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: apiMessages,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content?.trim();

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: content || 'تعذر توليد رد من النموذج.',
        type: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Persist assistant message
      await addDoc(collection(db, 'conversations', selectedConversation.id, 'messages'), {
        content: assistantMessage.content,
        type: 'assistant',
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'conversations', selectedConversation.id), {
        lastMessage: assistantMessage.content.slice(0, 120),
        updatedAt: serverTimestamp(),
      });
    } catch (e: any) {
      const assistantMessage: Message = {
        id: (Date.now() + 3).toString(),
        content: `حدث خطأ أثناء الاتصال بـ OpenAI: ${e?.message || e}`,
        type: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const createConversation = async (p: PersonaId) => {
    // Create conversation doc
    const docRef = await addDoc(collection(db, 'conversations'), {
      title: DEFAULT_CONVERSATION_TITLE,
      customTitle: DEFAULT_CONVERSATION_TITLE,
      persona: p,
      locked: false,
      lastMessage: personaPrompts[p].intake.slice(0, 120),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    // Add intake as first assistant message
    await addDoc(collection(db, 'conversations', docRef.id, 'messages'), {
      content: personaPrompts[p].intake,
      type: 'assistant',
      createdAt: serverTimestamp(),
    });
    const conv: Conversation = {
      id: docRef.id,
      title: DEFAULT_CONVERSATION_TITLE,
      persona: p,
      locked: false,
      customTitle: DEFAULT_CONVERSATION_TITLE,
      caseNumber: undefined,
    };
    setSelectedConversation(conv);
  };

  const beginTitleEditing = () => {
    if (!selectedConversation || deletingConversationId === selectedConversation.id) return;
    const baseTitle = selectedConversation.customTitle
      ? selectedConversation.customTitle
      : stripCaseNumberFromTitle(selectedConversation.title || DEFAULT_CONVERSATION_TITLE, selectedConversation.caseNumber);
    setTitleDraft(baseTitle);
    setIsEditingTitle(true);
  };

  const cancelTitleEditing = () => {
    if (savingTitle) return;
    const baseTitle = selectedConversation?.customTitle
      ? selectedConversation.customTitle
      : selectedConversation
        ? stripCaseNumberFromTitle(selectedConversation.title || DEFAULT_CONVERSATION_TITLE, selectedConversation.caseNumber)
        : '';
    setTitleDraft(baseTitle);
    setIsEditingTitle(false);
  };

  const commitTitleEditing = async () => {
    if (!selectedConversation || savingTitle) return;
    const trimmed = titleDraft.trim();
    let newCustomTitle = trimmed || DEFAULT_CONVERSATION_TITLE;
    if (selectedConversation.caseNumber) {
      newCustomTitle = stripCaseNumberFromTitle(newCustomTitle, selectedConversation.caseNumber);
    }
    const newTitle = composeConversationTitle(newCustomTitle, selectedConversation.caseNumber);
    setSavingTitle(true);
    try {
      await updateDoc(doc(db, 'conversations', selectedConversation.id), {
        customTitle: newCustomTitle,
        title: newTitle,
        updatedAt: serverTimestamp(),
      });
      setSelectedConversation((prev) => {
        if (!prev || prev.id !== selectedConversation.id) return prev;
        return { ...prev, customTitle: newCustomTitle, title: newTitle };
      });
      setConversations((prev) => prev.map((conv) => (
        conv.id === selectedConversation.id ? { ...conv, customTitle: newCustomTitle, title: newTitle } : conv
      )));
      setTitleDraft(newCustomTitle);
      setIsEditingTitle(false);
    } catch (e: any) {
      Alert.alert('تعذر إعادة التسمية', e?.message || 'حدث خطأ أثناء تحديث عنوان المحادثة.');
    } finally {
      setSavingTitle(false);
    }
  };

  const confirmDeleteConversation = (convId: string) => {
    if (deletingConversationId) return;

    if (Platform.OS === 'web') {
      const confirmFn = (globalThis as { confirm?: (message?: string) => boolean }).confirm;
      const canDelete = typeof confirmFn === 'function'
        ? confirmFn('هل تريد حذف هذه المحادثة وجميع رسائلها؟')
        : true;
      if (canDelete) deleteConversation(convId);
      return;
    }

    Alert.alert('حذف المحادثة', 'هل تريد حذف هذه المحادثة وجميع رسائلها؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => deleteConversation(convId) },
    ]);
  };

  const deleteConversation = async (convId: string) => {
    try {
      setDeletingConversationId(convId);
      const msgs = await getDocs(collection(db, 'conversations', convId, 'messages'));
      await Promise.allSettled(
        msgs.docs.map(d => deleteDoc(doc(db, 'conversations', convId, 'messages', d.id)))
      );
      // Try deleting linked report (if created with same id)
      try { await deleteDoc(doc(db, 'reports', convId)); } catch {}
      await deleteDoc(doc(db, 'conversations', convId));
      if (selectedConversation?.id === convId) setSelectedConversation(null);
      setMessages(prev => (selectedConversation?.id === convId ? [] : prev));
      setConversations(prev => prev.filter(conv => conv.id !== convId));
    } catch (e: any) {
      Alert.alert('تعذر الحذف', e?.message || 'حدث خطأ أثناء حذف المحادثة.');
    } finally {
      setDeletingConversationId(null);
    }
  };

  const pickPersonaAndCreate = async (p: PersonaId) => {
    setErrorText(null);
    try {
      await createConversation(p);
    } catch (e: any) {
      setErrorText('تعذر بدء المحادثة: صلاحيات غير كافية في Firestore/Storage. حدّث قواعد الأمان ثم أعد المحاولة.');
    }
  };

  const handleStartNewConversation = () => {
    setSelectedConversation(null);
    setMessages([]);
    setInputText('');
    setLiveDraft('');
    setPendingAttachmentUri(null);
    setUploading(false);
    setReportStatus('idle');
    setDraftCollapsed(true);
    setErrorText(null);
    setShowSpeechToText(false);
  };

  const handleTranscriptionComplete = (transcribedText: string) => {
    setInputText(prev => prev + (prev ? ' ' : '') + transcribedText);
    setShowSpeechToText(false);
  };

  const renderMessage = ({ item }: ListRenderItemInfo<Message>) => (
    <View style={[
      styles.messageContainer,
      item.type === 'user' ? styles.userMessageContainer : styles.assistantMessageContainer
    ]}>
      <View style={[
        styles.messageAvatar,
        item.type === 'user' ? styles.userAvatar : styles.assistantAvatar
      ]}>
        {item.type === 'user' ? (
          <User size={16} color={Colors.text.inverse} />
        ) : (
          <Bot size={16} color={Colors.text.inverse} />
        )}
      </View>
      
      <View style={[
        styles.messageBubble,
        item.type === 'user' ? styles.userMessage : styles.assistantMessage
      ]}>
        {item.attachment ? (
          <View>
            {item.attachment.contentType.startsWith('image/') ? (
              <Image source={{ uri: item.attachment.url }} style={styles.imagePreview} />
            ) : (
              <TouchableOpacity style={styles.fileAttachment} onPress={() => WebBrowser.openBrowserAsync(item.attachment!.url)}>
                <Paperclip size={16} color={Colors.text.primary} />
                <Text style={styles.fileName} numberOfLines={1}>{item.attachment.name}</Text>
                <Text style={styles.fileOpen}>فتح</Text>
              </TouchableOpacity>
            )}
            {!!item.content?.trim() && (
              <View style={{ marginTop: Spacing[2] }}>
                <Markdown style={item.type === 'user' ? chatMarkdownUserStyles : chatMarkdownAssistantStyles}>
                  {item.content}
                </Markdown>
              </View>
            )}
          </View>
        ) : (
          <Markdown style={item.type === 'user' ? chatMarkdownUserStyles : chatMarkdownAssistantStyles}>
            {item.content}
          </Markdown>
        )}
        <Text style={styles.messageTime}>
          {item.timestamp.toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.layoutRow}>
          {/* Left: Conversations Panel */}
          <View style={[styles.conversationsPanel, conversationsCollapsed && styles.conversationsPanelCollapsed]}>
            <View style={styles.convHeader}>
              {!conversationsCollapsed && <Text style={styles.convTitle}>المحادثات</Text>}
              <View style={styles.convHeaderActions}>
                {conversationsCollapsed ? (
                  <TouchableOpacity style={styles.newConversationIconButton} onPress={handleStartNewConversation}>
                    <Plus size={18} color={Colors.primary[600]} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.newConversationButton} onPress={handleStartNewConversation}>
                    <Plus size={16} color={Colors.text.inverse} />
                    <Text style={styles.newConversationButtonText}>محادثة جديدة</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setConversationsCollapsed(v => !v)} style={styles.collapseBtn}>
                  {conversationsCollapsed ? (
                    <ChevronRight size={18} color={Colors.text.tertiary} />
                  ) : (
                    <ChevronLeft size={18} color={Colors.text.tertiary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              data={conversations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.convItem, selectedConversation?.id === item.id && styles.convItemActive]}
                  onPress={() => setSelectedConversation(item)}
                >
                  <View style={styles.convItemRow}>
                    <View style={styles.convIconBadge}>
                      {item.persona === 'legal' ? (
                        <FileText size={14} color={Colors.primary[600]} />
                      ) : item.persona === 'fake_news' ? (
                        <SearchIcon size={14} color={Colors.primary[600]} />
                      ) : (
                        <Bot size={14} color={Colors.primary[600]} />
                      )}
                    </View>
                    {!conversationsCollapsed && (
                      <View style={styles.convItemContent}>
                        <Text style={styles.convItemTitle} numberOfLines={1}>{item.title || 'محادثة جديدة'}</Text>
                        <Text style={styles.convItemMeta} numberOfLines={1}>{personaPrompts[item.persona]?.label || 'مساعد عام'}</Text>
                      </View>
                    )}
                    {selectedConversation?.id === item.id && !conversationsCollapsed && (
                      <TouchableOpacity
                        onPress={() => confirmDeleteConversation(item.id)}
                        style={styles.trashBtn}
                        disabled={deletingConversationId === item.id}
                      >
                        <Trash2
                          size={16}
                          color={deletingConversationId === item.id ? Colors.text.muted : Colors.text.tertiary}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Right: Chat Area */}
          <View style={styles.chatArea}>
            {/* Chat Header */}
            <View style={styles.header}>
              <View style={styles.headerRightCluster}>
                <View style={styles.headerContent}>
                  {selectedConversation ? (
                    <>
                      <View style={styles.titleRow}>
                        {isEditingTitle ? (
                          <TextInput
                            style={styles.titleEditInput}
                            value={titleDraft}
                            onChangeText={setTitleDraft}
                            editable={!savingTitle}
                            onSubmitEditing={commitTitleEditing}
                            returnKeyType="done"
                            blurOnSubmit
                            placeholder="اكتب عنوان المحادثة"
                            autoFocus
                          />
                        ) : (
                          <Text style={styles.headerTitle} numberOfLines={1}>
                            {selectedConversation.title || DEFAULT_CONVERSATION_TITLE}
                          </Text>
                        )}
                        <View style={styles.titleActions}>
                          {isEditingTitle ? (
                            <>
                              <TouchableOpacity
                                onPress={commitTitleEditing}
                                style={[styles.titleIconButton, savingTitle && styles.titleIconButtonDisabled]}
                                disabled={savingTitle}
                              >
                                <Check size={18} color={Colors.primary[600]} />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={cancelTitleEditing}
                                style={[styles.titleIconButton, savingTitle && styles.titleIconButtonDisabled]}
                                disabled={savingTitle}
                              >
                                <X size={18} color={Colors.text.tertiary} />
                              </TouchableOpacity>
                            </>
                          ) : (
                            <TouchableOpacity
                              onPress={beginTitleEditing}
                              style={[styles.titleIconButton, deletingConversationId === selectedConversation.id && styles.titleIconButtonDisabled]}
                              disabled={deletingConversationId === selectedConversation.id}
                            >
                              <Pencil size={18} color={Colors.text.tertiary} />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                      <View style={styles.personaBadge}>
                        {selectedConversation.persona === 'legal' ? (
                          <FileText size={14} color={Colors.primary[600]} />
                        ) : selectedConversation.persona === 'fake_news' ? (
                          <SearchIcon size={14} color={Colors.primary[600]} />
                        ) : (
                          <Bot size={14} color={Colors.primary[600]} />
                        )}
                        <Text style={styles.personaBadgeText}>{personaPrompts[selectedConversation.persona]?.label}</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={styles.headerTitle}>المساعد الذكي</Text>
                      <Text style={styles.headerSubtitle}>اختر نوع المساعدة ثم ابدأ المحادثة</Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            {/* Messages List or Empty State */}
            {selectedConversation ? (
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>ابدأ محادثة جديدة</Text>
                {errorText ? <Text style={styles.emptyError}>{errorText}</Text> : (
                  <Text style={styles.emptySubtitle}>اختر أحد الأدوار التالية لبدء المحادثة</Text>
                )}
                <View style={styles.inlinePersonaRow}>

                  <TouchableOpacity style={styles.inlinePersonaCard} onPress={() => pickPersonaAndCreate('fake_news')}>
                    <View style={styles.inlinePersonaIcon}><SearchIcon size={20} color={Colors.primary[600]} /></View>
                    <Text style={styles.inlinePersonaTitle}>محلل الأخبار المُضلِّلة</Text>
                    <Text style={styles.inlinePersonaDesc}>تحقق مهني من المصداقية</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inlinePersonaCard} onPress={() => pickPersonaAndCreate('legal')}>
                    <View style={styles.inlinePersonaIcon}><FileText size={20} color={Colors.primary[600]} /></View>
                    <Text style={styles.inlinePersonaTitle}>كاتب المحاضر والتقارير القانونية</Text>
                    <Text style={styles.inlinePersonaDesc}>صياغة محاضر وتقارير رسمية</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inlinePersonaCard} onPress={() => pickPersonaAndCreate('general')}>
                    <View style={styles.inlinePersonaIcon}><Bot size={20} color={Colors.primary[600]} /></View>
                    <Text style={styles.inlinePersonaTitle}>مساعد عام</Text>
                    <Text style={styles.inlinePersonaDesc}>مساعدة عامة وواضحة</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <View style={styles.typingContainer}>
                <View style={styles.typingBubble}>
                  <View style={styles.typingDots}>
                    <View style={[styles.typingDot, styles.typingDot1]} />
                    <View style={[styles.typingDot, styles.typingDot2]} />
                    <View style={[styles.typingDot, styles.typingDot3]} />
                  </View>
                </View>
              </View>
            )}

            {/* Live Draft Panel */}
            {selectedConversation && (
              <View style={styles.draftPanel}>
                <View style={styles.draftHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity onPress={() => setDraftCollapsed(v => !v)}>
                      {draftCollapsed ? <ChevronDown size={16} color={Colors.text.primary} /> : <ChevronUp size={16} color={Colors.text.primary} />}
                    </TouchableOpacity>
                    <FileText size={16} color={Colors.primary[600]} />
                    <Text style={styles.draftTitle}>{selectedConversation?.persona === 'legal' ? 'تقرير قانوني' : 'مسودة التقرير'}</Text>
                    {selectedConversation?.persona === 'legal' && (
                      <View style={styles.badgeOfficial}><Text style={styles.badgeOfficialText}>محضر رسمي</Text></View>
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity style={[styles.primaryBtn, (!liveDraft.trim() || savingDraft) && styles.primaryBtnDisabled]} disabled={!liveDraft.trim() || savingDraft} onPress={() => saveReport('final')}>
                      <Text style={[styles.primaryBtnText, (!liveDraft.trim() || savingDraft) && styles.primaryBtnTextDisabled]}>{savingDraft ? 'جارٍ الحفظ...' : 'حفظ'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {!draftCollapsed && (
                  <>
                    <View style={styles.draftBody}>
                      {liveDraft ? (
                        <ScrollView style={styles.draftScroll} contentContainerStyle={{ paddingBottom: 8, alignItems: 'flex-end' }}>
                          <View style={styles.draftContentWrap}>
                            <Markdown style={liveDraftMarkdownStyles}>{liveDraft}</Markdown>
                          </View>
                        </ScrollView>
                      ) : (
                        <Text style={styles.draftEmpty}>ابدأ بالمراسلة، وسيتم توليد مسودة تقرير تلقائياً.</Text>
                      )}
                    </View>
                    {liveDraft && (() => {
                      const m = liveDraft.match(/^[#]*\s*المعلومات الناقصة[\s\S]*?\n((?:- .+\n)+)/m);
                      if (!m) return null;
                      const bullets = (m[1].match(/^- /gm) || []).length;
                      return (
                        <View style={styles.missingRow}>
                          <Text style={styles.missingText}>معلومات ناقصة: {bullets}</Text>
                        </View>
                      );
                    })()}
                  </>
                )}
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

            {/* Input Area */}
            <View style={[styles.inputArea, (!selectedConversation || uploading) && styles.inputAreaDisabled]}>
              <TouchableOpacity
                style={[styles.sendButton, (!inputText.trim() || !selectedConversation || uploading) && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!inputText.trim() || !selectedConversation || uploading}
              >
                <Send 
                  size={20} 
                  color={inputText.trim() && selectedConversation && !uploading ? Colors.text.inverse : Colors.text.muted} 
                />
              </TouchableOpacity>

              <View style={styles.inputActionsGroup}>
                <TouchableOpacity
                  style={[styles.attachButton, (!selectedConversation || uploading) && styles.attachButtonDisabled]}
                  onPress={handleAttachImage}
                  disabled={!selectedConversation || uploading}
                >
                  <ImageIcon size={18} color={selectedConversation && !uploading ? Colors.text.tertiary : Colors.text.muted} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.speechButton, (!selectedConversation || uploading) && styles.speechButtonDisabled]}
                  onPress={() => setShowSpeechToText(true)}
                  disabled={!selectedConversation || uploading}
                >
                  <Mic size={20} color={selectedConversation && !uploading ? Colors.success[500] : Colors.text.muted} />
                </TouchableOpacity>
              </View>

              {(uploading || pendingAttachmentUri) && (
                <View style={styles.uploadingRow}>
                  {pendingAttachmentUri ? (
                    <Image source={{ uri: pendingAttachmentUri }} style={styles.uploadingThumb} />
                  ) : null}
                  <Text style={styles.uploadingText}>جارٍ رفع الصورة...</Text>
                </View>
              )}

              <TextInput
                style={[styles.textInput, (!selectedConversation || uploading) && styles.textInputDisabled]}
                placeholder={selectedConversation ? "اكتب رسالتك هنا..." : "ابدأ محادثة جديدة واختر نوع المساعدة"}
                placeholderTextColor={Colors.text.muted}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={1000}
                textAlign="right"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
                editable={!!selectedConversation && !uploading}
              />
            </View>
          </View>
        </View>

        {/* No modal; inline persona cards are rendered in empty state */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type PaletteShape = ReturnType<typeof useTheme>['palette'];

const hexToRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace('#', '');
  const full = sanitized.length === 3
    ? sanitized.split('').map((c) => c + c).join('')
    : sanitized;
  const intVal = parseInt(full, 16);
  const r = (intVal >> 16) & 255;
  const g = (intVal >> 8) & 255;
  const b = intVal & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createStyles = (mode: ThemeMode, palette: PaletteShape) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    // Ensure RTL layout by default
  //  direction: 'rtl' as const,
   // writingDirection: 'rtl' as const,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...TextStyles.heading3,
    marginBottom: Spacing[1],
    textAlign: 'center',
    flexShrink: 1,
    color: Colors.text.primary,
  },
  headerSubtitle: {
    ...TextStyles.caption,
    textAlign: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    width: '100%',
  },
  titleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  titleEditInput: {
    minWidth: 200,
    maxWidth: Platform.OS === 'web' ? 360 : 260,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    backgroundColor: Colors.background.secondary,
    textAlign: 'center',
    color: Colors.text.primary,
    fontFamily: Typography.weights.semibold,
    fontSize: Typography.sizes['3xl'],
  },
  titleIconButton: {
    padding: Spacing[1],
    borderRadius: BorderRadius.default,
  },
  titleIconButtonDisabled: {
    opacity: 0.4,
  },
  headerRightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  messagesContent: {
    padding: Spacing[5],
    paddingBottom: Spacing[8],
    direction: 'rtl' as const,
    writingDirection: 'rtl' as const,
  },
  messageContainer: {
    flexDirection: 'row-reverse',
    marginBottom: Spacing[4],
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    gap: Spacing[2],
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  assistantMessageContainer: {
    alignSelf: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing[2],
    marginRight: 0,
  },
  userAvatar: {
    backgroundColor: Colors.primary[500],
  },
  assistantAvatar: {
    backgroundColor: Colors.secondary[600],
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    alignItems: 'flex-end',
  },
  userMessage: {
    backgroundColor: Colors.primary[500],
    borderBottomRightRadius: BorderRadius.sm,
  },
  assistantMessage: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  messageText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.regular,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
    marginBottom: Spacing[1],
  },
  userMessageText: {
    color: Colors.text.inverse,
    textAlign: 'right',
  },
  assistantMessageText: {
    color: Colors.text.primary,
    textAlign: 'right',
  },
  imagePreview: {
    width: 220,
    height: 160,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing[2],
  },
  fileAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  fileName: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.text.primary,
  },
  fileOpen: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary[600],
    fontFamily: Typography.weights.semibold,
  },
  messageTime: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.weights.regular,
    opacity: 0.7,
    textAlign: 'right',
  },
  typingContainer: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[2],
  },
  typingBubble: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.sm,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.text.muted,
  },
  typingDot1: {
    // Animation would be added here in a real implementation
  },
  typingDot2: {
    // Animation would be added here in a real implementation
  },
  typingDot3: {
    // Animation would be added here in a real implementation
  },
  draftPanel: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
    marginHorizontal: Spacing[5],
    marginBottom: Spacing[3],
    overflow: 'hidden',
  },
  draftHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  draftTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  draftBody: {
    padding: Spacing[3],
    alignItems: 'flex-end',
  },
  draftScroll: {
    maxHeight: 420,
  },
  draftContentWrap: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'flex-end',
  },
  badgeOfficial: {
    backgroundColor: Colors.success[50],
    borderColor: Colors.success[200],
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
  },
  badgeOfficialText: {
    fontSize: Typography.sizes.xs,
    color: Colors.success[700],
    fontFamily: Typography.weights.semibold,
  },
  draftEmpty: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  missingRow: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
  },
  missingText: {
    fontSize: Typography.sizes.sm,
    color: Colors.danger[600],
    fontFamily: Typography.weights.semibold,
  },
  pillBtn: {
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
  pillOn: { backgroundColor: Colors.success[50], borderColor: Colors.success[200] },
  pillOff: { backgroundColor: Colors.background.secondary, borderColor: Colors.border.default },
  pillText: { fontSize: Typography.sizes.sm },
  pillTextOn: { color: Colors.success[700], fontFamily: Typography.weights.semibold },
  pillTextOff: { color: Colors.text.secondary },
  primaryBtn: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
  },
  primaryBtnDisabled: { backgroundColor: Colors.secondary[300] },
  primaryBtnText: { color: Colors.text.inverse, fontFamily: Typography.weights.semibold },
  primaryBtnTextDisabled: { color: Colors.text.inverse },
  secondaryBtn: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
  },
  secondaryBtnDisabled: { opacity: 0.6 },
  secondaryBtnText: { color: Colors.text.primary, fontFamily: Typography.weights.semibold },
  secondaryBtnTextDisabled: { color: Colors.text.tertiary },
  layoutRow: {
    flex: 1,
    flexDirection: 'row',
  },
  conversationsPanel: {
    width: 280,
    borderRightWidth: 1,
    borderRightColor: Colors.border.default,
    backgroundColor: Colors.background.primary,
  },
  conversationsPanelCollapsed: {
    width: 72,
  },
  convHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  convHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginLeft: 'auto',
  },
  newConversationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
  newConversationButtonText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.semibold,
    color: Colors.text.inverse,
  },
  newConversationIconButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  convTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  convItem: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    alignItems: 'flex-end',
  },
  convItemRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing[3],
  },
  convItemContent: {
    flex: 1,
    alignItems: 'flex-end',
    gap: Spacing[1],
  },
  trashBtn: {
    padding: Spacing[1],
    marginRight: 'auto',
    marginLeft: 0,
  },
  collapseBtn: {
    padding: Spacing[1],
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.secondary,
  },
  convIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  convItemActive: {
    backgroundColor: hexToRgba(palette.primary[500], mode === 'dark' ? 0.2 : 0.08),
    borderRightWidth: 2,
    borderRightColor: palette.primary[500],
  },
  convItemTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.semibold,
    color: Colors.text.primary,
    textAlign: 'right',
  },
  convItemMeta: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.regular,
    color: Colors.text.tertiary,
    textAlign: 'right',
  },
  chatArea: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...TextStyles.heading3,
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  emptyError: {
    ...TextStyles.caption,
    color: Colors.danger[600],
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  emptySubtitle: {
    ...TextStyles.caption,
    textAlign: 'center',
  },
  inlinePersonaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
    marginTop: Spacing[4],
    justifyContent: 'center',
    paddingHorizontal: Spacing[4],
  },
  inlinePersonaCard: {
    width: 220,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[4],
    alignItems: 'center',
  },
  inlinePersonaIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  inlinePersonaTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.weights.semibold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: Spacing[1],
  },
  inlinePersonaDesc: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.regular,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: Spacing[1],
  },
  personaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  personaBadgeText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary[600],
    fontFamily: Typography.weights.semibold,
  },
  // modal styles removed (inline start panel is used)
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
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
    gap: Spacing[3],
  },
  inputAreaDisabled: {
    opacity: 0.6,
  },
  inputActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  uploadingRow: {
    position: 'absolute',
    left: Spacing[5],
    bottom: Spacing[4] + 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  uploadingText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
  },
  uploadingThumb: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  textInput: {
    flex: 1,
    ...InputStyles.large,
    maxHeight: 120,
    textAlignVertical: 'top',
    writingDirection: 'rtl' as const,
  },
  textInputDisabled: {
    backgroundColor: Colors.background.tertiary,
    borderColor: Colors.border.medium,
  },
  speechButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.success[50],
    borderWidth: 2,
    borderColor: Colors.success[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechButtonDisabled: {
    backgroundColor: Colors.background.secondary,
    borderColor: Colors.border.default,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButtonDisabled: {
    backgroundColor: Colors.background.secondary,
    borderColor: Colors.border.light,
  },
  attachDocText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
    fontFamily: Typography.weights.semibold,
  },
  attachDocTextDisabled: {
    color: Colors.text.muted,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.secondary[300],
  },
});

// Markdown styles for live draft rendering
const createLiveDraftMarkdownStyles = () => ({
  body: {
    color: Colors.text.primary,
    fontFamily: Typography.weights.regular,
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.sm,
    textAlign: 'right' as const,
    writingDirection: 'rtl' as const,
  },
  heading1: {
    color: Colors.text.primary,
    fontFamily: Typography.weights.semibold,
    fontSize: Typography.sizes.xl,
    marginBottom: Spacing[2],
    textAlign: 'right' as const,
  },
  heading2: {
    color: Colors.text.primary,
    fontFamily: Typography.weights.semibold,
    fontSize: Typography.sizes.lg,
    marginTop: Spacing[2],
    marginBottom: Spacing[1],
    textAlign: 'right' as const,
  },
  paragraph: {
    marginBottom: Spacing[2],
  },
  bullet_list: {
    marginBottom: Spacing[2],
  },
  ordered_list: {
    marginBottom: Spacing[2],
  },
  list_item: {
    textAlign: 'right' as const,
  },
  table: { marginBottom: Spacing[2], width: '100%' },
  thead: { borderBottomWidth: 1, borderBottomColor: Colors.border.default },
  th: { textAlign: 'right' as const, fontFamily: Typography.weights.semibold, paddingVertical: 6 },
  tr: { borderBottomWidth: 1, borderBottomColor: Colors.border.light },
  td: { textAlign: 'right' as const, paddingVertical: 6 },
});

// Markdown styles for chat bubbles
const createChatMarkdownAssistantStyles = () => ({
  body: {
    color: Colors.text.primary,
    fontFamily: Typography.weights.regular,
    fontSize: Typography.sizes.base,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
    textAlign: 'right' as const,
    writingDirection: 'rtl' as const,
  },
  heading1: { color: Colors.text.primary, fontFamily: Typography.weights.semibold, fontSize: Typography.sizes.lg, textAlign: 'right' as const },
  heading2: { color: Colors.text.primary, fontFamily: Typography.weights.semibold, fontSize: Typography.sizes.base, textAlign: 'right' as const },
  paragraph: { marginBottom: Spacing[1] },
  bullet_list: { marginBottom: Spacing[1] },
  ordered_list: { marginBottom: Spacing[1] },
  list_item: { textAlign: 'right' as const },
  link: { color: Colors.primary[600] },
  code_inline: { backgroundColor: Colors.background.secondary, paddingHorizontal: 4, borderRadius: 4 },
});

const createChatMarkdownUserStyles = () => ({
  body: {
    color: Colors.text.inverse,
    fontFamily: Typography.weights.regular,
    fontSize: Typography.sizes.base,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
    textAlign: 'right' as const,
    writingDirection: 'rtl' as const,
  },
  heading1: { color: Colors.text.inverse, fontFamily: Typography.weights.semibold, fontSize: Typography.sizes.lg, textAlign: 'right' as const },
  heading2: { color: Colors.text.inverse, fontFamily: Typography.weights.semibold, fontSize: Typography.sizes.base, textAlign: 'right' as const },
  paragraph: { marginBottom: Spacing[1] },
  bullet_list: { marginBottom: Spacing[1] },
  ordered_list: { marginBottom: Spacing[1] },
  list_item: { textAlign: 'right' as const },
  link: { color: Colors.background.primary },
  code_inline: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 4, borderRadius: 4 },
});
