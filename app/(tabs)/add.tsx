import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useCardStore } from '../../store/useCardStore';
import { useRouter } from 'expo-router';
import { Camera, Search } from 'lucide-react-native';

interface ClearbitCompany {
  name: string;
  domain: string;
  logo: string;
}

export default function AddCardScreen() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ClearbitCompany[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [brandName, setBrandName] = useState('');
  const [website, setWebsite] = useState('');
  const [barcodeValue, setBarcodeValue] = useState('');
  const [brandColor, setBrandColor] = useState('#2563eb'); 

  const addCard = useCardStore((state) => state.addCard);
  const router = useRouter();

  // Debounce effect for Clearbit API
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    
    let isCancelled = false;
    
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (!isCancelled) setSuggestions(data);
      } catch (error) {
        console.error("Autocomplete Error:", error);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => fetchCompanies(), 400);
    return () => {
      clearTimeout(delayDebounce);
      isCancelled = true;
    };
  }, [query]);

  const handleSelectCompany = (company: ClearbitCompany) => {
    setBrandName(company.name);
    setWebsite(company.domain);
    // Setting a temporary primary color. In a real scenario, color extraction from logo can be performed here.
    setQuery('');
    setSuggestions([]);
  };

  const handleSave = () => {
    if (!brandName || !barcodeValue) return;
    
    addCard({
      brandName,
      website,
      barcodeType: 'CODE128', // default fallback for now
      barcodeValue,
      brandPrimaryColorHex: brandColor,
      code: '',
      notes: ''
    });
    router.push('/');
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 bg-neutral-50 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <Text className="text-3xl font-extrabold text-neutral-900 mb-6">Nouvelle Carte</Text>

        {/* Global Search Bar */}
        <View className="relative z-50 mb-6">
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm border border-neutral-200">
            <Search size={22} className="text-neutral-400 mr-2" />
            <TextInput
              placeholder="Rechercher une enseigne (ex: Sephora)"
              value={query}
              onChangeText={setQuery}
              className="flex-1 text-base text-neutral-900"
              autoCorrect={false}
            />
            {isLoading && <ActivityIndicator size="small" color="#9CA3AF" />}
          </View>

          {/* Autocomplete Dropdown */}
          {suggestions.length > 0 && (
            <View className="absolute top-14 left-0 right-0 bg-white rounded-xl shadow-lg border border-neutral-100 max-h-60 overflow-hidden z-50">
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.domain}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    className="flex-row items-center p-4 border-b border-neutral-50"
                    onPress={() => handleSelectCompany(item)}
                  >
                    <Image source={{ uri: item.logo }} className="w-8 h-8 rounded-full bg-neutral-100 mr-3" />
                    <Text className="text-base text-neutral-800 font-medium">{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* Form */}
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 z-10">
          <Text className="text-sm font-semibold text-neutral-500 mb-2 uppercase">Informations</Text>
          
          <TextInput
            placeholder="Nom de l'enseigne"
            value={brandName}
            onChangeText={setBrandName}
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-4 text-neutral-900 text-base font-medium"
          />

          <TextInput
            placeholder="Site Web (Optionnel)"
            value={website}
            onChangeText={setWebsite}
            autoCapitalize="none"
            keyboardType="url"
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-6 text-neutral-900 text-base"
          />

          <Text className="text-sm font-semibold text-neutral-500 mb-2 uppercase">Code-Barre</Text>
          <View className="flex-row mb-6">
            <TextInput
              placeholder="Ex: 123456789012"
              value={barcodeValue}
              onChangeText={setBarcodeValue}
              keyboardType="number-pad"
              className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-base font-mono tracking-widest"
            />
            {/* The scanner feature button would go here */}
            <TouchableOpacity className="ml-3 bg-neutral-100 rounded-xl p-3 justify-center items-center border border-neutral-200">
              <Camera size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            className={`rounded-xl py-4 flex-row justify-center items-center ${
              !brandName || !barcodeValue ? 'bg-blue-300' : 'bg-blue-600'
            }`}
            onPress={handleSave}
            disabled={!brandName || !barcodeValue}
          >
            <Text className="text-white font-bold text-lg">Enregistrer</Text>
          </TouchableOpacity>
        </View>
        <View className="h-20" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
