# RAPPORT DEVOPS — APPLICATION "MARKDOWN NOTES APP"

## Page de garde

**Établissement :** Formation / Module DevOps  
**Projet :** Réalisation d’une application full-stack orientée DevOps  
**Titre :** Markdown Notes App  
**Auteurs :** Nom1 – Nom2  
**Dépôt Git :** `YoussefElaatiki/Exam_Devops`  
**Répertoire du livrable :** `04-notes-app/`  
**Date :** 2026  
**Encadrant :** À compléter  

---

## Sommaire

1. Introduction  
2. Objectifs du projet  
3. Présentation fonctionnelle  
4. Architecture générale  
5. Architecture logicielle détaillée  
6. Mise en œuvre du backend  
7. Mise en œuvre du frontend  
8. Base de données et persistance  
9. Sécurité et authentification  
10. Stratégie Git  
11. Conteneurisation  
12. Orchestration locale avec Docker Compose  
13. Pipeline CI/CD  
14. Déploiement Kubernetes  
15. Tests et validation  
16. Difficultés rencontrées  
17. Répartition du travail  
18. Conclusion  
19. Annexes  

---

## 1. Introduction

Ce projet consiste à concevoir, structurer et documenter une application web complète de prise de notes au format Markdown.

L’objectif n’était pas seulement de produire une interface utilisateur et une API fonctionnelles, mais de proposer une démarche de type production intégrant les dimensions DevOps dès la conception.

Le livrable couvre donc plusieurs couches complémentaires : développement logiciel, sécurisation des flux, gestion de la base de données, tests automatisés, conteneurisation, intégration continue, livraison continue et préparation au déploiement Kubernetes.

L’application réalisée permet à un utilisateur de s’inscrire, de se connecter, de créer des notes en Markdown, de les modifier, de les supprimer, de les rechercher et de les publier via un lien public.

Le projet a été organisé de manière à rester lisible, portable et facilement exécutable sur un poste de développement ou dans un environnement d’intégration continue.

---

## 2. Objectifs du projet

Les objectifs principaux étaient les suivants :

- développer une application full-stack moderne ;
- séparer clairement les responsabilités entre frontend, backend et base de données ;
- mettre en place une authentification sécurisée par JWT ;
- utiliser PostgreSQL comme moteur de persistance ;
- normaliser la configuration via des variables d’environnement ;
- fournir des conteneurs Docker adaptés à un usage réaliste ;
- orchestrer localement l’ensemble de la pile avec Docker Compose ;
- automatiser les tests et la construction dans GitHub Actions ;
- préparer un déploiement Kubernetes documenté et cohérent ;
- produire une documentation de projet claire et exploitable.

Au-delà de l’aspect technique, le projet vise également à illustrer une chaîne DevOps complète, depuis l’écriture du code jusqu’à son exécution dans un environnement conteneurisé.

---

## 3. Présentation fonctionnelle

L’application "Markdown Notes App" répond à un besoin simple mais représentatif : centraliser des notes personnelles dans un environnement web moderne.

### 3.1 Fonctionnalités principales

Les fonctionnalités implémentées sont :

- inscription d’un nouvel utilisateur ;
- connexion d’un utilisateur existant ;
- récupération du profil connecté ;
- création d’une note ;
- modification d’une note ;
- suppression d’une note ;
- recherche textuelle dans les notes ;
- filtrage par tags ;
- visualisation en temps réel du rendu Markdown ;
- publication optionnelle d’une note par lien public ;
- distinction de rôle entre utilisateur standard et administrateur.

### 3.2 Valeur pédagogique

Ce cas d’usage est particulièrement intéressant dans un examen DevOps, car il mobilise des concepts transverses :

- API REST ;
- ORM et schéma relationnel ;
- interface SPA ;
- authentification ;
- reverse proxy web ;
- pipelines de build ;
- images conteneurisées ;
- déploiement déclaratif.

---

## 4. Architecture générale

L’architecture globale repose sur trois composants principaux :

