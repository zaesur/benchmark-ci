import express from "express";
import { Controller } from "./controllers/controllers";
import errorMiddleware from "./middleware/error.middleware";

class App {
  private app: express.Application;

  constructor(controllers: Controller[] = []) {
    this.app = express();

    this.initializeControllers(controllers);
    this.initializeNotFound();
    this.initializeErrorHandling();
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/api", controller.router);
    });
  }

  private initializeNotFound() {
    this.app.use("/", (req, res) => res.sendStatus(404));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
