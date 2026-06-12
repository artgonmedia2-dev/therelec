import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Mentions Légales — Politique de Confidentialité RGPD",
  description: "Mentions légales, politique de confidentialité RGPD et CGV de Therelec.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://therelec.fr/mentions-legales" },
}

export default function MentionsLegalesPage() {
  return (
    <>
      <section className="pt-28 pb-16 bg-gray-50 border-b border-gray-200">
        <div className="container-site">
          <h1 className="text-4xl font-black text-gray-900 mb-3">Mentions légales</h1>
          <p className="text-gray-500">Dernière mise à jour : 10 juin 2026</p>
          <nav className="flex flex-wrap gap-4 mt-6">
            {["Informations légales", "Politique de confidentialité", "CGV", "Certifications"].map(
              (section) => (
                <a
                  key={section}
                  href={`#${section.toLowerCase().replace(/\s+/g, "-").replace(/'/g, "")}`}
                  className="text-[#04599c] hover:underline text-sm font-medium"
                >
                  {section}
                </a>
              )
            )}
          </nav>
        </div>
      </section>

      <section className="py-16">
        <div className="container-site max-w-4xl">
          <div className="prose prose-gray max-w-none space-y-12">
            {/* Informations légales */}
            <div id="informations-légales">
              <h2 className="text-2xl font-black text-gray-900 mb-6 pb-2 border-b border-gray-200">
                1. Informations légales
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong className="text-gray-900">Raison sociale :</strong> Therelec
                </p>
                <p>
                  <strong className="text-gray-900">Activité :</strong> Génie Électrique et Climatique
                </p>
                <p>
                  <strong className="text-gray-900">Siège social :</strong> Neuilly-sur-Seine, 92200,
                  Hauts-de-Seine, France
                </p>
                <p>
                  <strong className="text-gray-900">SIRET :</strong> [SIRET à renseigner]
                </p>
                <p>
                  <strong className="text-gray-900">TVA intracommunautaire :</strong> [Numéro TVA]
                </p>
                <p>
                  <strong className="text-gray-900">Téléphone :</strong>{" "}
                  <a href="tel:+33699699428" className="text-[#04599c] hover:underline">
                    06 99 69 94 28
                  </a>
                </p>
                <p>
                  <strong className="text-gray-900">Email :</strong>{" "}
                  <a href="mailto:contact@therelec.fr" className="text-[#04599c] hover:underline">
                    contact@therelec.fr
                  </a>
                </p>
                <p>
                  <strong className="text-gray-900">Assurance décennale :</strong> [Numéro police]
                </p>
                <p>
                  <strong className="text-gray-900">Hébergeur du site :</strong> Vercel Inc., 440 N
                  Barranca Ave #4133, Covina, CA 91723, USA
                </p>
              </div>
            </div>

            {/* Certifications */}
            <div id="certifications">
              <h2 className="text-2xl font-black text-gray-900 mb-6 pb-2 border-b border-gray-200">
                2. Certifications professionnelles
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong className="text-gray-900">Certification Qualifelec :</strong> Numéro de
                  certification [N° Qualifelec] — Valide jusqu&apos;au 31 décembre 2025
                </p>
                <p>
                  <strong className="text-gray-900">Certification RGE QualiPac :</strong> Numéro de
                  certification [N° QualiPac] — Valide jusqu&apos;au 31 décembre 2025
                </p>
                <p>
                  Ces certifications sont vérifiables sur les sites officiels Qualifelec.fr et
                  qualipac.fr.
                </p>
              </div>
            </div>

            {/* Politique de confidentialité */}
            <div id="politique-de-confidentialité">
              <h2 className="text-2xl font-black text-gray-900 mb-6 pb-2 border-b border-gray-200">
                3. Politique de confidentialité (RGPD)
              </h2>
              <div className="space-y-6 text-gray-600">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Collecte des données personnelles
                  </h3>
                  <p>
                    Therelec collecte des données personnelles (nom, téléphone, email, code postal)
                    uniquement lorsque vous utilisez nos formulaires de contact. Ces données sont
                    utilisées exclusivement pour répondre à vos demandes de devis et vous contacter
                    dans le cadre de nos services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Base légale</h3>
                  <p>
                    Le traitement de vos données est basé sur votre consentement explicite (cocher la
                    case RGPD dans le formulaire) et sur l&apos;intérêt légitime de Therelec pour
                    répondre à vos demandes.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Conservation des données</h3>
                  <p>
                    Vos données sont conservées pendant 3 ans à compter de votre dernier contact, puis
                    supprimées automatiquement, sauf obligation légale contraire.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Vos droits</h3>
                  <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                  <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                    <li>Droit d&apos;accès à vos données</li>
                    <li>Droit de rectification</li>
                    <li>Droit à l&apos;effacement (droit à l&apos;oubli)</li>
                    <li>Droit à la portabilité</li>
                    <li>Droit d&apos;opposition au traitement</li>
                  </ul>
                  <p className="mt-3">
                    Pour exercer vos droits, contactez notre DPO à :{" "}
                    <a href="mailto:contact@therelec.fr" className="text-[#04599c] hover:underline">
                      contact@therelec.fr
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Cookies</h3>
                  <p>
                    Ce site utilise des cookies techniques nécessaires au bon fonctionnement du site.
                    Aucun cookie de traçage n&apos;est utilisé sans votre consentement explicite.
                  </p>
                </div>
              </div>
            </div>

            {/* CGV */}
            <div id="cgv">
              <h2 className="text-2xl font-black text-gray-900 mb-6 pb-2 border-b border-gray-200">
                4. Conditions Générales de Vente (CGV)
              </h2>
              <div className="space-y-6 text-gray-600">
                <p>
                  Les présentes CGV régissent les relations contractuelles entre Therelec et ses
                  clients pour toutes prestations de travaux électriques et de climatisation.
                </p>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Devis et commandes</h3>
                  <p>
                    Tout devis est valable 30 jours à compter de sa date d&apos;émission. La commande
                    n&apos;est ferme qu&apos;après signature du devis par le client. Les devis sont
                    gratuits et sans engagement.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Prix et facturation</h3>
                  <p>
                    Les prix sont indiqués HT et TTC. La TVA applicable est de 10% pour les travaux
                    de rénovation dans les logements de plus de 2 ans, et 20% pour les locaux
                    professionnels et constructions neuves.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Garanties</h3>
                  <p>
                    Tous nos travaux sont garantis 2 ans pour les défauts de conformité, 10 ans pour
                    les dommages relevant de la garantie décennale. Nos assurances couvrent l&apos;ensemble
                    de nos interventions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Litiges</h3>
                  <p>
                    En cas de litige, nous vous invitons à nous contacter en premier lieu à{" "}
                    <a href="mailto:contact@therelec.fr" className="text-[#04599c] hover:underline">
                      contact@therelec.fr
                    </a>
                    . En cas d&apos;échec de la médiation amiable, les tribunaux compétents seront
                    ceux du ressort de Nanterre.
                  </p>
                </div>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-6 pb-2 border-b border-gray-200">
                5. Propriété intellectuelle
              </h2>
              <p className="text-gray-600">
                L&apos;ensemble des contenus présents sur ce site (textes, images, logos, design) sont
                la propriété exclusive de Therelec et sont protégés par le droit d&apos;auteur. Toute
                reproduction, même partielle, est interdite sans autorisation écrite préalable.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Therelec. Tous droits réservés.</p>
            <Link href="/" className="text-[#04599c] hover:underline text-sm">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