1. **Frontend** : application React/Vite servie par Nginx.  
2. **Backend** : API Express en TypeScript exposant les routes métier.  
3. **Base de données** : PostgreSQL 16 pour stocker utilisateurs et notes.  

Ces composants communiquent de la manière suivante :

- le navigateur appelle le frontend ;
- le frontend consomme l’API backend via HTTP ;
- le backend utilise Prisma pour communiquer avec PostgreSQL ;
- le backend gère l’authentification et les autorisations ;
- Docker Compose orchestre les trois services en local.

Cette séparation favorise la maintenabilité, le découplage des responsabilités et la possibilité de faire évoluer chaque bloc indépendamment.

---

## 5. Architecture logicielle détaillée

### 5.1 Structure du backend

Le backend est organisé autour des dossiers suivants :

- `src/routes/` pour les routes métier ;
- `src/middleware/` pour l’authentification et la gestion d’erreurs ;
- `src/schemas/` pour la validation des entrées avec Zod ;
- `src/tests/` pour les tests Vitest/Supertest ;
- `prisma/` pour le schéma de base de données et le seeding.

### 5.2 Structure du frontend

Le frontend est organisé autour de :

- `src/pages/` pour les pages applicatives ;
- `src/components/` pour les composants réutilisables ;
- `src/hooks/` pour la logique de récupération et d’état ;
- `src/store/` pour l’état global d’authentification avec Zustand ;
- `src/api/` pour le client Axios ;
- `src/types/` pour les interfaces TypeScript.

### 5.3 Choix d’architecture

Les choix ont été guidés par les principes suivants :

- simplicité de lecture ;
- séparation claire entre logique métier et présentation ;
- typage fort ;
- réduction des couplages ;
- facilité de test ;
- compatibilité avec les workflows DevOps modernes.

---

## 6. Mise en œuvre du backend

### 6.1 Technologies backend

Le backend repose sur :

- Node.js 20 ;
- Express ;
- TypeScript ;
- Prisma ;
- Zod ;
- bcryptjs ;
- jsonwebtoken.

### 6.2 Endpoints exposés

Les routes d’authentification sont :

- `POST /api/auth/register` ;
- `POST /api/auth/login` ;
- `GET /api/auth/me`.

Les routes liées aux notes sont :

- `GET /api/notes` ;
- `POST /api/notes` ;
- `GET /api/notes/:id` ;
- `PUT /api/notes/:id` ;
- `DELETE /api/notes/:id` ;
- `GET /api/notes/public/:slug`.

Une route de santé est également disponible :

- `GET /health`.

### 6.3 Validation des entrées

L’usage de Zod permet de rejeter proprement les données invalides avant toute opération métier.

Cela améliore :

- la robustesse de l’API ;
- la clarté des messages d’erreur ;
- la sécurité globale ;
- la maintenabilité du code.

### 6.4 Gestion des erreurs

Un middleware central de gestion d’erreurs uniformise les réponses côté serveur.

En environnement de production, il évite également d’exposer inutilement des détails internes.

---

## 7. Mise en œuvre du frontend

### 7.1 Technologies frontend

Le frontend repose sur :

- React 18 ;
- Vite ;
- TypeScript ;
- Tailwind CSS ;
- React Router ;
- Axios ;
- Zustand ;
- React Markdown.

### 7.2 Parcours utilisateur

Le parcours principal est le suivant :

1. l’utilisateur arrive sur la page de connexion ;
2. il peut se connecter ou créer un compte ;
3. après authentification, il accède au tableau de bord ;
4. il peut créer, éditer, supprimer et rechercher ses notes ;
5. il peut basculer une note en mode public ;
6. il peut consulter une note publique via un lien dédié.

### 7.3 Expérience utilisateur

L’interface a été pensée pour être :

- simple ;
- lisible ;
- réactive ;
- mobile-friendly ;
- cohérente visuellement.

Le composant `NoteEditor` propose un mode édition, un mode aperçu et un mode partagé, ce qui améliore fortement l’ergonomie.

### 7.4 Correctif important

