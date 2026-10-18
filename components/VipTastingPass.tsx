"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  Gift,
  Sparkles,
  BellRing,
  CheckCircle2,
  Clock,
  Star,
  ArrowRight,
  ShieldCheck,
  Users,
} from "lucide-react";

const TASTING_OPTIONS = [
  "Semiduro de Turrialba (Insignia)",
  "Queso Ahumado en Leña Natural",
  "Queso Palmito Hilado a Mano",
  "Queso Maduro Selección Especial",
];

const PICKUP_OPTIONS = [
  { id: "Guadalupe (Sábado)", label: "Feria de Guadalupe · Sábados", badge: "Fila Rápida" },
  { id: "Hatillo (Domingo)", label: "Feria de Hatillo · Domingos", badge: "Fila Rápida" },
  { id: "Domicilio GAM", label: "Entrega a Domicilio GAM", badge: "Ruta Semanal" },
];

const TESTIMONIALS = [
  {
    name: "Doña Cecilia Madrigal",
    role: "Clienta en Feria de Guadalupe desde 1998",
    quote:
      "En mi casa no entra otro queso para el gallo pinto. Uno lo pone al sartén y dora parejito sin soltar agua ni pegarse. Apartarlo por WhatsApp entre semana es una bendición.",
    highlight: "26 años comprando Semiduro",
  },
  {
    name: "Chef Roberto Solano",
    role: "Propietario de Cafetería & Soda en San Pedro",
    quote:
      "El bloque institucional de 2.5 kg nos cambió la operación: siempre viene con el mismo punto de sal y rinde muchísimo más que los quesos comerciales de supermercado.",
    highlight: "Cliente Mayorista B2B",
  },
  {
    name: "Familia Vargas Mora",
    role: "Clientes en Feria de Hatillo",
    quote:
      "La natilla casera y el queso palmito saben a finca de verdad. Llegamos el domingo, recogemos nuestra bolsa ya pesada sin hacer fila y nos dan a probar el ahumado.",
    highlight: "Canasta Semanal Familiar",
  },
];

