import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from '../../context/ThemeContext';
import { getChatHistory, type ChatMessage } from '../../services/api';

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<ChatMessage[]>([]);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useThemeContext();
  const systemColorScheme = useColorScheme();
  const isDark = theme === 'auto' ? systemColorScheme === 'dark' : theme === 'dark';

  const styles = getStyles(isDark);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      setSessions(history);
    } catch (err) {
      setError('Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePrivateMode = () => {
    setIsPrivateMode(!isPrivateMode);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return 'Just now';
  };

  const renderSession = ({ item }: { item: ChatMessage }) => (
    <TouchableOpacity style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.sessionMeta}>
          <Ionicons
            name={item.isUser ? 'person' : 'logo-github'}
            size={20}
            color={isDark ? '#FFFFFF' : '#000000'}
          />
          <Text style={styles.sessionTitle}>
            {item.isUser ? 'You' : 'Neura'}
          </Text>
        </View>
        <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
      </View>
      <Text style={styles.preview} numberOfLines={2}>
        {item.text}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat History</Text>
        <TouchableOpacity
          style={styles.privateButton}
          onPress={togglePrivateMode}>
          <Ionicons
            name={isPrivateMode ? 'eye-off' : 'eye'}
            size={24}
            color={isDark ? '#FFFFFF' : '#000000'}
          />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {isPrivateMode ? (
        <View style={styles.privateModeContainer}>
          <Ionicons
            name="lock-closed"
            size={48}
            color={isDark ? '#666666' : '#999999'}
          />
          <Text style={styles.privateModeText}>Private Mode Enabled</Text>
          <Text style={styles.privateModeSubtext}>
            Chat history is hidden for privacy
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No chat history yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#E5E5E5',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    privateButton: {
      padding: 8,
    },
    listContent: {
      padding: 16,
      gap: 16,
    },
    sessionCard: {
      backgroundColor: isDark ? '#1A1A1A' : '#F3F4F6',
      borderRadius: 12,
      padding: 16,
      gap: 8,
    },
    sessionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sessionMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    sessionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    timestamp: {
      fontSize: 14,
      color: isDark ? '#888888' : '#666666',
    },
    preview: {
      fontSize: 16,
      color: isDark ? '#CCCCCC' : '#666666',
      lineHeight: 22,
    },
    privateModeContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    privateModeText: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#000000',
      marginTop: 16,
    },
    privateModeSubtext: {
      fontSize: 16,
      color: isDark ? '#888888' : '#666666',
      marginTop: 8,
      textAlign: 'center',
    },
    errorContainer: {
      margin: 16,
      padding: 12,
      backgroundColor: '#FEE2E2',
      borderRadius: 8,
    },
    errorText: {
      color: '#DC2626',
      fontSize: 14,
      textAlign: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: isDark ? '#888888' : '#666666',
      textAlign: 'center',
    },
  });