Le hook de debounce du tableau de bord a été corrigé pour utiliser `useEffect` plutôt qu’une approche incorrecte basée sur `useCallback`.

Cette correction garantit un comportement stable lors de la recherche dynamique.

---

## 8. Base de données et persistance

### 8.1 Modélisation

La base de données PostgreSQL contient principalement deux entités :

- `User` ;
- `Note`.

Un utilisateur peut posséder plusieurs notes.

Chaque note contient notamment :

- un titre ;
- un contenu Markdown ;
- une liste de tags ;
- un statut public/privé ;
- un slug public éventuel ;
- des dates de création et de mise à jour.

### 8.2 Prisma

Prisma joue ici plusieurs rôles :

- définir le schéma ;
- générer le client de base de données ;
- faciliter les requêtes ;
- réduire le code SQL manuel ;
- améliorer le typage.

### 8.3 Seed de données

Un script de seeding crée :

- un compte administrateur ;
- un compte utilisateur standard ;
- plusieurs notes d’exemple.

Cette étape accélère les démonstrations et les validations fonctionnelles.

---

## 9. Sécurité et authentification

### 9.1 Authentification JWT

Le backend émet des jetons JWT lors de l’inscription et de la connexion.

Ces jetons contiennent notamment :

- l’identifiant utilisateur ;
- l’email ;
- le rôle.

Le frontend ajoute automatiquement ce jeton dans l’en-tête `Authorization` des requêtes protégées.

### 9.2 Hachage des mots de passe

Les mots de passe ne sont jamais stockés en clair.

Ils sont hachés avec `bcryptjs`, ce qui constitue une bonne pratique minimale pour un tel projet.

### 9.3 Contrôle d’accès

Un middleware d’authentification protège les routes privées.

Un second mécanisme permet de distinguer les rôles, notamment pour des usages futurs orientés administration.

### 9.4 Variables sensibles

Les éléments sensibles sont externalisés via :

- `.env.example` pour la documentation ;
- variables d’environnement réelles au runtime ;
- `Secret` Kubernetes pour les valeurs critiques.

---

## 10. Stratégie Git

### 10.1 Principes retenus

La stratégie Git recommandée pour ce projet est basée sur :

- une branche principale stable (`main`) ;
- des branches de travail dédiées aux fonctionnalités ;
- des commits courts mais explicites ;
- des pull requests pour revue et intégration.

### 10.2 Bénéfices

Cette stratégie permet :

- d’isoler les changements ;
- de faciliter la relecture ;
- de déclencher la CI sur chaque proposition ;
- de limiter les régressions ;
- de conserver un historique compréhensible.

### 10.3 Convention de commits proposée

Quelques exemples de messages adaptés :

- `feat: add notes CRUD API` ;
- `feat: add markdown editor UI` ;
- `chore: add docker compose stack` ;
- `ci: add GitHub Actions pipeline` ;
- `fix: correct dashboard debounce hook`.

---

## 11. Conteneurisation

### 11.1 Objectif

La conteneurisation permet de fournir un environnement d’exécution reproductible et cohérent entre les postes de développement, les environnements CI et les environnements de déploiement.

### 11.2 Image backend

L’image backend suit une approche multi-stage :

- une phase de build pour installer les dépendances et compiler TypeScript ;
- une phase finale plus légère pour l’exécution ;
- un utilisateur non root pour réduire les risques ;
- un entrypoint dédié au lancement des migrations.

### 11.3 Image frontend

Le frontend est :

- compilé avec Vite dans une étape de build ;
- servi par Nginx dans l’image finale ;
- configuré pour supporter le routage SPA ;
- optimisé pour les ressources statiques.

### 11.4 Bonnes pratiques appliquées

Les points positifs de la conteneurisation sont :

- séparation build/runtime ;
- images plus propres ;
- réduction de la surface d’attaque ;
- configuration par variables ;
- exposition de ports explicite.

---

## 12. Orchestration locale avec Docker Compose

Le fichier `docker-compose.yml` permet de lancer toute la plateforme avec une seule commande.

### 12.1 Services définis

- `postgres` ;
- `backend` ;
- `frontend`.

