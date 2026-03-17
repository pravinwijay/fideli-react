import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { X } from 'lucide-react-native';

interface BarcodeScannerProps {
  onScan: (type: string, data: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View className="flex-1 bg-black justify-center items-center"><Text className="text-white">Chargement de la caméra...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black justify-center items-center px-6">
        <Text className="text-white text-center mb-4 text-lg font-medium">
          L'accès à la caméra est nécessaire pour scanner vos cartes de fidélité.
        </Text>
        <TouchableOpacity onPress={requestPermission} className="bg-blue-600 px-6 py-3 rounded-xl">
          <Text className="text-white font-bold">Autoriser la Caméra</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    onScan(type, data);
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'qr', 'code128', 'code39'],
        }}
      />
      
      {/* Overlay to guide the user */}
      <View className="absolute inset-0 justify-center items-center pointer-events-none">
         <View className="w-72 h-40 border-2 border-white/50 rounded-xl" />
         <Text className="text-white font-semibold text-center mt-6 bg-black/50 px-4 py-2 rounded-full overflow-hidden">
           Placez le code-barre dans le cadre
         </Text>
      </View>

      {/* Close button */}
      <TouchableOpacity 
        onPress={onClose}
        className="absolute top-16 right-6 bg-white/20 p-3 rounded-full"
      >
        <X color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
}
