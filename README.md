# DriveMe

Plateforme web et PWA de mobilité conçue pour le marché marocain. DriveMe met en relation des passagers avec des chauffeurs et professionnels du transport, permet de publier une demande de trajet, de comparer les propositions reçues et de sélectionner librement une offre avant le départ.

> Travail de Fin d’Études - ICC Bruxelles - année académique 2025-2026
> Copyright © 2025-2026 Youssef Qarnouf. Tous droits réservés.

## Version de référence

Version stable actuelle :

```text
DriveMe V10.2.1
Commit : d45b8f3
Tag : v10.2.1-mobile-admin-ux-production-stable
Date de référence : 15 août 2026
```

Cette version comprend notamment :

* les parcours Passager, Chauffeur et Administrateur ;
* la typologie professionnelle des chauffeurs ;
* la validation administrative et documentaire ;
* le choix du service par le passager ;
* le portefeuille chauffeur et les commissions ;
* l’interface responsive ;
* l’optimisation mobile des tableaux de bord ;
* la navigation mobile de la page d’accueil ;
* le socle PWA installable et hors ligne ;
* les pages publiques et juridiques en quatre langues.

## Accès

* Application : https://driveme.cloud
* API : https://api.driveme.cloud
* Environnement local : `http://localhost:8081`
* Swagger local : `http://localhost:8080/swagger-ui/index.html`

La disponibilité publique dépend de l’état du VPS et des services de production. Les identifiants de démonstration sont communiqués au jury séparément et ne sont jamais publiés dans ce dépôt.

## Positionnement

DriveMe est une plateforme technologique de mise en relation. Elle ne délivre aucune licence, autorisation administrative ou agrément de transport.

La vérification documentaire réalisée par DriveMe ne remplace pas les autorisations éventuellement exigées par les autorités compétentes. Chaque chauffeur ou professionnel reste responsable de la validité de ses permis, assurances, documents et autorisations.

Les textes juridiques du projet constituent un cadrage académique et doivent être validés par un professionnel du droit marocain avant toute exploitation commerciale à grande échelle.

## Profils utilisateurs

### Passager

Le passager peut :

* créer et gérer son compte ;
* demander une course ;
* préciser le trajet, la date, l’heure et le nombre de passagers ;
* sélectionner une catégorie de service ;
* recevoir et comparer les propositions des chauffeurs ;
* accepter une offre ;
* suivre le cycle de la course ;
* consulter ses paiements ;
* évaluer le chauffeur après une course ;
* utiliser les fonctions d’assistance et SOS.

### Chauffeur

Le chauffeur peut :

* choisir sa catégorie professionnelle ;
* compléter son profil et les informations de son véhicule ;
* transmettre les documents nécessaires ;
* suivre la validation de son dossier ;
* activer sa disponibilité après validation ;
* consulter les demandes compatibles avec son profil ;
* proposer un tarif ;
* gérer les courses acceptées ;
* consulter son portefeuille ;
* demander une recharge ;
* consulter les commissions et transactions ;
* suivre sa note moyenne et son activité.

### Administrateur

L’administrateur peut :

* consulter les tableaux de bord et statistiques ;
* gérer les chauffeurs et passagers ;
* examiner les dossiers chauffeur ;
* consulter les documents de manière sécurisée ;
* accepter ou refuser chaque document ;
* valider ou suspendre un chauffeur ;
* superviser les courses ;
* suivre les paiements, recharges et commissions ;
* gérer les incidents SOS ;
* contrôler l’activité générale de la plateforme.

## Catégories de chauffeurs

DriveMe distingue trois catégories :

* `TAXI_OFFICIEL`
* `TRANSPORTEUR_TOURISTIQUE`
* `CHAUFFEUR_PRIVE`

Les documents demandés sont adaptés à la catégorie sélectionnée.

Documents communs :

* pièce d’identité ;
* permis de conduire ;
* carte grise ;
* assurance ;
* photographie ou selfie de contrôle.

Documents professionnels complémentaires :

* licence ou justificatif taxi ;
* agrément de transport touristique ;
* justificatif d’activité professionnelle.

Les documents réels ne doivent jamais être enregistrés dans Git ou publiés sur GitHub.

## Cycle principal d’une course

```text
Demande du passager
→ recherche des chauffeurs compatibles
→ proposition tarifaire
→ comparaison des offres
→ acceptation d’une offre
→ prise en charge
→ course en cours
→ course terminée
→ paiement et commission
→ avis du passager
```

Les transitions sont contrôlées par le backend afin d’éviter les changements de statut incohérents.

## Portefeuille chauffeur

Le système comprend :

* bonus de bienvenue après validation du dossier ;
* solde prépayé ;
* demandes de recharge ;
* packs de recharge ;
* historique des transactions ;
* débit de la commission après une course terminée ;
* suivi administratif des recharges et commissions.

