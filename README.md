# DriveMe - Application VTC moderne (Projet TFE 2025)

##  Contexte académique
**Projet de fin d’études (TFE)** – Bachelier en Informatique, orientation développement d’applications.  
Objectif : concevoir et développer une application VTC complète, fiable et sécurisée, inspirée du modèle **inDrive**, adaptée initialement au **marché marocain**, avec une **ouverture internationale** future.

---

##  Présentation du projet
**DriveMe** est une application VTC (Voiture de Transport avec Chauffeur) connectant passagers et conducteurs via une plateforme mobile et web.  
Elle vise à offrir :
- Une **solution locale sécurisée et équitable**,  
- Un **modèle économique innovant basé sur des recharges prépayées** pour les conducteurs,  
- Une **expérience fluide** via un écosystème technique complet : géolocalisation, messagerie, suivi en temps réel, évaluation, etc.

---

##  Sécurité et conformité
DriveMe met l’accent sur la **sécurité des utilisateurs** :
- Authentification obligatoire par **numéro de téléphone** (SMS/OTP),
- Vérification des conducteurs : permis, assurance, carte grise, photo, casier judiciaire,
- Bouton **SOS** intégré pour alerter les autorités,
- Conformité aux exigences locales et RGPD.

---

##  Architecture technique
| Composant | Technologie principale |
|------------|------------------------|
| Backend API | **Spring Boot 3 (Java)** |
| Frontend | **Angular 20** |
| Base de données | **MySQL 8 (via XAMPP)** |
| IDE | **IntelliJ IDEA Ultimate** |
| Gestion de version | **Git + GitHub** |
| Outils complémentaires | Lombok, Hibernate, REST, JSON, Postman |

---

##  Structure actuelle du dépôt

## ⚙️ Structure actuelle du dépôt

```yaml
DriveMe:
  README.md
  src:
    main:
      java:
        com:
          driveme:
            controller: "Endpoints REST (API)"
            model: "Entités JPA : Chauffeur, Passager, etc."
            repository: "Interfaces JPA (DAO)"
            service: "Logique métier"
      resources:
        application.properties: "Configuration principale Spring Boot"
        static: "Ressources front (CSS, JS, images...)"
        templates: "Pages HTML / Thymeleaf (si utilisées)"
  pom.xml: "Configuration Maven"


---

##  Objectifs du TFE
1. Démontrer la **capacité à concevoir une architecture logicielle complète** (backend + frontend + BDD).
2. Assurer la **sécurité et la fiabilité** des échanges utilisateurs.
3. Intégrer des **services modernes** (notifications, géolocalisation, paiements locaux).
4. Préparer une **scalabilité internationale** du modèle.

---

##  Vision entrepreneuriale
DriveMe est également pensé comme une **startup technologique marocaine** :
- Basée sur une **SARL locale**,
- Reposant sur un **système de recharges prépayées** via **Inwi, IAM, Orange, CIH Pay, Wafacash, PayPal**,
- Avec une ambition claire : **rendre le transport plus sûr et plus rentable pour les conducteurs** tout en soutenant la **population active locale**.

---

##  Auteur
**Youssef Qarnouf**  
Développeur - Administrateur M365 - Entrepreneur Tech  
Basé en Belgique - Projet orienté vers le Maroc  
Contact : *qyossef@gmail.com*

---

##  Licence
Projet académique, utilisation réservée dans le cadre du TFE.  
Toute reproduction ou utilisation commerciale est interdite sans autorisation.

---

##  Statut du projet
- Initialisation complète du dépôt (octobre 2025)  
- En cours : développement du backend Spring Boot (`DriveMe-Spring`)  
- À venir : intégration Angular & API REST sécurisée


