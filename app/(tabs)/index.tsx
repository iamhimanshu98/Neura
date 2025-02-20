import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeContext } from '../../context/ThemeContext';
import { sendMessage, type ChatMessage } from '../../services/api';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { useFonts } from 'expo-font';

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'What can I help you with?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [fontsLoaded] = useFonts({
    'Gilroy-Regular': require('../../assets/fonts/Gilroy-Regular.ttf'),
    'Gilroy-Bold': require('../../assets/fonts/Gilroy-Bold.ttf'),
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const { theme } = useThemeContext();
  const systemColorScheme = useColorScheme();
  const isDark =
    theme === 'auto' ? systemColorScheme === 'dark' : theme === 'dark';

  const styles = getStyles(isDark);

  // Send message function (same as before)
  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await sendMessage(inputText);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading]);

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (e.nativeEvent.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image
            source={require('../../assets/images/android-chrome-512x512.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Neura </Text>
        </View>
        <Text style={styles.subtitle}>Your AI Assistant</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
        >
          {messages.map((message) => (
            <Animated.View
              key={message.id}
              entering={FadeInUp}
              style={[
                styles.messageBubble,
                message.isUser ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.isUser
                    ? styles.userMessageText
                    : styles.aiMessageText,
                ]}
              >
                {message.text}
              </Text>
            </Animated.View>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#7C3AED" />
              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          )}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor={isDark ? '#666666' : '#999999'}
            multiline
            editable={!isLoading}
            onKeyPress={handleKeyPress} // Detect key press
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons
              name="send"
              size={24}
              color={
                inputText.trim() && !isLoading
                  ? '#7C3AED'
                  : isDark
                  ? '#666666'
                  : '#999999'
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    header: {
      padding: 20,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#E5E5E5',
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center', // Align logo and title vertically
      gap: 8, // Adjust spacing between logo and title
    },
    title: {
      fontSize: 28,
      fontFamily: 'Gilroy-Regular',
      // fontWeight: '900',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#888888' : '#666666',
      marginTop: 4,
    },
    logo: {
      width: 24, // Adjust as needed
      height: 24,
      resizeMode: 'contain',
    },
    content: {
      flex: 1,
    },
    messagesContainer: {
      flex: 1,
      padding: 16,
    },
    messagesContent: {
      flexGrow: 1,
      gap: 16,
    },
    messageBubble: {
      maxWidth: '80%',
      padding: 12,
      borderRadius: 16,
      marginVertical: 4,
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#7C3AED',
      borderBottomRightRadius: 4,
    },
    aiMessage: {
      alignSelf: 'flex-start',
      backgroundColor: isDark ? '#333333' : '#F3F4F6',
      borderBottomLeftRadius: 4,
    },
    messageText: {
      fontSize: 16,
      lineHeight: 24,
    },
    userMessageText: {
      color: '#FFFFFF',
    },
    aiMessageText: {
      color: isDark ? '#FFFFFF' : '#000000',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: isDark ? '#333333' : '#F3F4F6',
      padding: 12,
      borderRadius: 16,
      gap: 8,
    },
    loadingText: {
      color: isDark ? '#FFFFFF' : '#000000',
      fontSize: 16,
    },
    errorContainer: {
      alignSelf: 'center',
      backgroundColor: '#FEE2E2',
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
    },
    errorText: {
      color: '#DC2626',
      fontSize: 14,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 16,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#333333' : '#E5E5E5',
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    },
    input: {
      flex: 1,
      backgroundColor: isDark ? '#333333' : '#F3F4F6',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#000000',
      maxHeight: 100,
    },
    sendButton: {
      alignSelf: 'flex-end',
      padding: 8,
    },
  });
