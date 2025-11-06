// import express from "express";
// import swaggerUi from "swagger-ui-express";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import cors from "cors";
// import { METHODS } from "http";

// export class Server {
//   controllers = {};
//   app = null;
//   routes = [];
//   port;

//   constructor(app, port) {
//     this.app = app;
//     this.port = port;

//     // Centralizá middlewares base acá (evitá duplicar en index.js)
//     this.app.use(express.json());
//     this.app.use(cors({
//       origin : 'http://localhost:3001',
//       METHODS : ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
//       credentials : true
//     }))
//   }

//   // Retorna la instancia de express
//   getApp() {
//     return this.app;
//   }

//   // Crea un controller y lo registra
//   setController(ControllerClass, instance) {
//     this.controllers[ControllerClass.name] = instance;
//   }

//   // Retorna la instancia del controller registrado
//   getController(ControllerClass) {
//     const controller = this.controllers[ControllerClass.name];
//     if (!controller) {
//       throw new Error(`Controller ${ControllerClass.name} no registrado en el server`);
//     }
//     return controller;
//   }

//   // Agrega una ruta al server (acepta función factory o { path, router })
//   addRoute(routeEntry) {
//     this.routes.push(routeEntry);
//   }

//   // Bindea/asocia las rutas
//   configureRoutes() {
//     this.routes.forEach((entry) => {
//       if (typeof entry === "function") {
//         // patrón factory: (getController) => Router
//         const router = entry(this.getController.bind(this));
//         this.app.use(router);
//       } else if (entry && typeof entry === "object" && entry.path && entry.router) {
//         // patrón objeto: { path, router }
//         this.app.use(entry.path, entry.router);
//       } else {
//         throw new Error("Entrada de ruta inválida. Esperaba función o { path, router }.");
//       }
//     });
//   }

//   launch() {
//     this.app.listen(this.port, () => {
//       console.log(`Backend escuchando en puerto ${this.port}`);
//     });
//   }
// }
