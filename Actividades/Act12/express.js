import express from "express";
const app = express();
const PORT = 3000;

app.use(express.json());

// Base de datos simulada de transacciones de Kueski Pay
const transaccionesMock = [
	{
		id: "kp_78910",
		monto: 1500.0,
		status: "approved",
		cliente: "Carlos Mendoza",
	},
	{ id: "kp_11213", monto: 4200.5, status: "pending", cliente: "Ana Gómez" },
	{ id: "kp_14151", monto: 850.0, status: "declined", cliente: "Luis Robles" },
	{ id: "kp_16171", monto: 2300.0, status: "approved", cliente: "Sofía Pasos" },
];

// 1. Uso de Query Parameters (req.query)
// Endpoint: GET /kueskipay/transacciones?status=approved
app.get("/kueskipay/transacciones", (req, res) => {
	const { status } = req.query;

	if (status) {
		const filtradas = transaccionesMock.filter(
			(t) => t.status === status.toLowerCase(),
		);
		return res.json({
			filtro: status,
			total: filtradas.length,
			resultados: filtradas,
		});
	}

	// Si no se envía parámetro, regresa todo
	res.json(transaccionesMock);
});

// 2. Uso de Route Parameters (req.params)
// Endpoint: GET /kueskipay/transaccion/:id
app.get("/kueskipay/transaccion/:id", (req, res) => {
	const { id } = req.params; // Captura el parámetro dinámico ":id"

	const transaccion = transaccionesMock.find((t) => t.id === id);

	if (!transaccion) {
		return res.status(404).json({
			error: true,
			mensaje: `La transacción con ID ${id} no fue encontrada en Kueski Pay.`,
		});
	}

	res.json({
		mensaje: "Transacción localizada con éxito",
		datos: transaccion,
	});
});

app.listen(PORT, () => {
	console.log(`Servidor de Kueski Pay corriendo en http://localhost:${PORT}`);
});
