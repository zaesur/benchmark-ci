import { RedisClient } from "redis";
import App from "./app";
import BenchmarkController from "./benchmark/benchmark.controller";
import BenchmarkService from "./benchmark/benchmark.service";

const port: number = parseInt(process.env.PORT || "6379", 10);
const host: string = process.env.HOST || "127.0.0.1"
const password: string = process.env.PASSWORD || "";

const redis = new RedisClient({ port, host, password });
const benchmarkService = new BenchmarkService(redis);

const app = new App([
    new BenchmarkController(benchmarkService),
]);

app.listen(8080);
