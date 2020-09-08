const yaml = require("js-yaml");
const fs = require("fs");

const defaultTransformer = source => source;

const transformers = {
    Model: source => {
        return source
    }
};

module.exports = ({ configPath }) => () => () => {
    let state = {};

    const resources = yaml.safeLoadAll(
        fs.readFileSync(configPath, "utf8")
    );

    resources.forEach(resource => {
        const key = resource.kind;

        state[key + "Datas"] = state[key + "Datas"] || {};
        state[key] = state[key] || [];

        const transform = transformers[resource.kind] || defaultTransformer;

        state[key + "Datas"][new String(resource.spec.id)] = transform(resource.spec);
        state[key].push(new String(resource.spec.id));

        return state;
    });

    return state;
};
