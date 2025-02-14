import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../context/ThemeContext';

export default function SettingsScreen() {
  const [isPrivateModeEnabled, setIsPrivateModeEnabled] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const { theme, setTheme } = useThemeContext();
  const systemColorScheme = useColorScheme();
  const isDark = theme === 'auto' ? systemColorScheme === 'dark' : theme === 'dark';

  const styles = getStyles(isDark);

  const ThemeOption = ({ value, label, icon }: { value: 'light' | 'dark' | 'auto', label: string, icon: string }) => (
    <TouchableOpacity
      style={[
        styles.themeOption,
        theme === value && styles.themeOptionSelected,
      ]}
      onPress={() => setTheme(value)}>
      <Ionicons
        name={icon as any}
        size={24}
        color={isDark ? '#FFFFFF' : '#000000'}
      />
      <Text style={[
        styles.themeOptionText,
        theme === value && styles.themeOptionTextSelected,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const SettingItem = ({
    icon,
    title,
    description,
    hasSwitch,
    value,
    onValueChange,
  }: {
    icon: string;
    title: string;
    description: string;
    hasSwitch?: boolean;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons
          name={icon as any}
          size={24}
          color={isDark ? '#FFFFFF' : '#000000'}
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {hasSwitch && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: '#7C3AED' }}
          thumbColor={isDark ? '#FFFFFF' : '#F4F3F4'}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.themeOptions}>
            <ThemeOption value="light" label="Light" icon="sunny" />
            <ThemeOption value="dark" label="Dark" icon="moon" />
            <ThemeOption value="auto" label="Auto" icon="contrast" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <SettingItem
            icon="lock-closed"
            title="Private Mode"
            description="Hide chat history and disable storage"
            hasSwitch
            value={isPrivateModeEnabled}
            onValueChange={setIsPrivateModeEnabled}
          />
          <SettingItem
            icon="notifications"
            title="Notifications"
            description="Receive chat notifications"
            hasSwitch
            value={isNotificationsEnabled}
            onValueChange={setIsNotificationsEnabled}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <SettingItem
            icon="information-circle"
            title="About Neura"
            description="Learn more about your AI assistant"
          />
          <SettingItem
            icon="shield-checkmark"
            title="Privacy Policy"
            description="Read our privacy policy"
          />
          <SettingItem
            icon="document-text"
            title="Terms of Service"
            description="View terms of service"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingItem
            icon="help-circle"
            title="Help Center"
            description="Get help with using Neura"
          />
          <SettingItem
            icon="mail"
            title="Contact Support"
            description="Reach out to our support team"
          />
        </View>

        <TouchableOpacity style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </TouchableOpacity>
      </ScrollView>
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
    content: {
      flex: 1,
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 16,
    },
    themeOptions: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 8,
    },
    themeOption: {
      flex: 1,
      backgroundColor: isDark ? '#1A1A1A' : '#F3F4F6',
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      gap: 8,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    themeOptionSelected: {
      borderColor: '#7C3AED',
    },
    themeOptionText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    themeOptionTextSelected: {
      color: '#7C3AED',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      gap: 16,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#333333' : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    settingDescription: {
      fontSize: 14,
      color: isDark ? '#888888' : '#666666',
      marginTop: 2,
    },
    versionContainer: {
      padding: 20,
      alignItems: 'center',
      marginTop: 24,
    },
    versionText: {
      fontSize: 14,
      color: isDark ? '#666666' : '#999999',
    },
  });