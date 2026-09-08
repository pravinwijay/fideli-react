import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page introuvable' }} />
      <View className="flex-1 justify-center items-center bg-neutral-50 px-6">
        <View className="w-20 h-20 bg-red-50 rounded-3xl justify-center items-center mb-6 border border-red-100 shadow-sm">
          <AlertCircle size={40} color="#dc2626" />
        </View>

        <Text className="text-2xl font-extrabold text-neutral-900 text-center mb-2">
          Page introuvable
        </Text>
        <Text className="text-neutral-500 text-center text-sm sm:text-base mb-8 max-w-sm">
          Cette page ou cet écran n'existe pas ou a été déplacé.
        </Text>

        <Link
          href="/"
          className="bg-blue-600 active:bg-blue-700 px-6 py-3.5 rounded-2xl shadow-md"
        >
          <Text className="text-white font-bold text-base">
            Retourner à l'accueil
          </Text>
        </Link>
      </View>
    </>
  );
}
