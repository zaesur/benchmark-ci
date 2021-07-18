const path = require('path');
const { readDirectory, readJSON } = require('./utils');

const getBenchmarks = async directoryName => {
    const directoryPath = path.join(__dirname, '..', directoryName);
    const filenames = await readDirectory(directoryPath);
    const promises = filenames.map(filename => readJSON(path.join(directoryPath, filename)));
    return Promise.all(promises);
};

const parseBenchmarks = files => files
    .flat()
    .reduce((acc, { benchmark, params, primaryMetric }) => {
        const key = `${benchmark} [${Object.entries(params).map(entry => entry.join(':')).join(', ')}]`;
        acc[key] = acc[key] || { benchmark, params, metrics: [] };
        acc[key].metrics.push(primaryMetric);
        return acc;
    }, {});

module.exports = {
    getBenchmarks,
    parseBenchmarks
};