# DriveMe - Application VTC moderne (Projet TFE 2025)

## Contexte académique

Projet de fin d’études (TFE) – Bachelier en Informatique, orientation développement d’applications.

Objectif : concevoir et développer une application VTC complète, fiable et sécurisée, inspirée du modèle inDrive, adaptée au marché marocain avec une ouverture internationale.

---

## Présentation du projet

DriveMe est une application VTC (Voiture de Transport avec Chauffeur) permettant de connecter passagers et conducteurs via une plateforme mobile et web.

Objectifs :

* Offrir une solution de transport sécurisée
* Proposer un modèle économique innovant (crédits prépayés)
* Garantir une expérience utilisateur fluide

---

## Fonctionnalités Backend

### Authentification & Sécurité

* Authentification JWT sécurisée
* Gestion des rôles :

  * ADMIN
  * CHAUFFEUR
  * PASSAGER
* Protection des endpoints via Spring Security

### Gestion des courses

Workflow métier complet :

EN_ATTENTE → ACCEPTEE → TERMINEE

* Création par le passager
* Acceptation par le chauffeur
* Finalisation sécurisée

### Paiement automatique

* Généré automatiquement après une course TERMINÉE
* Un seul paiement par course
* Statuts :

  * EN_ATTENTE
  * PAYE
  * REFUSE

---

## Architecture technique

| Composant       | Technologie             |
| --------------- | ----------------------- |
| Backend         | Spring Boot 3 (Java 17) |
| Sécurité        | Spring Security + JWT   |
| Base de données | MySQL                   |
| ORM             | JPA / Hibernate         |
| API             | REST (JSON)             |
| Outils          | IntelliJ, Postman       |
| Versioning      | Git + GitHub            |

---

## Structure du projet

backend/DriveMe-Spring

* controller → API REST
* dto → Data Transfer Objects
* entity → Entités JPA
* repository → Accès base de données
* service → Logique métier
* security → JWT + filtres
* exception → Gestion erreurs

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

* Authentification JWT
* Autorisation basée sur les rôles
* Protection des endpoints
* Validation métier stricte

---

## État du projet

Backend :

* Architecture complète
* Sécurité JWT fonctionnelle
* Workflow métier validé
* Paiement automatique opérationnel

Frontend :

* À développer (Angular)

---

## Objectifs du TFE

* Architecture complète Backend + Frontend + DB
* Sécurité robuste
* Logique métier réaliste
* Application scalable

---

## Vision

DriveMe est conçu comme une future startup orientée marché marocain avec un système de recharges prépayées pour les chauffeurs.

---

## Auteur

Youssef Qarnouf
Email : [qyossef@gmail.com](mailto:qyossef@gmail.com)

---

## Licence

Projet académique (TFE)
