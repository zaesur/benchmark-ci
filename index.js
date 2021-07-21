const Git = require('simple-git');
const core = require('@actions/core');

(async () => {
    try {
        const git = Git();

        // Get log.
        (async () => {
            const log = await git.log();
            console.log(log.all.length);
        })();

        // Save results.
        (async () => {
            git.checkout('results');
            const log = await git.log();
            console.log(log.all.length);
        })();

    } catch (error) {   
        core.setFailed(error.message);
    }
})();