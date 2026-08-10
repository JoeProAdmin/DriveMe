# Liste de contrôle avant publication publique

Date cible : avant le 15/08/2026.

## 1. État Git

- [ ] Branche de publication identifiée et synchronisée avec `origin`.
- [ ] Dépôt propre avant le début de l’audit.
- [ ] Tag stable conservé avant toute réécriture éventuelle de l’historique.
- [ ] Aucun fichier métier non validé ajouté au commit de documentation.

## 2. Secrets et données

- [ ] Historique complet analysé avec un scanner de secrets reconnu.
- [ ] `.env`, clés, jetons et certificats absents de toutes les révisions.
- [ ] Sauvegardes SQL historiques inspectées ou retirées de l’historique.
- [ ] Compte personnel de l’auteur absent du code, des scripts et des anciens commits.
- [ ] Emails, téléphones, adresses et documents réels absents.
- [ ] Tout secret anciennement exposé révoqué et remplacé.

## 3. Comptes du jury

- [ ] Administrateur de démonstration fictif créé et testé.
- [ ] Chauffeur de démonstration fictif créé et testé.
- [ ] Passager de démonstration fictif créé et testé.
- [ ] Aucun mot de passe réutilisé depuis un compte réel.
- [ ] Identifiants communiqués au jury par le canal convenu.
- [ ] Véritable administrateur maître réservé à la production et absent de Git.

## 4. Documentation et droits

- [ ] `README.md` conforme à l’état réel de la V9.
- [ ] `LICENSE.txt` propriétaire relu et présent à la racine.
- [ ] `SECURITY.md` présent.
- [ ] `.gitignore` renforcé.
- [ ] Licences des dépendances tierces respectées.
- [ ] Aucun logo, visuel ou texte tiers non autorisé.

## 5. Validation technique

- [ ] `git diff --check` sans erreur.
- [ ] Backend compilé et tests exécutés.
- [ ] Frontend compilé sans erreur.
- [ ] Docker Compose démarre les trois services.
- [ ] MySQL est `healthy`.
- [ ] Parcours passager, chauffeur et administrateur testés.
- [ ] FR / EN / AR / ES et RTL arabe contrôlés.
- [ ] Aucune donnée réelle visible dans Swagger, les logs ou l’interface.

## 6. Paramètres GitHub

- [ ] Branche principale et branche présentée clairement identifiées.
- [ ] Protection de branche activée si disponible.
- [ ] Secret scanning et push protection activés si disponibles.
- [ ] Dependabot alerts et security updates activés si disponibles.
- [ ] Adresse ou canal privé de sécurité configuré.
- [ ] Issues, Discussions et Wiki désactivés s’ils ne sont pas utiles.
- [ ] Description, site et sujets du dépôt complétés sans information sensible.

## 7. Publication

- [ ] Dernier clone/test réalisé depuis une copie propre.
- [ ] Commit de préparation publié et hash conservé.
- [ ] Visibilité changée en `Public` seulement après validation de tous les points.
- [ ] Page publique contrôlée immédiatement en navigation privée.
- [ ] URL publique transmise au jury.

## 8. Après publication

- [ ] Déploiement OVH réalisé avec des secrets injectés hors Git.
- [ ] DNS et HTTPS vérifiés.
- [ ] Sauvegardes chiffrées et procédure de restauration testées.
- [ ] Administrateur maître créé directement en production.
- [ ] Mot de passe initial remplacé et conservé dans un gestionnaire de mots de passe.
- [ ] Journaux et supervision configurés sans exposer de données sensibles.
