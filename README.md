DriveMe – Smart Mobility Platform

Présentation

DriveMe est une plateforme de mobilité intelligente développée dans le cadre du Travail de Fin d'Études (TFE) ICC 2025–2026.

L'application vise à mettre en relation des passagers et des chauffeurs via une plateforme sécurisée, moderne et évolutive. Inspirée des leaders internationaux du transport à la demande, DriveMe a été conçue pour répondre aux besoins du marché marocain tout en respectant les standards techniques d'une solution professionnelle pouvant évoluer vers un déploiement commercial.

L'objectif du projet est de proposer une alternative moderne offrant sécurité, transparence, simplicité d'utilisation et gestion centralisée des opérations.

---

Fonctionnalités Principales

Espace Passager

- Création et gestion de compte
- Authentification sécurisée
- Demande de course
- Consultation de l'historique des trajets
- Suivi du statut des courses
- Évaluation des chauffeurs
- Gestion du profil utilisateur

Espace Chauffeur

- Création et gestion de compte chauffeur
- Validation administrative du dossier
- Consultation et acceptation des courses
- Gestion du profil professionnel
- Historique des activités
- Gestion du crédit DriveMe
- Consultation des revenus

Espace Administrateur

- Tableau de bord centralisé
- Gestion des chauffeurs
- Gestion des passagers
- Gestion des courses
- Gestion des paiements
- Gestion des avis
- Contrôle et supervision de la plateforme

---

Architecture Technique

Domaine| Technologie
Backend| Spring Boot 3
Langage Backend| Java 17
Frontend| Angular 17 Standalone
Sécurité| Spring Security + JWT
Base de données| MySQL
ORM| Hibernate / JPA
API| RESTful JSON
Documentation API| Swagger OpenAPI
Versioning| Git / GitHub
Build Tool| Maven
Déploiement cible| Docker / VPS Linux

---

Architecture du Projet

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

---

Fonctionnalités Implémentées

Authentification et Sécurité

- Authentification JWT
- Gestion des rôles
- Protection des endpoints REST
- Contrôle d'accès basé sur les rôles
- Validation des données
- Architecture sécurisée Spring Security

Gestion des Courses

Workflow métier actuel :

EN_ATTENTE
    ↓
ACCEPTEE
    ↓
TERMINEE

Gestion des Paiements

- Création automatique du paiement après validation d'une course
- Historisation des transactions
- Gestion des statuts de paiement

Administration

- Dashboard administrateur
- Statistiques globales
- Gestion centralisée des utilisateurs
- Supervision des activités

---

Frontend Angular

Interface Publique

- Landing Page moderne
- Présentation des services
- Accès à l'authentification
- Design responsive

Dashboard Administrateur

- Tableau de bord moderne
- Cartes statistiques
- Navigation latérale
- Actions rapides

Gestion des Entités

- Chauffeurs
- Passagers
- Courses
- Paiements

Expérience Utilisateur

- Responsive Desktop
- Responsive Tablette
- Responsive Mobile
- Architecture évolutive pour application Android et iOS

---

Sécurité

DriveMe applique plusieurs niveaux de sécurité :

- Authentification JWT
- Gestion des rôles utilisateurs
- Validation côté backend
- Protection des routes Angular
- Contrôle d'accès administrateur
- Sécurisation des API REST

---

Roadmap

Version Actuelle

- Backend Spring Boot opérationnel
- Frontend Angular opérationnel
- Authentification JWT
- Dashboard administrateur
- Gestion des chauffeurs
- Gestion des passagers
- Gestion des courses
- Gestion des paiements
- Documentation Swagger

Évolutions Prévues

- Paiement électronique sécurisé
- QR Code de paiement
- Géolocalisation en temps réel
- Cartographie interactive
- Notifications temps réel
- Gestion des avis
- Multilingue (Français, Anglais, Arabe, Espagnol)
- Application Android
- Application iOS
- Tableau de bord analytique avancé
- Déploiement Cloud

---

Objectifs Académiques

Ce projet répond aux principales exigences du Travail de Fin d'Études ICC :

- Architecture Backend / Frontend complète
- API RESTful sécurisée
- Gestion des rôles et des accès
- Base de données relationnelle normalisée
- Documentation technique
- Versioning GitHub
- Déploiement professionnel
- Sécurisation des données
- Application multilingue
- Back-office d'administration

---

Auteur

Youssef Qarnouf

Bachelier en Informatique – Développement d'Applications

Institut des Carrières Commerciales (ICC)

Année académique 2025–2026

---

Propriété Intellectuelle

Copyright © 2026 Youssef Qarnouf

Projet développé dans le cadre du Travail de Fin d'Études ICC.

Toute reproduction, diffusion, modification ou exploitation commerciale du code source ou de la documentation est interdite sans autorisation écrite de l'auteur.

Tous droits réservés.