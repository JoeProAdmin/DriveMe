# Politique de sécurité DriveMe

## Signaler une vulnérabilité

Ne publiez pas de vulnérabilité, de secret, de donnée personnelle ou de procédure d’exploitation dans une issue, une discussion ou une pull request publique.

Signalez le problème à Youssef Qarnouf par un canal privé en indiquant :

- la zone concernée ;
- les conditions de reproduction ;
- l’impact potentiel ;
- les éléments utiles, sans joindre de données personnelles réelles.

Un canal privé de signalement sera renseigné dans les paramètres GitHub avant l’ouverture publique du dépôt.

## Périmètre pris en charge

La branche et la version actuellement présentées pour l’évaluation sont prises en charge. Les anciennes archives, forks non officiels, copies modifiées et déploiements tiers ne le sont pas.

## Règles de divulgation

Merci de laisser à l’auteur un délai raisonnable pour analyser et corriger le problème avant toute divulgation. L’absence de réponse ne constitue pas une autorisation de publier des secrets, des données personnelles ou du code d’exploitation.

## Secrets et données personnelles

Le dépôt ne doit contenir aucun :

- mot de passe ou secret JWT de production ;
- fichier `.env` réel ;
- jeton, clé API, clé privée ou certificat privé ;
- sauvegarde de base contenant des données réelles ;
- pièce d’identité, permis, carte grise ou document chauffeur réel ;
- identifiant du véritable administrateur maître.

Si un secret est découvert dans l’historique Git, il doit être considéré comme compromis, révoqué et remplacé, puis retiré de l’historique avant publication.