### 12.2 Mécanismes utiles

Le Compose mis en place inclut :

- un réseau dédié ;
- un volume persistant pour PostgreSQL ;
- un healthcheck sur la base ;
- une dépendance du backend vis-à-vis du service PostgreSQL ;
- une paramétrisation via `.env`.

### 12.3 Intérêt pédagogique

Docker Compose sert ici de socle d’intégration locale.

Il permet de valider rapidement que l’ensemble du système fonctionne de bout en bout avant tout passage en CI ou en cluster.

---

## 13. Pipeline CI/CD

### 13.1 Objectifs du pipeline

Le pipeline GitHub Actions a pour rôle de :

- vérifier la qualité minimale du code ;
- exécuter les tests backend ;
- construire le frontend ;
- construire les images Docker ;
- publier les images sur GHCR en cas de push sur `main`.

### 13.2 Organisation des jobs

Le workflow contient trois grands jobs :

1. `lint-and-test` ;
2. `build-frontend` ;
3. `build-and-push`.

### 13.3 Déclencheurs

Le pipeline se déclenche sur :

- `push` vers `main` ;
- `pull_request` ciblant `main`.

### 13.4 Intérêt DevOps

Cette automatisation :

- réduit les erreurs manuelles ;
- fiabilise la chaîne de livraison ;
- détecte rapidement les régressions ;
- normalise les étapes de build ;
- prépare une industrialisation progressive.

---

## 14. Déploiement Kubernetes

### 14.1 Manifests fournis

Le dossier `k8s/` contient :

- `namespace.yaml` ;
- `configmap.yaml` ;
- `secret.yaml` ;
- `postgres-deployment.yaml` ;
- `backend-deployment.yaml` ;
- `frontend-deployment.yaml` ;
- `services.yaml`.

### 14.2 Ressources déployées

Le déploiement prévoit :

- un namespace dédié ;
- une configuration centralisée ;
- des secrets pour les données sensibles ;
- un déploiement PostgreSQL avec PVC ;
- un déploiement backend répliqué ;
- un déploiement frontend répliqué ;
- des services de type `ClusterIP` et `NodePort`.

### 14.3 Résilience minimale

Les éléments suivants renforcent la robustesse :

- probes de liveness et readiness sur le backend ;
- réplicas multiples pour les couches applicatives ;
- ressources CPU/mémoire déclarées ;
- séparation des responsabilités entre composants.

### 14.4 Limites connues

Pour un véritable environnement de production, il faudrait encore envisager :

- un ingress contrôleur ;
- TLS ;
- un stockage managé ou plus robuste ;
- une stratégie de sauvegarde ;
- des secrets chiffrés ;
- une supervision ;
- une journalisation centralisée.

---

## 15. Tests et validation

### 15.1 Tests backend

Les tests backend couvrent plusieurs cas représentatifs :

- validation des entrées ;
- inscription utilisateur ;
- refus de doublons ;
- refus d’identifiants invalides ;
- accès protégé sans jeton ;
- accès public à une note publiée ;
- endpoint de santé.

### 15.2 Philosophie de test

Le choix de tests Vitest + Supertest permet de tester le comportement HTTP sans devoir dépendre entièrement d’une base réelle pour les scénarios unitaires.

Des mocks Prisma sont utilisés pour isoler les routes.

### 15.3 Vérification de la structure

La structure finale du dépôt a été organisée pour correspondre aux exigences demandées.

Chaque fichier clé nécessaire à l’exécution, à la documentation et au déploiement a été créé.

---

## 16. Difficultés rencontrées

### 16.1 Volume du livrable

Le premier défi a été l’ampleur du périmètre.

Le projet ne demandait pas seulement une application, mais également tout son écosystème DevOps.

### 16.2 Cohérence inter-couches

Il a fallu s’assurer que :

- les URL d’API étaient cohérentes ;
- les ports correspondaient entre fichiers ;
- les variables d’environnement restaient homogènes ;
- les images Docker reflétaient bien la structure du code ;
- les manifests Kubernetes restaient compatibles avec la logique applicative.

