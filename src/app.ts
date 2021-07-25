import cors, { CorsOptions } from "cors";
import express from "express";
import morgan from "morgan";
import errorMiddleware from "./middleware/error.middleware";
import { Controller } from "./types/controller";

class App {
  private app: express.Application;

  constructor(controllers: Controller[] = []) {
    this.app = express();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen(port: number) {

    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }

  private initializeMiddleware() {
    const options: CorsOptions = { origin: "http://localhost:8081" };
    this.app.use(morgan("tiny"));
    this.app.use(cors(options));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeControllers(controllers: Controller[]) {
    for (const controller of controllers) {
      this.app.use('/', controller.router);
    }
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
