import http from "http";

const puerto = 3000;
const API_KEY = "9b6d7c2ba64234885961bc087bce5041"; // No olvides poner tu clave real
const CIUDAD = "Leon, Guanajuato";

const servidor = http.createServer(async (req, res) => {
	console.log(`Petición recibida: ${req.method} ${req.url}`);

	// =========================================================================
	// RUTA 1: Método GET (Mostrar el Dashboard y el botón)
	// =========================================================================
	if (req.method === "GET" && req.url === "/") {
		const paginaHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Weatherstack Test - Node Puro</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body style="background-color: #1a1a1a; color: bisque; text-align: center; padding: 40px;">
          
          <h1 class="display-4 fw-bold text-info mb-4">Dashboard del Clima 🌤️</h1>
          
          <div class="container">
            <div class="card bg-dark text-white border-primary mx-auto" style="max-width: 500px;">
              <div class="card-body">
                <h4 class="mb-3">Simulador de Consulta</h4>
                <p>Al hacer clic, el servidor hará una petición POST interna para obtener el clima de <strong>${CIUDAD}</strong>.</p>
                
                <form action="/consultar" method="POST">
                  <button type="submit" class="btn btn-primary btn-lg w-100 fw-bold">Consultar Clima</button>
                </form>
              </div>
            </div>
          </div>

        </body>
      </html>
    `;

		res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
		res.end(paginaHTML);
	}

	// =========================================================================
	// RUTA 2: Método POST (Ejecutar Transacción hacia Weatherstack)
	// =========================================================================
	else if (req.method === "POST" && req.url === "/consultar") {
		try {
			console.log(`Ejecutando POST para consultar el clima de: ${CIUDAD}...`);

			// Hacemos el fetch a la API
			const response = await fetch(
				`http://api.weatherstack.com/current?access_key=${API_KEY}&query=${CIUDAD}`,
			);
			const data = await response.json();

			if (data.error) {
				throw new Error(data.error.info);
			}

			// Extraemos la información
			const temp = data.current.temperature;
			const desc = data.current.weather_descriptions[0];
			const icono = data.current.weather_icons[0];
			const ubicacion = `${data.location.name}, ${data.location.country}`;

			const exitoHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Clima en ${data.location.name}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
          </head>
          <body style="background-color: #1a1a1a; color: bisque; text-align: center; padding: 50px;">
            
            <h1 class="text-success mb-4">Informacion de la ciudad</h1>
            
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-md-6">
                  <div class="card bg-dark text-white border-success">
                    <div class="card-body">
                      <h3 class="card-title text-warning">${ubicacion}</h3>
                      <img src="${icono}" alt="Icono clima" class="rounded-circle my-3 border border-2 border-success">
                      <h2 class="card-text display-5">${temp}°C</h2>
                      <p class="card-text fs-4 text-muted">${desc}</p>
                      <p class="card-text mt-3">Humedad: ${data.current.humidity}% | Viento: ${data.current.wind_speed} km/h</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br>
            <a href="/" class="btn btn-outline-light mt-4">Volver al Inicio</a>
          </body>
        </html>
      `;

			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.end(exitoHTML);
		} catch (error) {
			console.error("Error al consultar el clima (POST):", error.message);
			res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
			res.end(`
        <body style="background-color: #1a1a1a; color: bisque; text-align: center; padding: 50px;">
          <h1 style="color: red;">Error en la transacción</h1>
          <p>${error.message}</p>
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

// =========================================================================
// INICIAR SERVIDOR
// =========================================================================
servidor.listen(puerto, () => {
	console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
