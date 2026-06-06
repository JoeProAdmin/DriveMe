# DriveMe

## Présentation

DriveMe est une application de mise en relation entre passagers et chauffeurs développée dans le cadre d’un Travail de Fin d’Études (TFE).

L’objectif du projet est de proposer une plateforme moderne de réservation de courses permettant :

* l’inscription et l’authentification des utilisateurs ;
* la gestion des chauffeurs et des passagers ;
* la création et le suivi des courses ;
* la gestion des paiements ;
* l’administration centralisée de la plateforme ;
* une architecture sécurisée basée sur JWT.

Le projet cible principalement le marché marocain tout en restant extensible à d’autres pays.

---

## Technologies utilisées

### Backend

* Java 17
* Spring Boot 3
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* MySQL

### Frontend

* Angular 17 Standalone
* TypeScript
* HTML5
* CSS3
* RxJS

### Outils

* IntelliJ IDEA
* Git
* GitHub
* Swagger OpenAPI

---

## Fonctionnalités implémentées

### Authentification

* Inscription utilisateur
* Connexion sécurisée
* Gestion des rôles
* Protection des routes via JWT

### Gestion des utilisateurs

* Chauffeurs
* Passagers
* Administrateurs

### Gestion des courses

* Création d’une course
* Consultation des courses
* Suivi des statuts

### Administration

* Tableau de bord administrateur
* Gestion des chauffeurs
* Validation des profils chauffeurs

### Paiements

* Interface de paiement
* Préparation à l’intégration d’une passerelle réelle

---

## Structure du projet

```text
DriveMe
│
├── backend
│   ├── controller
│   ├── dto
│   ├── entity
│   ├── repository
│   ├── security
│   └── service
│
├── frontend
│   ├── src
│   │   ├── app
│   │   ├── core
│   │   ├── features
│   │   └── layout
│
├── sql
├── docs
└── README.md
```

## Sécurité

Le projet utilise :

* JWT (JSON Web Token)
* BCrypt pour le hachage des mots de passe
* Spring Security
* Contrôle d’accès basé sur les rôles

Rôles disponibles :

* ADMIN
* CHAUFFEUR
* PASSAGER

---

## Lancement du projet

### Backend

```bash
cd backend
mvn spring-boot:run
```

Backend disponible sur :

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend disponible sur :

```text
http://localhost:4200
```

---

## Documentation API

Swagger :

```text
http://localhost:8080/swagger-ui/index.html
```

---

## État actuel du projet

Fonctionnel :

* Authentification JWT
* Gestion utilisateurs
* Gestion chauffeurs
* Gestion passagers
* Gestion courses
* Dashboard Angular
* API REST sécurisée
* Base MySQL

En cours d’amélioration :

* Paiement réel
* Géolocalisation
* Notifications
* Déploiement production

---

## Auteur

Youssef Qarnouf

Travail de Fin d'Études – ICC Bruxelles

Année académique 2025-2026
