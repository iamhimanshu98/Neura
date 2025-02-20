import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../context/ThemeContext';

const suggestedPrompts = [
  { id: '1', text: 'Tell me a fun fact about space!' },
  { id: '2', text: 'Can you generate a short story for me?' },
  { id: '3', text: 'What’s a good productivity hack?' },
  { id: '4', text: 'Teach me something new in 30 seconds!' },
  { id: '5', text: 'What’s an underrated travel destination?' },
];

export default function ExploreScreen() {
  const { theme } = useThemeContext();
  const systemColorScheme = useColorScheme();
  const isDark = theme === 'auto' ? systemColorScheme === 'dark' : theme === 'dark';
  const styles = getStyles(isDark);

  const handlePromptPress = (prompt: string) => {
    console.log(`User selected: ${prompt}`);
    // Here, you can navigate to the chatbot screen and pass the selected prompt.
  };

  const renderPrompt = ({ item }: { item: { id: string; text: string } }) => (
    <TouchableOpacity style={styles.promptCard} onPress={() => handlePromptPress(item.text)}>
      <Text style={styles.promptText}>{item.text}</Text>
      <Ionicons name="arrow-forward" size={18} color={isDark ? '#FFFFFF' : '#000000'} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Try This</Text>
      </View>

      <FlatList
        data={suggestedPrompts}
        renderItem={renderPrompt}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No suggestions available</Text>
          </View>
        }
      />
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
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#E5E5E5',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    listContent: {
      padding: 16,
      gap: 16,
    },
    promptCard: {
      backgroundColor: isDark ? '#1A1A1A' : '#F3F4F6',
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    promptText: {
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#000000',
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
