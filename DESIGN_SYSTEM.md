# Système de Design - OnlyFries

## Vue d'ensemble

Ce document décrit le nouveau système de design cohérent implémenté dans l'application OnlyFries. L'objectif était de créer une expérience utilisateur harmonieuse avec une palette de couleurs unifiée, des composants réutilisables et des états de chargement cohérents.

## Palette de Couleurs

### Couleur Principale - Crème
La couleur crème (`#FFEDCD`) reste la couleur principale de l'application, déclinée en plusieurs nuances :

```css
cream: {
  50: '#FFFEF7',   // Très clair
  100: '#FFFBF0',  // Clair
  200: '#FFF5E6',  // Moyen clair
  300: '#FFEDCD',  // Principal (existant)
  400: '#FFE5B8',  // Moyen
  500: '#FFDDA3',  // Moyen foncé
  600: '#FFD58E',  // Foncé
  700: '#F4C685',  // Très foncé
  800: '#E8B77C',  // Ultra foncé
  900: '#DCA973',  // Le plus foncé
}
```

### Couleurs d'Accent - Brand
Basées sur l'ambre pour créer une harmonie avec le crème :

```css
brand: {
  50: '#FEF7ED',   // Très clair
  100: '#FDEDD3',  // Clair
  200: '#FCD9A6',  // Moyen clair
  300: '#FAC074',  // Moyen
  400: '#F8A340',  // Moyen foncé
  500: '#F59E0B',  // Principal
  600: '#D97706',  // Foncé
  700: '#B45309',  // Très foncé
  800: '#92400E',  // Ultra foncé
  900: '#78350F',  // Le plus foncé
  950: '#451A03',  // Le plus foncé
}
```

### Couleurs d'État

- **Succès** : Vert harmonieux (`#22C55E`)
- **Erreur** : Rouge cohérent (`#EF4444`)
- **Avertissement** : Orange/Ambre (`#F59E0B`)

## Composants UI

### Button
Composant bouton avec 7 variants et 4 tailles :

**Variants :**
- `primary` : Couleur brand principale
- `secondary` : Couleur crème pour actions secondaires
- `success` : Vert pour actions de validation
- `error` : Rouge pour actions destructives
- `warning` : Orange pour avertissements
- `ghost` : Transparent avec hover
- `outline` : Bordure seule

**Tailles :**
- `sm` : Petit (36px hauteur)
- `md` : Moyen (44px hauteur) - par défaut
- `lg` : Grand (48px hauteur)
- `xl` : Très grand (56px hauteur)

### Input
Composant input avec validation visuelle :

**Props spéciales :**
- `label` : Label automatique
- `error` : Message d'erreur avec styling rouge
- `success` : Message de succès avec styling vert
- `inputSize` : Taille de l'input (évite conflit avec size HTML)

### Card
Composant carte flexible :

**Variants :**
- `default` : Carte standard avec ombre douce
- `elevated` : Carte surélevée avec ombre forte
- `outlined` : Carte avec bordure accentuée
- `ghost` : Carte transparente

### LoadingSpinner
Spinner de chargement cohérent :

**Tailles :** `sm`, `md`, `lg`, `xl`
**Couleurs :** `primary`, `secondary`, `white`, `neutral`

## Ombres et Bordures

### Ombres Personnalisées
```css
shadow-soft: '0 2px 8px 0 rgba(0, 0, 0, 0.08)'
shadow-medium: '0 4px 12px 0 rgba(0, 0, 0, 0.12)'
shadow-strong: '0 8px 24px 0 rgba(0, 0, 0, 0.16)'
shadow-inner-soft: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
```

### Rayons de Bordure
- `rounded-lg` : 8px
- `rounded-xl` : 12px
- `rounded-2xl` : 16px
- `rounded-3xl` : 20px

## Améliorations Apportées

### 1. NavBar
- ✅ Nouvelle palette de couleurs cohérente
- ✅ Animations et micro-interactions
- ✅ Meilleur contraste et lisibilité
- ✅ États de hover améliorés

### 2. Composant Start
- ✅ Design en cartes avec gradients subtils
- ✅ Boutons et inputs standardisés
- ✅ Séparateur "OU" redessiné
- ✅ Loading states cohérents

### 3. Composant Auth
- ✅ Cartes avec gradients et ombres
- ✅ Messages d'erreur/succès dans des cartes
- ✅ Inputs avec labels intégrés
- ✅ Design centré et aéré

### 4. Menu
- ✅ Filtres de catégories en boutons arrondis
- ✅ Cartes d'items avec hover effects
- ✅ Images améliorées avec border-radius
- ✅ État de chargement avec spinner

### 5. Cart (Panier)
- ✅ Header avec icône et titre
- ✅ Items en cartes avec badges de quantité
- ✅ Total mis en valeur avec gradient
- ✅ Bouton d'action principal amélioré

### 6. Page Confirmation
- ✅ Cards avec animations Framer Motion
- ✅ Icônes de statut colorées
- ✅ Sections bien séparées
- ✅ QR Code dans une carte dédiée

### 7. UserProfile
- ✅ Design en carte avec header iconographique
- ✅ Informations structurées avec icônes
- ✅ Bouton de déconnexion standardisé

## Accessibilité

- ✅ Contrastes respectés (WCAG AA)
- ✅ Focus visible amélioré
- ✅ Aria-labels sur les spinners
- ✅ Tailles de touch targets respectées (44px minimum)

## CSS Global

### Scrollbars Personnalisées
Les scrollbars utilisent maintenant la palette de couleurs de l'application.

### Classes Utilitaires
- `.line-clamp-2` et `.line-clamp-3` : Limitation du nombre de lignes
- `.text-gradient-brand` : Gradient de texte avec les couleurs brand
- `.animate-pulse-soft` : Animation de pulse adoucie
- `.backdrop-blur-card` : Effet de flou pour les cartes

## Utilisation

```tsx
import { Button, Input, Card, LoadingSpinner } from './components/ui';

// Bouton primaire
<Button variant="primary" size="lg">
  Action principale
</Button>

// Input avec validation
<Input 
  label="Email"
  error="Email requis"
  inputSize="lg"
/>

// Carte avec contenu
<Card variant="elevated" padding="lg">
  Contenu de la carte
</Card>

// Spinner de chargement
<LoadingSpinner size="xl" color="primary" />
```

## Cohérence Visuelle

Tous les composants suivent maintenant :
- ✅ **Espacement uniforme** : Multiples de 4px
- ✅ **Rayons de bordure cohérents** : 8px, 12px, 16px, 20px
- ✅ **Ombres standardisées** : 4 niveaux d'élévation
- ✅ **Couleurs harmonieuses** : Palette crème + brand
- ✅ **Typographie unifiée** : Échelles de tailles cohérentes
- ✅ **États interactifs** : Hover, focus, disabled uniformes

Le système est maintenant prêt pour une expansion future tout en maintenant la cohérence visuelle de l'application OnlyFries. 