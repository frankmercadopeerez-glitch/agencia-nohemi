# Activar Mercado Pago en Dunas & Olas

La web ya crea una preferencia de Checkout Pro desde una función privada y redirige al cliente al enlace seguro de Mercado Pago. El `Access Token` nunca se envía al navegador.

## Lo que debe hacer el propietario de la cuenta

1. Crear o verificar una cuenta de Mercado Pago Colombia a nombre del negocio.
2. Entrar en **Mercado Pago Developers > Tus integraciones**.
3. Crear una aplicación para **Pagos online > Checkout Pro**.
4. Usar primero las credenciales de prueba.
5. En Vercel, abrir el proyecto de `dunasyolas.com` y crear estas variables:

   - `MERCADO_PAGO_ACCESS_TOKEN`: Access Token de prueba o producción.
   - `MERCADO_PAGO_ENV`: `test` durante pruebas; eliminarla o usar `production` al activar cobros reales.
   - `PUBLIC_SITE_URL`: `https://dunasyolas.com`.
   - `MERCADO_PAGO_WEBHOOK_URL`: opcional hasta crear el receptor de notificaciones.

6. Volver a desplegar el sitio para que Vercel cargue las variables.
7. Hacer una compra completa de prueba con una cuenta compradora de prueba distinta a la vendedora.
8. Cuando todo funcione, activar las credenciales de producción y sustituir únicamente `MERCADO_PAGO_ACCESS_TOKEN`.

## Cómo se obtiene el enlace

No se guarda un enlace fijo en el código. Al pulsar **Pagar en línea con Mercado Pago**, la función `/api/create-mercadopago-preference` valida nuevamente los productos y precios, crea una preferencia y recibe de Mercado Pago un `init_point`. Ese es el enlace único que se abre para ese pedido.

Si se prefiere un enlace fijo sin carrito, puede crearse desde la opción **Link de pago** de la cuenta de Mercado Pago, definir nombre y valor, y copiar la URL. Ese método sirve mejor para anticipos con un valor único; para el carrito variable de la web conviene Checkout Pro.

## Seguridad

- No escribir el Access Token en HTML, JavaScript público, GitHub ni mensajes.
- Configurarlo solamente como variable privada de Vercel.
- Probar con credenciales de prueba antes de producción.
- El total se reconstruye en el servidor usando el catálogo de la web; no se acepta el precio enviado por el navegador.
- Para confirmar automáticamente una reserva se debe añadir y validar un webhook de pagos. Mientras tanto, el equipo debe comprobar el pago en Mercado Pago antes de confirmar disponibilidad.

Documentación oficial:

- https://www.mercadopago.com.co/developers/es/docs/getting-started
- https://www.mercadopago.com.co/developers/es/docs/checkout-pro/additional-content/credentials
- https://www.mercadopago.com.co/developers/es/docs/checkout-pro/payment-notifications
