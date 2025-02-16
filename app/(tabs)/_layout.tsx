import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../context/ThemeContext';

export default function TabLayout() {
  const { theme, isDark } = useThemeContext();
  const systemColorScheme = useColorScheme();
  
  // Use system theme if auto, otherwise use manual selection
  const effectiveDark = theme === 'auto' ? systemColorScheme === 'dark' : theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: effectiveDark ? '#1A1A1A' : '#FFFFFF',
          borderTopColor: effectiveDark ? '#333333' : '#E5E5E5',
        },
        tabBarActiveTintColor: '#7C3AF0',
        tabBarInactiveTintColor: effectiveDark ? '#888888' : '#666666',
      }}>
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
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="time" size={size} color={color} />
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