class Report implements Report {
  public hash: Hash;
  public benchmarks: Benchmark[];

  constructor(hash: Hash, body: any[]) {
    this.hash = hash;
    this.benchmarks = this.parseBenchmarks(body);
  }

  private parseBenchmarks(body: any[]): Benchmark[] {
    return body.map(({ benchmark: name, primaryMetric: { score }, params: parameters }) => ({ name, score, parameters}));
  }
}

export default Report;
