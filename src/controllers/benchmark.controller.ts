import { Router, NextFunction, Request, Response } from "express";
import createError from "http-errors";
import Report from "../models/report/report.model";
import { Controller } from "./controllers";

class BenchmarkController implements Controller {
  public path = "/benchmarks";
  public router = Router();
  private reports: Map<Hash, Report>;

  constructor() {
    this.reports = new Map();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:hash`, this.getBenchmark);
    this.router.post(`${this.path}/:hash`, this.addBenchmark);
  }

  private getBenchmark = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const hash = request.params.hash;
    if (this.reports.has(hash)) {
      const status = 200;
      const report = this.reports.get(hash);
      response.status(200).send({ status, message: report.benchmarks });
    } else {
      next(new createError.NotFound());
    }
  }

  private addBenchmark = (
    request: Request,
    response: Response,
  ) => {
    const status = 201;
    const hash = request.params.hash;
    const report = new Report(hash, request.body);
    this.reports.set(hash, report);
    response.sendStatus(status);
  }
}

export default BenchmarkController;
