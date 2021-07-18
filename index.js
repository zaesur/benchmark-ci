const git = require('simple-git');
const core = require('@actions/core');
const { getBenchmarks, parseBenchmarks } = require('./src/parse');
const { trendDetection } = require('./src/test');

(async () => {
    try {
        const directoryName = core.getInput('benchmarks-directory');
        const threshold = core.getInput('threshold');

        const files = await getBenchmarks(directoryName);
        const parsed = await parseBenchmarks(files);

        const log = await git().log();
        console.log(log);

        for (const [name, benchmark] of Object.entries(parsed)) {
            const result = trendDetection(benchmark);
            if (result > threshold) {
                core.setFailed(`Benchmark ${name} failed. Performance declined ${result.toFixed(2)} percent.`);
            }
        }
    } catch (error) {   
        core.setFailed(error.message);
    }
})();