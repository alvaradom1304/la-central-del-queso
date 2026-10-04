# AI & Automation Systems Architecture

## 1. Automation Matrix
**Automate Fully (No Human Needed):**

- **Accounts Receivable Reminders (Ventas Fiadas)**: Saves hours of manual tracking and eliminates the awkwardness of manual collection by sending automated, polite payment reminders via WhatsApp on scheduled dates.

- **QR Code to WhatsApp Order Routing**: Instantly routes customers scanning packaging QR codes to a pre-filled WhatsApp chat, requiring zero manual intervention to initiate the sales funnel.

- **Digital Catalog Inventory Sync**: Automatically updates product availability on the Next.js landing page when stock levels are adjusted in the central database, preventing overselling.


**Augment with AI (Human in the loop):**

- **Conversational Order Parsing**: AI parses unstructured WhatsApp messages from customers into structured orders (products, quantities, delivery address) for quick human approval.

- **B2B Lead Qualification**: AI filters and categorizes wholesale inquiries from restaurants and sodas, drafting personalized pricing proposals based on volume before a human takes over.

- **Cost and Margin Analysis**: AI assistant analyzes raw material costs and sales data to help Doña Martha calculate exact margins and suggest optimal pricing for combos.


**Keep 100% Human (Preserve Warmth):**

- **Artisanal Dairy Production**: The core value proposition relies on Doña Martha's 30-year traditional recipes and manual craftsmanship, which cannot and should not be automated.

- **Feria del Agricultor Customer Relations**: Physical tasting, warm conversation, and building trust at the feria stand are irreplaceable drivers of brand loyalty.

- **Final Order Quality Control & Delivery**: Ensuring the freshness of vacuum-sealed products and maintaining a friendly face during local deliveries preserves the brand's artisanal warmth.


## 2. Core Automation Workflows

### Automated Accounts Receivable & Sinpe Móvil Reconciliation
- **Input Trigger:** A sale is marked as 'Fiado' (on credit) in the Airtable database by the feria staff.
- **Process Steps:** 

  - Airtable records the customer name, phone number, amount, and due date.

  - On the due date, n8n triggers an automated workflow.

  - n8n sends a personalized, warm WhatsApp message via WhatsApp Business API with payment instructions via Sinpe Móvil.

  - When the customer sends the Sinpe Móvil payment confirmation screenshot, the team marks the record as 'Paid' in Airtable.

- **Decision Logic:** If the payment is not marked as 'Paid' within 48 hours of the first reminder, n8n triggers a second, soft follow-up message. If paid, it automatically sends a thank-you message and updates the customer's credit status.
- **Output Action:** Customer account balance updated to zero in Airtable and automated confirmation message sent.

### Conversational WhatsApp Order Intake
- **Input Trigger:** Customer sends an order message via WhatsApp (often initiated by scanning a packaging QR code).
- **Process Steps:** 

  - The incoming message is received by the WhatsApp Business API and routed to n8n.

  - An AI agent (Gemini/OpenAI) parses the text to extract: product types, quantities, delivery address, and preferred delivery day.

  - The AI checks current inventory levels in Airtable.

  - n8n drafts an order confirmation message and creates a pending order in Airtable.

- **Decision Logic:** If items are in stock, the AI drafts a confirmation with the total price and Sinpe Móvil details. If an item is out of stock, the AI drafts a polite alternative suggestion (e.g., suggesting Queso Semiduro if Turrialba is sold out).
- **Output Action:** A draft response is presented to Doña Martha's team in their WhatsApp inbox for 1-click approval and sending.

### B2B Wholesale Lead Nurturing
- **Input Trigger:** A local food business submits the 'Cotizar Mayoreo' form on the Next.js landing page.
- **Process Steps:** 

  - Form data (business name, location, estimated weekly volume, contact info) is sent to Airtable.

  - n8n triggers an AI analysis of the lead's location against delivery routes.

  - AI drafts a customized wholesale proposal PDF based on the requested volume.

  - An automated WhatsApp notification is sent to Doña Martha's sales team with the lead details and the drafted proposal.

- **Decision Logic:** If the business is within the active delivery zone, the system automatically schedules a 'Free Sample Delivery' task in the CRM. If outside, it flags the lead for manual review to evaluate route expansion.
- **Output Action:** A personalized WhatsApp message and PDF proposal are prepared for the sales team to send to the prospect.


## 3. Recommended Automation Stack
**Tools:**

- n8n (Workflow Automation & Integration)

- Airtable (Relational Database, Inventory, and CRM)

- WhatsApp Business API / Twilio (Conversational Channel)

- Gemini / OpenAI API (Conversational Parsing & Decision Logic)

- Next.js & Tailwind CSS (Mobile-First Digital Catalog)

- Sinpe Móvil (Local Payment Method)


**Integration Rationale:** n8n serves as the affordable, self-hosted orchestrator connecting the Next.js frontend, Airtable database, and WhatsApp API. Airtable replaces traditional paper bookkeeping with an easy-to-use mobile interface for the feria staff. AI handles unstructured conversational data from WhatsApp, allowing Doña Martha to maintain a highly personalized, warm customer experience without manual administrative overhead.

## 4. Estimated Operational ROI
**Impact & Hours Saved:** Saves approximately 12 to 15 hours per week by eliminating manual paper bookkeeping, automating 'fiado' credit tracking, and streamlining WhatsApp order entry. Additionally, it is projected to increase B2B lead conversion rates by 25% through instant, automated follow-ups.