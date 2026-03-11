import Link from "next/link";
import { getCategorySlug } from "@/lib/categories";

interface SiteFooterProps {
  locale?: string;
}

const CHIEN_LINKS = [
  { label: "Se gratte les oreilles", href: "/chien/chien-gratte-oreilles" },
  { label: "Vomit le matin", href: "/chien/chien-vomit-matin" },
  { label: "Boite d'une patte", href: "/chien/chien-boite-patte" },
  { label: "Ne mange plus", href: "/chien/chien-mange-pas" },
  { label: "Tous les guides chien →", href: "/chien" },
];

const CHAT_LINKS = [
  { label: "Vomit régulièrement", href: "/chat/chat-vomit" },
  { label: "Ne mange plus", href: "/chat/chat-mange-pas" },
  { label: "Éternue souvent", href: "/chat/chat-eternue" },
  { label: "Boit beaucoup", href: "/chat/chat-boit-beaucoup" },
  { label: "Tous les guides chat →", href: "/chat" },
];

const AUTRES_ANIMAUX_LINKS = [
  { label: "Lapin 🐰", href: "/lapin" },
  { label: "Oiseau 🦜", href: "/oiseau" },
  { label: "Rongeurs 🐹", href: "/rongeurs" },
  { label: "Reptile 🦎", href: "/reptile" },
  { label: "Poisson 🐟", href: "/poisson" },
  { label: "Furet 🦡", href: "/furet" },
];

const GUIDES_LINKS = [
  { label: "Symptômes", href: "/symptomes" },
  { label: "Urgences vétérinaires", href: "/chien/chien-urgence-vet" },
  { label: "Chat agressif", href: "/chat/chat-agressif" },
  { label: "Produits", href: "/produits" },
  { label: "Antiparasitaires chien", href: "/produits/meilleur-antiparasitaire-chien" },
  { label: "Antiparasitaires chat", href: "/produits/meilleur-antiparasitaire-chat" },
];

const FOOTER_LABELS: Record<string, { col1: string; col2: string; col3: string; col4: string; tagline: string; medical: string; affiliate: string; legal: string; privacy: string; about: string; copyright: string }> = {
  fr: { col1: "Chien", col2: "Chat", col3: "Autres animaux", col4: "Guides", tagline: "La santé animale,\nenfin accessible.", medical: "ⓘ Ce site est destiné à titre informatif uniquement et ne remplace pas l'avis d'un vétérinaire diplômé. En cas d'urgence, consultez immédiatement un professionnel de santé animale.", affiliate: "ⓘ Certains liens de ce site sont des liens affiliés. Nous percevons une commission si vous achetez via ces liens, sans coût supplémentaire pour vous.", legal: "Mentions légales", privacy: "Confidentialité", about: "À propos", copyright: "Tous droits réservés." },
  en: { col1: "Dog", col2: "Cat", col3: "Other pets", col4: "Guides", tagline: "Animal health,\nfinally accessible.", medical: "ⓘ This site is for informational purposes only and does not replace the advice of a qualified veterinarian. In case of emergency, contact an animal health professional immediately.", affiliate: "ⓘ Some links on this site are affiliate links. We earn a commission if you purchase via these links, at no extra cost to you.", legal: "Legal notice", privacy: "Privacy", about: "About", copyright: "All rights reserved." },
  es: { col1: "Perro", col2: "Gato", col3: "Otros animales", col4: "Guías", tagline: "Salud animal,\npor fin accesible.", medical: "ⓘ Este sitio es solo informativo y no reemplaza el consejo de un veterinario titulado. En caso de urgencia, consulte inmediatamente a un profesional de salud animal.", affiliate: "ⓘ Algunos enlaces de este sitio son de afiliados. Recibimos una comisión si compras a través de ellos, sin coste adicional para ti.", legal: "Aviso legal", privacy: "Privacidad", about: "Acerca de", copyright: "Todos los derechos reservados." },
  de: { col1: "Hund", col2: "Katze", col3: "Andere Tiere", col4: "Ratgeber", tagline: "Tiergesundheit,\nendlich verständlich.", medical: "ⓘ Diese Website dient nur zu Informationszwecken und ersetzt nicht den Rat eines approbierten Tierarztes. Im Notfall wenden Sie sich sofort an einen Tiergesundheitsexperten.", affiliate: "ⓘ Einige Links auf dieser Website sind Affiliate-Links. Wir erhalten eine Provision, wenn Sie über diese Links kaufen, ohne Mehrkosten für Sie.", legal: "Impressum", privacy: "Datenschutz", about: "Über uns", copyright: "Alle Rechte vorbehalten." },
  it: { col1: "Cane", col2: "Gatto", col3: "Altri animali", col4: "Guide", tagline: "Salute animale,\nfinalmente accessibile.", medical: "ⓘ Questo sito è solo a scopo informativo e non sostituisce il parere di un veterinario qualificato. In caso di emergenza, consultare immediatamente un professionista della salute animale.", affiliate: "ⓘ Alcuni link su questo sito sono link affiliati. Riceviamo una commissione se acquisti tramite questi link, senza costi aggiuntivi per te.", legal: "Note legali", privacy: "Privacy", about: "Chi siamo", copyright: "Tutti i diritti riservati." },
  pt: { col1: "Cão", col2: "Gato", col3: "Outros animais", col4: "Guias", tagline: "Saúde animal,\npor fim acessível.", medical: "ⓘ Este site é apenas para fins informativos e não substitui o conselho de um veterinário qualificado. Em caso de emergência, consulte imediatamente um profissional de saúde animal.", affiliate: "ⓘ Alguns links neste site são links afiliados. Recebemos uma comissão se comprar através destes links, sem custo adicional para si.", legal: "Menções legais", privacy: "Privacidade", about: "Sobre", copyright: "Todos os direitos reservados." },
  nl: { col1: "Hond", col2: "Kat", col3: "Andere dieren", col4: "Gidsen", tagline: "Dierengezondheid,\neindelijk toegankelijk.", medical: "ⓘ Deze site is uitsluitend bedoeld voor informatieve doeleinden en vervangt niet het advies van een gediplomeerde dierenarts. Bij een noodgeval raadpleegt u onmiddellijk een diergezondheidsprofessional.", affiliate: "ⓘ Sommige links op deze site zijn affiliate links. We ontvangen een commissie als u via deze links koopt, zonder extra kosten voor u.", legal: "Juridische vermeldingen", privacy: "Privacy", about: "Over ons", copyright: "Alle rechten voorbehouden." },
};

