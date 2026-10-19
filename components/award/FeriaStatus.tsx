"use client";

import { useEffect, useState } from "react";

/**
 * Estado en vivo de una feria a partir del horario de lib/locations.ts
 * («Sábados de 5:30 AM a 1:00 PM»), con la hora de Costa Rica.
 * No se pinta en el servidor (la hora es del visitante): evita desajustes de hidratación.
 */
const DAYS: Record<string, number> = { domingos: 0, lunes: 1, martes: 2, miércoles: 3, jueves: 4, viernes: 5, sábados: 6 };
const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function parse(daysHours: string) {
  const m = daysHours.toLowerCase().match(/^(\S+)\s+de\s+(\d{1,2}):(\d{2})\s*(am|pm)\s+a\s+(\d{1,2}):(\d{2})\s*(am|pm)/);
  if (!m || !(m[1] in DAYS)) return null;
  const toMin = (h: string, mm: string, ap: string) => ((Number(h) % 12) + (ap === "pm" ? 12 : 0)) * 60 + Number(mm);
  return { day: DAYS[m[1]], open: toMin(m[2], m[3], m[4]), close: toMin(m[5], m[6], m[7]), openLabel: `${m[2]}:${m[3]} ${m[4].toUpperCase()}`, closeLabel: `${m[5]}:${m[6]} ${m[7].toUpperCase()}` };
}

function nowInCostaRica() {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Costa_Rica", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export default function FeriaStatus({ daysHours }: { daysHours: string }) {
  const [label, setLabel] = useState<{ open: boolean; text: string } | null>(null);

  useEffect(() => {
    const s = parse(daysHours);
    if (!s) return;
    const update = () => {
      const n = nowInCostaRica();
      if (n.day === s.day && n.minutes >= s.open && n.minutes < s.close) {
        setLabel({ open: true, text: `Abierta ahora · hasta la ${s.closeLabel}` });
        return;
      }
      let days = (s.day - n.day + 7) % 7;
      if (days === 0 && n.minutes >= s.close) days = 7;
      const when = days === 0 ? "hoy" : days === 1 ? "mañana" : `el ${DAY_NAMES[s.day]} (en ${days} días)`;
      setLabel({ open: false, text: `Abre ${when} a las ${s.openLabel}` });
    };
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [daysHours]);

  if (!label) return null;
  return (
    <p className="aw-feria__status" data-open={label.open}>
      <span className="aw-feria__dot" aria-hidden="true" />
      {label.text}
    </p>
  );
}
