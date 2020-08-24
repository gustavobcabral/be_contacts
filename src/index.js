const express = require("express");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(routes);

app.listen(3333);

// app.get("/", (request, response) => {
//   return response.json({
//     evento: "Criando Projeto",
//     dono: "Gustavo Cabral",
//   });
// });
