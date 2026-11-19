# DriveMe Frontend

Interface web et PWA de DriveMe, plateforme de mobilité conçue pour le marché marocain.

Le frontend propose des espaces adaptés aux passagers, aux chauffeurs et aux administrateurs. Il communique avec l’API Spring Boot.

La présentation générale et les instructions de déploiement sont disponibles dans le [README principal](../README.md).

## Technologies

| Technologie | Utilisation |
| --- | --- |
| Angular | Composants autonomes, routage et formulaires |
| TypeScript | Développement de l’interface |
| HttpClient et RxJS | Communication avec le backend |
| HTML, CSS et SCSS | Mise en page responsive |
| Angular Service Worker | Installation PWA et cache des ressources configurées |

Les dépendances Angular et Angular Service Worker sont déclarées en `^21.2.20`. Le fichier `package-lock.json` fixe les versions installées avec `npm ci`.

## Fonctionnalités

### Espace passager

- Création d’une demande de course.
- Consultation des propositions des chauffeurs et sélection d’une offre.
- Suivi de la course et consultation de l’historique.
- Annulation des demandes éligibles.
- Consultation des paiements déclarés et dépôt d’avis.
- Tableau de bord avec les courses en attente, actives, terminées et annulées.

### Espace chauffeur

- Gestion du profil et de la disponibilité.
- Consultation des demandes disponibles et proposition d’un prix.
- Suivi des étapes des courses attribuées.
- Consultation des courses terminées et annulées.
- Consultation du portefeuille, des commissions et de son historique.

### Espace administrateur

- Supervision des chauffeurs et des passagers.
- Validation des dossiers chauffeurs.
- Consultation et filtrage des courses.
- Suivi des paiements, des crédits et des commissions.
- Consultation des incidents SOS.
- Tableau de bord présentant la répartition des courses par statut.

### Fonctions communes

- Connexion, inscription et récupération du mot de passe.
- Navigation adaptée au rôle de l’utilisateur.
- Interface responsive en français, anglais, arabe et espagnol.
- Affichage de droite à gauche pour l’arabe.
- Installation en tant que PWA.

## Organisation du code

| Emplacement | Responsabilité |
| --- | --- |
| `src/app/core/` | Services API, authentification, intercepteur HTTP et gardes |
| `src/app/shared/` | Composants réutilisables et structure des espaces connectés |
| `src/app/features/` | Pages et fonctionnalités métier |
| `src/app/app.routes.ts` | Déclaration des routes |
| `src/environments/` | Configuration des adresses de l’application et de l’API |
| `public/` | Ressources publiques et manifeste PWA |
| `ngsw-config.json` | Configuration du Service Worker |
| `nginx/default.conf` | Configuration Nginx du frontend conteneurisé |

## Authentification et autorisations

Après connexion, l’intercepteur HTTP transmet le JWT dans l’en-tête `Authorization: Bearer` des requêtes vers l’API DriveMe.

Les gardes Angular contrôlent la navigation vers les espaces connectés et les pages réservées à certains rôles. Le backend vérifie les autorisations, l’appartenance des ressources et les règles métier à chaque action concernée.

Le jeton est actuellement conservé dans `localStorage`. La prévention des failles XSS reste donc importante.

## Annulation et cohérence des informations

Les courses annulées restent visibles dans l’historique et dans les compteurs concernés.

L’annulation autonome du passager est limitée aux demandes lui appartenant, sans chauffeur attribué ni paiement, aux statuts autorisés par le backend.

L’interface distingue le budget initial du passager, le prix accepté et l’état du paiement. Une course annulée affiche un paiement non applicable.

Le tableau de bord chauffeur porte sur ses courses attribuées. La page de gestion des courses peut également inclure les demandes disponibles.

## Développement local

Depuis le répertoire `frontend`, installer les dépendances :

```powershell
npm ci
```

Démarrer le serveur de développement :

```powershell
npm start
```

L’interface est accessible à l’adresse :

```text
http://localhost:4200
```

La configuration de développement utilise l’API suivante :

```text
http://localhost:8080/api
```

Le backend doit être démarré séparément. Pour lancer l’ensemble de l’application avec Docker Compose, consulter le [README principal](../README.md).

## Compilation de production

```powershell
npm run build
```

La configuration de production utilise `environment.prod.ts`, génère des ressources versionnées et active le Service Worker.

Le Dockerfile compile l’application avec Node.js 22, puis copie les fichiers de `dist/driveme-frontend/browser` dans une image Nginx.

## PWA et connexion réseau

Le Service Worker met en cache le socle de l’interface et les ressources définies dans `ngsw-config.json`.

Les opérations métier, notamment la création des courses, les propositions, les paiements et l’administration, nécessitent une connexion au serveur. Les réponses métier de l’API ne sont pas configurées pour une utilisation hors ligne.

## Limites actuelles

- Les écrans de paiement ne constituent pas une intégration bancaire réelle.
- Le suivi GPS continu du chauffeur reste à développer.
- Les notifications lorsque l’application est fermée restent à développer.
- Le SOS permet un signalement et un suivi administratif, sans garantie d’intervention des secours.

## Sécurité et licence

Ne publier aucun secret, mot de passe, document personnel ou donnée de production.

Consulter la [politique de sécurité](../SECURITY.md) et la [licence du projet](../LICENSE.txt).

## Auteur

Youssef Qarnouf

Site : [driveme.cloud](https://driveme.cloud)
