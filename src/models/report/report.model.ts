class Report implements Report {
  public hash: Hash;
  public benchmarks: Benchmark[];

  constructor(hash: Hash, body: string) {
    this.hash = hash;
    this.benchmarks = this.parseBenchmarks(body);
  }

  private parseBenchmarks(body: string): Benchmark[] {
    return [];
  }
}

export default Report;
