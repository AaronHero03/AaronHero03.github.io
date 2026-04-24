//Escribe un comentario explicando para qué sirve http
// http sirve para crear el servidor web y escuchar las peticiones
import http from "http";
//Escribe un comentario explicando para qué sirve fs
// fs sirve para leer archivos de la compu, como las paginas html
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

//Esta función deberá mostrar deberá mostrar una página HTML
//con la bienvenida a tu proyecto
function darBienvenida(req, res) {
	//Agrega lo mínimo necesario en bienvenida.html
	fs.readFile("Actividades/Servidor/bienvenida.html", "utf8", (error, data) => {
		if (error) {
			// Este codigo indica un fallo inesperado en el servidor que impide cargar una pagaina
			//Escribe qué significa el 500
			// 500 significa que hubo un error interno en nuestro servidor
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Oh no!!!!");
			return;
		}
		// Es un codigo que indica que el proceso fue realizado con exito
		//Escribe qué significa el 200
		// 200 significa que todo salio bien (OK) y mandamos la respuesta
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(data);
	});
}

//Esta función deberá enviar un json con los datos de los usuarios
function getUsuarios(req, res) {
	//Esto representa un objeto JSON de un usuario
	//Agrega otro usuario
	const usuarios = [
		{ nombre: "Daft", saldo: "0" },
		{ nombre: "Punk", saldo: "10" },
	];
	res.writeHead(200, { "Content-Type": "application/json" });

	//Escribe qué hace la función stringify y por qué la tenemos que usar
	// La funcion stringify transforma objetos de javascript en texto con formato JSON
	res.end(JSON.stringify(usuarios));
}

function mostrarUsuarios(req, res) {
	fs.readFile("Actividades/Servidor/usuarios.html", "utf8", (error, data) => {
		if (error) {
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Oh no!!!!");
			return;
		}
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(data);
	});
}

function mostrarPerfil(req, res) {
	fs.readFile("Actividades/Servidor/perfil.html", "utf8", (error, data) => {
		if (error) {
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Oh no!!!!");
			return;
		}
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(data);
	});
}

function mostrarMovimientos(req, res) {
	//Construye una página básica movimientos.html
	fs.readFile(
		"Actividades/Servidor/movimientos.html",
		"utf8",
		(error, data) => {
			if (error) {
				res.writeHead(500, { "Content-Type": "text/plain" });
				res.end("Oh no!!!!");
				return;
			}
			res.writeHead(200, { "Content-Type": "text/html" });
			res.end(data);
		},
	);
}

function mostrarEquipo(req, res) {
	fs.readFile("Actividades/Servidor/equipo.html", "utf8", (error, data) => {
		if (error) {
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Oh no!!!!");
			return;
		}
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(data);
	});
}

function mostrarOpinion(req, res) {
	fs.readFile("Actividades/Servidor/opinion.html", "utf8", (error, data) => {
		if (error) {
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Oh no!!!!");
			return;
		}
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(data);
	});
}

//Esta función deberá enviar un json con los datos de las movimientos
function getMovimientos(req, res) {
	const movimientos = [
		{ nombre: "Daft", tipo: "retiro", cantidad: 10 },
		{ nombre: "Punk", tipo: "deposito", cantidad: 20 },
	];
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify(movimientos));
}

// ENDPOINTS PARA EXTENSION DE KUESKI

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
	const url = new URL(req.url, `http://${req.headers.host}`);
	const domain = url.searchParams.get("domain");

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

function manejarRuta404(req, res) {
	res.writeHead(404, { "Content-Type": "text/plain" });
	//Cambia el mensaje por algo más divertido
	res.end("Aaaaaaaaaaaahhahahhahahahhahahha no jala.");
}

//incluye el enlace a la documentación de createServer
// https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
const servidor = http.createServer((req, res) => {
	const url = req.url.split("?")[0];

	if (url === "/") {
		darBienvenida(req, res);
	} else if (url === "/api/usuarios") {
		getUsuarios(req, res);
	} else if (url === "/api/movimientos") {
		getMovimientos(req, res);
	} else if (url === "/usuarios") {
		mostrarUsuarios(req, res);
	} else if (url === "/movimientos") {
		mostrarMovimientos(req, res);
	}
	//Agrega una ruta /equipo y su función correspondiente para que muestre el equipo del proyecto
	//Haz una página equipo.html correspondiente
	//Escribe el nombre completo y una cualidad que valores en esa persona de tu equipo
	// Juan Perez - Su logica para resolver bugs.
	//Trata de agregar una imagen a equipo.html
	//Explica si la puedes ver, en caso negativo ¿qué crees que pase?
	// No se puede ver. Pasa porque el navegador intenta pedir la foto al servidor, pero como no hicimos una ruta especifica para leer imagenes, se va directo al error 404.
	else if (url === "/equipo") {
		mostrarEquipo(req, res);
	}
	//Agrega una ruta /opinion
	//Haz una página opinion.html
	// Lee el siguiente artículo y responde ¿Crees que el colonialismo digital es un riesgo para tu carrera profesionl? ¿Para tu vida persona?
	//¿Qué es el freedombox?
	//https://www.aljazeera.com/opinions/2019/3/13/digital-colonialism-is-threatening-the-global-south
	else if (url === "/opinion") {
		mostrarOpinion(req, res);
	} else if (url === "/user/id-user") {
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

const puerto = 1984;
servidor.listen(puerto, () => {
	console.log(`Servidor escuchando en el puerto ${puerto}`);
});

//Importante
//En esta actividad deberás agregar en miarchivo.html un enlace a servidor.js y al resto de los html
