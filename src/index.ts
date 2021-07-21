import App from "./app";
import BenchmarkController from "./controllers/benchmark.controller";

const app = new App([new BenchmarkController()]);

app.listen(8080);
