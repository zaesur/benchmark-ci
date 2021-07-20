const git = require('simple-git');
const core = require('@actions/core');
const glob = require('glob-promise');

(async () => {
    try {
        const directory = core.getInput('directory')

        const log = await git().log();
        const filePromises = log.all.map(({ hash }) => glob(`${directory}/*${hash}*.json`));
        const files = (await Promise.all(filePromises)).map(([result]) => result);
        
        console.log(files);
    } catch (error) {   
        core.setFailed(error.message);
    }
})();