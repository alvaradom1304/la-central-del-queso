import type { Metadata } from "next";
import "./award.css";
import { display, accent } from "./award-fonts";
import AwardShell from "@/components/award/AwardShell";
import HeroStage from "@/components/award/HeroStage";
import FincaIntro from "@/components/award/FincaIntro";
import Pizarra from "@/components/award/Pizarra";
import Canasta from "@/components/award/Canasta";
import OpenCart from "@/components/award/OpenCart";
import SliceCard from "@/components/award/SliceCard";
import FeriaStatus from "@/components/award/FeriaStatus";
import Reveals from "@/components/award/Reveals";
import { products } from "@/lib/products";
import { locations } from "@/lib/locations";
import { BUSINESS_PHONE, BUSINESS_PHONE_DISPLAY, whatsappUrl } from "@/lib/whatsapp";
import { crc, verifiedText } from "@/lib/award/copy";

const DESCRIPTION =
  "Semiduro de Turrialba, palmito hilado a mano y natilla de rancho. Arme su pedido, confírmelo por WhatsApp y recójalo en la feria de Guadalupe (sábados) o Hatillo (domingos).";

export const metadata: Metadata = {
  title: "La Central del Queso · Semiduro de Turrialba y quesos de feria",
  description: DESCRIPTION,
  openGraph: {
    title: "La Central del Queso",
    description: DESCRIPTION,
    type: "website",
    locale: "es_CR",
  },
};

// Se ejecuta antes de pintar el titular: solo entonces se oculta para la entrada animada.
// Si el JS no llega, la animación CSS de respaldo (award.css) lo muestra igualmente.
const PRE_PAINT = "document.documentElement.classList.add('aw-js')";

const semiduro = products.find((p) => p.id === "semiduro-tradicional")!;
// Se omiten las frases no verificadas («desde 1980») hasta que el negocio confirme el dato.
const semiduroTexto = verifiedText(semiduro.description);

// Datos estructurados solo con información de lib/ (sin dirección: el negocio vende en ferias).
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "La Central del Queso",
  description: DESCRIPTION,
  telephone: "+" + BUSINESS_PHONE,
  makesOffer: products.map((p) => ({
    "@type": "Offer",
    price: p.priceCRC,
    priceCurrency: "CRC",
    itemOffered: { "@type": "Product", name: p.name, description: verifiedText(p.description) },
  })),
};

const SENSES = [
  { key: "firmeza", label: "Firmeza", hint: "Textura firme" },
  { key: "fundicion", label: "Fundición", hint: "Dora al sartén sin deshacerse" },
  { key: "salinidad", label: "Sal", hint: "Punto exacto de sal" },
  { key: "intensidad", label: "Intensidad", hint: "Gratina con carácter" },
] as const;

