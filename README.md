# FlowPulse

FlowPulse est une application web moderne construite avec Next.js et Firebase, offrant une interface d'administration sécurisée et une gestion des utilisateurs avancée.

## 🚀 Fonctionnalités

- 🔐 Authentification Google
- 👥 Gestion des utilisateurs avec rôles (Admin/Utilisateur)
- 🎨 Interface utilisateur moderne avec Tailwind CSS et shadcn/ui
- 🌓 Mode sombre/clair
- 📱 Design responsive
- 🔒 Sécurité renforcée avec Firebase

## 🛠️ Technologies utilisées

- **Frontend** :
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Firebase Authentication
  - Firebase Firestore

## 📋 Prérequis

- Node.js 18.x ou supérieur
- npm ou yarn
- Un compte Firebase avec un projet configuré

## 🔧 Installation

1. Clonez le repository :

```bash
git clone [URL_DU_REPO]
cd flowpulse
```

2. Installez les dépendances :

```bash
npm install
```

3. Configurez les variables d'environnement :
   Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
```

4. Lancez le serveur de développement :

```bash
npm run dev
```

## 🔐 Configuration Firebase

1. Créez un projet sur [Firebase Console](https://console.firebase.google.com)
2. Activez l'authentification Google
3. Créez une base de données Firestore
4. Configurez les règles de sécurité Firestore :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      allow write: if isAdmin();
    }
  }
}
```

## 📁 Structure du projet

```
flowpulse/
├── src/
│   ├── app/                    # Pages et routes Next.js
│   │   ├── ui/                # Composants UI réutilisables
│   │   └── ...                # Autres composants
│   ├── lib/                   # Utilitaires et configurations
│   │   └── firebase/          # Configuration Firebase
│   └── hooks/                 # Hooks React personnalisés
├── public/                    # Fichiers statiques
└── ...                        # Fichiers de configuration
```

## 🔑 Rôles utilisateurs

- **Administrateur** : Accès complet à toutes les fonctionnalités
- **Utilisateur** : Accès limité aux fonctionnalités de base

## 🚀 Déploiement

1. Construisez l'application :

```bash
npm run build
```

2. Démarrez le serveur de production :

```bash
npm start
```

## 📝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- [Jérôme Albrecht] - Développement initial
