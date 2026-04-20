import http from "http";
import { Spot } from "@binance/connector";

// 1. Configurar las credenciales de la Testnet
const apiKey =
	"CXbp8gNrE8R5LU4SPprxHjZPe0dwVPzwEhY5wdGxtPcQHcd5t0L9ILFgNMSsWJyz";
const apiSecret =
	"qI2GwZcvLwhaHizwuE5QDL1XTNss7wd509cY6SAQVirh4K7MW9huszrV9jaAL6zP";

// Instanciar el cliente apuntando a la Testnet de Binance
const client = new Spot(apiKey, apiSecret, {
	baseURL: "https://testnet.binance.vision",
});

const servidor = http.createServer(async (req, res) => {
	console.log(`Petición recibida: ${req.method} ${req.url}`);

	// =========================================================================
	// RUTA 1: Método GET (Mostrar Información)
	// =========================================================================
	if (req.method === "GET" && req.url === "/") {
		try {
			// Obtenemos el precio actual de BTC
			const ticker = await client.tickerPrice("BTCUSDT");
			const btcPrice = parseFloat(ticker.data.price).toFixed(2);

			// Obtenemos el balance de la cuenta Testnet
			const account = await client.account();
			const usdtBalance =
				account.data.balances.find((b) => b.asset === "USDT")?.free || "0.00";
			const btcBalance =
				account.data.balances.find((b) => b.asset === "BTC")?.free || "0.00";

			// Construimos el HTML con Bootstrap
			const paginaHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Binance Testnet - Mi Servidor</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
          </head>
          <body style="background-color: #1a1a1a; color: bisque; text-align: center; padding: 40px;">
            
            <h1 class="display-4 fw-bold text-warning mb-4">Dashboard Binance (Testnet)</h1>
            
            <div class="container">
              <div class="row justify-content-center mb-5">
                <div class="col-md-4">
                  <div class="card bg-dark text-white border-warning">
                    <div class="card-body">
                      <h5 class="card-title text-muted">Precio BTC/USDT</h5>
                      <h2 class="card-text">$${btcPrice}</h2>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card bg-dark text-white border-success">
                    <div class="card-body">
                      <h5 class="card-title text-muted">Tus Fondos</h5>
                      <p class="card-text mb-0 fs-5">USDT: $${parseFloat(usdtBalance).toFixed(2)}</p>
                      <p class="card-text mb-0 fs-5">BTC: ₿${parseFloat(btcBalance).toFixed(4)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card bg-dark text-white border-primary mx-auto" style="max-width: 500px;">
                <div class="card-body">
                  <h4 class="mb-3">Simulador de Compra</h4>
                  <p>Al hacer clic, comprarás $50 USDT en Bitcoin a precio de mercado.</p>
                  <form action="/comprar" method="POST">
                    <button type="submit" class="btn btn-primary btn-lg w-100 fw-bold">Comprar $50 de BTC</button>
                  </form>
                </div>
              </div>
            </div>

          </body>
        </html>
      `;

			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.end(paginaHTML);
		} catch (error) {
			console.error("Error al conectar con Binance (GET):", error.message);
			res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
			res.end("Error al obtener datos de Binance.");
		}
	}

	// =========================================================================
	// RUTA 2: Método POST (Ejecutar Transacción)
	// =========================================================================
	else if (req.method === "POST" && req.url === "/comprar") {
		try {
			console.log("Ejecutando orden de compra en Binance Testnet...");

			// Enviamos un POST a Binance para comprar BTC usando 50 USDT a precio de mercado
			const orderResponse = await client.newOrder("BTCUSDT", "BUY", "MARKET", {
				quoteOrderQty: 50, // Gasta exactamente 50 USDT
			});

			const orderData = orderResponse.data;

			const exitoHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Compra Exitosa</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
          </head>
          <body style="background-color: #1a1a1a; color: bisque; text-align: center; padding: 50px;">
            <h1 class="text-success mb-4">¡Compra Ejecutada con Éxito! 🚀</h1>
            <p class="lead">ID de la Orden: ${orderData.orderId}</p>
            <p class="lead">Gastaste: $${orderData.cummulativeQuoteQty} USDT</p>
            <p class="lead">Recibiste: ₿${orderData.executedQty} BTC</p>
            <br>
            <a href="/" class="btn btn-outline-light mt-4">Volver al Inicio</a>
          </body>
        </html>
      `;

			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.end(exitoHTML);
		} catch (error) {
			console.error(
				"Error al ejecutar la compra (POST):",
				error.response ? error.response.data : error.message,
			);
			res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
			res.end(`
        <body style="background-color: #1a1a1a; color: bisque; text-align: center; padding: 50px;">
          <h1 style="color: red;">Error en la transacción</h1>
          <p>${error.response ? JSON.stringify(error.response.data) : "Error desconocido"}</p>
          <a href="/" style="color: white;">Volver</a>
        </body>
      `);
		}
	}

	// =========================================================================
	// RUTA 3: Manejo de rutas no encontradas (404)
	// =========================================================================
	else {
		res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
		res.end("Página no encontrada");
	}
});

const puerto = 2000;

servidor.listen(puerto, () => {
	console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
