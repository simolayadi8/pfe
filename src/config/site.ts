// src/config/site.ts

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  // Nom et description de ton site
  name: "Géo‑portail Blé",
  description:
    "Sélectionnez une parcelle sur la carte pour estimer le rendement de votre culture grâce à l'imagerie satellite et nos modèles ML.",

  // Liens de la navbar desktop
  navItems: [
    { label: "Accueil",      href: "/"           },
    { label: "Carte",        href: "/map"        },
    { label: "Analyse",      href: "/analysis"   },
    { label: "Prédiction",   href: "/prediction" },
  ],

  // Liens du menu mobile (navbar burger)
  navMenuItems: [
    { label: "Accueil",      href: "/"           },
    { label: "Carte",        href: "/map"        },
    { label: "Analyse",      href: "/analysis"   },
    { label: "Prédiction",   href: "/prediction" },
    // si tu veux, ajoute d'autres pages ici
  ],

  // Liens externes (réseaux sociaux, docs, sponsor…)
  links: {
    github: "https://github.com/ton‑orga/ton‑projet",
    twitter: "https://twitter.com/ton‑compte",
    docs:   "/docs",       // si tu as une doc interne
    discord:"https://discord.gg/xxx",
    sponsor:"https://ton‑lien‑patreon.com",
  },
}


