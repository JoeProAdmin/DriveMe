# DriveMe

## © 2025-2026 Youssef Qarnouf - Tous droits réservés

Projet réalisé dans le cadre du Travail de Fin d'Études (TFE) ICC Bruxelles.

Toute reproduction, distribution, modification ou réutilisation partielle ou totale du code source est interdite sans autorisation écrite préalable de l'auteur.

---

## Présentation

DriveMe est une plateforme de mobilité intelligente mettant en relation passagers et chauffeurs.

Fonctionnalités principales :

* Authentification sécurisée JWT
* Gestion des chauffeurs
* Gestion des passagers
* Gestion des courses
* Gestion des paiements
* Gestion des avis et notations
* Dashboard Administrateur
* Dashboard Chauffeur
* Dashboard Passager
* Interface multilingue (FR / EN / AR / ES)

Marché cible principal : Maroc

Domaine réservé : driveme.cloud

---

## Technologies

### Backend

* Java 17
* Spring Boot 3
* Spring Security
* JWT
* Hibernate
* Spring Data JPA
* MySQL

### Frontend

* Angular
* TypeScript
* HTML5
* CSS3
* RxJS

### Outils

* IntelliJ IDEA
* Git
* GitHub
* Maven
* Swagger OpenAPI

---

## Fonctionnalités disponibles

### Authentification

* Inscription
* Connexion JWT
* Gestion des rôles

### Gestion des utilisateurs

* Administrateur
* Chauffeur
* Passager

### Gestion des chauffeurs

* Validation des profils
* Solde de crédits
* Note moyenne
* Gestion administrative

### Gestion des courses

* Création
* Suivi
* Historique
* Gestion des statuts

### Paiements

* Recharges chauffeurs
* Gestion des crédits
* Simulation de paiement

### Avis

* Évaluation des chauffeurs
* Commentaires
* Calcul automatique de la note moyenne

### Administration

* Gestion Chauffeurs
* Gestion Passagers
* Gestion Courses
* Gestion Paiements

---

## Sécurité

* JWT Authentication
* BCrypt Password Hashing
* Spring Security
* Contrôle d'accès basé sur les rôles

Rôles disponibles :

* ADMIN
* CHAUFFEUR
* PASSAGER

---

## Architecture

DriveMe

* backend

  * controller
  * dto
  * entity
  * repository
  * security
  * service

* frontend

  * app
  * core
  * features
  * layout

* docs

* sql

---

## Lancement du projet

### Backend

cd backend/DriveMe-Spring

mvnw spring-boot:run

Application disponible sur :

http://localhost:8080

### Frontend

cd frontend

npm install

ng serve

Application disponible sur :

http://localhost:4200

---

## Documentation API

Swagger :

http://localhost:8080/swagger-ui/index.html

---

## État du projet

Fonctionnel :

* JWT
* API REST
* Chauffeurs
* Passagers
* Courses
* Paiements
* Avis
* Dashboard Admin
* Dashboard Chauffeur
* Dashboard Passager
* Multilingue FR / EN / AR / ES

En cours :

* Géolocalisation
* Notifications
* Paiement réel
* Déploiement OVH

---

## Auteur

Youssef Qarnouf

Travail de Fin d'Études

ICC Bruxelles

Année académique 2025-2026

---

## Licence

Tous droits réservés.

Ce dépôt est publié uniquement à des fins académiques et de démonstration.

Aucune licence Open Source n'est accordée.
