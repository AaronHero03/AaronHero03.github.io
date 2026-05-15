import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const USERS_DB = {
	user_0001: {
		balance: 12500.5,
		cashback_accumulated: 450.25,
		currency: "MXN",
	},
};

const STORES_DB = {
	"amazon.com.mx": {
		id: "store_001",
		name: "Amazon México",
		cashback: 5,
		affiliated: true,
	},
	"mercadolibre.com.mx": {
		id: "stores_002",
		name: "Mercado Libre",
		affiliated: false,
	},
};

const abrirHtml = (archivo) => (req, res) => {
	res.sendFile(path.join(__dirname, archivo), (err) => {
		if (err) res.status(500).send("Oh no!!!!");
	});
};

app.get("/", abrirHtml("bienvenida.html"));
app.get("/usuarios", abrirHtml("usuarios.html"));
app.get("/movimientos", abrirHtml("movimientos.html"));
app.get("/equipo", abrirHtml("equipo.html"));
app.get("/opinion", abrirHtml("opinion.html"));
app.get("/perfil", abrirHtml("perfil.html"));

app.get("/api/usuarios", (req, res) => {
	const usuarios = [
		{ nombre: "Daft", saldo: "0" },
		{ nombre: "Punk", saldo: "10" },
	];
	// Esta muy como que no hace falta stringify
	// Express tambien maneja los codigos de error y éxito
	res.json(usuarios);
});

app.get("/api/movimientos", (req, res) => {
	const movimientos = [
		{ nombre: "Daft", tipo: "retiro", cantidad: 10 },
		{ nombre: "Punk", tipo: "deposito", cantidad: 20 },
	];
	res.json(movimientos);
});

app.get("/api/usuario", (req, res) => {});

// ENDPOINTS PARA EXTENSION DE KUESKI

// GET: Obtener informacion de un cliente en especifico
// /user/{id-user}
app.get("/user/:id", (req, res) => {
	// Express ayuda mucho con el query del user
	const user_id = req.params.id;
	const usuario = USERS_DB[user_id];

	if (usuario) {
		res.json(usuario);
	} else {
		res.status(404).json({ message: "Usuario no encontrado" });
	}
});

app.get("/user/profiles", (req, res) => {
	res.json(USERS_DB);
});

app.post("/auth/link", (req, res) => {
	res.status(201).json({
		status: "success",
		message: "Cuenta enlazada con éxito",
		token: "kueski_login_0102",
	});
});

app.get("/stores/check", (req, res) => {
	// Con express se pueden sacar facilmente el dominio y mas cosas de la url sin necesidad de extraer texto
	const domain = req.query.domain;
	const is_affiliated = !!STORES_DB[domain];
	res.json({ is_affiliated });
});

app.post("/cashback/activate", (req, res) => {
	res.json({
		status: "activated",
		message: "Se activo el cashback",
		token: "kueski_cb_00012",
	});
});

app.get("/payment", (req, res) => {
	res.json({
		status: "confirmed",
		cashback_generated: 60,
		operation_id: "00344",
	});
});

app.use((req, res) => {
	res.status(404).send("Aaaaaaaaaaaahhahahhahahahhahahha no jala.");
});

// Ya no hace falta todo el bloque de if/else para el manejo de las rutas

const puerto = 1984;

app.listen(puerto, () => {
	console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
