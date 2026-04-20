import http from "http";

async function getMaluma() {
	const respuesta = await fetch(
		"https://www.theaudiodb.com/api/v1/json/123/search.php?s=maluma",
	);
	const datos = await respuesta.json();
	const artista = datos.artists[0];

	return artista.strBiographyEN;
}

const servidor = http.createServer(async (req, res) => {
	console.log("Alguien me mandó una solicitud");
	const biografia = await getMaluma();

	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end(biografia);
});

const puerto = 1983;

servidor.listen(puerto, () => {
	console.log(`Servidor escuchando en el puerto ${puerto}`);
});