Les paiements externes restent simulés dans la version académique. Une passerelle de paiement certifiée devra être intégrée et validée avant une exploitation commerciale réelle.

## Interface et PWA

DriveMe est optimisé pour :

* ordinateur ;
* tablette ;
* smartphone ;
* affichage responsive ;
* installation comme Progressive Web App ;
* Service Worker Angular ;
* cache des ressources essentielles ;
* navigation hors ligne limitée au socle prévu ;
* français, anglais, arabe et espagnol ;
* affichage RTL pour l’arabe.

Une PWA ne remplace pas automatiquement une application mobile native. Les fonctionnalités dépendant du réseau ou de l’API restent indisponibles lorsque le serveur n’est pas accessible.

## Architecture technique

| Couche            | Technologies                                                 |
| ----------------- | ------------------------------------------------------------ |
| Backend           | Java 17, Spring Boot 3.2.5, Spring Security, Spring Data JPA |
| Sécurité          | JWT, BCrypt, contrôle des rôles                              |
| Frontend          | Angular 21, TypeScript, RxJS                                 |
| Base de données   | MySQL 8.4                                                    |
| Migrations        | Flyway                                                       |
| Conteneurisation  | Docker Compose                                               |
| Serveur frontend  | Nginx                                                        |
| Documentation API | Swagger / OpenAPI                                            |
| Production        | VPS OVH, Nginx reverse proxy, HTTPS                          |
| Versionnement     | Git et GitHub                                                |

## Organisation du projet

```text
DriveMe/
├── backend/                     API Spring Boot
│   └── src/main/resources/
│       └── db/migration/        Migrations Flyway
├── frontend/                    Application Angular et PWA
├── docker/                      Configuration technique MySQL
├── sql/                         Scripts historiques contrôlés
├── docker-compose.yml
├── .env.example                 Modèle sans secret
├── README.md
├── SECURITY.md
└── LICENSE.txt
```

## Migrations Flyway

Les migrations sont conservées dans :

```text
backend/src/main/resources/db/migration
```

État actuel :

| Migration | Objet                                      |
| --------- | ------------------------------------------ |
| V1        | Schéma initial                             |
| V2        | Alignement du schéma de production         |
| V3        | Dossier et documents chauffeur             |
| V4        | Incidents SOS                              |
| V5        | Correction du statut SOS                   |
| V6        | Contact et acceptation des conditions      |
| V7        | Portefeuille chauffeur et commissions      |
| V8        | Réparation de l’historique du portefeuille |
| V9        | Typologie des chauffeurs                   |
| V10       | Choix du service passager                  |
| V11       | Documents professionnels chauffeur         |

Une migration déjà appliquée ne doit jamais être modifiée rétroactivement. Toute évolution supplémentaire doit utiliser une nouvelle version.

## Prérequis locaux

* Windows 10 ou Windows 11 ;
* Docker Desktop ;
* WSL 2 ;
* Git ;
* PowerShell 7 ;
* IntelliJ IDEA, facultatif pour le démarrage Docker ;
* ports `8080` et `8081` disponibles.

Java, Maven, Node.js, Angular CLI, MySQL et Nginx sont fournis par les images Docker pour l’exécution conteneurisée.

## Configuration locale

Créer le fichier local d’environnement :

```powershell
Copy-Item .env.example .env
```

Renseigner les valeurs nécessaires uniquement dans `.env`.

Le fichier `.env` :

* est ignoré par Git ;
* ne doit jamais être commité ;
* ne doit jamais être envoyé au jury ;
* ne doit jamais être incorporé dans un ZIP public ;
* ne doit contenir aucun secret réutilisé ailleurs.

## Démarrage quotidien

### 1. Ouvrir Docker Desktop

Attendre l’indication :

```text
Engine running
```

### 2. Ouvrir le projet

```powershell
Set-Location "C:\Projets\DriveMe"
```

### 3. Contrôler Git

```powershell
git status --short
git status -sb
git log -1 --oneline
```

Le développement ne doit pas démarrer si des modifications inexpliquées sont présentes.

### 4. Vérifier Docker Compose

```powershell
docker compose config --quiet
```

L’absence de message confirme que la configuration est valide.

### 5. Démarrer les services

```powershell
docker compose up -d
```

Cette commande démarre ou recrée si nécessaire :

* MySQL ;
* le backend Spring Boot ;
* le frontend Angular servi par Nginx.

### 6. Vérifier les services

```powershell
docker compose ps
```

État attendu :

* `database` : `healthy` ;
* `backend` : `Up` ;
* `frontend` : `Up`.

### 7. Vérifier les journaux

```powershell
docker compose logs backend --tail=120
docker compose logs frontend --tail=60
```

### 8. Ouvrir l’application

```text
http://localhost:8081
```

