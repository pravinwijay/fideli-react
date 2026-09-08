import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  Linking 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Brightness from 'expo-brightness';
import Barcode from 'react-native-barcode-svg';
import { ArrowLeft, Trash2, Copy, Check, ExternalLink, Calendar, Hash, FileText } from 'lucide-react-native';

import { useCardStore } from '@/store/useCardStore';

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  
  const card = useCardStore((state) => state.cards.find((c) => c.id === id));
  const removeCard = useCardStore((state) => state.removeCard);

  useEffect(() => {
    // Gestion de la luminosité uniquement sur les plateformes mobiles
    if (Platform.OS === 'web') return;

    let prevBrightness: number | null = null;
    (async () => {
      try {
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === 'granted') {
          prevBrightness = await Brightness.getBrightnessAsync();
          await Brightness.setBrightnessAsync(1); // Luminosité maximale pour faciliter le scan
        }
      } catch {
        // Ignorer les erreurs de luminosité sur simulateur ou matériel non supporté
      }
    })();

    return () => {
      // Restaurer la luminosité précédente en quittant l'écran
      if (prevBrightness !== null && Platform.OS !== 'web') {
        Brightness.setBrightnessAsync(prevBrightness).catch(() => {});
      }
    };
  }, []);

  if (!card) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-50 px-4">
        <Text className="text-xl font-semibold text-neutral-800">Carte non trouvée</Text>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mt-4 bg-blue-600 px-6 py-3 rounded-full shadow-sm"
          style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
        >
          <Text className="text-white font-medium">Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    removeCard(card.id);
    router.replace('/');
  };

  const handleCopyBarcode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(card.barcodeValue);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWebsite = () => {
    if (!card.website) return;
    let url = card.website.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    Linking.openURL(url).catch(() => {});
  };

  return (
    <ScrollView 
      className="flex-1 bg-neutral-100/60" 
      bounces={false}
      contentContainerStyle={{ 
        paddingBottom: Platform.OS === 'web' ? 80 : 60 
      }}
    >
      <View className="w-full max-w-2xl mx-auto min-h-screen bg-white shadow-xl sm:my-6 sm:rounded-3xl overflow-hidden border-x sm:border border-neutral-200/60">
        
        {/* En-tête avec la couleur de l'enseigne */}
        <View 
          style={{ backgroundColor: card.brandPrimaryColorHex || '#1e293b' }} 
          className="pt-12 sm:pt-14 pb-14 px-6 sm:px-8 relative overflow-hidden"
        >
          {/* Halos décoratifs */}
          <View 
            pointerEvents="none"
            className="absolute -top-16 -right-16 w-52 h-52 bg-white/15 rounded-full blur-2xl" 
          />
          <View 
            pointerEvents="none"
            className="absolute -bottom-10 -left-10 w-44 h-44 bg-black/25 rounded-full blur-xl" 
          />

          {/* Navigation supérieure */}
          <View className="flex-row justify-between items-center mb-8 relative z-20">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="bg-black/25 hover:bg-black/40 p-2.5 rounded-full backdrop-blur transition-colors"
              style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
            >
              <ArrowLeft color="#ffffff" size={22} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleDelete} 
              className="bg-black/25 hover:bg-red-600/80 p-2.5 rounded-full backdrop-blur transition-colors"
              style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
            >
              <Trash2 color="#ffffff" size={20} />
            </TouchableOpacity>
          </View>

          {/* Marque */}
          <Text className="text-3xl sm:text-4xl text-white font-black text-center tracking-tight drop-shadow mb-1.5">
            {card.brandName}
          </Text>

          {card.website ? (
            <TouchableOpacity 
              onPress={handleOpenWebsite}
              className="flex-row items-center justify-center gap-1.5 self-center bg-white/15 hover:bg-white/25 px-3 py-1 rounded-full mt-1 backdrop-blur"
              style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
            >
              <Text className="text-white text-xs sm:text-sm font-semibold tracking-wider">
                {card.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}
              </Text>
              <ExternalLink size={12} color="#ffffff" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Carte du Code-barre */}
        <View className="mx-4 sm:mx-8 -mt-8 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-100 items-center justify-center relative z-20">
          <Text className="text-neutral-400 text-xs font-bold uppercase tracking-widest text-center mb-4">
            Scannez ce code en caisse
          </Text>

          {/* Graphique Code-barres */}
          <View className="w-full bg-white p-2 sm:p-4 items-center justify-center overflow-hidden">
            <Barcode 
              value={card.barcodeValue} 
              format="CODE128" 
              maxWidth={360}
            />
          </View>

          {/* Valeur textuelle + Bouton de copie */}
          <View className="flex-row items-center justify-center gap-3 mt-4 pt-3 border-t border-neutral-100 w-full">
            <Text className="text-neutral-900 font-mono tracking-widest text-lg sm:text-xl font-bold">
              {card.barcodeValue}
            </Text>
            <TouchableOpacity
              onPress={handleCopyBarcode}
              className={`p-2 rounded-xl border transition-colors ${
                copied 
                  ? 'bg-emerald-50 border-emerald-300' 
                  : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200'
              }`}
              style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
            >
              {copied ? <Check size={16} color="#059669" /> : <Copy size={16} color="#6b7280" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Détails et Métadonnées */}
        <View className="px-4 sm:px-8 py-6">
          <View className="flex-col sm:flex-row gap-3.5">
            
            {/* Numéro client (si renseigné) */}
            {card.code ? (
              <View className="flex-1 bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                <View className="flex-row items-center gap-1.5 mb-1.5">
                  <Hash size={14} color="#9ca3af" />
                  <Text className="text-xs uppercase text-neutral-400 font-bold tracking-wider">
                    Numéro client
                  </Text>
                </View>
                <Text className="text-base sm:text-lg font-bold text-neutral-800">
                  {card.code}
                </Text>
              </View>
            ) : null}

            {/* Date d'ajout */}
            <View className="flex-1 bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
              <View className="flex-row items-center gap-1.5 mb-1.5">
                <Calendar size={14} color="#9ca3af" />
                <Text className="text-xs uppercase text-neutral-400 font-bold tracking-wider">
                  Ajoutée le
                </Text>
              </View>
              <Text className="text-base sm:text-lg font-bold text-neutral-800">
                {new Date(card.dateAdded).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
            </View>
          </View>

          {/* Bloc de Notes */}
          <View className="mt-3.5 bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
            <View className="flex-row items-center gap-1.5 mb-2">
              <FileText size={14} color="#9ca3af" />
              <Text className="text-xs uppercase text-neutral-400 font-bold tracking-wider">
                Notes & Conditions
              </Text>
            </View>
            <Text className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
              {card.notes || "Aucune note ajoutée pour cette carte."}
            </Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}
