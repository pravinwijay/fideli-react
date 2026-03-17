import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCardStore } from '../../store/useCardStore';
import * as Brightness from 'expo-brightness';
import Barcode from 'react-native-barcode-svg';
import { ArrowLeft, Trash2 } from 'lucide-react-native';

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const card = useCardStore((state) => state.cards.find(c => c.id === id));
  const removeCard = useCardStore((state) => state.removeCard);

  useEffect(() => {
    // Maximize brightness to facilitate scanning in store
    let prevBrightness: number | null = null;
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {
        prevBrightness = await Brightness.getBrightnessAsync();
        await Brightness.setBrightnessAsync(1); // Max
      }
    })();

    return () => {
      // Restore brightness on unmount
      if (prevBrightness !== null) {
        Brightness.setBrightnessAsync(prevBrightness);
      }
    };
  }, []);

  if (!card) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-50 px-4">
        <Text className="text-xl font-semibold text-neutral-800">Carte non trouvée</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-600 px-6 py-3 rounded-full">
          <Text className="text-white font-medium">Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    removeCard(card.id);
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-white" bounces={false}>
      {/* Header section with brand color */}
      <View style={{ backgroundColor: card.brandPrimaryColorHex || '#1e293b' }} className="pt-16 pb-12 px-6 shadow-sm z-10 rounded-b-3xl">
        <View className="flex-row justify-between items-center mb-10">
          <TouchableOpacity onPress={() => router.back()} className="bg-black/20 p-2 rounded-full">
            <ArrowLeft color="#ffffff" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className="bg-black/20 p-2 rounded-full">
            <Trash2 color="#ffffff" size={20} />
          </TouchableOpacity>
        </View>

        <Text className="text-4xl text-white font-extrabold text-center tracking-tight mb-2">
          {card.brandName}
        </Text>
        {card.website ? (
           <Text className="text-white/80 text-center text-sm font-medium uppercase tracking-widest">
             {card.website.replace('www.', '')}
           </Text>
        ) : null}
      </View>

      {/* Barcode Display Card */}
      <View className="bg-white mx-6 -mt-8 rounded-2xl p-8 shadow-xl border border-neutral-100 items-center justify-center elevation-10 z-20">
        <View className="w-full flex-row justify-between items-center mb-6">
          <Text className="text-neutral-400 text-xs font-bold uppercase tracking-widest flex-1">Scannez ce code en caisse</Text>
        </View>

        <View className="w-full bg-white p-4 items-center">
          <Barcode 
            value={card.barcodeValue} 
            format="CODE128" 
          />
          <Text className="text-neutral-900 mt-2 font-mono tracking-widest text-lg">{card.barcodeValue}</Text>
        </View>
      </View>

      <View className="px-8 mt-10">
        <View className="flex-row">
          <View className="flex-1 mr-2 bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
            <Text className="text-xs uppercase text-neutral-400 font-bold mb-1">Code Annexe</Text>
            <Text className="text-lg font-semibold text-neutral-800">{card.code || 'Aucun'}</Text>
          </View>
          <View className="flex-1 ml-2 bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
            <Text className="text-xs uppercase text-neutral-400 font-bold mb-1">Ajoutée le</Text>
            <Text className="text-lg font-semibold text-neutral-800">
               {new Date(card.dateAdded).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>

        <View className="mt-4 bg-neutral-50 rounded-2xl p-6 border border-neutral-100 mb-10">
           <Text className="text-xs uppercase text-neutral-400 font-bold mb-2">Notes</Text>
           <Text className="text-base text-neutral-600 leading-relaxed">
             {card.notes || "Ajoutez des notes ou des conditions d'utilisation concernant cette carte étudiante / fidélité."}
           </Text>
        </View>
      </View>
    </ScrollView>
  );
}
