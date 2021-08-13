import { Router, RequestHandler } from "express";
import { BadRequest, NotFound } from "http-errors";
import { Controller } from "../types/controller";
import { BenchmarkMap } from "./benchmark.map";
import BenchmarkService from "./benchmark.service";
import { analyzeBenchmarks } from "./benchmark.util";

class BenchmarkController implements Controller {
  public path = "/api/benchmarks";
  public router = Router();
  private benchmarkService: BenchmarkService;

  constructor(benchmarkService: BenchmarkService) {
    this.benchmarkService = benchmarkService;
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
      const benchmarks = await this.benchmarkService.getAll();
      response.send(benchmarks);
    } catch (error) {
      next(new BadRequest(error.message));
    }
  }

  private getBenchmark: RequestHandler = async (request, response, next) => {
    try {
      const hash = request.params.hash as Hash;
      const benchmark: Benchmark = await this.benchmarkService.get(hash);
      response.send(benchmark);
    } catch (error) {
      next(new NotFound(error.message));
    }
  }

  private addBenchmark: RequestHandler = async (request, response, next) => {
    try {
      const benchmark = BenchmarkMap.JMHToBenchmark(request.params.hash, request.body);
      await this.benchmarkService.create(benchmark);
      response.sendStatus(201);
    } catch (error) {
      next(new BadRequest(error.message));
    }
  }

  private deleteBenchmark: RequestHandler = async (request, response, next) => {
    try {
      const hash = request.params.hash as Hash;
      await this.benchmarkService.delete(hash);
      response.sendStatus(204);
    } catch (error) {
      next(new BadRequest(error.message));
    }
  }

  private compareBenchmarks: RequestHandler = async (request, response, next) => {
    try {
      const body = request.body;
      const [current, ...history] = await Promise.all([
        body.current,
        ...body.history
      ].map(hash => this.benchmarkService.get(hash)));
      const payload = analyzeBenchmarks(current, history, body.threshold);
      
      response.send(payload);
    } catch (error) {
      next(new BadRequest(error.message));
    }
  }
}

export default BenchmarkController;
