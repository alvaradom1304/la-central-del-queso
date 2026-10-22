import SeleccionCasa from "@/components/claude/SeleccionCasa";
import CalculadoraFeria from "@/components/claude/CalculadoraFeria";
import { BUSINESS_PHONE_DISPLAY, whatsappUrl } from "@/lib/whatsapp";
import { IlusProducto } from "@/components/claude/Ilustraciones";
import { BotonPedido, PedidoProvider } from "@/components/claude/pedido";
import Pizarra from "@/components/claude/Pizarra";
import { FERIAS, bloqueNegocio, colones } from "@/components/claude/datos";

const NAV = [
  { href: "#quesos", texto: "Quesos" },
  { href: "#calculadora-sommelier", texto: "Calculadora de feria" },
  { href: "#ferias", texto: "Ferias" },
  { href: "#negocios", texto: "Negocios" },
];

export default function ElPuesto() {
  return (
    <div className="cq min-h-screen">
      <PedidoProvider>
        <a href="#quesos" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] cq-boton cq-boton-tinta">
          Saltar a los quesos
        </a>
        <div className="cq-toldo" aria-hidden="true" />
        <div className="cq-toldo-borde" aria-hidden="true" />

        <header className="sticky top-0 z-40 bg-[#F7F2E8]/90 backdrop-blur border-b-2 border-[#1C2620]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8 h-[68px] flex items-center justify-between gap-4">
            <a href="#" className="flex items-center gap-3 min-w-0">
              <svg viewBox="0 0 40 40" className="w-10 h-10 shrink-0" aria-hidden="true">
                <circle cx="20" cy="20" r="18" fill="#EDB843" stroke="#1C2620" strokeWidth="2" />
                <path d="M9 25 L29 15 L31 25 Z" fill="#F8EBC2" stroke="#1C2620" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="23" cy="22" r="1.4" fill="#1C2620" opacity="0.4" />
              </svg>
              <span className="leading-none">
                <span className="cq-display block text-lg sm:text-xl">La Central del Queso</span>
                <span className="block text-[0.68rem] font-bold tracking-[0.18em] uppercase text-[#4A5A50] mt-1">
                  Quesos Doña Martha
                </span>
              </span>
            </a>
            <nav aria-label="Principal" className="hidden md:flex items-center gap-7 font-semibold">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className="hover:text-[#B14F2C] transition-colors">
                  {n.texto}
                </a>
              ))}
            </nav>
            <BotonPedido />
          </div>
        </header>

        <main>
          <nav className="art-mobile-nav" aria-label="Secciones">{NAV.map(n=><a key={n.href} href={n.href}>{n.texto}</a>)}</nav>
          <section className="maison-hero">
            <img src="/hero_luxury_maison.jpg" width="1376" height="768" alt="Queso de corteza rústica sobre piedra, junto a un frasco de miel y madera" fetchPriority="high" />
            <div className="maison-hero-copy"><div className="maison-kicker">QUESOS DOÑA MARTHA · COSTA RICA</div><h1 className="cq-display cq-h1">El arte de<br/>compartir<br/><em>lo nuestro.</em></h1><p>Hay sabores que invitan a quedarse un rato más. Quesos, natilla y tradición para llevar de la feria al centro de su mesa.</p><div className="art-hero-actions"><a href="#quesos" className="cq-boton cq-boton-tinta">Descubrir nuestros quesos ↗</a><a href="#calculadora-sommelier" className="cq-boton cq-boton-linea">Calcular mi canasta</a></div></div>
            <div className="maison-seal" aria-hidden="true"><div>LA CENTRAL<strong>DM</strong>QUESOS · TRADICIÓN</div></div>
            <div className="maison-hero-bottom"><span>GUADALUPE · SÁBADOS &nbsp; / &nbsp; HATILLO · DOMINGOS</span><span>De la feria, con cariño.</span></div>
          </section>

          {/* Franja de datos */}
          <div className="bg-[#2C5A3C] text-[#F7F2E8] border-y-2 border-[#1C2620]">
            <ul className="max-w-[1200px] mx-auto px-4 sm:px-8 py-5 grid grid-cols-2 lg:grid-cols-4 gap-4 font-semibold text-sm sm:text-base">
              <li>Tradición de nuestra mesa</li>
              <li>Sábados en Guadalupe, domingos en Hatillo</li>
              <li>Pruebe antes de llevar en el puesto</li>
              <li>Pago por SINPE Móvil</li>
            </ul>
          </div>

          <SeleccionCasa />
          <CalculadoraFeria />

          {/* Pizarra */}
          <section id="quesos" className="scroll-mt-24 max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <p className="cq-mano text-2xl text-[#B14F2C]">precios de referencia</p>
                <h2 className="cq-display cq-h2">
                  Nuestra carta <em>de quesos</em>
                </h2>
              </div>
              <p className="max-w-sm text-[#4A5A50] cq-pretty">
                Precios en colones. Los quesos por kilo van de medio en medio kilo; el total exacto se confirma al pesar.
              </p>
            </div>
            <Pizarra />
          </section>

          {/* Cómo pedir */}
          <section id="como-pedir" className="scroll-mt-24 bg-[#ECE1C9] border-y-2 border-[#1C2620]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
              <h2 className="cq-display cq-h2 max-w-2xl">
                Como en el puesto, <em>pero desde el teléfono.</em>
              </h2>
              <ol className="mt-10 grid gap-6 md:grid-cols-3">
                {[
                  ["Arme su pedido", "Elija en la pizarra lo que quiere llevar y cuánto."],
                  ["Envíelo por WhatsApp", "El mensaje sale listo con su pedido y dónde lo recoge. Usted solo lo envía."],
                  ["Recoja y pague", "Le confirmamos disponibilidad y el total al pesar. Paga por SINPE Móvil y lo recoge en la feria."],
                ].map(([t, d], i) => (
                  <li key={t} className="cq-tarjeta p-6">
                    <span className="cq-display text-6xl text-[#B14F2C] leading-none">{i + 1}</span>
                    <h3 className="cq-display text-2xl mt-3">{t}</h3>
                    <p className="mt-2 text-[#4A5A50] cq-pretty">{d}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Ferias */}
          <section id="ferias" className="scroll-mt-24 max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
            <h2 className="cq-display cq-h2">
              Dónde estamos <em>cada fin de semana</em>
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {FERIAS.map((f) => (
                <article key={f.id} className="cq-boleto p-6 sm:p-8">
                  <span className="cq-muesca cq-muesca-izq" aria-hidden="true" />
                  <span className="cq-muesca cq-muesca-der" aria-hidden="true" />
                  <p className="cq-eyebrow text-[#2C5A3C]">{f.diaTexto}</p>
                  <h3 className="cq-display text-4xl mt-2">Feria de {f.nombre}</h3>
                  <p className="mt-2 font-semibold tabular-nums">{f.horario}</p>
                  <p className="mt-1 text-[#4A5A50]">{f.puesto}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href={f.mapsUrl} target="_blank" rel="noopener noreferrer" className="cq-boton cq-boton-linea !h-11">
                      Google Maps
                    </a>
                    <a href={f.wazeUrl} target="_blank" rel="noopener noreferrer" className="cq-boton cq-boton-linea !h-11">
                      Waze
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Negocios */}
          <section id="negocios" className="scroll-mt-24 bg-[#1E4029] text-[#F7F2E8] border-y-2 border-[#1C2620]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-24 grid gap-10 md:grid-cols-[1.2fr_0.8fr] items-center">
              <div>
                <p className="cq-mano text-2xl text-[#EDB843]">para sodas, restaurantes y pizzerías</p>
                <h2 className="cq-display cq-h2 mt-1">¿Cocina para muchos?</h2>
                <p className="mt-5 text-lg text-[#F7F2E8]/80 max-w-xl cq-pretty">
                  {bloqueNegocio.name}: {colones(bloqueNegocio.priceCRC)} el bloque, que sale a{" "}
                  {colones(bloqueNegocio.priceCRC / 2.5)} el kilo. Escríbanos y le cotizamos según su volumen.
                </p>
                <a
                  href={whatsappUrl("Hola, tengo un negocio de comida y quisiera cotizar queso por volumen con La Central del Queso.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cq-boton cq-boton-crema mt-8"
                >
                  Cotizar por WhatsApp
                </a>
              </div>
              <IlusProducto tipo="bloque" className="w-full max-w-[320px] mx-auto" />
            </div>
          </section>
        </main>

        <footer className="bg-[#1C2620] text-[#F7F2E8]/80 pb-28 md:pb-0">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-12 grid gap-8 md:grid-cols-3 text-sm">
            <div>
              <p className="cq-display text-2xl text-[#F7F2E8]">La Central del Queso</p>
              <p className="mt-1">Quesos Doña Martha · Guadalupe y Hatillo.</p>
            </div>
            <div>
              <p className="font-semibold text-[#F7F2E8]">Pedidos por WhatsApp</p>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {BUSINESS_PHONE_DISPLAY}
              </a>
              <p className="mt-1">Pago por SINPE Móvil.</p>
            </div>
            <p className="text-[#F7F2E8]/60">
              Precios de referencia en colones; el total por kilo se confirma al pesar. Prepare su canasta y confirme su pedido con nosotros por WhatsApp.
            </p>
          </div>
        </footer>
      </PedidoProvider>
    </div>
  );
}
