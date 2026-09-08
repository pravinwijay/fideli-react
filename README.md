# Fideli

> Application mobile et web moderne de gestion de cartes de fidélité, conçue avec Expo et React Native.

---

## Fonctionnalités

- **Scanner de code-barres** : Numérisation instantanée via la caméra (EAN-13, CODE-128, QR Code, etc.).
- **Aperçu en temps réel** : Visualisation instantanée de la carte lors de la saisie (couleur, code, enseigne).
- **Affichage optimisé en caisse** : Rendu vectoriel du code-barres et ajustement automatique de la luminosité maximale de l'écran.
- **Recherche rapide** : Filtrage en temps réel par nom d'enseigne, code annexe ou notes.
- **Gestion simple** : Suppression et réorganisation faciles avec animations fluides.
- **100% hors-ligne et sécurisé** : Données conservées localement sur l'appareil (AsyncStorage).

---

## Stack Technique

- **Framework** : [Expo SDK 55](https://expo.dev) & [React Native 0.83](https://reactnative.dev) (React 19)
- **Routage** : [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Styling** : [NativeWind v4](https://www.nativewind.dev) (Tailwind CSS)
- **Gestion d'état** : [Zustand](https://github.com/pmndrs/zustand) avec persistance locale
- **Animations** : [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Icônes** : [Lucide React Native](https://lucide.dev)

---

## Démarrage Rapide

### Prérequis

- [Node.js](https://nodejs.org) (v18+)
- [Expo Go](https://expo.dev/client) sur votre smartphone (ou simulateur iOS / Android)

### Installation

```bash
# Cloner le projet
git clone https://github.com/pravinwijay/fideli-react.git
cd fideli-react

# Installer les dépendances
npm install
```

### Lancement

```bash
# Démarrer le serveur de développement Expo
npx expo start

# Raccourcis directs
npm run ios       # Lancer sur simulateur iOS
npm run android   # Lancer sur émulateur Android
npm run web       # Lancer dans le navigateur
```

### Vérification des types

```bash
npm run typecheck
```

---

## Structure du Projet

```
├── app/                  # Routes et écrans (Expo Router)
│   ├── (tabs)/           # Navigation par onglets (Mes Cartes, Ajouter)
│   ├── card/[id].tsx     # Vue détaillée et affichage du code-barres
│   └── _layout.tsx       # Configuration racine de navigation
├── components/           # Composants UI réutilisables (CardItem, Scanner)
├── constants/            # Constantes de l'application (palette de couleurs)
├── store/                # Store Zustand (cartes, persistence)
├── types/                # Définitions TypeScript du domaine
└── global.css            # Styles Tailwind globaux
```
