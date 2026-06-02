# DriveMe

## Présentation

DriveMe est une plateforme de mobilité intelligente développée dans le cadre du Travail de Fin d'Études (TFE) ICC 2025-2026.

L'objectif du projet est de proposer une solution moderne, sécurisée et évolutive permettant la mise en relation entre passagers et chauffeurs via une architecture professionnelle basée sur Spring Boot, Angular et MySQL.

Le projet vise initialement le marché marocain avec une perspective d'évolution vers une plateforme de mobilité internationale.

---

# Objectifs du Projet

DriveMe a été conçu pour répondre aux besoins suivants :

- Réservation de trajets en temps réel
- Gestion des chauffeurs et passagers
- Paiement sécurisé
- Gestion des avis et évaluations
- Administration centralisée
- Architecture RESTful moderne
- Application multilingue
- Compatibilité Web, Mobile et Tablette
- Déploiement professionnel sur serveur Linux

---

# Architecture Technique

| Domaine | Technologie |
|----------|-------------|
| Backend | Spring Boot 3 |
| Langage Backend | Java 17 |
| Frontend | Angular 17 Standalone |
| Sécurité | Spring Security + JWT |
| Base de données | MySQL |
| ORM | Hibernate / JPA |
| API | RESTful JSON |
| Documentation API | Swagger OpenAPI |
| Versioning | Git / GitHub |
| Build Tool | Maven |
| Déploiement cible | Docker / VPS Linux |

---

# Organisation du Projet

Le projet est structuré selon une architecture moderne Frontend / Backend.

```text
DriveMe
│
├── backend
│   └── DriveMe-Spring
│
├── frontend
│   └── Angular
│
├── sql
│
├── docs
│
└── README.md
```

---

# Fonctionnalités Implémentées

## Authentification et Sécurité

- Authentification JWT
- Gestion des rôles
- Protection des endpoints REST
- Contrôle d'accès basé sur les rôles
- Hashage des mots de passe avec BCrypt

## Gestion des Utilisateurs

### Passagers

- Création de compte
- Connexion sécurisée
- Gestion du profil
- Historique des trajets

### Chauffeurs

- Gestion du profil
- Validation administrative
- Consultation des courses
- Gestion du crédit DriveMe

## Gestion des Courses

Workflow métier actuel :

```text
EN_ATTENTE
     ↓
ACCEPTEE
     ↓
TERMINEE
```

Fonctionnalités :

- Création de course
- Affectation chauffeur
- Suivi du statut
- Historisation

## Gestion des Paiements

- Génération automatique du paiement
- Historisation
- Association aux courses
- Gestion du statut de paiement

## Administration

- Dashboard centralisé
- Gestion des chauffeurs
- Gestion des passagers
- Gestion des courses
- Gestion des paiements

---

# Fonctionnalités Frontend

## Landing Page

- Présentation publique de DriveMe
- Design responsive
- Compatible Desktop, Mobile et Tablette

## Authentification

- Interface de connexion
- Intégration API JWT
- Protection des routes Angular

## Dashboard Administrateur

- Statistiques globales
- Vue d'ensemble de la plateforme
- Actions rapides
- Interface moderne responsive

## Gestion des Chauffeurs

- Consultation
- Validation
- Suppression

## Gestion des Passagers

- Consultation
- Gestion administrative

## Gestion des Courses

- Liste des trajets
- Mise à jour des statuts
- Consultation détaillée

---

# Sécurité

Le projet applique plusieurs mécanismes de sécurité :

- Spring Security
- JWT Authentication
- BCrypt Password Encoder
- Contrôle d'accès par rôles
- Validation des données
- Protection des routes Angular
- Architecture REST sécurisée

---

# État d'Avancement

| Module | Statut |
|----------|----------|
| Backend Spring Boot | Terminé |
| Base de données MySQL | Terminé |
| Authentification JWT | Terminé |
| Swagger OpenAPI | Terminé |
| API REST | Terminé |
| Dashboard Administrateur | En cours d'amélioration |
| Gestion Chauffeurs | Fonctionnel |
| Gestion Passagers | Fonctionnel |
| Gestion Courses | Fonctionnel |
| Gestion Paiements | Fonctionnel |
| Landing Page | En cours |
| Gestion Avis | En cours |
| Multilingue | En cours |
| QR Code Paiement | Planifié |
| Notifications Temps Réel | Planifié |
| Déploiement VPS Linux | Planifié |
| Application Android | Planifié |
| Application iOS | Planifié |

---

# Conformité TFE ICC

| Exigence | Statut |
|-----------|---------|
| Versioning GitHub | Conforme |
| API RESTful | Conforme |
| Back-office sécurisé | Conforme |
| Authentification JWT | Conforme |
| Base de données relationnelle | Conforme |
| Documentation API | Conforme |
| Swagger OpenAPI | Conforme |
| Gestion des rôles | Conforme |
| Paiement sécurisé | En cours |
| Multilingue | En cours |
| Tests unitaires | À réaliser |
| Tests d'intégration | À réaliser |
| Déploiement | À réaliser |

---

# Évolutions Prévues

## Front Office

- Application multilingue
  - Français
  - Anglais
  - Arabe
  - Espagnol

- Géolocalisation
- Carte interactive
- Historique avancé
- Gestion des favoris

## Paiements

- Paiement par QR Code
- Paiement mobile
- Paiement bancaire
- Historique des transactions

## Administration

- Tableau de bord analytique
- Rapports statistiques
- Audit d'activité
- Journalisation complète

## Mobile

- Progressive Web App (PWA)
- Android APK
- Application iOS

---

# Déploiement Prévu

Architecture cible :

```text
Utilisateur
      │
      ▼
Frontend Angular
      │
      ▼
API Spring Boot
      │
      ▼
Base de données MySQL
      │
      ▼
Serveur Linux VPS
```

Technologies envisagées :

- Docker
- Nginx
- Linux Ubuntu Server
- GitHub Actions
- SSL HTTPS

---

# Auteur

Youssef Qarnouf

Bachelier en Informatique – Développement d'Applications

Institut des Carrières Commerciales (ICC)

Année académique 2025-2026

---

# Licence

Projet réalisé dans le cadre du Travail de Fin d'Études ICC 2025-2026.

Tous droits réservés.