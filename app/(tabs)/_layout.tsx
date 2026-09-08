import React from 'react';
import { Tabs } from 'expo-router';
import { CreditCard, PlusCircle } from 'lucide-react-native';
import { useWindowDimensions, Platform } from 'react-native';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb', // blue-600
        tabBarInactiveTintColor: '#6b7280', // neutral-500
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
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
              borderColor: '#e5e7eb',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.12,
              shadowRadius: 20,
              elevation: 10,
              paddingBottom: 8,
              paddingTop: 8,
              // @ts-ignore - web cursor
              cursor: 'pointer',
            }
          : {
              backgroundColor: '#ffffff',
              borderTopWidth: 1,
              borderTopColor: '#f3f4f6',
              height: Platform.OS === 'ios' ? 84 : 64,
              paddingBottom: Platform.OS === 'ios' ? 24 : 8,
              paddingTop: 8,
            },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mes Cartes',
          tabBarIcon: ({ color, focused }) => (
            <CreditCard size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Ajouter',
          tabBarIcon: ({ color, focused }) => (
            <PlusCircle size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