export default function VipTastingPass() {
  const [visitorName, setVisitorName] = useState("");
  const [selectedPickup, setSelectedPickup] = useState(PICKUP_OPTIONS[0].id);
  const [selectedTasting, setSelectedTasting] = useState(TASTING_OPTIONS[0]);
  const [clubFrequency, setClubFrequency] = useState<"semanal" | "quincenal">("semanal");

  const passCode = useMemo(() => {
    const clean = visitorName.trim().toUpperCase().replace(/[^A-Z]/g, "");
    const prefix = clean.slice(0, 3).padEnd(3, "X");
    const num = ((visitorName.length * 137) % 899) + 100;
    return `LCQ-${prefix}${num}`;
  }, [visitorName]);

  const handleActivatePass = (e: React.FormEvent) => {
    e.preventDefault();
    const nameToUse = visitorName.trim() || "Cliente de la Web";
    const msg =
      `🎟️ *PASE VIP DE CATA Y CERO FILA — LA CENTRAL DEL QUESO*\n` +
      `----------------------------------------\n` +
      `🔑 *Código de Pase:* #${passCode}\n` +
      `👤 *Nombre:* ${nameToUse}\n` +
      `📍 *Modalidad:* ${selectedPickup}\n` +
      `🧀 *Degustación elegida:* ${selectedTasting}\n` +
      `🎁 *Beneficio incluido:* Cata gratuita + 100g de cortesía (Natilla o Cuajada) en primera compra mayor a ₡6,000 + Retiro sin fila.\n` +
      `----------------------------------------\n` +
      `_Hola, acabo de generar mi Pase VIP en la web. Por favor avísenme cuando llegue el lote fresco de esta semana._`;

    window.open(
      `https://wa.me/50688888888?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const handleJoinThursdayClub = () => {
    const msg =
      `🔔 *ALTA EN EL CLUB "EL QUESERO FIEL" (${clubFrequency.toUpperCase()})*\n` +
      `----------------------------------------\n` +
      `Hola, quiero recibir el aviso prioritario de los jueves cuando llega el camión con el lote fresco de Turrialba para apartar mi canasta ${clubFrequency} y acumular mi regalía cada 4 pedidos.`;

    window.open(
      `https://wa.me/50688888888?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <section
      id="club-vip"
      className="py-24 sm:py-32 px-4 sm:px-8 bg-gradient-to-b from-[#120E0A] via-[#0D1510] to-[#0E1712] border-t border-white/10 relative overflow-hidden"
    >
      {/* Barra Superior de Frescura Semanal */}
      <div className="max-w-[1440px] mx-auto mb-16">
        <div className="bg-[#16110C] text-[#F7F4EC] rounded-3xl p-5 sm:px-8 sm:py-6 shadow-2xl border border-[#DDA13E]/35 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="relative flex h-3.5 w-3.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DDA13E] opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#DDA13E]" />
            </span>
            <div>
              <span className="font-mono text-2xs uppercase tracking-widest text-[#DDA13E] font-bold block">
                Monitor de Frescura Semanal · Origen Volcán Turrialba
              </span>
              <p className="font-serif text-lg sm:text-xl font-semibold text-[#F7F4EC]">
                Lote artesanal de la semana en curso: Apartados abiertos sin costo en línea
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className="bg-white/5 px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-1.5 text-[#F7F4EC]/85">
              <Clock className="w-3.5 h-3.5 text-[#DDA13E]" />
              <span>Cierre de apartados: Viernes 6:00 PM</span>
            </span>
            <span className="bg-[#B85634] text-white px-3.5 py-2 rounded-xl font-bold tabular-nums">
              18 cupos de apartado sin fila disponibles
            </span>
          </div>
        </div>
      </div>

      {/* BLOQUE PRINCIPAL: GENERADOR DE PASE DORADO DE CATA VIP */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Columna Izquierda: Formulario Interactivo en 10 Segundos (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDA13E]/15 border border-[#DDA13E]/40 text-[#DDA13E] font-mono text-xs uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5" />
            <span>Invitación Especial de Primera Visita</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl font-semibold text-[#F7F4EC] leading-[1.05]">
            ¿Quiere probar antes de decidir?{" "}
            <span className="italic font-light text-[#DDA13E]">
              Genere su Pase de Cata Gratis.
            </span>
          </h2>

          <p className="text-[#F7F4EC]/75 text-sm sm:text-base font-light leading-relaxed">
            En la feria nunca vendemos a ciegas: primero le damos a probar una tajadita. Cree aquí
            su <strong>Pase Digital VIP</strong> en 10 segundos y desbloquee 3 beneficios
            exclusivos para este fin de semana:
          </p>

          <ul className="space-y-2.5 text-xs sm:text-sm text-[#F7F4EC]/85">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#DDA13E] shrink-0" />
              <span>
                <strong>Degustación guiada gratuita</strong> de nuestras variedades en el puesto.
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#DDA13E] shrink-0" />
              <span>
                <strong>100g de cortesía</strong> (Natilla de Rancho o Cuajada) en su compra mayor
                a ₡6,000.
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#DDA13E] shrink-0" />
              <span>
                <strong>Fila Express & Aviso de Viernes:</strong> Le apartamos su queso fresco
                antes de que se agote.
              </span>
            </li>
          </ul>

          {/* Formulario Interactivo que Alimenta el Boleto en Vivo */}
          <form
            onSubmit={handleActivatePass}
            className="bg-[#1B130D] p-6 sm:p-7 rounded-3xl border border-white/15 shadow-2xl space-y-4"
          >
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#DDA13E] mb-1.5">
                1. ¿A nombre de quién emitimos el Pase VIP?
              </label>
              <input
                type="text"
                placeholder="Escriba su nombre y apellido (Ej: Andrés Mora)"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full min-h-[46px] bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-[#F7F4EC] placeholder:text-[#F7F4EC]/35 focus:outline-hidden focus:border-[#DDA13E]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#DDA13E] mb-1.5">
                2. ¿Dónde prefiere hacer válido su beneficio?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PICKUP_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedPickup(opt.id)}
                    className={`min-h-[54px] p-2.5 rounded-xl border text-left transition-all ${
                      selectedPickup === opt.id
                        ? "bg-[#DDA13E] text-[#0D1510] border-[#DDA13E] font-bold"
                        : "bg-black/35 text-[#F7F4EC] border-white/10 hover:border-white/30"
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] uppercase block ${
                        selectedPickup === opt.id ? "text-[#0D1510]/80" : "text-[#DDA13E]"
                      }`}
                    >
                      {opt.badge}
                    </span>
                    <span className="text-xs font-semibold leading-tight block mt-0.5">
                      {opt.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#DDA13E] mb-1.5">
                3. ¿Cuál queso desea degustar o apartar primero?
              </label>
              <select
                value={selectedTasting}
                onChange={(e) => setSelectedTasting(e.target.value)}
                className="w-full min-h-[46px] bg-[#0E0A07] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-[#F7F4EC] focus:outline-hidden focus:border-[#DDA13E]"
              >
                {TASTING_OPTIONS.map((t) => (
                  <option key={t} value={t} className="bg-[#16110C] text-[#F7F4EC]">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              data-cursor="ACTIVAR VIP"
              className="w-full min-h-[52px] bg-[#DDA13E] hover:bg-[#F0BA5C] text-[#0D1510] font-bold text-sm py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Ticket className="w-4 h-4" />
              <span>Activar Mi Pase VIP en WhatsApp (Gratis)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Columna Derecha: Boleto Dorado Interactivo en Vivo + Club del Quesero Fiel (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div
            layout
            className="bg-gradient-to-br from-[#1B2D22] via-[#121F17] to-[#0B140F] text-[#F7F4EC] rounded-[2rem] p-7 sm:p-9 border-2 border-[#DDA13E]/60 shadow-2xl relative overflow-hidden"
          >
            <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#DDA13E]/20 blur-3xl" />

            <div className="flex items-start justify-between gap-4 border-b border-dashed border-white/20 pb-5 relative z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[#DDA13E] font-mono text-2xs font-bold uppercase tracking-[0.25em]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pasaporte Oficial de Feria</span>
                </div>
                <h3 className="font-serif text-3xl font-semibold text-white mt-1">
                  La Central del Queso
                </h3>
                <p className="text-xs text-[#F7F4EC]/65">
                  Tradición Familiar Costarricense desde 1980
                </p>
              </div>

              <div className="bg-[#DDA13E] text-[#0D1510] px-3.5 py-2 rounded-xl text-right tabular-nums shadow-md">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider block opacity-80">
                  Código VIP
                </span>
                <span className="font-mono font-bold text-sm sm:text-base">#{passCode}</span>
              </div>
            </div>

            <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              <div className="bg-black/30 border border-white/10 rounded-2xl p-3.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#DDA13E] font-semibold block">
                  Titular del Pase
                </span>
                <span className="font-serif text-xl font-semibold text-white truncate block mt-0.5">
                  {visitorName.trim() || "Invitado Especial (Escriba su nombre)"}
                </span>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-3.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#DDA13E] font-semibold block">
                  Punto de Retiro / Entrega
                </span>
                <span className="font-serif text-xl font-semibold text-white block mt-0.5">
                  {selectedPickup}
                </span>
              </div>

              <div className="sm:col-span-2 bg-[#DDA13E]/15 border border-[#DDA13E]/40 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#DDA13E] font-bold block">
                    Cata + Regalía Desbloqueada
                  </span>
                  <span className="font-serif text-xl font-semibold text-white block">
                    {selectedTasting}
                  </span>
                  <span className="text-xs text-[#F7F4EC]/80 block mt-0.5">
                    + 100g de Natilla o Cuajada gratis en compra mayor a ₡6,000
                  </span>
                </div>
                <Gift className="w-8 h-8 text-[#DDA13E] shrink-0" />
              </div>
            </div>

            <div className="pt-4 border-t border-dashed border-white/20 flex items-center justify-between text-xs text-[#F7F4EC]/65 relative z-10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#DDA13E]" />
                <span>Sin pago por adelantado · Presente su WhatsApp en el puesto</span>
              </span>
              <span className="font-mono font-bold text-[#DDA13E] uppercase">Válido 2026</span>
            </div>
          </motion.div>

          {/* CLUB "EL QUESERO FIEL" */}
          <div className="bg-[#1B130D] rounded-3xl p-6 sm:p-7 border border-white/15 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="font-mono text-2xs font-bold uppercase tracking-widest text-[#DDA13E] flex items-center gap-1.5">
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Alerta del Camión de los Jueves</span>
                </span>
                <h4 className="font-serif text-2xl font-semibold text-[#F7F4EC]">
                  Únase al Club “El Quesero Fiel”
                </h4>
              </div>
              <div className="inline-flex bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setClubFrequency("semanal")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    clubFrequency === "semanal"
                      ? "bg-[#DDA13E] text-[#0D1510]"
                      : "text-[#F7F4EC]/65"
                  }`}
                >
                  Semanal
                </button>
                <button
                  type="button"
                  onClick={() => setClubFrequency("quincenal")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    clubFrequency === "quincenal"
                      ? "bg-[#DDA13E] text-[#0D1510]"
                      : "text-[#F7F4EC]/65"
                  }`}
                >
                  Quincenal
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#F7F4EC]/75 font-light leading-relaxed">
              Reciba un mensaje corto cada jueves cuando baja el queso recién cuajado de Turrialba.
              Aparte su pedido con prioridad y reciba{" "}
              <strong className="text-[#DDA13E]">
                un producto artesanal de cortesía en cada 4to pedido
              </strong>
              .
            </p>

            <button
              type="button"
              onClick={handleJoinThursdayClub}
              className="w-full min-h-[46px] bg-white/10 hover:bg-[#DDA13E] text-[#F7F4EC] hover:text-[#0D1510] border border-white/15 font-semibold text-xs sm:text-sm py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <BellRing className="w-4 h-4 text-[#DDA13E]" />
              <span>Recibir Aviso Prioritario de Lote ({clubFrequency})</span>
            </button>
          </div>
        </div>
      </div>

      {/* VOCES REALES DE LA FERIA */}
      <div className="max-w-[1440px] mx-auto mt-20 pt-16 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[#DDA13E] font-mono text-xs uppercase tracking-widest">
            <Users className="w-3.5 h-3.5" />
            <span>Confianza Ganada desde 1980</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-5xl font-semibold text-[#F7F4EC]">
            Lo que dicen las familias y cocinas que nos eligen cada semana
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-[#16110C] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#DDA13E]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#DDA13E] text-[#DDA13E]" />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider bg-white/5 text-[#DDA13E] border border-[#DDA13E]/30 px-2.5 py-1 rounded-full">
                    {t.highlight}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#F7F4EC]/80 italic leading-relaxed font-light">
                  “{t.quote}”
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <span className="font-serif font-semibold text-[#F7F4EC] text-lg block">
                  {t.name}
                </span>
                <span className="text-xs text-[#F7F4EC]/55 block">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
