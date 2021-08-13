import { RedisClient } from "redis";
import { promisify } from "util";
import { BenchmarkMap } from "./benchmark.parse";

class BenchmarkService {
    private redis: RedisClient;

    constructor(redis: RedisClient) {
        this.redis = redis;
    }

    create(benchmark: Benchmark): Promise<boolean> {
        const setAsync: (collection: string, record: Record<string, string>) => Promise<boolean> = promisify(this.redis.hmset).bind(this.redis);
        return setAsync("benchmarks", { [benchmark.hash]: BenchmarkMap.BenchmarkToString(benchmark) });
    }

    get(hash: Hash): Promise<Benchmark> {
        const getAsync: (collection: string, key: string) => Promise<string> = promisify(this.redis.hget).bind(this.redis);
        return getAsync("benchmarks", hash).then(BenchmarkMap.StringToBenchmark);
    }

    getAll(): Promise<Benchmark[]> {
        const getAllAsync: (collection: string) => Promise<Record<string, string>> = promisify(this.redis.hgetall).bind(this.redis);
        return getAllAsync("benchmarks").then(Object.values).then(values => values.map(BenchmarkMap.StringToBenchmark));
    }

    delete(hash: Hash): Promise<boolean> {
        const deleteAsync: (collection: string, key: string) => Promise<boolean> = promisify(this.redis.hdel).bind(this.redis);
        return deleteAsync("benchmarks", hash);
    }
}

export default BenchmarkService;