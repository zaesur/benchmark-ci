import { RedisClient } from "redis";
import App from "./app";
import BenchmarkController from "./benchmark/benchmark.controller";
import BenchmarkService from "./benchmark/benchmark.service";

const redis = new RedisClient({ port: 6380, host: "127.0.0.1" });
const benchmarkService = new BenchmarkService(redis);

const app = new App([
    new BenchmarkController(benchmarkService),
]);

app.listen(8080);
