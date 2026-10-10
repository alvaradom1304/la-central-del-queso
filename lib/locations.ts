export interface Location {
  id: string;
  name: string;
  daysHours: string;
  standInfo: string;
  mapsUrl: string;
  wazeUrl: string;
}

export const locations: Location[] = [
  {
    id: "guadalupe",
    name: "Feria del Agricultor de Guadalupe",
    daysHours: "Sábados de 6:00 AM a 1:00 PM",
    standInfo: "Puesto tradicional de Doña Martha (Frente al área central)",
    mapsUrl: "https://maps.app.goo.gl/sP6rZgLRfiuueZDX7",
    wazeUrl: "https://waze.com/ul?q=Feria%20del%20Agricultor%20Guadalupe",
  },
  {
    id: "hatillo",
    name: "Feria del Agricultor de Hatillo",
    daysHours: "Domingos de 6:00 AM a 1:30 PM",
    standInfo: "Sector lácteos artesanales",
    mapsUrl: "https://maps.app.goo.gl/6U9jdZn92ayWhnD9A",
    wazeUrl: "https://waze.com/ul?q=Feria%20del%20Agricultor%20Hatillo",
  }
];
