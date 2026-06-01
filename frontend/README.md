# DriveMe - Frontend Angular (TFE 2025–2026)

## Contexte académique
Projet de fin d’études (TFE) – Bachelier en Informatique, orientation développement d’applications (ICC).

DriveMe est une application VTC moderne inspirée du modèle inDrive, adaptée au marché marocain avec une ambition d’extension internationale.

---

## Présentation du frontend

Ce projet correspond au frontend Angular de l’application DriveMe.

Il permet :
- l’interface utilisateur (authentification, dashboard futur, gestion des courses)
- la communication avec le backend Spring Boot
- la gestion de l’authentification (JWT à venir)

---

## Stack technique

- Angular (Standalone Components)
- TypeScript
- HTML / CSS
- Angular HttpClient
- Architecture modulaire (core / shared / features)

---

## Structure du projet

src/app/
├── core/        → services globaux (API, auth)
├── shared/      → composants réutilisables
├── features/    → modules métier
│     └── auth/
│           └── login/
├── app.ts
├── app.html
├── app.routes.ts

---

## Fonctionnalités implémentées

### Initialisation
- création du projet Angular
- configuration et lancement en local

### Architecture
- structure professionnelle (core / shared / features)
- utilisation des composants standalone Angular

### Authentification (en cours)
- écran de connexion (login)
- formulaire Angular (email + mot de passe)
- binding avec ngModel
- gestion des événements (ngSubmit)

### Communication backend
- service API Angular
- requête HTTP POST vers /api/auth/login
- utilisation de HttpClient
- correction du problème CORS côté backend

---

## État actuel du login

Le frontend est fonctionnel et correctement connecté au backend.

- le formulaire envoie correctement :
  - email
  - rawPassword
- la requête HTTP est bien transmise
- le backend répond

Limitation actuelle :

Le backend retourne une erreur :

400 Bad Request

Cela indique un problème côté backend (authentification, PasswordEncoder ou données en base).

Le frontend est donc validé à ce stade.

---

## Lancement du projet

Installation :

npm install

Démarrage :

ng serve

---

## Accès

http://localhost:4200

---

## Backend associé

http://localhost:8080/api

---

## Prochaines étapes

- correction du login backend (authentification JWT)
- récupération et stockage du token côté frontend
- mise en place d’un interceptor HTTP
- sécurisation des routes Angular
- redirection vers dashboard
- développement des modules métier (courses, chauffeurs, passagers)

---

## Auteur

Youssef Qarnouf  
Projet DriveMe – TFE ICC 2025–2026
