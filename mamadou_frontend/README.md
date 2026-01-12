Voici un exemple de **README.md** détaillé pour ton projet, basé sur l’arborescence que tu m’as fournie :

---

# 🏛 Admin Dash Naturalization

**Admin Dash Naturalization** est une application front-end développée avec **React** et **Vite**. Elle fournit un dashboard complet pour la gestion des utilisateurs, des trades, et des réflexions, avec une interface modulable et sécurisée.

---

## 🗂 Structure du projet

```
|—— .gitignore
|—— eslint.config.js
|—— index.html
|—— package-lock.json
|—— package.json
|—— public
|    |—— logo.png
|—— src
|    |—— App.jsx
|    |—— api
|    |—— components
|    |—— context
|    |—— data
|    |—— hooks
|    |—— index.css
|    |—— main.jsx
|    |—— pages
|    |—— routes
|    |—— utils
|—— tailwind.config.js
|—— vite.config.js
```

### 📌 Détails des dossiers

* **api** : Services pour les appels HTTP et interactions avec le backend (`authService.js`, `tradeService.js`, etc.)
* **components** : Composants réutilisables et layouts (`AuthLayout`, `DashboardLayout`, `Sidebar`, `Header`, `Button`, etc.)
* **context** : Context API pour gérer l’état global (`AuthContext`, `TradeContext`)
* **data** : Données statiques ou mock (`reflectionPrompts.js`)
* **hooks** : Hooks personnalisés (`useAuth.js`)
* **pages** : Pages principales organisées par module :

  * `auth` : Authentification, création et réinitialisation de mot de passe, verification OTP
  * `dashboard` : Pages du dashboard (`DashboardHome`, `TradeEntry`, `Reflections`, etc.)
* **routes** : Gestion des routes de l’application (`AppRoutes.jsx`, `ProtectedRoute.jsx`)
* **utils** : Fonctions utilitaires (`calculatePnL.js`, `reflectionAnalytics.js`, `profileUtils.js`)

---

## ⚡ Technologies utilisées

* **Frontend** : React + Vite + Tailwind CSS
* **State Management** : React Context API
* **API** : Axios avec services modulaires (`authService`, `tradeService`, etc.)
* **Testing** : Jest pour tests unitaires (`profileUtils.test.js`)
* **CI/CD** : GitHub Actions (Build, Docker, SonarQube, déploiement VPS)

---

## 🚀 Installation et setup

1. Cloner le projet :

```bash
git clone <URL_DU_REPO>
cd admin-dash-naturalization
```

2. Installer les dépendances :

```bash
npm ci
```

3. Lancer l’application en développement :

```bash
npm run dev
```

4. L’application sera accessible par défaut sur : `http://localhost:5173`

---

## 🐳 Docker

Build et lancement de l’image Docker :

```bash
docker build -t admin-dash-naturalization:1.0.0 .
docker run -d -p 8085:80 admin-dash-naturalization:1.0.0
```

---

## 🔒 Déploiement sur VPS

Le déploiement est automatisé via **GitHub Actions** :

* Build React app
* Push Docker image sur GitHub Container Registry (GHCR)
* Déploiement manuel via workflow dispatch sur VPS avec Docker

---

## 🧪 Tests

Tests unitaires avec Jest :

```bash
npm test
```

> Les tests sont ciblés sur les fonctions utilitaires et les composants critiques.

---

## 📁 Conventions

* Tous les composants réutilisables → `src/components`
* Pages principales → `src/pages`
* Services backend → `src/api`
* Context API → `src/context`
* Hooks personnalisés → `src/hooks`
* Utilitaires → `src/utils`

---

## ✨ Contribution

1. Forker le repo
2. Créer une branche feature : `git checkout -b feature/nom-feature`
3. Commits clairs et détaillés
4. PR vers `main` avec description

---

## 📄 Licence

Projet propriétaire – usage interne et suivi du projet Naturalization.


