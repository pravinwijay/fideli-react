import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  useWindowDimensions, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard, Plus, Search, X, Edit3, Check } from 'lucide-react-native';

import { useCardStore } from '@/store/useCardStore';
import CardItem from '@/components/CardItem';

export default function HomeScreen() {
  const cards = useCardStore((state) => state.cards);
  const removeCard = useCardStore((state) => state.removeCard);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { width } = useWindowDimensions();

  // Nombre de colonnes adapté aux appareils mobiles, tablettes et ordinateurs
  const numColumns = useMemo(() => {
    if (width < 640) return 1;
    if (width < 1024) return 2;
    if (width < 1440) return 3;
    return 4;
  }, [width]);

  // Filtrage des cartes selon la recherche (nom d'enseigne, notes, code, code-barres)
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return cards;
    const query = searchQuery.toLowerCase().trim();
    return cards.filter((card) => 
      card.brandName.toLowerCase().includes(query) ||
      (card.notes && card.notes.toLowerCase().includes(query)) ||
      (card.code && card.code.toLowerCase().includes(query)) ||
      card.barcodeValue.includes(query)
    );
  }, [cards, searchQuery]);

  const handlePressOut = () => {
    if (isEditing) setIsEditing(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOut}>
      <View className="flex-1 bg-neutral-50">
        {/* Conteneur principal responsive */}
        <View className="w-full max-w-7xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          
          {/* Barre d'en-tête */}
          <View className="flex-row flex-wrap justify-between items-center gap-3 mb-5">
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Mes Cartes
              </Text>
              {cards.length > 0 && (
                <View className="bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                  <Text className="text-blue-700 font-bold text-xs sm:text-sm">
                    {cards.length} {cards.length === 1 ? 'carte' : 'cartes'}
                  </Text>
                </View>
              )}
            </View>

            {/* Actions d'en-tête */}
            <View className="flex-row items-center gap-2">
              {cards.length > 0 && (
                <TouchableOpacity
                  onPress={() => setIsEditing(!isEditing)}
                  className={`flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors ${
                    isEditing 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-neutral-200 active:bg-neutral-100'
                  }`}
                  style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
                >
                  {isEditing ? (
                    <>
                      <Check size={16} color="#ffffff" />
                      <Text className="text-white font-bold text-sm">Terminer</Text>
                    </>
                  ) : (
                    <>
                      <Edit3 size={16} color="#4b5563" />
                      <Text className="text-neutral-700 font-semibold text-sm">Modifier</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              {/* Bouton d'ajout rapide */}
              <TouchableOpacity
                onPress={() => router.push('/add')}
                className="flex-row items-center gap-1.5 bg-blue-600 active:bg-blue-700 px-4 py-2 rounded-xl shadow-sm"
                style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
              >
                <Plus size={18} color="#ffffff" />
                <Text className="text-white font-bold text-sm hidden sm:flex">Ajouter une carte</Text>
                <Text className="text-white font-bold text-sm sm:hidden">Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Barre de recherche */}
          {cards.length > 0 && (
            <View className="relative mb-4">
              <View className="flex-row items-center bg-white border border-neutral-200 rounded-2xl px-3.5 py-2.5 shadow-sm">
                <Search size={18} color="#9ca3af" className="mr-2.5" />
                <TextInput
                  placeholder="Rechercher une enseigne, un code ou une note..."
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="flex-1 text-neutral-900 text-sm sm:text-base font-medium"
                  style={Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : undefined}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => setSearchQuery('')}
                    className="p-1 rounded-full bg-neutral-100 hover:bg-neutral-200"
                    style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
                  >
                    <X size={14} color="#6b7280" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Corps de l'écran */}
          {cards.length === 0 ? (
            /* État vide */
            <View className="flex-1 justify-center items-center px-4 py-12">
              <View className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-50 border border-blue-100 rounded-3xl justify-center items-center mb-6 shadow-sm">
                <CreditCard size={44} color="#2563eb" />
              </View>
              <Text className="text-2xl sm:text-3xl font-extrabold text-neutral-900 text-center mb-2">
                Aucune carte enregistrée
              </Text>
              <Text className="text-neutral-500 text-center text-sm sm:text-base mb-8 max-w-md">
                Ajoutez toutes vos cartes de fidélité pour les avoir toujours à portée de main en magasin.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/add')}
                className="flex-row items-center gap-2 bg-blue-600 active:bg-blue-700 px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
              >
                <Plus size={20} color="#ffffff" />
                <Text className="text-white font-bold text-base">
                  Ajouter ma première carte
                </Text>
              </TouchableOpacity>
            </View>
          ) : filteredCards.length === 0 ? (
            /* Aucun résultat de recherche */
            <View className="flex-1 justify-center items-center px-4 py-12">
              <Text className="text-lg sm:text-xl font-bold text-neutral-800 mb-2">
                Aucun résultat pour "{searchQuery}"
              </Text>
              <Text className="text-neutral-500 text-sm mb-4">
                Vérifiez l'orthographe ou essayez un autre mot-clé.
              </Text>
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                className="bg-neutral-200 px-4 py-2 rounded-xl"
                style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
              >
                <Text className="text-neutral-700 font-semibold text-sm">Effacer la recherche</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Grille de cartes */
            <FlatList
              key={`cards-grid-${numColumns}`}
              data={filteredCards}
              keyExtractor={(item) => item.id}
              numColumns={numColumns}
              renderItem={({ item }) => (
                <View 
                  style={{ flex: 1 / numColumns }}
                  className={numColumns === 1 ? "w-full max-w-lg mx-auto" : "w-full"}
                >
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
                </View>
              )}
              contentContainerStyle={{ 
                paddingBottom: Platform.OS === 'web' ? 110 : 90,
                paddingTop: 4 
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
