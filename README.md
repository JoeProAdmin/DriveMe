# DriveMe – Smart Mobility Platform

> Application VTC moderne développée dans le cadre du Travail de Fin d'Études (TFE) ICC 2025 - 2026.

## Présentation

DriveMe est une plateforme de mobilité intelligente inspirée des acteurs internationaux du transport à la demande.

L'objectif du projet est de proposer une solution moderne, sécurisée et évolutive permettant la mise en relation entre passagers et chauffeurs via une application web basée sur une architecture professionnelle.

Le projet cible initialement le marché marocain avec une vision d'expansion internationale.

---

## Aperçu du projet

### Espace Passager

* Création de compte
* Authentification sécurisée
* Demande de course
* Suivi des trajets
* Historique des déplacements
* Évaluation des chauffeurs

### Espace Chauffeur

* Gestion du profil
* Validation administrative
* Acceptation des courses
* Historique des revenus
* Gestion du crédit DriveMe

### Espace Administrateur

* Tableau de bord centralisé
* Gestion des chauffeurs
* Gestion des passagers
* Gestion des courses
* Gestion des paiements
* Gestion des avis

---

## Architecture Technique

| Domaine         | Technologie           |
| --------------- | --------------------- |
| Backend         | Spring Boot 3         |
| Langage         | Java 17               |
| Sécurité        | Spring Security + JWT |
| Base de données | MySQL                 |
| ORM             | Hibernate / JPA       |
| Frontend        | Angular Standalone    |
| API             | REST JSON             |
| Documentation   | Swagger OpenAPI       |
| Versioning      | Git / GitHub          |

---

## Architecture du Projet

```text
DriveMe
│
├── backend/
│   └── DriveMe-Spring
│
├── frontend/
│   └── Angular
│
├── sql/
│
├── docs/
│
└── README.md
```

---

## Fonctionnalités Implémentées

### Authentification

* JWT sécurisé
* Gestion des rôles
* Protection des routes
* Contrôle d'accès

### Gestion des Courses

Workflow métier :

```text
EN_ATTENTE
     ↓
ACCEPTEE
     ↓
TERMINEE
```

### Gestion des Paiements

* Paiement généré automatiquement
* Suivi du statut
* Historisation des transactions

### Administration

* Dashboard central
* Statistiques globales
* Gestion des utilisateurs
* Contrôle de la plateforme

---

## Fonctionnalités Frontend

### Dashboard Administrateur

* Interface moderne Angular
* Sidebar de navigation
* Cartes statistiques
* Actions rapides

### Gestion des Chauffeurs

* Consultation
* Suppression
* Statut de validation

### Gestion des Courses

* Liste des trajets
* Suivi du statut
* Rafraîchissement dynamique

### Authentification

* Formulaire de connexion
* Intégration API REST
* Gestion JWT

---

## Sécurité

DriveMe applique plusieurs mécanismes de sécurité :

* Authentification JWT
* Contrôle d'accès par rôle
* Validation des données
* Protection des endpoints REST
* Architecture sécurisée Spring Security

---

## Roadmap

### Version actuelle

* Backend opérationnel
* Frontend Angular opérationnel
* Authentification JWT
* Gestion des courses
* Gestion des paiements
* Dashboard administrateur

### Prochaines évolutions

* Carte interactive
* Géolocalisation
* Notifications temps réel
* Version mobile
* Multilingue FR / EN / AR / ES
* Tableau de bord analytique
* Déploiement Cloud

---

## Captures d'écran

### Dashboard Administrateur

*Ajouter une capture du dashboard ici*

### Gestion des Chauffeurs

*Ajouter une capture ici*

### Gestion des Courses

*Ajouter une capture ici*

---

## Objectifs Académiques

Ce projet répond aux exigences du Travail de Fin d'Études ICC :

* Architecture complète Backend / Frontend
* API REST sécurisée
* Gestion des rôles
* Base de données relationnelle
* Documentation technique
* Versioning GitHub
* Déploiement professionnel

---

## Auteur

**Youssef Qarnouf**

Bachelier en Informatique – Développement d'Applications

ICC 2025–2026

---

## Licence

Projet académique réalisé dans le cadre du TFE ICC 2025 - 2026.

## Licence

Projet académique (TFE)
