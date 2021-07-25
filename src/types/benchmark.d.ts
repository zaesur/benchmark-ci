type Hash = string;

type Run = {
    name: string
    score: number
    parameters?: Record<string, any>
}

type Benchmark  = {
    hash: Hash,
    runs: Array<Run>
}