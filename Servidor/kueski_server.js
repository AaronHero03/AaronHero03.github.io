import http from "http";
import fs from "fs";

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

// GET: Obtener informacion de un cliente en especifico
// /user/{id-user}
function getUser(req, res) {
	// En realidad esta se va a obtener del URL con ruteo dinamico
	const user_id = "user_0001";
	const usuario = USERS_DB[user_id];

	if (usuario) {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify(usuario));
	} else {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ message: "Usuario no encontrado" }));
	}
}

// POST: Vincular la cuenta de Kueski con la extension (FR-001)
// /auth/link
function linkAccount(req, res) {
	res.writeHead(201, { "Content-Type": "application/json" });
	res.end(
		JSON.stringify({
			status: "success",
			message: "Cuenta enlazada con exito",
			token: "kueski_login_0102",
		}),
	);
}

// GET: Obtener saldo de KueskiPay y cashback acumulado (FR-002, FR-009)
// /user/profiles
function getProfile(req, res) {
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify(USERS_DB));
}

// GET: Verificar si la URL del sitio pertenece a una tienda afiliada a KueskiPay (FR-004)
// /stores/check
function checkStore(req, res) {
	// Se obtiene en realidad de la url
	const domain = "amazon.com.mx";

	if (STORES_DB[domain]) {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ is_affiliated: true }));
	} else {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ is_affiliated: false }));
	}
}

// POST: Registrar la intencion del usuario de activar el cashback en la compra actual (FR-007)
// /cashback/activate
function activateCashback(req, res) {
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(
		JSON.stringify({
			status: "activated",
			message: "Se activo el cashback",
			token: "kueski_cb_00012",
		}),
	);
}

// POST: Notificar que el pago fue exitoso para validad cashback (FR-008)
// /payment
function checkPayment(req, res) {
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(
		JSON.stringify({
			status: "confirmed",
			cashback_generated: 60,
			operation_id: "00344",
		}),
	);
}

const servidor = http.createServer((req, res) => {
	const url = req.url;

	if (url === "/user/id-user") {
		getUser(req, res);
	} else if (url === "/user/profiles") {
		getProfile(req, res);
	} else if (url === "/auth/link") {
		linkAccount(req, res);
	} else if (url === "/stores/check") {
		checkStore(req, res);
	} else if (url === "/cashback/activate") {
		activateCashback(req, res);
	} else if (url === "/payment") {
		checkPayment(req, res);
	} else {
		manejarRuta404(req, res);
	}
});

function manejarRuta404(req, res) {
	res.writeHead(404, { "Content-Type": "text/plain" });
	res.end("Aaaaaaaaaaaahhahahhahahahhahahha no jala.");
}

const puerto = 1984;
servidor.listen(puerto, () => {
	console.log(`Servidor escuchando en el puerto ${puerto}`);
});