export default function Home() {
  return (
    <div className={`aw ${display.variable} ${accent.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <AwardShell>
        <main id="contenido">
          <FincaIntro />
          <HeroStage>
            <div className="aw-hero">
              <p className="aw-eyebrow">Semiduro de Turrialba · Ferias de Guadalupe y Hatillo</p>
              <h1 className="aw-title">
                <span className="aw-line" data-depth="0.55"><span className="aw-line__inner">Queso</span></span>{" "}
                <span className="aw-line" data-depth="1"><span className="aw-line__inner">que sí <em>dora</em></span></span>{" "}
                <span className="aw-line" data-depth="0.3"><span className="aw-line__inner">en el sartén.</span></span>
              </h1>
              <p className="aw-lede">
                Semiduro de Turrialba, palmito hilado a mano y natilla de rancho. Arme su pedido aquí, confírmelo por
                WhatsApp y recójalo en la feria.
              </p>
              <div className="aw-actions">
                <a className="aw-cta" href="#pizarra" data-attract>Ver la pizarra de precios</a>
                <button type="button" className="aw-cut" data-cut-toggle aria-pressed="false">
                  <span className="aw-cut__icon" aria-hidden="true" />
                  Cortar la cuña
                </button>
              </div>
              <SliceCard />
              <p className="aw-hero__days"><a className="aw-link" href="#ferias" data-attract>Sábado Guadalupe · Domingo Hatillo</a></p>
              <p className="aw-sticker">
                <span>Semiduro</span>
                <strong>{crc(semiduro.priceCRC)}</strong>
                <span>por {semiduro.unit}</span>
              </p>
              <p className="aw-scrollhint" aria-hidden="true">Baje para cortar la cuña</p>
            </div>

            <article className="aw-step" aria-labelledby="la-cuna">
              <p className="aw-eyebrow">{semiduro.badge} · {semiduro.name}</p>
              <h2 id="la-cuna" className="aw-h2">Firme al cuchillo, <em>dorado</em> al fuego.</h2>
              <p className="aw-body">{semiduroTexto}</p>
            </article>

            <article className="aw-step" aria-labelledby="perfil">
              <p className="aw-eyebrow">Perfil de la casa</p>
              <h2 id="perfil" className="aw-h2">Cuatro números <em>que se sienten</em>.</h2>
              <dl className="aw-senses">
                {SENSES.map((s) => (
                  <div key={s.key} className="aw-sense" style={{ ["--v" as string]: semiduro.sensory[s.key] / 5 }}>
                    <dt>{s.label}</dt>
                    <dd>
                      <span className="aw-sense__num">{semiduro.sensory[s.key]}<small>/5</small></span>
                      <span className="aw-sense__bar" aria-hidden="true"><span /></span>
                      <span className="aw-sense__hint">{s.hint}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </article>

            <article className="aw-step" aria-labelledby="usos">
              <p className="aw-eyebrow">En la cocina</p>
              <h2 id="usos" className="aw-h2">Del puesto <em>a su sartén</em>.</h2>
              <ul className="aw-uses">
                {semiduro.idealUses.map((u) => <li key={u}>{u}</li>)}
              </ul>
              <p className="aw-body">{semiduro.pairingNote}</p>
              <a className="aw-cta" href="#pizarra" data-attract>Ver Semiduro en la pizarra · {crc(semiduro.priceCRC)}/{semiduro.unit}</a>
            </article>
          </HeroStage>

          <section id="pizarra" className="aw-section aw-section--board" aria-labelledby="pizarra-title">
            <header className="aw-head">
              <p className="aw-eyebrow">La pizarra del puesto</p>
              <h2 id="pizarra-title" className="aw-h2">Precios <em>a la vista</em>.</h2>
              <p className="aw-body">Agregue lo que quiere llevar. Al final se arma el mensaje de WhatsApp con su pedido.</p>
            </header>
            <Pizarra />
          </section>

          <section id="canasta" className="aw-section aw-section--calc" aria-labelledby="canasta-title">
            <header className="aw-head">
              <p className="aw-eyebrow">Calculadora de feria</p>
              <h2 id="canasta-title" className="aw-h2">¿Cuánto queso <em>para la semana</em>?</h2>
              <p className="aw-body">Indique cuántos son en casa y cada cuánto comen queso. Le sugerimos una canasta que puede ajustar después.</p>
            </header>
            <Canasta />
          </section>

          <section id="ferias" className="aw-section aw-section--ferias" aria-labelledby="ferias-title">
            <header className="aw-head">
              <p className="aw-eyebrow">Dónde encontrarnos</p>
              <h2 id="ferias-title" className="aw-h2">Fines de semana <em>en la feria</em>.</h2>
            </header>
            <div className="aw-ferias">
              {locations.map((l) => (
                <article key={l.id} className="aw-feria">
                  <p className="aw-feria__day">{l.daysHours.split(" ")[0]}</p>
                  <h3>{l.name}</h3>
                  <p className="aw-feria__hours">{l.daysHours}</p>
                  <FeriaStatus daysHours={l.daysHours} />
                  <p className="aw-feria__stand">{l.standInfo}</p>
                  <p className="aw-feria__links">
                    <a href={l.mapsUrl} target="_blank" rel="noopener noreferrer">Google Maps<span className="aw-sr"> hacia {l.name} (abre en otra pestaña)</span></a>
                    <a href={l.wazeUrl} target="_blank" rel="noopener noreferrer">Waze<span className="aw-sr"> hacia {l.name} (abre en otra pestaña)</span></a>
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="pedido" className="aw-final" aria-labelledby="pedido-title">
            <p className="aw-eyebrow">Pedido directo</p>
            <h2 id="pedido-title" className="aw-final__title">Pídalo por <em>WhatsApp</em>.</h2>
            <p className="aw-body">
              Revise su pedido y envíelo con un toque. Coordinamos peso, entrega en feria y pago por Sinpe Móvil.
            </p>
            <div className="aw-actions aw-actions--center">
              <OpenCart className="aw-cta aw-cta--light">Revisar mi pedido</OpenCart>
              <a className="aw-link aw-link--light" href={whatsappUrl("¡Hola! Quisiera hacer un pedido.")} target="_blank" rel="noopener noreferrer" data-attract>
                Escribir al {BUSINESS_PHONE_DISPLAY}<span className="aw-sr"> (abre WhatsApp en otra pestaña)</span>
              </a>
            </div>
          </section>
        </main>

        <Reveals />
        <footer className="aw-footer">
          <p className="aw-footer__brand">La Central del Queso</p>
          <p>Semiduro de Turrialba y quesos de feria en las ferias del agricultor de Guadalupe y Hatillo.</p>
          <p>WhatsApp {BUSINESS_PHONE_DISPLAY} · Precios de referencia sujetos a confirmación · Fotografías ilustrativas.</p>
        </footer>
      </AwardShell>
    </div>
  );
}
