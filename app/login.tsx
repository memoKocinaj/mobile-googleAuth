import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useGoogleSignIn } from '@/hooks/use-google-signin';
import { router } from 'expo-router';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';

export default function LoginScreen() {
  const { signInWithGoogle } = useGoogleSignIn();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isSignUp) {
        // Sign up
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Sign in
        await signInWithEmailAndPassword(auth, email, password);
      }

      // Navigate to home screen on successful login
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Auth error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await signInWithGoogle();

      if (user) {
        // Navigate to home screen on successful login
        router.replace('/(tabs)');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to sign in with demo credentials
      try {
        await signInWithEmailAndPassword(auth, 'demo@example.com', 'password123');
      } catch (err) {
        // If demo account doesn't exist, create it
        if (err instanceof Error && err.message.includes('user-not-found')) {
          await createUserWithEmailAndPassword(auth, 'demo@example.com', 'password123');
        } else {
          throw err;
        }
      }

      router.replace('/(tabs)');
    } catch (err) {
      console.error('Demo login error:', err);
      setError(err instanceof Error ? err.message : 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.innerContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Sign in to get started</Text>
          </View>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.icon}>
              <Text style={styles.iconText}>🔐</Text>
            </View>
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              secureTextEntry
            />
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleEmailSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle Sign Up */}
          <TouchableOpacity
            onPress={() => setIsSignUp(!isSignUp)}
            disabled={loading}
          >
            <Text style={styles.toggleText}>
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : 'Don\'t have an account? Sign Up'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Demo Login Button */}
          <TouchableOpacity
            style={[styles.button, styles.demoButton, loading && styles.buttonDisabled]}
            onPress={handleDemoLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1f2937" size="small" />
            ) : (
              <>
                <Text style={styles.demoIcon}>⚡</Text>
                <Text style={styles.demoButtonText}>Quick Demo Login</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Sign In with Google Button */}
          <TouchableOpacity
            style={[styles.button, styles.googleButton, loading && styles.buttonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1f2937" size="small" />
            ) : (
              <>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info Text */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              For Google Sign-In, see README.md for setup instructions
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  innerContent: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  iconContainer: {
    marginBottom: 32,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 40,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    width: '100%',
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
    color: '#1f2937',
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minWidth: '100%',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButton: {
    backgroundColor: '#1f2937',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleText: {
    color: '#3b82f6',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#9ca3af',
    fontSize: 14,
  },
  demoButton: {
    backgroundColor: '#fbbf24',
    marginBottom: 12,
  },
  demoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  demoButtonText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  googleIcon: {
    color: '#1f2937',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  googleButtonText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  infoText: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

