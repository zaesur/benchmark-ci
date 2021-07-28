import _ from "lodash";

export const trendDetection = (mc: number, M: number[]): number => 100 * (mc * M.length / _.sum(M) - 1);