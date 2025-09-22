import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';
import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';

interface Conversation {
  id: string;
  title?: string;
  createdAt?: any;
}

interface Message {
  content: string;
  type: 'user' | 'assistant';
  createdAt?: any;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  // Fetch all conversations
  useEffect(() => {
    const q = query(collection(db, 'conversations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convs: Conversation[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConversations(convs);
    });
    return () => unsubscribe();
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return setMessages([]);
    const q = query(
      collection(db, 'conversations', selectedConversation.id, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = querySnapshot.docs.map(doc => doc.data() as Message);
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [selectedConversation]);

  // Create a new conversation
  const handleNewConversation = async () => {
    setLoading(true);
    const docRef = await addDoc(collection(db, 'conversations'), {
      createdAt: serverTimestamp(),
      title: 'محادثة جديدة',
    });
    setSelectedConversation({ id: docRef.id, title: 'محادثة جديدة' });
    setLoading(false);
  };

  // Send a message
  const handleSend = async () => {
    if (!inputText.trim() || !selectedConversation) return;
    setLoading(true);
    await addDoc(collection(db, 'conversations', selectedConversation.id, 'messages'), {
      content: inputText.trim(),
      type: 'user',
      createdAt: serverTimestamp(),
    });
    setInputText('');
    setLoading(false);
    // Placeholder: Here you would call your AI API and add the assistant reply
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = ({ item }: ListRenderItemInfo<Message>) => (
    <View style={[styles.message, item.type === 'user' ? styles.userMessage : styles.assistantMessage]}>
      <Text style={styles.messageText}>{item.content}</Text>
      {item.createdAt && (
        <Text style={styles.timestamp}>
          {item.createdAt.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : ''}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Conversation List */}
      <View style={styles.sidebar}>
        <TouchableOpacity style={styles.newButton} onPress={handleNewConversation} disabled={loading}>
          <Text style={styles.newButtonText}>محادثة جديدة</Text>
        </TouchableOpacity>
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.conversationItem, selectedConversation?.id === item.id && styles.selectedConversation]}
              onPress={() => setSelectedConversation(item)}
            >
              <Text style={styles.conversationTitle}>{item.title || 'بدون عنوان'}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {/* Chat Area */}
      <View style={styles.chatArea}>
        {selectedConversation ? (
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{selectedConversation.title || 'محادثة'}</Text>
            </View>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={renderMessage}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="اكتب رسالتك..."
                onSubmitEditing={handleSend}
                editable={!loading}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
                <Text style={styles.sendButtonText}>إرسال</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text>اختر محادثة أو أنشئ واحدة جديدة</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 200, backgroundColor: '#F3F4F6', padding: 12 },
  newButton: { backgroundColor: '#10B981', padding: 12, borderRadius: 8, marginBottom: 12 },
  newButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  conversationItem: { padding: 10, borderRadius: 6, marginBottom: 6, backgroundColor: '#fff' },
  selectedConversation: { backgroundColor: '#D1FAE5' },
  conversationTitle: { fontWeight: 'bold', color: '#111827' },
  chatArea: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 8 },
  headerTitle: { fontWeight: 'bold', fontSize: 18, color: '#10B981' , textAlign: 'center'},
  message: { marginBottom: 10, padding: 10, borderRadius: 8, maxWidth: '80%', alignSelf: 'flex-end' },
  userMessage: { backgroundColor: '#10B981', alignSelf: 'flex-end' },
  assistantMessage: { backgroundColor: '#F3F4F6', alignSelf: 'flex-start' },
  messageText: { color: '#111827' },
  timestamp: { fontSize: 10, color: '#6B7280', marginTop: 4, textAlign: 'left' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, marginRight: 8 },
  sendButton: { backgroundColor: '#10B981', padding: 12, borderRadius: 8 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
}); 