import React, { useState } from 'react';
import { View, Text, FlatList, TouchableWithoutFeedback } from 'react-native';
import { useCardStore } from '../../store/useCardStore';
import CardItem from '../../components/CardItem';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { cards, removeCard } = useCardStore((state) => ({
    cards: state.cards,
    removeCard: state.removeCard
  }));
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handlePressOut = () => {
    if (isEditing) setIsEditing(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOut}>
      <View className="flex-1 bg-neutral-50 pt-6">
        <View className="px-6 mb-4 flex-row justify-between items-center">
          <Text className="text-3xl font-extrabold text-neutral-900">Mes Cartes</Text>
          {isEditing && (
            <Text onPress={() => setIsEditing(false)} className="text-blue-600 font-semibold text-lg">
              Terminer
            </Text>
          )}
        </View>

        {cards.length === 0 ? (
          <View className="flex-1 justify-center items-center px-8">
            <Text className="text-neutral-500 text-center text-lg mb-4 font-medium">
              Aucune carte enregistrée pour le moment.
            </Text>
          </View>
        ) : (
          <FlatList
            data={cards}
            keyExtractor={(item) => item.id}
            numColumns={2}
            className="px-2"
            renderItem={({ item }) => (
              <CardItem
                card={item}
                isEditing={isEditing}
                onLongPress={() => setIsEditing(true)}
                onPress={() => {
                  if (isEditing) return;
                  router.push(`/card/${item.id}`);
                }}
                onDelete={() => removeCard(item.id)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
