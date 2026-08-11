# Corrections prépublication — 11 août 2026

Base contrôlée : `main` / commit `15f6118`.

## Corrections intégrées

- tri décroissant des chauffeurs, passagers, courses, paiements, recharges et incidents SOS ;
- libellés humains et multilingues pour les statuts des courses ;
- ergonomie responsive du formulaire de proposition chauffeur ;
- Pack Essentiel à 200 MAD en remplacement du pack à 100 MAD ;
- contrôle serveur aligné sur les packs 200/200, 250/275 et 500/600 ;
- dates du portefeuille affichées au format `jj/mm/aaaa à hh:mm` ;
- libellé de commission corrigé en « débitée » ;
- README aligné avec la production OVH, `driveme.cloud` et `api.driveme.cloud`.

## Validation

- build Angular de production : succès ;
- compilation Maven à relancer sur le PC Windows ou via Docker, l’environnement de contrôle n’ayant pas accès au dépôt Maven Central ;
- recette fonctionnelle complète à rejouer localement avant commit, push et déploiement VPS.

## Sécurité de la livraison

Le ZIP final exclut `.env`, `node_modules`, `target`, `dist`, sauvegardes SQL et données téléversées. Le fichier `.env.example` est conservé.
