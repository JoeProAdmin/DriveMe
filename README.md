# DriveMe - Application VTC moderne (Projet TFE 2025–2026)

## Contexte académique

Projet de fin d’études (TFE) – Bachelier en Informatique, orientation développement d’applications (ICC).

Objectif : concevoir et développer une application VTC complète, fiable et sécurisée, inspirée du modèle inDrive, adaptée au marché marocain avec une ouverture internationale.

---

## Présentation du projet

DriveMe est une application VTC (Voiture de Transport avec Chauffeur) permettant de connecter passagers et conducteurs via une plateforme web (et future mobile).

Objectifs :

- Offrir une solution de transport sécurisée
- Proposer un modèle économique innovant (crédits prépayés)
- Garantir une expérience utilisateur fluide
- Assurer une architecture professionnelle complète (Backend + Frontend + Base de données)

---

## Architecture globale

Le projet est structuré en deux parties principales :

- Backend : API REST sécurisée développée avec Spring Boot
- Frontend : application Angular (interface utilisateur)

Communication via API REST sécurisée (JWT).

---

## Architecture technique

| Composant       | Technologie             |
|-----------------|------------------------|
| Backend         | Spring Boot 3 (Java 17)|
| Sécurité        | Spring Security + JWT  |
| Base de données | MySQL                  |
| ORM             | JPA / Hibernate        |
| API             | REST (JSON)            |
| Frontend        | Angular (Standalone)   |
| Outils          | IntelliJ, Postman      |
| Versioning      | Git + GitHub           |

---

## Structure du projet

DriveMe/
├── backend/DriveMe-Spring
│     ├── controller
│     ├── dto
│     ├── entity
│     ├── repository
│     ├── service
│     ├── security
│     └── exception
│
├── frontend/
│     ├── src/app/
│     │     ├── core
│     │     ├── shared
│     │     └── features/auth/login
│
├── sql/
├── docs/
└── README.md

---

## Fonctionnalités Backend

### Authentification & Sécurité

- Authentification JWT sécurisée
- Gestion des rôles :
    - ADMIN
    - CHAUFFEUR
    - PASSAGER
- Protection des endpoints via Spring Security
- Validation des données et logique métier

### Gestion des courses

Workflow métier complet :

EN_ATTENTE → ACCEPTEE → TERMINEE

- Création par le passager
- Acceptation par le chauffeur
- Finalisation sécurisée

### Paiement automatique

- Généré automatiquement après une course TERMINÉE
- Un seul paiement par course
- Statuts :
    - EN_ATTENTE
    - PAYE
    - REFUSE

---

## Fonctionnalités Frontend

### Initialisation

- Projet Angular créé et configuré
- Lancement local opérationnel (http://localhost:4200)

### Architecture

- Structure professionnelle :
    - core (services)
    - shared (composants)
    - features (modules métier)
- Utilisation des composants standalone Angular

### Authentification (en cours)

- Écran de connexion (login)
- Formulaire Angular (email + mot de passe)
- Binding avec ngModel
- Appel HTTP vers le backend /api/auth/login
- Service API Angular fonctionnel

### Intégration Backend

- Communication Angular → Spring Boot fonctionnelle
- Correction du problème CORS
- Envoi des données conforme :
    - email
    - rawPassword

---

## Exemple de flux API

1. Login  
   POST /api/auth/login

2. Création course  
   POST /api/courses

3. Acceptation  
   PUT /api/courses/{id}/status?status=ACCEPTEE

4. Finalisation  
   PUT /api/courses/{id}/status?status=TERMINEE

5. Paiement  
   Créé automatiquement en base

---

## Sécurité

- Authentification JWT
- Autorisation basée sur les rôles
- Protection des endpoints
- Validation métier stricte

---

## État actuel du projet

### Backend

- Architecture complète validée
- Sécurité JWT opérationnelle
- Workflow métier fonctionnel
- Paiement automatique implémenté

### Frontend

- Initialisé et structuré
- Interface login fonctionnelle
- Communication backend établie
- Problème restant côté backend (authentification → erreur 400)

---

## Objectifs du TFE

- Architecture complète Backend + Frontend + Base de données
- Sécurité robuste (JWT)
- Logique métier réaliste
- Application scalable et professionnelle
- Déploiement et documentation complète

---

## Vision

DriveMe est conçu comme une future startup orientée marché marocain avec un système de recharges prépayées pour les chauffeurs.

---

## Auteur

Youssef Qarnouf  
Projet TFE – ICC 2025–2026

---

## Licence

Projet académique (TFE)