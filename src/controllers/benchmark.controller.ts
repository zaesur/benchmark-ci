import express, { NextFunction, Request, Response } from "express";
import Report from "../models/report/report.model";
import { Controller } from "./controllers";

class BenchmarkController implements Controller {
  public path = "/benchmarks";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/:hash`, this.addBenchmark);
  }

  private addBenchmark(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const hash = request.params.hash;
    const report = new Report(hash, request.body);
  }
}

export default BenchmarkController;
