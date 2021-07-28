import _ from "lodash";
import { trendDetection } from "../statistics/trenddetection";

const findAssociatedRun = (run: Run, runs: Run[]): Run | undefined => {
  return runs.find(
    (other) =>
      run.name === other.name && _.isEqual(run.parameters, other.parameters)
  );
};

export const analyzeBenchmarks = (current: Benchmark, history: Benchmark[]) => {
  const analysis = current.runs.map(run => {
    const associatedRuns = history.map(benchmark => findAssociatedRun(run, benchmark.runs));
    const associatedScores = associatedRuns.filter(_.negate(_.isUndefined)).map(associated => associated.score);

    return {
      name: run.name,
      parameters: run.parameters,
      score: associatedScores.length > 0 ? trendDetection(run.score, associatedScores) : Number.NEGATIVE_INFINITY
    };
  });

  return analysis;
};