En cas d’ancien cache PWA, utiliser `Ctrl + F5`.

Swagger :

```text
http://localhost:8080/swagger-ui/index.html
```

## Reconstruction après modification

Après une modification du code, reconstruire uniquement le service concerné lorsque cela est possible.

Backend :

```powershell
docker compose up -d --build backend
```

Frontend :

```powershell
docker compose up -d --build frontend
```

Reconstruction complète :

```powershell
docker compose up -d --build
```

Une reconstruction complète n’est pas nécessaire pour un redémarrage quotidien normal.

## Arrêt propre

Depuis `C:\Projets\DriveMe` :

```powershell
docker compose down
```

Cette commande arrête les conteneurs sans supprimer volontairement les données persistantes.

Ne pas utiliser :

```powershell
docker compose down -v
```

sauf si la suppression définitive des volumes et des données locales est explicitement souhaitée et sauvegardée.

Après l’arrêt :

1. vérifier que les conteneurs DriveMe sont arrêtés ;
2. fermer proprement IntelliJ avec `File > Exit` ;
3. quitter Docker Desktop si aucun autre projet ne l’utilise.

## Contrôles avant commit

```powershell
git status --short
git diff
git diff --check
```

Après compilation et recette :

```powershell
git add <fichiers-validés>
git status --short
git commit -m "Description claire du bloc validé"
git push
```

Les commits doivent rester réguliers, cohérents et compréhensibles pour le jury.

Les commandes destructives, les réécritures d’historique et les `push --force` sont interdits sans contrôle préalable.

## Sécurité

Le dépôt ne doit contenir aucun :

* fichier `.env` réel ;
* mot de passe ;
* secret JWT ;
* jeton ou clé API privée ;
* certificat privé ;
* sauvegarde de base contenant des données réelles ;
* document chauffeur réel ;
* véritable compte administrateur ;
* donnée personnelle de production.

Un secret supprimé du dernier commit peut rester accessible dans l’historique Git. Tout secret anciennement exposé doit être considéré comme compromis, révoqué et remplacé.

Consultez [SECURITY.md](SECURITY.md) pour la politique de signalement.

## Publication GitHub et jury

GitHub constitue :

* la sauvegarde régulière du code ;
* la preuve chronologique du développement ;
* la présentation technique au jury ;
* un point de restauration ;
* une démonstration de la maîtrise de Git.

Avant toute publication publique :

* analyser l’historique complet ;
* contrôler les anciens fichiers SQL ;
* rechercher les secrets ;
* retirer les données personnelles ;
* utiliser uniquement des comptes fictifs ;
* vérifier les licences tierces ;
* activer les protections GitHub disponibles ;
* suivre [GIT_PUBLICATION_CHECKLIST.md](GIT_PUBLICATION_CHECKLIST.md).

## Limites connues et feuille de route

Éléments non finalisés ou nécessitant une intégration externe :

* paiement bancaire réel ;
* connexion Google ;
* connexion Apple ;
* authentification par QR Code ;
* notifications de production ;
* publication dans les boutiques mobiles ;
* badge pare-brise PDF avec QR Code de vérification ;
* validation juridique professionnelle avant lancement commercial ;
* audit final des dépendances et vulnérabilités ;
* automatisation complète des sauvegardes et restaurations.

Ces éléments ne doivent pas être présentés comme opérationnels tant qu’ils ne sont pas implémentés, testés et validés.

## Jalons Git principaux

| Jalon                      | Référence                                   |
| -------------------------- | ------------------------------------------- |
| Portefeuille V8            | `v8-production-stable`                      |
| Validation professionnelle | `v9-a-validation-chauffeurs-stable`         |
| Publication V9             | `v9-b-publication-ready-stable`             |
| Responsive mobile V10      | `v10-mobile-responsive-stable`              |
| UX mobile V10.1            | `v10.1-mobile-ux-production-stable`         |
| PWA V10.2                  | `v10.2-pwa-production-stable`               |
| UX mobile/Admin V10.2.1    | `v10.2.1-mobile-admin-ux-production-stable` |

## Licence et propriété intellectuelle

DriveMe est un projet propriétaire. Ce dépôt peut être rendu consultable pour :

* l’évaluation académique ;
* la démonstration du projet ;
* le portfolio professionnel de l’auteur.

Il ne s’agit pas d’un logiciel open source.

Aucun droit de copie, modification, redistribution, hébergement, publication, création d’œuvre dérivée ou exploitation commerciale n’est accordé sans autorisation écrite préalable.

Les bibliothèques tierces restent soumises à leurs licences respectives.

Consultez [LICENSE.txt](LICENSE.txt) pour les conditions complètes.

## Auteur

**Youssef Qarnouf**
Travail de Fin d’Études - ICC Bruxelles
Année académique 2025-2026
Projet : [DriveMe.cloud](https://driveme.cloud)
