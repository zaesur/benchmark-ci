export class BenchmarkMap {
    static JMHToBenchmark (hash: Hash, body: unknown[]): Benchmark {
        const runs = body.map(({ benchmark: name, params: parameters, primaryMetric: { score } }) => ({ name, parameters, score }));
        return { hash, runs };
    }

    static BenchmarkToString(benchmark: Benchmark): string {
        return JSON.stringify(benchmark);
    }

    static StringToBenchmark(rawBenchmark: string): Benchmark {
        return JSON.parse(rawBenchmark);
    }
}