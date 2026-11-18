# Lire la configuration Vercel

Vercel attend un fichier `vercel.json` en JSON strict. Le format JSON n'accepte pas les commentaires : en ajouter directement dans ce fichier pourrait empêcher son chargement. Cette note explique donc les réglages sans modifier le fichier de configuration.

## Services

- `services.backend.root` indique que le service Express se trouve dans `backend/`.
- `services.frontend.root` indique que l'application Next.js se trouve dans `frontend/`.
- Le binding déclaré pour `frontend` demande à Vercel de lui fournir l'URL interne du service `backend` dans la variable `BACKEND_URL`. Cette valeur est injectée par Vercel ; elle n'est pas écrite dans le code.

## Images Next.js

- `images.sizes` liste les largeurs d'image que l'optimiseur Next.js peut produire.
- `images.localPatterns` autorise les images locales dont le chemin correspond à `/images/...`.
- `images.remotePatterns` autorise les images hébergées sur le domaine S3 indiqué et dans le chemin configuré.
- `images.qualities` liste les niveaux de qualité autorisés.
- `images.formats` autorise la sortie au format WebP.

## Réécritures des URL

Les règles sont évaluées dans l'ordre :

1. `/api/...` est envoyé au service `backend`.
2. `/auth/...` est envoyé au service `backend`.
3. Les autres chemins (`/...`) sont envoyés au service `frontend`.

Ces règles relient les URL publiques aux deux services. Cette note ne change ni ces règles ni le code du backend.
