import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Plus, Mic, Bot, User } from 'lucide-react-native';
import { SpeechToText } from '@/components/SpeechToText';
import { Colors, Typography, Spacing, BorderRadius, ButtonStyles, TextStyles, CardStyles, InputStyles } from '@/constants/theme';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'مرحباً! أنا مساعدك الذكي لكشف الأخبار المُضللة. كيف يمكنني مساعدتك اليوم؟',
      type: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSpeechToText, setShowSpeechToText] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `شكراً لك على رسالتك: "${userMessage.content}". هذا رد تجريبي من المساعد الذكي. في التطبيق الحقيقي، سيتم تحليل رسالتك وتقديم إجابة مفيدة ودقيقة.`,
        type: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
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
          <User size={16} color="#FFFFFF" />
        ) : (
          <Bot size={16} color="#FFFFFF" />
        )}
      </View>
      
      <View style={[
        styles.messageBubble,
        item.type === 'user' ? styles.userMessage : styles.assistantMessage
      ]}>
        <Text style={[
          styles.messageText,
          item.type === 'user' ? styles.userMessageText : styles.assistantMessageText
        ]}>
          {item.content}
        </Text>
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
        {/* Chat Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.newChatButton}>
            <Plus size={20} color="#10B981" />
            <Text style={styles.newChatText}>محادثة جديدة</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>المساعد الذكي</Text>
            <Text style={styles.headerSubtitle}>مدعوم بالذكاء الاصطناعي المتقدم</Text>
          </View>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />

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
        <View style={styles.inputArea}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Send 
              size={20} 
              color={inputText.trim() ? "#FFFFFF" : "#9CA3AF"} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.speechButton}
            onPress={() => setShowSpeechToText(true)}
          >
            <Mic size={20} color="#10B981" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="اكتب رسالتك هنا أو استخدم التسجيل الصوتي..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            textAlign="right"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  headerContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    ...TextStyles.heading3,
    marginBottom: Spacing[1],
    textAlign: 'right',
  },
  headerSubtitle: {
    ...TextStyles.caption,
    textAlign: 'right',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    ...ButtonStyles.ghost,
    borderColor: Colors.primary[200],
    gap: Spacing[2],
  },
  newChatText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.weights.medium,
    color: Colors.primary[600],
  },
  messagesList: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  messagesContent: {
    padding: Spacing[5],
    paddingBottom: Spacing[8],
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: Spacing[4],
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing[2],
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
  textInput: {
    flex: 1,
    ...InputStyles.large,
    maxHeight: 120,
    textAlignVertical: 'top',
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
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
});