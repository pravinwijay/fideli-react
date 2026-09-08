import React from 'react';
import { Tabs } from 'expo-router';
import { CreditCard, PlusCircle } from 'lucide-react-native';
import { useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isWide = width >= 768;

  // Calcul du padding inférieur sécurisé pour iOS / Android / Web
  const bottomInset = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'web' ? 8 : 4);
  const mobileTabHeight = 58 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb', // blue-600
        tabBarInactiveTintColor: '#64748b', // slate-500
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        tabBarItemStyle: {
          paddingTop: 5,
          paddingBottom: 3,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 1,
          marginBottom: 2,
        },
        tabBarStyle: isWide
          ? {
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: [{ translateX: -180 }],
              width: 360,
              height: 64,
              backgroundColor: '#ffffff',
              borderRadius: 32,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.12,
              shadowRadius: 20,
              elevation: 10,
              paddingBottom: 6,
              paddingTop: 6,
              // @ts-ignore - web cursor
              cursor: 'pointer',
            }
          : {
              backgroundColor: '#ffffff',
              borderTopWidth: 1,
              borderTopColor: '#f1f5f9',
              height: mobileTabHeight,
              paddingBottom: bottomInset,
              paddingTop: 6,
            },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mes Cartes',
          tabBarIcon: ({ color, focused }) => (
            <CreditCard size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Ajouter',
          tabBarIcon: ({ color, focused }) => (
            <PlusCircle size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