### 16.3 Qualité du frontend

Le frontend impose une attention particulière à :

- la gestion d’état ;
- la navigation ;
- les formulaires ;
- les interactions utilisateur ;
- la synchronisation avec l’API.

### 16.4 Gestion des détails techniques

Des détails apparemment mineurs peuvent bloquer la qualité globale, par exemple :

- un hook de debounce incorrect ;
- une configuration Nginx manquante pour une SPA ;
- une mauvaise gestion du token ;
- une absence de healthcheck ;
- un schéma de base non aligné avec l’API.

Ces points montrent qu’un travail DevOps sérieux exige une attention permanente aux interfaces entre les composants.

---

## 17. Répartition du travail

### 17.1 Proposition de répartition

Une répartition logique du travail entre deux membres peut être la suivante :

**Nom1**

- conception du backend ;
- modélisation Prisma ;
- sécurisation JWT ;
- tests backend ;
- conteneurisation API ;
- configuration Docker Compose.

**Nom2**

- conception du frontend ;
- composants React ;
- store Zustand ;
- pages et navigation ;
- configuration Nginx ;
- rédaction documentaire.

### 17.2 Travail commun

Les éléments suivants relèvent idéalement d’une validation conjointe :

- architecture globale ;
- conventions de nommage ;
- variables d’environnement ;
- pipeline CI/CD ;
- Kubernetes ;
- README ;
- démonstration finale.

### 17.3 Importance de la coordination

Dans un projet DevOps, la coordination est essentielle car une erreur entre couches peut invalider toute la chaîne de livraison.

Le partage régulier des décisions techniques limite ce risque.

---

## 18. Conclusion

Ce projet démontre qu’il est possible de construire une application web cohérente tout en intégrant les réflexes DevOps dès le départ.

La solution produite ne se limite pas à une simple interface ou à une simple API.

Elle inclut :

- une architecture claire ;
- une base de données structurée ;
- une authentification sécurisée ;
- une expérience utilisateur moderne ;
- une conteneurisation exploitable ;
- une chaîne CI/CD ;
- des manifests Kubernetes ;
- une documentation complète.

En contexte pédagogique, ce projet illustre bien la continuité entre développement logiciel et exploitation.

Il met en évidence la valeur de l’automatisation, de la standardisation et de la reproductibilité.

Les améliorations futures pourraient concerner :

- l’ajout de tests end-to-end ;
- la supervision applicative ;
- la gestion avancée des secrets ;
- une observabilité complète ;
- un déploiement cloud managé.

Malgré ces perspectives d’évolution, le livrable actuel constitue déjà une base solide, professionnelle et démontrable.

---

## 19. Annexes

### Annexe A — Comptes de démonstration

- Administrateur : `admin@notes.app` / `admin123`  
- Utilisateur : `user@notes.app` / `user123`  

### Annexe B — Commandes utiles

```bash
cd 04-notes-app
cp .env.example .env
docker compose up --build
```

```bash
cd 04-notes-app/backend
npm install
npx prisma generate
npm test
```

```bash
kubectl apply -f 04-notes-app/k8s/
kubectl get all -n notes-app
```

### Annexe C — Variables d’environnement principales

- `DATABASE_URL` : chaîne de connexion PostgreSQL  
- `JWT_SECRET` : secret de signature des jetons  
- `PORT` : port d’écoute du backend  
- `CORS_ORIGIN` : origine autorisée pour le frontend  
- `VITE_API_URL` : URL de l’API côté frontend  

### Annexe D — Arborescence synthétique

```text
04-notes-app/
├── backend/
├── frontend/
├── k8s/
├── docker-compose.yml
└── .env.example
```

### Annexe E — Résumé exécutif

Le projet fournit une application de notes Markdown complète, une API sécurisée, une persistance PostgreSQL, une exécution Docker Compose, une pipeline CI/CD GitHub Actions et une préparation au déploiement Kubernetes.

Il répond ainsi à un besoin technique et pédagogique cohérent avec une démarche DevOps moderne.
