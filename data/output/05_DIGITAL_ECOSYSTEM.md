# Digital Ecosystem Architecture

## 1. Digital Ecosystem Overview
**Core Objective:** To seamlessly bridge the physical warmth and trust of the Feria del Agricultor with the convenience of digital ordering via WhatsApp, driving recurring local deliveries and B2B sales.

**Key Touchpoints:**

- **Feria del Agricultor Stand**: Primary physical touchpoint for customer acquisition, product tasting, and building initial trust.

- **WhatsApp Business**: Core digital channel for order placement, customer retention, and personalized conversational sales.

- **Digital Catalog & Landing Page**: Mobile-first showcase of the product portfolio, heritage storytelling, and direct routing to WhatsApp.

- **QR Codes on Packaging**: Physical-to-digital bridge printed on vacuum-sealed labels to drive frictionless repeat purchases.


## 2. Information Architecture & Sitemap

### Inicio (Home)
- **Content Focus:** Doña Martha's 30-year family heritage, hero products (Queso Semiduro & Turrialba), and the warmth of the traditional feria.
- **Primary CTA:** Hacer Pedido por WhatsApp

### Nuestros Productos (Catalog)
- **Content Focus:** Artisanal dairy portfolio, vacuum-sealed freshness, product combos, and B2B wholesale options.
- **Primary CTA:** Ver Combos y Ordenar

### Nuestra Historia (Heritage)
- **Content Focus:** The family legacy of Doña Martha, traditional recipes, and commitment to local, non-industrial quality.
- **Primary CTA:** Conocer a Doña Martha

### Pedidos y Entregas (How it Works)
- **Content Focus:** Explanation of the scheduled local delivery service, coverage areas, and how to order via WhatsApp.
- **Primary CTA:** Consultar Horario de Entrega


## 3. UX/UI User Flows

**Scenario:** Feria Customer transitioning to Repeat Digital Buyer
- Steps:

  - Customer visits the Feria del Agricultor stand and tastes the Queso Semiduro.

  - Customer purchases a vacuum-sealed cheese featuring a QR code on the label.

  - During the week, the customer scans the QR code on the packaging to reorder.

  - The QR code opens WhatsApp with a pre-filled message: 'Hola Doña Martha, me gustaría pedir más queso'.

  - The customer coordinates delivery day and pays via Sinpe Móvil.


**Scenario:** Convenience-Seeking Family ordering for the first time online
- Steps:

  - User lands on the digital catalog via a local social media recommendation.

  - User browses the high-rotation product combos (e.g., Queso + Natilla + Pan).

  - User clicks the 'Ordenar Combo por WhatsApp' CTA.

  - WhatsApp chat opens with the selected combo details pre-populated.

  - The team confirms delivery address, scheduled route, and completes the sale.


**Scenario:** Local Food Business (B2B) seeking wholesale supply
- Steps:

  - Soda or restaurant owner visits the website's B2B section.

  - Reviews wholesale pricing, packaging standards, and consistency guarantees for Queso Semiduro.

  - Clicks 'Cotizar Mayoreo' to initiate direct commercial contact.

  - Receives personalized attention via WhatsApp or phone to coordinate a free sample delivery.



## 4. Conversion Mechanisms
**Primary Conversion Drivers:**

- QR codes on vacuum-sealed packaging linking directly to WhatsApp with pre-filled order messages

- Feria-to-Digital discount incentives (e.g., 10% off the first home delivery order when registering at the stand)

- Pre-packaged high-rotation combos (Queso + Natilla) featured prominently on the digital catalog with one-click WhatsApp checkout


**Secondary CTAs:**

- Feria locator and schedule finder

- B2B wholesale inquiry form

- Subscription/weekly delivery program sign-up


## 5. Technical Stack Architecture
- **Frontend / Core:** Next.js (React) with Tailwind CSS for a highly responsive, mobile-first digital catalog, styled with warm, organic brand colors (cream, foliage green, terracotta).
- **Scalability Rationale:** A lightweight, static-generated frontend ensures ultra-fast loading speeds on mobile networks (crucial for users scanning QR codes on the go). It integrates seamlessly with WhatsApp Business API and can easily scale to a full headless e-commerce platform (e.g., Shopify or WooCommerce backend) as order volume grows.