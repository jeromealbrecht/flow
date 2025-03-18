# Instructions pour configurer CORS dans Firebase Storage

Pour résoudre l'erreur CORS lors de l'upload des fichiers audio dans Firebase Storage, suivez ces étapes :

## 1. Connexion à Firebase

```bash
firebase login
```

## 2. Appliquer la configuration CORS

Exécutez la commande suivante à la racine du projet (où se trouve le fichier cors.json) :

```bash
firebase storage:cors update --project cdson-24c90 --buckets cdson-24c90.appspot.com
```

Cette commande applique les règles CORS définies dans le fichier cors.json à votre bucket Firebase Storage.

## 3. Vérifier la configuration

Pour vérifier que les règles CORS ont été correctement appliquées :

```bash
firebase storage:cors get --project cdson-24c90 --buckets cdson-24c90.appspot.com
```

## 4. Alternative : Configuration via la console Firebase

Si vous préférez utiliser l'interface web :

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet "cdson-24c90"
3. Cliquez sur "Storage" dans le menu de gauche
4. Allez dans l'onglet "Rules"
5. Ajoutez la configuration CORS en format JSON

## 5. Utilisation des fichiers audio

Pour tester les fichiers audio dans votre application, vous pouvez soit :

- Utiliser l'approche simulée actuelle (sans upload réel)
- Ou uploader manuellement des fichiers audio via la console Firebase et ajouter leur URL dans Firestore

## Notes importantes

- Si vous souhaitez réactiver l'upload direct, vous pouvez restaurer le code original dans src/app/studio/admin/page.tsx
- Si vous ajoutez de nouveaux domaines (comme un domaine de production), n'oubliez pas de mettre à jour le fichier cors.json et de réappliquer les règles
