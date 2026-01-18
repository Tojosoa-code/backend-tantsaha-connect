# Tantsaha Connect - Backend

**Tantsaha Connect** est une plateforme API REST conçue pour accompagner les agriculteurs dans le suivi technique de leurs exploitations. Elle permet la gestion des observations terrain, la réception de conseils agricoles et le suivi des alertes.

---

## 🛠️ Stack Technique

* **Runtime** : [Node.js](https://nodejs.org/)
* **Framework** : [Express.js](https://expressjs.com/)
* **Base de données** : MySQL
* **Authentification** : JSON Web Tokens (JWT)
* **Gestionnaire de version** : Git / GitHub

---

## 🚀 Installation et Démarrage

1. **Cloner le dépôt** :
   ```bash
   git clone [https://github.com/Tojosoa-code/backend-tantsaha-connect.git](https://github.com/Tojosoa-code/backend-tantsaha-connect.git)
   cd backend-tantsaha-connect
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   Créez un fichier `.env` à la racine du projet :
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=tantsaha_connect
   JWT_SECRET=votre_cle_secrete_ici
   ```

4. **Lancer le serveur** :
   ```bash
   # Pour le développement (avec nodemon)
   npm run dev
   ```

---

## 📑 Documentation des Routes (Endpoints)

Toutes les routes marquées par 🔒 nécessitent un Header `Authorization: Bearer <votre_token>`.

### 🔐 Authentification & Profil (`/api/auth`)

| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Inscription d'un nouvel utilisateur | Public |
| `POST` | `/login` | Connexion et récupération du token | Public |
| `GET` | `/profil` | Récupérer les infos de l'utilisateur connecté | 🔒 Privé |

### 📝 Observations (`/api/observations`)

| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Ajouter une nouvelle observation | 🔒 Privé |
| `GET` | `/` | Lister toutes les observations | 🔒 Privé |
| `PUT` | `/:id` | Modifier une observation | 🔒 Privé |
| `DELETE` | `/:id` | Supprimer une observation | 🔒 Privé |

### 💡 Conseils (`/api/conseils`)

| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Récupérer les conseils agricoles | 🔒 Privé |

### ⚠️ Alertes (`/api/alertes`)

| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Liste des alertes actives | 🔒 Privé |

---

## 📦 Exemple de corps de requête (Body JSON)

**Pour créer une observation (`POST /api/observations`) :**

```json
{
    "message": "Apparition de pucerons sur les feuilles de riz",
    "id_culture": 2,
    "date": "2024-05-21"
}
```

---

## 🧑‍💻 Auteur

* **Tojosoa** - [Lien vers le profil GitHub](https://github.com/Tojosoa-code)