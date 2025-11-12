import { Image } from 'expo-image';
import { Platform, StyleSheet, View, TouchableOpacity, Text, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/auth-context';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <ThemedView style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Text style={styles.greeting}>Hello, {user.displayName || user.email}! 👋</Text>
          </View>

          {user.photoURL && (
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: user.photoURL }}
                style={styles.profileImage}
              />
            </View>
          )}

          <View style={styles.userInfoContainer}>
            <Text style={styles.label}>Display Name</Text>
            <Text style={styles.value}>{user.displayName || '(Not set)'}</Text>

            <Text style={[styles.label, { marginTop: 16 }]}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>

            <Text style={[styles.label, { marginTop: 16 }]}>User ID</Text>
            <Text style={[styles.value, styles.userId]}>{user.uid}</Text>
          </View>
        </ThemedView>

        {/* Welcome Message */}
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome Back!</ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">✅ You&apos;re successfully logged in</ThemedText>
          <ThemedText>
            Your account has been connected to this app. You can now access all features.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">🔑 Authentication Features</ThemedText>
          <ThemedText>
            • Email/Password authentication with Firebase{'\n'}
            • Firebase Authentication backend{'\n'}
            • Secure session management{'\n'}
            • Automatic logout functionality
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">📱 Next Steps</ThemedText>
          <ThemedText>
            • To add Google Sign-In, follow the README.md setup guide{'\n'}
            • Configure Firebase credentials{'\n'}
            • Add Google OAuth configuration{'\n'}
            • Implement native sign-in SDK
          </ThemedText>
        </ThemedView>

        {/* Logout Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.logoutButton, loading && styles.buttonDisabled]}
            onPress={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.logoutButtonText}>Logout</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#f0f9ff',
  },
  profileHeader: {
    marginBottom: 12,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  userInfoContainer: {
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginTop: 4,
  },
  userId: {
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
    fontSize: 12,
  },
  titleContainer: {
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  buttonContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: '70%',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
