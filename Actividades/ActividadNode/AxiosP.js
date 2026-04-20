import axios from "axios";

axios
	.get(
		"http://datos.imss.gob.mx/api/action/datastore/search.json?resource_id=ae9ed6bc-058c-4556-bb50-a78c808bcc0c&limit=10",
	)
	.then((response) => {
		console.log("Respuesta:", response.data);
	})
	.catch((error) => {
		console.error("Error:", error);
	});
