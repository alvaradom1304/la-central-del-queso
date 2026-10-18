const BASE_URL = "https://lacentraldelqueso.cr"; // Change to actual production URL

export const CampaignLinks = {
  // Packaging QR codes
  QR_EMPAQUE_SEMIDURO: `${BASE_URL}?src=qr_empaque_semiduro`,
  QR_EMPAQUE_TURRIALBA: `${BASE_URL}?src=qr_empaque_turrialba`,
  QR_EMPAQUE_MADURO: `${BASE_URL}?src=qr_empaque_maduro`,

  // Feria Stand Banner QR codes
  FERIA_GUADALUPE: `${BASE_URL}?src=feria_guadalupe`,
  FERIA_HATILLO: `${BASE_URL}?src=feria_hatillo`,

  // Social Media Bio Links
  IG_BIO: `${BASE_URL}?utm_source=instagram_bio`,
  FB_POST: `${BASE_URL}?utm_source=facebook_post`,

  // Helper method for generating custom ones
  generateCustomLink: (source: string) => `${BASE_URL}?src=${encodeURIComponent(source)}`
};

/**
 * Usage:
 * Pass these URLs into a QR code generator (like qrcode.react or a service like bitly/qr)
 * and print them for physical assets.
 * When the user scans the code, they arrive at the website with the query param attached.
 * The Next.js app captures this param and stores it in session storage.
 * Finally, the order dispatch to n8n will include this 'source' field, attributing the sale to the specific asset.
 */
