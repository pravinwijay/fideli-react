import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  withSpring
} from 'react-native-reanimated';
import { Trash2 } from 'lucide-react-native';
import { LoyaltyCard } from '../store/useCardStore';

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

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isEditing) {
      const randomDelay = Math.random() * 150;
      scale.value = withSpring(0.95);
      // Slight delay so all cards don't jiggle exactly in sync
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
      scale.value = withSpring(1);
    }
    return () => clearTimeout(timeout);
  }, [isEditing]);

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
        { backgroundColor: card.brandPrimaryColorHex || '#1e293b' }
      ]}
      className="flex-1 aspect-[1.58] rounded-2xl p-4 m-2 justify-between shadow-md relative"
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
      {/* Delete Badge */}
      {isEditing && (
        <TouchableOpacity
          onPress={onDelete}
          className="absolute -top-3 -left-3 bg-red-500 rounded-full w-8 h-8 items-center justify-center z-50 border-2 border-white shadow-sm"
        >
          <Trash2 size={16} color="white" />
        </TouchableOpacity>
      )}

      {/* Brand Info */}
      <View>
        <Text className="text-white font-bold text-lg" numberOfLines={1}>{card.brandName}</Text>
      </View>
      
      {/* Visual mockup of the barcode on the card */}
      <View className="bg-white/25 rounded p-2 items-center w-full">
         <Text className="text-white font-mono text-xs tracking-widest">{card.barcodeValue}</Text>
      </View>
    </AnimatedTouchableOpacity>
  );
}
