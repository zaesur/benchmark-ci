const git = require('simple-git');
const core = require('@actions/core');
const { getBenchmark } = require('./src/parse');

(async () => {
    try {
        const log = await git().log();
        const hashes = log.map(({ hash }) => hash);
        console.log(hashes);
    } catch (error) {   
        core.setFailed(error.message);
    }
})();