import { config } from "dotenv";
import { RedisClient } from "redis";
import App from "./app";
import BenchmarkController from "./benchmark/benchmark.controller";
import BenchmarkService from "./benchmark/benchmark.service";

if (process.env.NODE_ENV !== 'production') {
    config();
}

const redis = new RedisClient({
    port: parseInt(process.env.REDIS_PORT, 10),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
});

redis.on("connect", () => {
    console.log("Established connection with Redis");
});

const benchmarkService = new BenchmarkService(redis);

const app = new App([
    new BenchmarkController(benchmarkService),
]);

app.listen(process.env.PORT);
