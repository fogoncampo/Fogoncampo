# Cómo activar el cobro directo con Mercado Pago

Este paquete agrega a tu web la función "Comprar ahora" que lleva al cliente
directo al Checkout de Mercado Pago. Seguí estos pasos en orden.

## 1. Conseguir tu Access Token de Mercado Pago

1. Entrá a https://www.mercadopago.com.ar/developers/panel
2. Iniciá sesión con tu cuenta de Mercado Pago (la del negocio)
3. Andá a "Tus integraciones" → creá una aplicación (podés llamarla "Fogón Mates Web")
4. Ahí vas a ver dos credenciales:
   - **Credenciales de prueba**: para probar sin mover plata real
   - **Credenciales de producción**: las reales, para cuando ya esté todo probado
5. Copiá el **Access Token** (empieza con `APP_USR-` en producción, o `TEST-` en modo prueba)

**Nunca pegues ese Access Token dentro del código HTML.** Solo va en Vercel,
como variable de entorno (paso 3).

## 2. Subir este código a tu repositorio de GitHub

Copiá estos archivos a la raíz de tu repositorio (junto a tu `index.html`):

```
tu-repo/
├── index.html          (el que ya tenías, actualizado)
├── gracias.html         (nuevo)
├── package.json         (nuevo)
├── api/
│   └── create-preference.js   (nuevo)
├── (tus fotos .jpeg)
└── bg-video.mp4
```

Subilo con `git add .`, `git commit -m "agregar pagos"`, `git push` — o subiendo
los archivos manualmente desde la web de GitHub si no usás la terminal.

## 3. Conectar el repositorio a Vercel

1. Entrá a https://vercel.com y creá una cuenta gratis (podés usar "Continuar con GitHub")
2. Click en "Add New Project"
3. Elegí tu repositorio de Fogón Mates y hacé click en "Import"
4. Antes de darle a "Deploy", andá a **Environment Variables** y agregá:
   - `MP_ACCESS_TOKEN` → pegá el Access Token del paso 1 (usá el de **prueba** primero)
   - `SITE_URL` → dejalo vacío por ahora, lo completamos en el paso 5
5. Click en **Deploy**. En un minuto te da una URL tipo `https://fogon-mates-web.vercel.app`

Con esto, Vercel pasa a alojar tanto tu web como el backend de pagos —
ya no hace falta GitHub Pages para la parte pública (podés mantenerlo como
respaldo si querés, pero la URL que le des a tus clientes debe ser la de Vercel,
porque es la única que tiene el backend funcionando).

## 4. Completar la URL del sitio

1. Copiá la URL que te dio Vercel (ej: `https://fogon-mates-web.vercel.app`)
2. En Vercel, andá a Settings → Environment Variables → editá `SITE_URL` y pegá esa URL
3. Volvé a la pestaña "Deployments" y hacé "Redeploy" para que tome el cambio

## 5. Probar antes de salir en vivo

Con el Access Token de **prueba** todavía puesto:

1. Entrá a tu web de Vercel, tocá "Comprar ahora" en cualquier producto
2. Te va a llevar al Checkout de Mercado Pago
3. Usá una tarjeta de prueba (Mercado Pago te las da acá:
   https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/test/cards)
4. Confirmá que después del pago te redirige a tu página de "Gracias"

## 6. Pasar a modo real

1. Volvé al panel de Desarrolladores de Mercado Pago y copiá el Access Token de **producción**
2. En Vercel, reemplazá el valor de `MP_ACCESS_TOKEN` por ese
3. Redeploy
4. Listo — ya podés cobrar de verdad. El dinero de cada venta va a tu cuenta de
   Mercado Pago, y de ahí lo transferís a tu cuenta de Brubank cuando quieras.

## Si algo falla

- Si el botón "Comprar ahora" queda tildado en "Redirigiendo…" y no pasa nada:
  revisá en Vercel → tu proyecto → pestaña "Logs" para ver el error exacto.
- El error más común es el Access Token mal copiado o vacío.
- Los precios que cobra Mercado Pago son los que ve en el botón — así que si
  cambiás un precio en `index.html`, no hace falta tocar nada más.
