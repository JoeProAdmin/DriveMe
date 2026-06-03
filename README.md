# DriveMe – Enterprise Smart Mobility Platform

DriveMe est une plateforme technologique distribuée de mobilité urbaine et de transport à la demande (VTC). Conçue selon les standards industriels de haute disponibilité, de sécurité et d'évolutivité, la plateforme permet une mise en relation temps réel et sécurisée entre passagers et conducteurs certifiés.

L'architecture technique est orientée micro-services découplés, garantissant une forte résilience, une maintenance isolée et une transition transparente vers une infrastructure conteneurisée.

## Fonctionnalités du Système

### Espace Passager (Client App)
* **Onboarding et Gestion de Compte** : Authentification sécurisée et cycle de vie client isolé.
* **Moteur de Dispatching** : Demande de course optimisée avec routage vers les conducteurs du segment réseau le plus proche.
* **Suivi de Transit** : Suivi dynamique des états de la course (EN_ATTENTE, ACCEPTEE, TERMINEE).
* **Registre de Facturation** : Historique complet des déplacements et des reçus financiers associés.
* **Système d'Évaluation** : Matrice d'analyse de la qualité de service avec notation des conducteurs.

### Espace Chauffeur (Driver Operations)
* **Console d'Activité** : Commutateur de disponibilité et gestion de l'état opérationnel sur le réseau de transit.
* **Conformité Administrative** : Tunnel de téléversement et de vérification des pièces justificatives obligatoires.
* **Gestion des Flux Financiers** : Suivi en direct des revenus, gestion du solde de crédits de la plateforme et historique des transactions.
* **Routage Métier** : Interface de capture, d'acceptation et de complétion des ordres de transit.

### Espace Super-Administrateur (Control Tower Dashboard)
* **Dashboard KPI Centralisé** : Télémétrie en temps réel du volume de transactions, du taux d'activité des chauffeurs et du taux de complétion des courses[cite: 2, 3, 4].
* **Gestion des Comptes et Rôles** : Contrôle total des profils utilisateurs pour les chauffeurs et les passagers.
* **Audit de Conformité** : Module d'approbation et de pré-validation des dossiers administratifs des chauffeurs.
* **Registre d'Exploitation** : Supervision globale de l'intégralité des courses et des flux monétaires du réseau[cite: 2, 3, 4].

## Architecture Technique et Stack

| Domaine | Technologie | Spécification / Rôle |
| :--- | :--- | :--- |
| Backend Framework | Spring Boot 3.x | Core Engine, API RESTful sans état (Stateless) |
| Langage Core | Java 17 | Programmation orientée objet, Typage strict, Performances accrues |
| Sécurité & Accès | Spring Security + JWT | Chiffrement de bout en bout, Authentification par jetons signés |
| Persistance | MySQL 8.x | Base de données relationnelle hautement normalisée (3NF) |
| ORM / Data | Hibernate / JPA | Couche d'abstraction de données et d'intégrité relationnelle[cite: 2, 3] |
| Frontend Framework | Angular 17 Standalone | Interface Single Page Application (SPA), Composants isolés[cite: 2, 3] |
| Documentation | Swagger OpenAPI 3.0 | Spécification, test et documentation des endpoints REST[cite: 2, 3] |
| Gestion de Code | Git / GitHub | Gestionnaire de versions distribué[cite: 2, 3] |

## Organisation de l'Écosystème

```text
DriveMe/
├── backend/            # Code source de l'API Spring Boot 3
│   └── DriveMe-Spring/ # Logique métier, Security, Entities, Controllers, DTOs
├── frontend/           # Application Single Page Application Angular 17
│   └── src/            # Core, Layouts, Features (Dashboard, Auth, Course)
├── sql/                # Scripts d'initialisation et structures DDL de la base de données
├── docs/               # Architecture logicielle, diagrammes de séquence et spécifications
└── README.md           # Documentation maîtresse du projet

### Sécurité, Conformité et Gestion des Risques

La plateforme DriveMe applique le paradigme du Security by Design et intègre des contre-mesures strictes pour couvrir les failles majeures du OWASP Top 10 :

* **Authentification sans état (Stateless JWT)** : Aucun état de session n'est stocké côté serveur. Chaque transaction HTTP est authentifiée via un jeton signé de manière cryptographique et vérifié par un filtre Spring Security[cite: 2, 3].
* **Contrôle d'Accès basé sur les Rôles (RBAC)** : Les routes de l'API sont protégées au niveau méthode via l'annotation `@PreAuthorize(hasRole(...))`, empêchant toute faille de type IDOR ou escalade de privilèges.
* **Chiffrement des Données Sensibles** : Aucun mot de passe ne réside en clair en base de données[cite: 2, 3]. L'application utilise l'algorithme de hachage BCrypt associé à un sel adaptatif pour interdire les attaques par force brute ou tables de correspondance.
* **Conformité de Confidentialité** : Traçabilité du traitement, isolation complète des données personnelles, horodatage automatisé via hooks `@PrePersist` et chiffrement des métadonnées de conformité téléversées par les chauffeurs[cite: 2, 3].

### Feuille de Route d'Ingénierie (Roadmap)

#### Étape 1 : Noyau Fonctionnel (Opérationnel)
- [x] Architecture API Restful découplée[cite: 2, 3]
- [x] Authentification centralisée JWT et contrôle RBAC[cite: 2, 3]
- [x] Dashboard d'administration centralisé avec télémétrie des KPI[cite: 2, 3, 4]
- [x] Registre de gestion et d'approbation rapide des conducteurs partenaires[cite: 2, 3]
- [x] Persistance MySQL normalisée avec mapping relationnel strict[cite: 2, 3]

#### Étape 2 : Extensions Métiers (En cours de déploiement)
- [ ] Moteur d'estimation de prix dynamique et calcul d'itinéraires[cite: 2, 3]
- [ ] Passerelles de paiements locales (CIH Pay) et internationales[cite: 2, 3, 4]
- [ ] Système d'architecture multilingue natif (Français, Anglais, Arabe avec support RTL complet)[cite: 2, 3]
- [ ] Composant de validation pour les certificats de transport et reçus de paiement[cite: 2, 3, 4]

#### Étape 3 : Hybridation et Distribution Mobile
- [ ] Configuration de l'application en PWA (Progressive Web App) installable[cite: 2, 3]
- [ ] Compilation en application native Android (APK) et iOS via Capacitor[cite: 2, 3]
- [ ] Déploiement avec serveur proxy inverse Nginx et SSL Let's Encrypt

### Équipe d'Ingénierie et Direction Technique

* Youssef Qarnouf - Lead Frontend Architect et Product Owner[cite: 2, 3]
* Site Internet : [https://driveme.ma](https://driveme.ma)
* API Endpoints : [https://api.driveme.ma](https://api.driveme.ma)

### Licence et Propriété Intellectuelle

DriveMe Platform © 2026. Tous droits réservés.  
Ce logiciel et sa documentation associée sont la propriété exclusive de DriveMe Mobility Platform. Toute reproduction, distribution ou modification non autorisée de ce code source est strictement interdite.