import { ScrollViewStyleReset } from 'expo-router/html';

// Ce fichier configure le rendu HTML statique sur le web.
// Son contenu s'exécute uniquement dans l'environnement Node.js lors du build web.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Fideli - Vos cartes de fidélité au même endroit</title>

        {/* Désactive le scroll du body sur le web pour reproduire l'expérience native des ScrollView */}
        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #f8fafc;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #0f172a;
  }
}`;
