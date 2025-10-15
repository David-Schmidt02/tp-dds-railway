import bodyParser from "body-parser";
import {configureRoutes} from "./routes.js";

export const startServer = (app, port, appContext) => {
  app.use(bodyParser.json())

  configureRoutes(app, appContext)

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  return app;
}