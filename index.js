const git = require('simple-git');
const core = require('@actions/core');
const { getBenchmark } = require('./src/parse');

(async () => {
    try {
        // Input variables.
        const directoryName = core.getInput('benchmarks-directory');
        const threshold = core.getInput('threshold');

        // Process benchmarks.
        const hashes = await git().log().map(({ hash }) => hash);
        const files = await Promise.all(hashes.map(hash => getBenchmark(directoryName, hash)));

        // Results.
        console.log(files);
    } catch (error) {   
        core.setFailed(error.message);
    }
})();