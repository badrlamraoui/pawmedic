export interface VetProfile {
  slug: string;
  name: string;
  title: string;
  school: string;       // abbreviation
  schoolFull: string;   // full name
  graduationYear: number;
  years: number;
  city: string;
  specializations: string[];
  themes: string[];     // match article.theme
  categories: string[]; // match article.category
  bio: string;          // plain text, 2 paragraphs separated by \n\n
  initials: string;
  color: string;        // avatar background color
  photo: string;        // Unsplash photo URL (fixed per vet)
}

export const VETS: VetProfile[] = [
  {
    slug: "dr-sophie-martin",
    name: "Dr. Sophie Martin",
    title: "Vétérinaire généraliste",
    school: "ENVL",
    schoolFull: "École Nationale Vétérinaire de Lyon",
    graduationYear: 2016,
    years: 10,
    city: "Lyon",
    specializations: ["Médecine générale", "Dermatologie", "Santé préventive"],
    themes: ["sante", "comportement"],
    categories: ["chien", "chat"],
    bio: "Diplômée de l'École Nationale Vétérinaire de Lyon en 2016, le Dr. Sophie Martin exerce depuis 10 ans dans une clinique vétérinaire généraliste à Lyon. Elle est spécialisée dans le suivi de santé global des chiens et des chats, avec une attention particulière portée à la dermatologie et à la prévention des maladies chroniques.\n\nPassionnée par la médecine intégrative, elle allie les dernières avancées scientifiques à une approche centrée sur le bien-être de l'animal et la communication avec les propriétaires. Elle contribue régulièrement à des formations continues pour les praticiens vétérinaires.",
    initials: "SM",
    color: "#0d9488",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
  },
  {
    slug: "dr-thomas-leroy",
    name: "Dr. Thomas Leroy",
    title: "Spécialiste en nutrition animale",
    school: "ONIRIS",
    schoolFull: "Oniris — École Nationale Vétérinaire de Nantes",
    graduationYear: 2018,
    years: 8,
    city: "Nantes",
    specializations: ["Nutrition clinique", "Diététique vétérinaire", "Obésité animale"],
    themes: ["alimentation", "races", "produits"],
    categories: ["chien", "chat", "produits"],
    bio: "Le Dr. Thomas Leroy est diplômé d'Oniris (Nantes) avec une spécialisation en nutrition clinique vétérinaire. Depuis 8 ans, il conseille les propriétaires d'animaux sur les régimes alimentaires adaptés, les compléments nutritionnels et la gestion du poids chez le chien et le chat.\n\nIl est l'auteur de plusieurs guides pratiques sur l'alimentation BARF, les croquettes haut de gamme et la prévention de l'obésité animale. Il intervient également comme formateur auprès des étudiants vétérinaires d'Oniris.",
    initials: "TL",
    color: "#d97706",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
  },
  {
    slug: "dr-marie-dupont",
    name: "Dr. Marie Dupont",
    title: "Vétérinaire comportementaliste",
    school: "ENVA",
    schoolFull: "École Nationale Vétérinaire d'Alfort",
    graduationYear: 2014,
    years: 12,
    city: "Paris",
    specializations: ["Comportement canin et félin", "Éducation positive", "Anxiété de séparation"],
    themes: ["comportement", "elevage", "sorties", "jeux"],
    categories: ["chien", "chat"],
    bio: "Diplômée de l'École Nationale Vétérinaire d'Alfort (Maisons-Alfort) en 2014, le Dr. Marie Dupont s'est spécialisée en médecine comportementale vétérinaire. Avec 12 ans d'expérience, elle accompagne les propriétaires confrontés aux troubles du comportement (anxiété, agressivité, peurs) chez le chien et le chat.\n\nElle est membre de l'Association Européenne de Médecine du Comportement des Animaux de Compagnie (ESVCE) et propose des consultations comportementales à Paris. Elle contribue à de nombreuses publications sur l'éducation positive et l'enrichissement environnemental.",
    initials: "MD",
    color: "#9333ea",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f",
  },
  {
    slug: "dr-pierre-moreau",
    name: "Dr. Pierre Moreau",
    title: "Spécialiste Nouveaux Animaux de Compagnie",
    school: "ENVT",
    schoolFull: "École Nationale Vétérinaire de Toulouse",
    graduationYear: 2017,
    years: 9,
    city: "Toulouse",
    specializations: ["Lapins & rongeurs", "Oiseaux de compagnie", "Reptiles & amphibiens", "Poissons d'aquarium"],
    themes: ["sante", "alimentation", "veterinaire"],
    categories: ["lapin", "oiseau", "rongeurs", "reptile", "poisson", "furet"],
    bio: "Diplômé de l'École Nationale Vétérinaire de Toulouse en 2017, le Dr. Pierre Moreau s'est orienté dès ses études vers les Nouveaux Animaux de Compagnie (NAC). Il exerce dans une clinique spécialisée à Toulouse, prenant en charge lapins, furets, rongeurs, oiseaux, reptiles et poissons d'aquarium.\n\nIl est l'un des rares vétérinaires français à avoir suivi une formation spécifique en médecine des poissons d'ornement, et il participe régulièrement à des congrès internationaux sur la médecine des NAC.",
    initials: "PM",
    color: "#0891b2",
    photo: "https://images.unsplash.com/photo-1537396123722-7b2b60646e1c",
  },
  {
    slug: "dr-julie-bernard",
    name: "Dr. Julie Bernard",
    title: "Vétérinaire urgentiste",
    school: "ENVB",
    schoolFull: "VetAgro Sup — Campus Vétérinaire de Lyon (ex-ENVB)",
    graduationYear: 2015,
    years: 11,
    city: "Bordeaux",
    specializations: ["Médecine d'urgence", "Soins intensifs", "Pharmacologie vétérinaire"],
    themes: ["medicaments", "veterinaire", "sante"],
    categories: ["chien", "chat", "symptomes", "produits"],
    bio: "Le Dr. Julie Bernard est diplômée de VetAgro Sup (Lyon) en 2015 avec une spécialisation en médecine d'urgence et soins intensifs. Elle travaille depuis 11 ans aux urgences vétérinaires de Bordeaux, traitant des cas critiques 24h/24. Son expertise en pharmacologie lui permet de conseiller avec précision sur les traitements médicamenteux et les interactions à risque.\n\nSon objectif est de permettre aux propriétaires d'animaux de reconnaître les signes d'urgence et d'agir rapidement. Elle est régulièrement consultée par des médias spécialisés sur les thèmes de la santé animale critique et de la toxicologie.",
    initials: "JB",
    color: "#dc2626",
    photo: "https://images.unsplash.com/photo-1527613426441-4da17471b66d",
  },
];

/** djb2 hash */
function strHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
    h = h >>> 0;
  }
  return h;
}

/**
 * Assign a vet to an article based on theme → category → slug hash.
 * Ensures consistent assignment (same article always gets the same vet).
 */
export function getVetForArticle(
  category: string,
  theme?: string,
  slug?: string
): VetProfile {
  // 1. Match by theme first
  if (theme) {
    const byTheme = VETS.filter((v) => v.themes.includes(theme));
    if (byTheme.length > 0) {
      const hash = strHash(slug ?? category);
      return byTheme[hash % byTheme.length];
    }
  }
  // 2. Match by category
  const byCategory = VETS.filter((v) => v.categories.includes(category));
  if (byCategory.length > 0) {
    const hash = strHash(slug ?? category);
    return byCategory[hash % byCategory.length];
  }
  // 3. Fallback: hash on slug
  const hash = strHash(slug ?? category);
  return VETS[hash % VETS.length];
}
