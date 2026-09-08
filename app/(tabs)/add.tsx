import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Pressable,
  KeyboardAvoidingView, 
  ScrollView, 
  Platform, 
  Modal, 
  useWindowDimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Check, Sparkles, CreditCard, Wifi } from 'lucide-react-native';

import { useCardStore } from '@/store/useCardStore';
import { COLOR_PALETTE, DEFAULT_CARD_COLOR } from '@/constants/colors';
import BarcodeScanner from '@/components/BarcodeScanner';

export default function AddCardScreen() {
  const [brandName, setBrandName] = useState('');
  const [barcodeValue, setBarcodeValue] = useState('');
  const [brandColor, setBrandColor] = useState(DEFAULT_CARD_COLOR);
  const [notes, setNotes] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const addCard = useCardStore((state) => state.addCard);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 860;

  const isFormValid = brandName.trim().length > 0 && barcodeValue.trim().length > 0;

  const selectedColor = COLOR_PALETTE.find((c) => c.hex.toLowerCase() === brandColor.toLowerCase()) || COLOR_PALETTE[0];

  const handleSave = () => {
    if (!isFormValid) return;

    addCard({
      brandName: brandName.trim(),
      website: '',
      barcodeType: 'CODE128',
      barcodeValue: barcodeValue.trim(),
      brandPrimaryColorHex: brandColor,
      code: '',
      notes: notes.trim(),
    });
    router.replace('/');
  };

  const handleScan = (_type: string, data: string) => {
    setBarcodeValue(data);
    setIsScanning(false);
  };

  const renderCardPreview = () => (
    <View className="w-full">
      <View className="flex-row items-center gap-2 mb-3">
        <Sparkles size={18} color="#2563eb" />
        <Text className="text-sm font-bold text-neutral-700 uppercase tracking-wider">
          Aperçu en Direct
        </Text>
      </View>

      <View
        style={{
          backgroundColor: brandColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
          elevation: 8,
        }}
        className="w-full aspect-[1.586] rounded-2xl p-5 sm:p-6 justify-between relative overflow-hidden border border-white/15"
      >
        {/* Halos décoratifs */}
        <View 
          pointerEvents="none"
          className="absolute -top-16 -right-16 w-44 h-44 bg-white/15 rounded-full blur-2xl" 
        />
        <View 
          pointerEvents="none"
          className="absolute -bottom-10 -left-10 w-36 h-36 bg-black/20 rounded-full blur-xl" 
        />

        {/* En-tête de la carte */}
        <View className="flex-row justify-between items-start">
          <View className="flex-1 pr-3">
            <Text 
              className="text-white font-extrabold text-xl sm:text-2xl tracking-wide drop-shadow" 
              numberOfLines={1}
            >
              {brandName || 'Nom de la marque'}
            </Text>
          </View>

          {/* Vagues sans contact et puce simulée */}
          <View className="flex-row items-center space-x-1.5 opacity-85">
            <View className="w-8 h-6 rounded bg-amber-300/90 border border-amber-400/60 mr-2" />
            <Wifi size={20} color="white" className="rotate-90 opacity-90" />
          </View>
        </View>

        {/* Mockup du Code-barre */}
        <View className="bg-white/95 backdrop-blur rounded-xl p-3 items-center w-full shadow-inner border border-white/40">
          <View className="w-full flex-row justify-center items-center h-6 mb-1.5 px-2 overflow-hidden opacity-90">
            {Array.from({ length: 42 }).map((_, i) => (
              <View 
                key={i} 
                className="bg-neutral-900 mx-[1.5px]" 
                style={{
                  width: (i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1),
                  height: (i % 6 === 0 ? 22 : 24),
                }}
              />
            ))}
          </View>
          <Text 
            className="text-neutral-900 font-mono text-xs sm:text-sm font-bold tracking-widest"
            numberOfLines={1}
          >
            {barcodeValue || '1234 5678 9012'}
          </Text>
        </View>
      </View>

      <Text className="text-neutral-400 text-xs text-center mt-3 font-medium">
        L'apparence de la carte est mise à jour automatiquement pendant votre saisie.
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        className="flex-1 bg-neutral-50" 
        contentContainerStyle={{ 
          paddingBottom: Platform.OS === 'web' ? 120 : 100 
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          {/* Titre */}
          <View className="mb-6">
            <Text className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Nouvelle Carte
            </Text>
            <Text className="text-neutral-500 text-sm sm:text-base mt-1">
              Renseignez les détails de votre carte de fidélité ou d'adhérent.
            </Text>
          </View>

          {/* Grille principale : Formulaire + Aperçu (Aperçu au-dessus sur mobile pour un feedback direct) */}
          <View className={isLargeScreen ? 'flex-row items-start gap-8' : 'flex-col gap-6'}>
            
            {/* Colonne Aperçu en Direct (affichée en premier sur mobile) */}
            <View className={isLargeScreen ? 'hidden' : 'w-full'}>
              <View className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-200/80">
                {renderCardPreview()}
              </View>
            </View>

            {/* Colonne Formulaire */}
            <View className={isLargeScreen ? 'flex-1' : 'w-full'}>
              <View className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-200/80">
                
                {/* Nom de l'enseigne */}
                <View className="mb-5">
                  <Text className="text-sm font-semibold text-neutral-700 mb-1.5">
                    Nom de l'enseigne <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    placeholder="Ex: Fnac, Sephora, Carrefour, Decathlon..."
                    placeholderTextColor="#9ca3af"
                    value={brandName}
                    onChangeText={setBrandName}
                    className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-base font-medium focus:border-blue-500"
                  />
                </View>

                {/* Sélection de la couleur */}
                <View className="mb-5">
                  <View className="flex-row items-center justify-between mb-2.5">
                    <Text className="text-sm font-semibold text-neutral-700">
                      Couleur de la carte
                    </Text>
                    <View className="flex-row items-center gap-1.5">
                      <View 
                        style={{ backgroundColor: brandColor }} 
                        className="w-3.5 h-3.5 rounded-full border border-neutral-300" 
                      />
                      <Text className="text-xs font-bold text-neutral-600">
                        {selectedColor.name}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row flex-wrap gap-2.5 items-center">
                    {COLOR_PALETTE.map((c) => {
                      const isSelected = brandColor.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <Pressable
                          key={c.hex}
                          onPress={() => setBrandColor(c.hex)}
                          hitSlop={6}
                          style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
                          className={`w-11 h-11 rounded-full justify-center items-center border-2 transition-transform ${
                            isSelected ? 'border-blue-600 bg-blue-50/50 scale-105' : 'border-transparent'
                          }`}
                        >
                          <View
                            style={{ backgroundColor: c.hex }}
                            className="w-8 h-8 rounded-full justify-center items-center shadow-sm"
                          >
                            {isSelected && <Check size={16} color="#ffffff" strokeWidth={3} />}
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Section Code-barres */}
                <View className="mb-5">
                  <Text className="text-sm font-semibold text-neutral-700 mb-1.5">
                    Numéro de code-barre <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <TextInput
                      placeholder="Ex: 978020137962"
                      placeholderTextColor="#9ca3af"
                      value={barcodeValue}
                      onChangeText={setBarcodeValue}
                      keyboardType="number-pad"
                      className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-base font-mono tracking-wider focus:border-blue-500"
                    />
                    <TouchableOpacity 
                      onPress={() => setIsScanning(true)}
                      className="bg-neutral-100 active:bg-neutral-200 rounded-xl p-3.5 justify-center items-center border border-neutral-200 shadow-sm"
                      style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
                    >
                      <Camera size={22} color="#4b5563" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Notes */}
                <View className="mb-8">
                  <Text className="text-sm font-semibold text-neutral-700 mb-1.5">
                    Notes
                  </Text>
                  <TextInput
                    placeholder="Ex: -15% sur les livres, valable en magasin..."
                    placeholderTextColor="#9ca3af"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                    className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-base focus:border-blue-500"
                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                  />
                </View>

                {/* Bouton d'enregistrement */}
                <TouchableOpacity 
                  className={`rounded-2xl py-4 flex-row justify-center items-center shadow-md transition-opacity ${
                    !isFormValid 
                      ? 'bg-neutral-300 opacity-60' 
                      : 'bg-blue-600 active:bg-blue-700'
                  }`}
                  onPress={handleSave}
                  disabled={!isFormValid}
                  style={
                    Platform.OS === 'web'
                      ? ({ cursor: !isFormValid ? 'not-allowed' : 'pointer' } as any)
                      : undefined
                  }
                >
                  <CreditCard size={20} color="#ffffff" className="mr-2" />
                  <Text className="text-white font-bold text-lg">
                    Enregistrer la carte
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Colonne Aperçu en Direct (Desktop uniquement, à droite) */}
            {isLargeScreen && (
              <View className="w-[380px] lg:w-[420px]">
                <View className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200/80 sticky top-8">
                  {renderCardPreview()}
                </View>
              </View>
            )}

          </View>
        </View>

        {/* Modal du Scanner */}
        <Modal 
          visible={isScanning} 
          animationType="slide" 
          transparent={true}
          onRequestClose={() => setIsScanning(false)}
        >
          <View className="flex-1 bg-black/75 justify-center items-center p-4">
            <View className="w-full max-w-lg h-[80vh] max-h-[520px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <BarcodeScanner 
                onScan={handleScan}
                onClose={() => setIsScanning(false)}
              />
            </View>
          </View>
        </Modal>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
