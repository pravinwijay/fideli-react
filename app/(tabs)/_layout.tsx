import React from 'react';
import { Tabs } from 'expo-router';
import { CreditCard, PlusCircle } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb', // blue-600
        headerShown: false, // We use custom headers in our screens
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f5f5f5',
          elevation: 0,
          shadowOpacity: 0,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mes Cartes',
          tabBarIcon: ({ color }) => (
            <CreditCard size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Ajouter',
          tabBarIcon: ({ color }) => (
            <PlusCircle size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
