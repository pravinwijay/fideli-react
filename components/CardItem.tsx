import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  withSpring
} from 'react-native-reanimated';
import { Trash2, Wifi } from 'lucide-react-native';

import { LoyaltyCard } from '@/types/card';

interface CardItemProps {
  card: LoyaltyCard;
  isEditing: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onDelete: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function CardItem({ card, isEditing, onPress, onLongPress, onDelete }: CardItemProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isEditing) {
      const randomDelay = Math.random() * 150;
      scale.value = withSpring(0.95);
      // Décalage aléatoire pour que le tremblement ne soit pas synchronisé
      timeout = setTimeout(() => {
        rotation.value = withRepeat(
          withSequence(
            withTiming(1.3, { duration: 110, easing: Easing.linear }),
            withTiming(-1.3, { duration: 110, easing: Easing.linear })
          ),
          -1,
          true
        );
      }, randomDelay);
    } else {
      rotation.value = withTiming(0, { duration: 200 });
      scale.value = withSpring(isHovered ? 1.03 : 1);
    }
    return () => clearTimeout(timeout);
  }, [isEditing, isHovered]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateZ: `${rotation.value}deg` },
        { scale: scale.value }
      ],
    };
  });

  return (
    <AnimatedTouchableOpacity
      style={[
        animatedStyle, 
        { 
          backgroundColor: card.brandPrimaryColorHex || '#1e293b',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: isHovered ? 12 : 4 },
          shadowOpacity: isHovered ? 0.25 : 0.12,
          shadowRadius: isHovered ? 16 : 8,
          elevation: isHovered ? 8 : 4,
        },
        Platform.OS === 'web' ? ({ cursor: isEditing ? 'grab' : 'pointer' } as any) : undefined
      ]}
      className="flex-1 aspect-[1.586] rounded-2xl p-4 sm:p-5 m-2 justify-between relative overflow-hidden border border-white/10"
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.9}
      // Événements survol pour le web
      {...(Platform.OS === 'web'
        ? {
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false),
          }
        : {})}
    >
      {/* Halos décoratifs */}
      <View 
        pointerEvents="none"
        className="absolute -top-16 -right-16 w-40 h-40 bg-white/10 rounded-full blur-2xl" 
      />
      <View 
        pointerEvents="none"
        className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/15 rounded-full blur-xl" 
      />

      {/* Pastille de suppression en mode édition */}
      {isEditing && (
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="absolute -top-1 -left-1 bg-red-500 rounded-full w-8 h-8 items-center justify-center z-50 border-2 border-white shadow-lg"
        >
          <Trash2 size={16} color="white" />
        </TouchableOpacity>
      )}

      {/* En-tête : Nom de la marque + Sans contact / Puce */}
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-2">
          <Text 
            className="text-white font-extrabold text-lg sm:text-xl tracking-wide drop-shadow" 
            numberOfLines={1}
          >
            {card.brandName}
          </Text>
          {card.website ? (
            <Text 
              className="text-white/70 text-xs font-medium uppercase tracking-wider mt-0.5" 
              numberOfLines={1}
            >
              {card.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}
            </Text>
          ) : null}
        </View>

        {/* Vagues sans contact (puce retirée) */}
        <View className="flex-row items-center opacity-85">
          <Wifi size={18} color="white" className="rotate-90 opacity-90" />
        </View>
      </View>
      
      {/* Mockup visuel du code-barres sur la carte */}
      <View className="bg-white/90 backdrop-blur rounded-xl p-2 sm:p-2.5 items-center w-full shadow-inner border border-white/40">
        <View className="w-full flex-row justify-center items-center h-5 mb-1 px-1 overflow-hidden opacity-85">
          {Array.from({ length: 36 }).map((_, i) => (
            <View 
              key={i} 
              className="bg-neutral-900 mx-[1.5px]" 
              style={{
                width: (i % 3 === 0 ? 2.5 : i % 2 === 0 ? 1.5 : 1),
                height: (i % 5 === 0 ? 18 : 20),
              }}
            />
          ))}
        </View>
        <Text 
          className="text-neutral-900 font-mono text-xs sm:text-sm font-semibold tracking-widest"
          numberOfLines={1}
        >
          {card.barcodeValue}
        </Text>
      </View>
    </AnimatedTouchableOpacity>
  );
}