export default function SiteFooter({ locale = "fr" }: SiteFooterProps) {
  const lbl = FOOTER_LABELS[locale] ?? FOOTER_LABELS.fr;

  return (
    <footer className="bg-[#1a1a18] pt-14 pb-6 px-5">
      <div className="max-w-6xl mx-auto">

        {/* Top grid: brand + 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Col 1: Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-4">
              <svg
                className="w-5 h-5 text-[#0d9488]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <ellipse cx="5" cy="7.5" rx="1.8" ry="2.5" />
                <ellipse cx="9" cy="5.5" rx="1.8" ry="2.5" />
                <ellipse cx="15" cy="5.5" rx="1.8" ry="2.5" />
                <ellipse cx="19" cy="7.5" rx="1.8" ry="2.5" />
                <path d="M12 10c-4 0-7 2.5-7 5.5 0 2 1.5 3.5 3.5 3.5.8 0 1.5-.2 2-.5.3-.2.7-.2 1 0 .5.3 1.2.5 2 .5 2 0 3.5-1.5 3.5-3.5C19 12.5 16 10 12 10z" />
              </svg>
              <span className="font-mono text-sm font-semibold tracking-widest text-white">
                PAWMEDIC
              </span>
            </Link>
            <p className="text-xs text-white/50 leading-relaxed" style={{ whiteSpace: "pre-line" }}>
              {lbl.tagline}
            </p>
          </div>

          {/* Col 2: Chien */}
          <div>
            <p className="text-white/40 font-mono uppercase text-xs tracking-widest mb-4">
              {lbl.col1}
            </p>
            <ul className="space-y-2.5">
              {CHIEN_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}/${getCategorySlug("chien", locale)}${link.href.slice("/chien".length)}`}
                    className="text-xs text-white/60 hover:text-white transition-colors leading-relaxed"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Chat */}
          <div>
            <p className="text-white/40 font-mono uppercase text-xs tracking-widest mb-4">
              {lbl.col2}
            </p>
            <ul className="space-y-2.5">
              {CHAT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}/${getCategorySlug("chat", locale)}${link.href.slice("/chat".length)}`}
                    className="text-xs text-white/60 hover:text-white transition-colors leading-relaxed"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Autres animaux */}
          <div>
            <p className="text-white/40 font-mono uppercase text-xs tracking-widest mb-4">
              {lbl.col3}
            </p>
            <ul className="space-y-2.5">
              {AUTRES_ANIMAUX_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}/${getCategorySlug(link.href.slice(1), locale)}`}
                    className="text-xs text-white/60 hover:text-white transition-colors leading-relaxed"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Symptomes + Produits */}
          <div>
            <p className="text-white/40 font-mono uppercase text-xs tracking-widest mb-4">
              {lbl.col4}
            </p>
            <ul className="space-y-2.5">
              {GUIDES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-xs text-white/60 hover:text-white transition-colors leading-relaxed"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6 space-y-4">

          {/* Medical disclaimer */}
          <p className="text-[10px] text-white/20 leading-relaxed font-mono max-w-2xl">
            {lbl.medical}
          </p>

          {/* Affiliate disclaimer */}
          <p className="text-[11px] text-white/30 leading-relaxed font-mono max-w-2xl">
            {lbl.affiliate}
          </p>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center flex-wrap gap-5">
              <Link
                href={`/${locale}/mentions-legales`}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                {lbl.legal}
              </Link>
              <Link
                href={`/${locale}/confidentialite`}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                {lbl.privacy}
              </Link>
              <Link
                href={`/${locale}/a-propos`}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                {lbl.about}
              </Link>
            </div>
            <p className="text-xs text-white/30 shrink-0">
              © {new Date().getFullYear()} Pawmedic. {lbl.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
