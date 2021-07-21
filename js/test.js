const trendDetection = benchmark => {
    const add = (a, b) => a + b;
    const [ mc, ...M ] = benchmark.metrics;
    return M.length > 0 ? M.map(mb => 100 * mc.score * M.length / mb.score).reduce(add, 0) - 100 : 0;
};

module.exports = {
    trendDetection
};