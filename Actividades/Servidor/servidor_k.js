//Escribe un comentario explicando para qué sirve http
import http from "http";
//Escribe un comentario explicando para qué sirve fs
import fs from "fs";

//Esta función deberá mostrar deberá mostrar una página HTML
//con la bienvenida a tu proyecto
function darBienvenida(req, res) {
	//Agrega lo mínimo necesario en bienvenida.html

	fs.readFile("Actividades/Servidor/bienvenida.html", "utf8", (error, data) => {
		if (error) {
			// Este codigo indica un fallo inesperado en el servidor que impide cargar una pagaina
			//Escribe qué significa el 500
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Oh no!!!!");
			return;
		}
		// Es un codigo que indica que el proceso fue realizado con exito
		//Escribe qué significa el 200
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

//Esta función deberá enviar un json con los datos de las movimientos
function getMovimientos(req, res) {
	//Tienes que corregir varias cosas en esta sección
	const movimientos = [
		{ nombre: "Daft", tipo: "retiro", cantidad: "10" },
		{ nombre: "Punk", tipo: "deposito", cantidad: "20" },
	];
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify(movimientos));
}

function manejarRuta404(req, res) {
	res.writeHead(404, { "Content-Type": "text/plain" });
	//Cambia el mensaje por algo más divertido
	res.end("Aaaaaaaaaaaahhahahhahahahhahahha no jala.");
}

//incluye el enlace a la documentación de createServer
const servidor = http.createServer((req, res) => {
	const url = req.url;

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
	//Trata de agregar una imagen a equipo.html
	//Explica si la puedes ver, en caso negativo ¿qué crees que pase?

	//Agrega una ruta /opinion
	//Haz una página opinion.html
	// Lee el siguiente artículo y responde ¿Crees que el colonialismo digital es un riesgo para tu carrera profesionl? ¿Para tu vida persona?
	//¿Qué es el freedombox?
	//https://www.aljazeera.com/opinions/2019/3/13/digital-colonialism-is-threatening-the-global-south
	else {
		manejarRuta404(req, res);
	}
});

const puerto = 1984;
servidor.listen(puerto, () => {
	console.log(`Servidor escuchando en el puerto ${puerto}`);
});

//Importante
//En esta actividad deberás agregar en miarchivo.html un enlace a servidor.js y al resto de los html
