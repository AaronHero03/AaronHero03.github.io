import mysql from "mysql2";
import express from "express";

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
	host: "iot-iotec.b.aivencloud.com",
	port: 12163,
	user: "avnadmin",
	password: process.env.AIVEN_PASSWORD,
	database: "defaultdb",
});

connection.connect((error) => {
	if (error) throw error;
	console.log("Conectada");
});

app.listen(1984, () => {
	console.log("Up and up");
});

app.get("/bienvenida", (req, res) => {
	res.send("Esto no es una página html");
});

app.get("/clientes", (req, res) => {
	const consultaSQL = "SELECT * FROM clientes;";

	connection.query(consultaSQL, (error, resultados) => {
		if (error) return res.status(500).json({ error: error.message });
		res.json(resultados);
		console.log(resultados);
	});
});

app.get("/pedidos", (req, res) => {
	const consultaSQL = "SELECT * FROM pedidos_clientes;";

	connection.query(consultaSQL, (error, resultados) => {
		if (error) return res.status(500).json({ error: error.message });
		res.json(resultados);
		console.log(resultados);
	});
});

app.get("/pedido/:id/articulos", (req, res) => {
	const { id } = req.params;
	const consultaSQL = "SELECT * FROM articulos_pedidos WHERE id_pedido = ?;";

	// Pasamos [id] para evitar inyecciones SQL de forma segura
	connection.query(consultaSQL, [id], (error, resultados) => {
		if (error) return res.status(500).json({ error: error.message });

		if (resultados.length === 0) {
			return res
				.status(404)
				.json({ mensaje: `No se encontraron artículos para el pedido ${id}` });
		}

		res.json(resultados);
		console.log(resultados);
	});
});
