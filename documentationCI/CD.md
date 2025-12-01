# DOCUMENTATION TECHNIQUE - CI/CD PIPELINE

**Projet :** OnBoarding API  
**Certification :** Concepteur Développeur d'Applications (CDA)  
**Date :** Décembre 2024

---

## Table des matières

1. [Introduction](#1-introduction)
2. [Architecture du Pipeline CI/CD](#2-architecture-du-pipeline-cicd)
3. [Détail des Jobs](#3-détail-des-jobs)
4. [Gestion des Secrets](#4-gestion-des-secrets)
5. [Processus de Déploiement](#5-processus-de-déploiement)
6. [Monitoring et Rollback](#6-monitoring-et-rollback)
7. [Améliorations Futures](#7-améliorations-futures)

---

## 1. Introduction

### 1.1 Contexte

Dans le cadre du projet OnBoarding API, un pipeline CI/CD a été mis en place pour automatiser l'intégration, les tests et le déploiement de l'application. Ce système garantit la qualité du code et permet des déploiements rapides et fiables sur l'environnement de production.

Le projet OnBoarding API est une application NestJS avec une base de données PostgreSQL, intégrée à un bot Discord pour la gestion automatisée des promotions de formation.

### 1.2 Objectifs

Les objectifs principaux du pipeline CI/CD sont :

- **Automatiser l'exécution des tests** à chaque modification du code
- **Construire et versionner** automatiquement les images Docker
- **Déployer automatiquement** sur le VPS de production
- **Garantir la traçabilité** des déploiements via Git
- **Réduire les erreurs humaines** lors des déploiements
- **Accélérer le cycle de développement** grâce à l'automatisation

### 1.3 Technologies utilisées

| Technologie | Utilisation |
|-------------|-------------|
| **GitHub Actions** | Orchestration du pipeline CI/CD |
| **Docker & Docker Compose** | Containerisation de l'application |
| **GitHub Container Registry (GHCR)** | Stockage des images Docker |
| **PostgreSQL 16** | Base de données de production |
| **SSH/SCP** | Déploiement sur VPS distant |
| **Jest** | Framework de tests unitaires et d'intégration |

---

## 2. Architecture du Pipeline CI/CD

### 2.1 Vue d'ensemble

Le pipeline CI/CD est composé de trois jobs principaux qui s'exécutent séquentiellement :

```
┌─────────────┐
│   PUSH      │
│  sur main   │
│ ou develop  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         JOB 1 : TEST                │
│  - Installation des dépendances     │
│  - Exécution des tests unitaires    │
│  - Tests d'intégration avec DB      │
└──────────────┬──────────────────────┘
               │ (si succès)
               ▼
┌─────────────────────────────────────┐
│         JOB 2 : BUILD               │
│  - Connexion à GHCR                 │
│  - Construction de l'image Docker   │
│  - Push vers le registry            │
│  - Tagging (latest + SHA)           │
└──────────────┬──────────────────────┘
               │ (si main uniquement)
               ▼
┌─────────────────────────────────────┐
│         JOB 3 : DEPLOY              │
│  - Copie du docker-compose          │
│  - Configuration de l'environnement │
│  - Déploiement sur VPS              │
│  - Vérification du déploiement      │
└─────────────────────────────────────┘
```

### 2.2 Déclencheurs (Triggers)

Le pipeline se déclenche dans les cas suivants :

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

**Comportement par branche :**

| Branche | Test | Build | Deploy |
|---------|------|-------|--------|
| `main` (push) | ✅ | ✅ | ✅ |
| `develop` (push) | ✅ | ❌ | ❌ |
| Pull Request | ✅ | ❌ | ❌ |

### 2.3 Conditions d'exécution

Chaque job possède des conditions spécifiques :

- **Test** : S'exécute sur tous les pushs et PRs
- **Build** : S'exécute uniquement sur les pushs (pas les PRs)
- **Deploy** : S'exécute uniquement sur les pushs vers `main`

---

## 3. Détail des Jobs

### 3.1 Job TEST

#### 3.1.1 Objectif

Valider la qualité du code en exécutant l'ensemble des tests (unitaires et d'intégration) dans un environnement isolé.

#### 3.1.2 Configuration

```yaml
test:
  name: Run Tests
  runs-on: ubuntu-latest
  
  services:
    postgres:
      image: postgres:16-alpine
      env:
        POSTGRES_USER: admin
        POSTGRES_PASSWORD: admin
        POSTGRES_DB: onboarding_test
      ports:
        - 5432:5432
      options: >-
        --health-cmd pg_isready
        --health-interval 10s
        --health-timeout 5s
        --health-retries 5
```

#### 3.1.3 Étapes d'exécution

1. **Checkout du code** : Récupération du code source depuis le repository
2. **Setup Node.js** : Installation de Node.js v20 avec cache npm
3. **Installation des dépendances** : `npm ci` pour une installation reproductible
4. **Exécution des tests** : `npm test` avec connexion à PostgreSQL

#### 3.1.4 Service PostgreSQL

Un conteneur PostgreSQL temporaire est créé pour les tests d'intégration :

- **Image** : `postgres:16-alpine` (version légère)
- **Healthcheck** : Vérifie que la base est prête avant de lancer les tests
- **Isolation** : Base de données dédiée aux tests (`onboarding_test`)
- **Destruction** : Le conteneur est automatiquement supprimé après le job

#### 3.1.5 Avantages

- Tests exécutés dans un environnement propre à chaque run
- Détection précoce des régressions
- Base de données réelle pour les tests d'intégration
- Pas d'impact sur la base de production

### 3.2 Job BUILD

#### 3.2.1 Objectif

Construire une image Docker de l'application et la publier sur GitHub Container Registry (GHCR).

#### 3.2.2 Configuration

```yaml
build:
  name: Build and Push API Image
  runs-on: ubuntu-latest
  needs: [test]
  if: github.event_name == 'push'
  
  permissions:
    contents: read
    packages: write
```

#### 3.2.3 Stratégie de tagging

Le système utilise deux tags pour chaque image :

```yaml
tags: |
  type=raw,value=latest
  type=sha,prefix={{branch}}-
```

**Exemple concret :**
- Commit SHA : `a1b2c3d`
- Branche : `main`
- Tags générés :
  - `ghcr.io/exizygl/onboarding-api:latest`
  - `ghcr.io/exizygl/onboarding-api:main-a1b2c3d`

#### 3.2.4 Avantages du double tagging

| Tag | Usage | Avantage |
|-----|-------|----------|
| `latest` | Déploiement automatique | Toujours la dernière version stable |
| `{branch}-{sha}` | Rollback et traçabilité | Permet de revenir à une version précise |

#### 3.2.5 Permissions

Les permissions GitHub sont définies explicitement :

- `contents: read` : Lecture du code source
- `packages: write` : Écriture dans GHCR

### 3.3 Job DEPLOY

#### 3.3.1 Objectif

Déployer l'application sur le VPS de production en utilisant Docker Compose.

#### 3.3.2 Configuration

```yaml
deploy:
  name: Deploy API to VPS
  runs-on: ubuntu-latest
  needs: [build]
  if: github.ref == 'refs/heads/main'
```

#### 3.3.3 Étapes d'exécution

**Step 1 : Checkout du code**
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```
Récupère le code source pour accéder au fichier `docker-compose.prod.yml`.

**Step 2 : Copie du docker-compose sur le VPS**
```yaml
- name: Copy docker-compose to VPS
  uses: appleboy/scp-action@v0.1.7
  with:
    source: "docker-compose.prod.yml"
    target: "~/api/docker-compose.yml"
```

Copie le fichier de configuration Docker Compose via SCP :
- **Source** : `docker-compose.prod.yml` (versionné dans Git)
- **Destination** : `~/api/docker-compose.yml` (sur le VPS)
- **Avantage** : Configuration versionnée et testable localement

**Step 3 : Configuration et déploiement**

Le script SSH effectue les opérations suivantes :

1. **Création du fichier .env**
```bash
cat > .env << ENV_EOF
DB_NAME=${{ secrets.DB_NAME }}
DB_USER=${{ secrets.DB_USER }}
DB_PASSWORD=${{ secrets.DB_PASSWORD }}
GITHUB_REPOSITORY_LOWER=$(echo "${{ github.repository }}" | tr '[:upper:]' '[:lower:]')
ENV_EOF
```

2. **Arrêt des conteneurs existants**
```bash
docker compose down 2>/dev/null || true
```

3. **Connexion au registry**
```bash
echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
```

4. **Pull de la nouvelle image**
```bash
docker compose pull
```

5. **Démarrage des services**
```bash
docker compose up -d
```

6. **Nettoyage**
```bash
docker image prune -af
```

7. **Vérification**
```bash
docker ps
```

#### 3.3.4 Architecture du déploiement

```
┌─────────────────────────────────────┐
│           VPS (Ubuntu)              │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Docker Network (app-network)│ │
│  │                               │ │
│  │  ┌─────────────────────────┐ │ │
│  │  │  PostgreSQL Container   │ │ │
│  │  │  - Port: 5432           │ │ │
│  │  │  - Volume: postgres_data│ │ │
│  │  │  - Healthcheck actif    │ │ │
│  │  └──────────┬──────────────┘ │ │
│  │             │                │ │
│  │  ┌──────────▼──────────────┐ │ │
│  │  │  API Container          │ │ │
│  │  │  - Port: 3000           │ │ │
│  │  │  - depends_on: postgres │ │ │
│  │  │  - restart: always      │ │ │
│  │  └─────────────────────────┘ │ │
│  └───────────────────────────────┘ │
│                                     │
│  Volumes persistants :              │
│  └─ postgres_data                   │
└─────────────────────────────────────┘
```

---

## 4. Gestion des Secrets

### 4.1 Secrets GitHub utilisés

Les secrets suivants sont configurés dans GitHub Settings > Secrets :

| Secret | Description | Utilisation |
|--------|-------------|-------------|
| `VPS_HOST` | Adresse IP ou domaine du VPS | Connexion SSH |
| `VPS_USERNAME` | Nom d'utilisateur SSH | Connexion SSH |
| `VPS_SSH_KEY` | Clé privée SSH | Authentification |
| `VPS_PORT` | Port SSH (généralement 22) | Connexion SSH |
| `DB_NAME` | Nom de la base de données | Configuration PostgreSQL |
| `DB_USER` | Utilisateur de la base | Configuration PostgreSQL |
| `DB_PASSWORD` | Mot de passe de la base | Configuration PostgreSQL |
| `GITHUB_TOKEN` | Token d'accès GitHub | Accès à GHCR (auto-généré) |

### 4.2 Sécurité des secrets

**Bonnes pratiques appliquées :**

1. **Jamais de secrets en clair** dans le code source
2. **Rotation régulière** des mots de passe et clés SSH
3. **Principe du moindre privilège** : chaque secret a un usage spécifique
4. **Secrets au niveau repository** : non accessibles dans les forks
5. **Transmission sécurisée** : `--password-stdin` pour Docker login

### 4.3 Fichier .env sur le VPS

Le fichier `.env` est créé dynamiquement sur le VPS à chaque déploiement :

```bash
DB_NAME=onboarding_prod
DB_USER=api_user
DB_PASSWORD=***********
GITHUB_REPOSITORY_LOWER=exizygl/onboarding-api
```

**Caractéristiques :**
- Créé à chaque déploiement (pas versionné)
- Utilisé par Docker Compose pour l'interpolation des variables
- Permissions restrictives sur le VPS

---

## 5. Processus de Déploiement

### 5.1 Flux de déploiement complet

```
Développeur                GitHub Actions              VPS
    │                           │                       │
    │ 1. git push main          │                       │
    ├──────────────────────────>│                       │
    │                           │                       │
    │                      2. Tests                     │
    │                           │                       │
    │                      3. Build Image               │
    │                           │                       │
    │                      4. Push to GHCR              │
    │                           ├──────────────────────>│
    │                           │                       │
    │                      5. SSH Connection            │
    │                           ├──────────────────────>│
    │                           │                       │
    │                      6. Copy docker-compose       │
    │                           ├──────────────────────>│
    │                           │                       │
    │                           │              7. docker compose down
    │                           │              8. docker login ghcr.io
    │                           │              9. docker compose pull
    │                           │              10. docker compose up -d
    │                           │              11. docker image prune
    │                           │                       │
    │                           │              12. Verification
    │                           │<──────────────────────┤
    │                           │                       │
    │   13. Notification        │                       │
    │<──────────────────────────┤                       │
```

### 5.2 Temps de déploiement

Estimation des temps d'exécution :

| Phase | Durée moyenne | Description |
|-------|---------------|-------------|
| Tests | 2-3 minutes | Installation + exécution des tests |
| Build | 1-2 minutes | Construction de l'image Docker |
| Deploy | 1-2 minutes | Transfert et démarrage des conteneurs |
| **Total** | **4-7 minutes** | Du push à la production |

### 5.3 Stratégie de déploiement

Le système utilise une stratégie de **déploiement continu (CD)** :

- **Automatique sur main** : Chaque push sur `main` déclenche un déploiement
- **Zero-downtime** : `docker compose up -d` remplace les conteneurs en douceur
- **Healthcheck PostgreSQL** : L'API attend que la DB soit prête avant de démarrer

### 5.4 Gestion des versions

**Versioning des images Docker :**

```bash
# Tag latest (toujours la dernière version)
ghcr.io/exizygl/onboarding-api:latest

# Tags avec SHA (traçabilité)
ghcr.io/exizygl/onboarding-api:main-a1b2c3d
ghcr.io/exizygl/onboarding-api:main-b2c3d4e
ghcr.io/exizygl/onboarding-api:main-c3d4e5f
```

**Avantages :**
- Traçabilité complète : chaque déploiement est lié à un commit Git
- Rollback facile : possibilité de redéployer une version antérieure
- Audit : historique complet dans GHCR et GitHub Actions

---

## 6. Monitoring et Rollback

### 6.1 Monitoring du pipeline

**Indicateurs de succès :**

1. **Tests passés** ✅
   - Tous les tests unitaires et d'intégration réussissent
   - Aucune régression détectée

2. **Build réussi** ✅
   - Image Docker construite sans erreur
   - Image poussée sur GHCR avec succès

3. **Déploiement réussi** ✅
   - Conteneurs démarrés correctement
   - Healthcheck PostgreSQL OK
   - API accessible sur le port 3000

**Vérification post-déploiement :**

```bash
# Dans les logs GitHub Actions
docker ps
# Doit afficher :
# - onboarding-db (running)
# - onboarding-api (running)
```

### 6.2 Gestion des erreurs

**En cas d'échec :**

| Phase | Action automatique | Action manuelle requise |
|-------|-------------------|------------------------|
| Tests échouent | ❌ Build annulé | Corriger le code |
| Build échoue | ❌ Deploy annulé | Vérifier le Dockerfile |
| Deploy échoue | ❌ Rollback manuel | Vérifier logs VPS |

### 6.3 Procédure de Rollback

**Rollback automatique (via Git) :**

```bash
# 1. Identifier le dernier commit stable
git log --oneline

# 2. Revenir au commit stable
git revert <commit-sha>
git push origin main

# 3. Le pipeline redéploie automatiquement la version stable
```

**Rollback manuel (urgent) :**

```bash
# 1. Connexion SSH au VPS
ssh user@vps-host

# 2. Modifier docker-compose.yml pour utiliser une version spécifique
cd ~/api
nano docker-compose.yml

# Remplacer :
# image: ghcr.io/exizygl/onboarding-api:latest
# Par :
# image: ghcr.io/exizygl/onboarding-api:main-a1b2c3d

# 3. Redémarrer les conteneurs
docker compose pull
docker compose up -d
```

### 6.4 Logs et Debugging

**Consultation des logs :**

```bash
# Logs de l'API
docker logs onboarding-api -f

# Logs de PostgreSQL
docker logs onboarding-db -f

# Logs combinés
docker compose logs -f
```

**Points de vérification :**

1. **Connectivité base de données** : L'API peut-elle se connecter à PostgreSQL ?
2. **Variables d'environnement** : Les variables sont-elles correctement injectées ?
3. **Réseau Docker** : Les conteneurs peuvent-ils communiquer ?
4. **Ports exposés** : Le port 3000 est-il accessible depuis l'extérieur ?

---

## 7. Améliorations Futures

### 7.1 Améliorations à court terme

**1. Environnements multiples**
```yaml
# Ajout d'un environnement de staging
deploy-staging:
  if: github.ref == 'refs/heads/develop'
  # Deploy vers staging.example.com
```

**2. Notifications**
```yaml
# Notification Slack/Discord en cas d'échec
- name: Notify on failure
  if: failure()
  uses: slack-notify-action
```

**3. Tests de performance**
```yaml
# Ajout de tests de charge avec Artillery
- name: Load testing
  run: npm run test:load
```

### 7.2 Améliorations à moyen terme

**1. Blue/Green Deployment**
- Déploiement sans downtime
- Bascule instantanée entre versions
- Rollback immédiat en cas de problème

**2. Monitoring avancé**
- Intégration Prometheus + Grafana
- Alertes automatiques (CPU, RAM, erreurs)
- Métriques applicatives (temps de réponse, taux d'erreur)

**3. Sauvegardes automatisées**
```yaml
# Backup quotidien de la base de données
- name: Database backup
  run: |
    docker exec onboarding-db pg_dump -U $DB_USER $DB_NAME > backup.sql
    aws s3 cp backup.sql s3://backups/
```

### 7.3 Améliorations à long terme

**1. Infrastructure as Code (IaC)**
- Terraform pour provisionner l'infrastructure VPS
- Configuration versionnée et reproductible
- Multi-cloud ready

**2. Kubernetes Migration**
- Scalabilité automatique (HPA)
- Self-healing
- Rolling updates natifs
- Service mesh (Istio)

**3. Security Scanning**
```yaml
# Scan de vulnérabilités dans l'image Docker
- name: Trivy vulnerability scanner
  uses: aquasecurity/trivy-action
```

**4. Tests End-to-End**
- Tests Playwright/Cypress automatisés
- Validation complète du parcours utilisateur
- Screenshots en cas d'échec

### 7.4 Optimisations de performance

**1. Cache des layers Docker**
```yaml
# Utilisation du cache pour accélérer le build
- name: Build with cache
  uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

**2. Déploiements parallèles**
- Deploy de l'API et du bot Discord en parallèle
- Réduction du temps total de déploiement

**3. Optimisation des images Docker**
- Multi-stage builds
- Images Alpine Linux
- Suppression des dev dependencies en production

---

## Annexes

### Annexe A : Fichier docker-compose.prod.yml

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: onboarding-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
  
  api:
    image: ghcr.io/${GITHUB_REPOSITORY_LOWER}:latest
    container_name: onboarding-api
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
    ports:
      - "3000:3000"
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### Annexe B : Commandes utiles

**Gestion des conteneurs :**
```bash
# Voir l'état des conteneurs
docker ps

# Redémarrer l'API
docker restart onboarding-api

# Voir les logs en temps réel
docker logs -f onboarding-api

# Accéder au shell du conteneur
docker exec -it onboarding-api sh
```

**Gestion de la base de données :**
```bash
# Accéder à PostgreSQL
docker exec -it onboarding-db psql -U api_user -d onboarding_prod

# Backup manuel
docker exec onboarding-db pg_dump -U api_user onboarding_prod > backup.sql

# Restore
docker exec -i onboarding-db psql -U api_user onboarding_prod < backup.sql
```

**Gestion des images :**
```bash
# Lister les images locales
docker images

# Supprimer les anciennes images
docker image prune -a

# Pull manuel d'une version spécifique
docker pull ghcr.io/exizygl/onboarding-api:main-a1b2c3d
```

### Annexe C : Checklist de déploiement

- [ ] Tests passés en local
- [ ] Code commité sur la branche correcte
- [ ] Secrets GitHub à jour
- [ ] docker-compose.prod.yml validé
- [ ] Push sur GitHub
- [ ] Vérification du pipeline GitHub Actions
- [ ] Vérification des logs de déploiement
- [ ] Test de l'API en production
- [ ] Vérification de la base de données
- [ ] Monitoring post-déploiement (15 minutes)

### Annexe D : Glossaire

| Terme | Définition |
|-------|------------|
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **GHCR** | GitHub Container Registry |
| **VPS** | Virtual Private Server |
| **Healthcheck** | Vérification automatique de l'état d'un service |
| **Rollback** | Retour à une version antérieure |
| **SCP** | Secure Copy Protocol |
| **SSH** | Secure Shell |
| **Registry** | Dépôt d'images Docker |
| **Runner** | Machine exécutant les jobs GitHub Actions |

---

## Conclusion

Le pipeline CI/CD mis en place pour le projet OnBoarding API permet :

✅ **Automatisation complète** du cycle de déploiement  
✅ **Qualité garantie** grâce aux tests automatisés  
✅ **Traçabilité** de chaque déploiement via Git  
✅ **Déploiements rapides** (4-7 minutes du push à la production)  
✅ **Sécurité renforcée** avec gestion des secrets et images Docker  
✅ **Rollback facilité** en cas de problème  

Ce système constitue une base solide pour l'évolution du projet et peut être étendu avec les améliorations proposées dans la section 7.

---

**Document rédigé dans le cadre de la certification CDA**  
**Version : 1.0**  
**Dernière mise à jour : Décembre 2024**