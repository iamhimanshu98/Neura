import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../context/ThemeContext';

export default function TabLayout() {
  const { theme } = useThemeContext();
  const systemColorScheme = useColorScheme();

  // Determine if dark mode should be applied
  const isDark =
    theme === 'auto' ? systemColorScheme === 'dark' : theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
          borderTopColor: isDark ? '#333333' : '#E5E5E5',
        },
        tabBarActiveTintColor: '#7C3AF0',
        tabBarInactiveTintColor: isDark ? '#888888' : '#666666',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore" // ✅ Updated from "history" to "explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="compass" size={size} color={color} /> // ✅ Changed icon
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
