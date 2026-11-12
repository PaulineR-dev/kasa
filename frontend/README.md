# Kasa — application front-end

Kasa est une plateforme de location de logements développée avec Next.js. Le front-end permet de consulter les annonces et leurs fiches détaillées, de parcourir leurs photos, de gérer des favoris dans le navigateur, et de créer un compte ou de se connecter. Il comprend aussi des pages À propos, de messagerie provisoire et une page 404 personnalisée.

Le dépôt GitHub du projet est [PaulineR-dev/kasa](https://github.com/PaulineR-dev/kasa).

## Prérequis

- Node.js compatible avec Next.js 16.
- npm.
- Le serveur API Kasa démarré et accessible pour charger les logements et utiliser l'inscription et la connexion.
- Un accès réseau à Google Fonts lors de la compilation, car Inter est chargée avec `next/font/google`.

## Installation

Depuis la racine du dépôt, installer les dépendances du front-end :

```bash
cd frontend
npm install
```

## Configuration

Le front-end peut lire les variables d'environnement suivantes. Elles peuvent être définies dans l'environnement du terminal ou dans un fichier local `frontend/.env.local`.

| Variable | Utilisation | Valeur locale par défaut |
| --- | --- | --- |
| `API_URL` | Adresse de base du serveur API utilisée par les appels serveur et les réécritures Next.js. | `http://localhost:3000` |
| `SITE_URL` | URL publique du site utilisée pour les URL canoniques, le sitemap, `robots.txt` et les données structurées. | `http://localhost:3001` |

Pour le développement local, démarrer l'API sur le port 3000 et le front sur le port 3001, ou définir les variables pour les ports utilisés. En production, définir `SITE_URL` avec le domaine public réel et `API_URL` avec l'adresse joignable du serveur API.

## Lancement du projet

Depuis `frontend/`, lancer le serveur de développement :

```bash
npm run dev -- --port 3001
```

Ouvrir ensuite [http://localhost:3001](http://localhost:3001).

Pour créer et lancer une version de production :

```bash
npm run build
npm run start -- --port 3001
```

## Vérifications

Lancer les tests unitaires du carrousel et des favoris :

```bash
npm test
```

Vérifier le code avec ESLint :

```bash
npm run lint
```

## Pages et fonctionnalités principales

- `/` : accueil et liste de logements.
- `/properties/[slug]` : fiche détaillée, galerie photo et accordéons d'équipements et de catégories.
- `/about` : présentation de Kasa.
- `/login` et `/signup` : connexion et création de compte.
- `/favorites` : favoris conservés dans le stockage local du navigateur.
- `/messages` : écran provisoire de la messagerie.
- Les routes spéciales `/sitemap.xml` et `/robots.txt` aident les moteurs de recherche à découvrir les pages publiques.

Les pages d'accueil et de logement récupèrent leur contenu côté serveur. Les composants interactifs, comme le carrousel et les boutons de favoris, utilisent React côté navigateur. Les appels vers `/api` et `/auth` sont transmis au serveur API par les réécritures définies dans `next.config.mjs`.
