// api/create-preference.js
// Función serverless (Vercel) que crea una "preferencia de pago" en Mercado Pago
// y devuelve el link de Checkout al que hay que redirigir al cliente.
//
// El Access Token NUNCA va acá escrito. Se lee de una variable de entorno
// (MP_ACCESS_TOKEN) configurada en el panel de Vercel, así queda oculto.

import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// Poné acá la URL real de tu web una vez que esté publicada
// (por ejemplo: https://fogonmates.vercel.app o https://fogonmates.com.ar)
const SITE_URL = process.env.SITE_URL || 'https://TU-DOMINIO-ACA';

export default async function handler(req, res) {
  // Permite que el fetch funcione incluso si el HTML y la API terminan
  // quedando en dominios distintos. Si todo vive en el mismo dominio
  // (recomendado: todo en Vercel), esto ni hace falta, pero no molesta.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { title, price, quantity } = req.body || {};

    const parsedPrice = Number(price);
    const parsedQty = Number(quantity) || 1;

    if (!title || !parsedPrice || parsedPrice <= 0) {
      return res.status(400).json({ error: 'Faltan datos del producto (título o precio inválido)' });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: String(title).slice(0, 250),
            quantity: parsedQty,
            unit_price: parsedPrice,
            currency_id: 'ARS',
          },
        ],
        back_urls: {
          success: `${SITE_URL}/gracias.html`,
          failure: `${SITE_URL}/index.html`,
          pending: `${SITE_URL}/index.html`,
        },
        auto_return: 'approved',
        statement_descriptor: 'FOGON MATES',
      },
    });

    return res.status(200).json({ init_point: result.init_point });
  } catch (err) {
    console.error('Error creando preferencia de Mercado Pago:', err);
    return res.status(500).json({ error: 'No se pudo iniciar el pago' });
  }
}
