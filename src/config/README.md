# Configuration Supabase

Pour utiliser l'authentification Supabase, vous devez créer un fichier `.env` à la racine de votre projet avec les variables suivantes :

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Comment obtenir ces clés :

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet ou utilisez un projet existant
3. Dans le tableau de bord de votre projet, allez dans Settings > API
4. Copiez votre "Project URL" et votre "anon public" key
5. Remplacez les valeurs dans le fichier `.env`

## Fonctionnalités implémentées :

- ✅ Inscription utilisateur
- ✅ Connexion utilisateur
- ✅ Déconnexion
- ✅ Réinitialisation de mot de passe
- ✅ Protection des routes
- ✅ Gestion de l'état d'authentification
- ✅ Interface utilisateur responsive 