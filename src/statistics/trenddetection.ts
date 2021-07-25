import _ from "lodash";

export const trendDetection = (mc: number, M: number[]): number => 100 * (_.sumBy(M, mi => mc * M.length / mi) - 1);
