import os

base_dir = 'src/web'
dirs = [
    f'{base_dir}/app',
    f'{base_dir}/components',
    f'{base_dir}/lib',
    f'{base_dir}/public',
]

for d in dirs:
    os.makedirs(d, exist_ok=True)

files = {
    f'{base_dir}/package.json': '''{
  "name": "la-central-del-queso-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.2.3"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.3"
  }
}''',
    f'{base_dir}/tsconfig.json': '''{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}''',
    f'{base_dir}/tailwind.config.ts': '''import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFFDD0",
        foliage: "#4CAF50",
        terracotta: "#E2725B",
      },
    },
  },
  plugins: [],
};
export default config;''',
    f'{base_dir}/postcss.config.js': '''module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};''',
    f'{base_dir}/next.config.mjs': '''/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;''',
    f'{base_dir}/app/globals.css': '''@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #faf9f6;
  color: #333333;
}''',
    f'{base_dir}/app/layout.tsx': '''import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "La Central del Queso | Doña Martha",
  description: "La calidez de la feria, la frescura de nuestra tradición en su mesa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}''',
    f'{base_dir}/app/page.tsx': '''export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 bg-cream">
        <h1 className="text-5xl font-serif text-terracotta mb-6">
          La Central del Queso
        </h1>
        <p className="text-xl max-w-2xl text-gray-700 mb-8">
          Hola, qué gusto saludarle. Somos la familia de Doña Martha. 
          Llevamos más de 30 años elaborando queso artesanal con la misma frescura 
          y calidez que usted encuentra en la feria, ahora directo a su hogar.
        </p>
        <button className="bg-foliage text-white px-8 py-3 rounded-full text-lg font-medium shadow hover:bg-green-700 transition-colors">
          Hacer Pedido por WhatsApp
        </button>
      </section>
    </main>
  );
}'''
}

for path, content in files.items():
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print('Next.js base structure created successfully.')
