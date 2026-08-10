# DriveMe

Plateforme web de mobilité conçue pour le marché marocain, mettant en relation des passagers et des professionnels du transport. DriveMe permet de publier une demande de trajet, de comparer des propositions et de sélectionner librement une offre avant le départ.

> Projet de Travail de Fin d’Études — ICC Bruxelles — année académique 2025-2026
> Copyright © 2025-2026 Youssef Qarnouf. Tous droits réservés.

## Statut du projet

DriveMe est en phase de finalisation V9 avant déploiement sur l’infrastructure OVH et ouverture d’une version de démonstration.

- V8 stable : parcours passager, chauffeur et administration validés ;
- V9 juridique et stratégique : pages À propos, Conditions d’utilisation et Confidentialité finalisées en FR, EN, AR et ES ;
- V9 professionnelle : catégories de chauffeurs et choix du service passager intégrés ;
- environnement local de production : Docker Compose, MySQL, Spring Boot, Angular et Nginx opérationnels ;
- déploiement OVH, HTTPS, paiement réel et publication bêta : à finaliser.

Le domaine réservé pour le projet est `driveme.cloud`.

## Fonctionnalités principales

- authentification sécurisée par JWT et mots de passe hachés avec BCrypt ;
- rôles `ADMIN`, `CHAUFFEUR` et `PASSAGER` ;
- inscription et gestion des profils passagers et chauffeurs ;
- typologie professionnelle des chauffeurs ;
- vérification administrative et documentaire des chauffeurs ;
- création, proposition, acceptation et suivi des courses ;
- portefeuille prépayé chauffeur, recharges et commissions ;
- paiements simulés dans l’environnement académique ;
- avis, commentaires et calcul de la note moyenne ;
- assistance SOS et supervision administrative ;
- tableaux de bord passager, chauffeur et administration ;
- interface multilingue FR / EN / AR / ES, avec RTL en arabe.

## Architecture technique

| Couche | Technologies |
| --- | --- |
| Backend | Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA, Hibernate, Flyway |
| Frontend | Angular, TypeScript, HTML, SCSS/CSS, RxJS |
| Données | MySQL 8.4 |
| Exécution | Docker Compose, Nginx |
| Documentation | Swagger / OpenAPI |
| Versionnement | Git et GitHub |

Organisation principale :

```text
DriveMe/
├── backend/       API Spring Boot et migrations Flyway
├── frontend/      application Angular et configuration Nginx
├── docker/        initialisation technique MySQL
├── sql/           scripts techniques historiques
├── docker-compose.yml
└── .env.example   modèle sans secret
```

## Démarrage recommandé avec Docker

### Prérequis

- Docker Desktop avec Docker Compose ;
- Git ;
- ports locaux `8080` et `8081` disponibles.

### Configuration

Copier le modèle d’environnement sans modifier le fichier suivi par Git :

```powershell
Copy-Item .env.example .env
```

Renseigner uniquement le fichier local `.env`. Il est ignoré par Git et ne doit jamais être publié.

### Construction et démarrage

```powershell
docker compose up -d --build
docker compose ps
```

Accès local :

- application : `http://localhost:8081` ;
- API directe : `http://localhost:8080/api` ;
- Swagger : `http://localhost:8080/swagger-ui/index.html`.

Arrêt propre :

```powershell
docker compose down
```

Ne pas ajouter `-v` à cette commande sauf si la suppression volontaire des volumes et données locales est souhaitée.

## Comptes de démonstration du jury

Les comptes du jury doivent être exclusivement fictifs et créés dans la base de démonstration. Ils ne doivent partager aucune adresse, aucun téléphone ni aucun mot de passe avec un compte réel ou futur de production.

| Profil | Identifiant de démonstration | Mot de passe |
| --- | --- | --- |
| Administrateur | À renseigner après création et test | À communiquer au jury par le canal prévu |
| Chauffeur | À renseigner après création et test | À communiquer au jury par le canal prévu |
| Passager | À renseigner après création et test | À communiquer au jury par le canal prévu |

Le véritable administrateur maître de DriveMe sera créé uniquement dans la base de production après le déploiement. Ses identifiants, son hash BCrypt et ses secrets ne seront jamais enregistrés dans ce dépôt.

## Sécurité et données

- aucun fichier `.env` ni secret de production ne doit être versionné ;
- aucune clé privée, sauvegarde de base ou pièce d’identité ne doit être publiée ;
- les documents chauffeurs réels doivent être stockés hors du dépôt ;
- les données de démonstration doivent rester entièrement fictives ;
- toute clé exposée, même dans un ancien commit, doit être révoquée et remplacée ;
- les vulnérabilités doivent être signalées selon [SECURITY.md](SECURITY.md), jamais dans une issue publique.

Avant toute publication, l’historique Git complet doit être contrôlé. Le fait qu’un fichier soit aujourd’hui ignoré ou supprimé ne garantit pas son absence des anciens commits.

## Feuille de route

### Avant publication publique — au plus tard le 15/08/2026

- terminer l’audit des secrets, données personnelles et sauvegardes dans tout l’historique Git ;
- retirer ou anonymiser tout compte personnel et toute donnée réelle ;
- créer et tester les comptes fictifs du jury ;
- aligner la documentation, la licence propriétaire et la politique de sécurité ;
- compiler, lancer et tester les parcours critiques ;
- activer les protections GitHub disponibles ;
- publier le dépôt uniquement après validation de la liste de contrôle.

### Après sécurisation du dépôt

- finaliser la recette fonctionnelle V9 ;
- préparer l’infrastructure OVH et les variables de production ;
- configurer DNS, HTTPS, sauvegardes et supervision ;
- créer l’administrateur maître directement en production ;
- exécuter les tests de déploiement et de restauration ;
- préparer la version bêta et, le moment venu, la publication mobile.

## Limites de la version académique

Les paiements externes, notifications de production, services cartographiques définitifs et intégrations de boutique peuvent être simulés ou rester à configurer. Une vérification DriveMe ne constitue ni un agrément public ni une autorisation de transport. Chaque professionnel demeure responsable de ses permis, assurances, documents et autorisations applicables.

## Propriété intellectuelle et licence

Ce dépôt est rendu consultable uniquement pour l’évaluation académique, la démonstration du projet et la présentation professionnelle de son auteur. Il ne s’agit pas d’un logiciel open source.

Aucun droit de copie, modification, redistribution, hébergement, publication, création d’œuvre dérivée ou exploitation commerciale n’est accordé. La consultation du dépôt ne vaut ni cession de droits ni autorisation de réutilisation.

Les conditions complètes figurent dans [LICENSE.txt](LICENSE.txt).

## Auteur

Youssef Qarnouf
Travail de Fin d’Études — ICC Bruxelles
Année académique 2025-2026
