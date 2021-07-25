import { Router, RequestHandler } from "express";
import { BadRequest, NotFound } from "http-errors";
import _ from "lodash";
import { trendDetection } from "../statistics/trenddetection";
import { Controller } from "../types/controller";
import BenchmarkModel from "./benchmark.service";

type AddJMHRequest = {
  benchmark: string,
  params?: Record<string, any>
  primaryMetric: {
    score: number
  }
}[];

type CompareRequest = {
  threshold: number,
  current: Hash,
  history: Hash[]
}

const findAssociatedRun = (run: Run, runs: Run[]): Run | undefined => {
  return runs.find(other => run.name === other.name && _.isEqual(run.parameters, other.parameters));
}

class BenchmarkController implements Controller {
  public path = "/api/benchmarks";
  public router = Router();
  private benchmarkModel: BenchmarkModel;

  constructor(benchmarkModel: BenchmarkModel) {
    this.benchmarkModel = benchmarkModel;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.post(this.path, this.compareBenchmarks);
    this.router.get(`${this.path}/:hash`, this.getBenchmark);
    this.router.post(`${this.path}/:hash`, this.addBenchmark);
    this.router.delete(`${this.path}/:hash`, this.deleteBenchmark);
  }

  private getAll: RequestHandler = async (_request, response, next) => {
    try {
      const benchmarks = await this.benchmarkModel.getAll();
      response.send(benchmarks);
    } catch (error) {
      next(new BadRequest(error.message));
    }
  }

  private getBenchmark: RequestHandler = async (request, response, next) => {
    try {
      const hash = request.params.hash as Hash;
      const benchmark: Benchmark = await this.benchmarkModel.get(hash);
      response.send(benchmark);
    } catch (error) {
      next(new NotFound(error.message));
    }
  }

  private addBenchmark: RequestHandler = async (request, response, next) => {
    try {
      const hash = request.params.hash as Hash;
      const body = request.body as AddJMHRequest;
      const runs = body.map(({ benchmark: name, params: parameters, primaryMetric: { score } }) => ({ name, parameters, score }));
      await this.benchmarkModel.create({ hash, runs });
      response.sendStatus(201);
    } catch (error) {
      next(new BadRequest(error.message));
    }
  }

  private deleteBenchmark: RequestHandler = async (request, response, next) => {
    try {
      const hash = request.params.hash as Hash;
      await this.benchmarkModel.delete(hash);
      response.sendStatus(204);
    } catch (error) {
      next(new BadRequest(error.message));
    }
  }

  private compareBenchmarks: RequestHandler = async (request, response, next) => {
    try {
      const body = request.body as CompareRequest;
      const [current, ...history] = await Promise.all([
        body.current,
        ...body.history
      ].map(hash => this.benchmarkModel.get(hash)));

      const results = current.runs.map(run => {
        const associatedRuns = history.map(benchmark => findAssociatedRun(run, benchmark.runs));
        const associatedScores = associatedRuns.filter(_.negate(_.isUndefined)).map(associated => associated.score);

        return {
          name: run.name,
          parameters: run.parameters,
          score: associatedScores.length > 0 ? trendDetection(run.score, associatedScores) : Number.NEGATIVE_INFINITY
        };
      });

      const payload = {
        success: results.every(result => result.score < body.threshold),
        results
      };

      response.send(payload);
    } catch (error) {
      next(new BadRequest(error.message));
    }
  }
}

export default BenchmarkController;
