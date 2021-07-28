export const parseJMH = (hash: Hash, body: unknown[]): Benchmark => {
    const runs = body.map(({ benchmark: name, params: parameters, primaryMetric: { score } }) => ({ name, parameters, score }));
    return { hash, runs };
}