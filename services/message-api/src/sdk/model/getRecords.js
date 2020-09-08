const get = require('lodash/get')
const getResource = require("./getResource");

const getFields = model =>
    Object.keys(model.fields).map(id => model.fields[id]);

const scalarTypes = {
    json: {
        serialize: value => {
            try {
                return value ? JSON.parse(value) : null;
            } catch {
                return null;
            }
        },
        parseValue: value => {
            try {
                return value ? JSON.stringify(value) : null;
            } catch {
                return null;
            }
        }
    }
};

const serializeData = (data, { model }) => {
    const fields = getFields(model);

    let record = {};

    fields.forEach(field => {
        const { type } = field;
        const scalarType = scalarTypes[type];

        let value = data[field.id];

        if (!scalarType) {
            record[field.id] = value;
            return;
        }

        value = scalarType.serialize(value);

        record[field.id] = value;
    });

    return record;
};

const getRelationshipFields = model =>
    getFields(model).filter(field => field.type === "relationship");

const transform = (model, row) => serializeData(row, { model });

const transformMany = (model, rows) => rows.map(row => transform(model, row));

const addRecords = (state, { modelId, records }) => {
    const key = modelId;
    state[key + "Datas"] = state[key + "Datas"] || {};
    state[key] = state[key] || [];

    records.forEach(record => {
        state[key + "Datas"][record.id] = record;
        state[key].push(record.id);
    });
    return state;
};

const getRecordsForRelationship = ctx => async ({ modelId, whereIn }) => {
    if (!whereIn.length) {
        return []
    }
    const model = getResource(ctx)("Model", modelId);
    const rows = await ctx.db.query(
        `SELECT * FROM \`${model.tableName}\` WHERE id IN (?)`,
        [whereIn]
    );
    const records = transformMany(model, rows);
    return records;
};

module.exports = ctx => async params => {
    let state = {};
    state[params.modelId + 'Datas'] = {}
    state[params.modelId] = []

    const model = getResource(ctx)("Model", params.modelId);
    const modelListPage = getResource(ctx)("ModelListPage", params.modelId);

    const extendQuery = modelListPage ? get(modelListPage, 'protected.query') : ''

    const rows = await ctx.db.query(`SELECT * FROM \`${model.tableName}\`${extendQuery ? ` ${extendQuery}` : ''} LIMIT 1000`);
    const records = transformMany(model, rows);

    // Add records
    state = addRecords(state, {
        modelId: params.modelId,
        records
    });

    const relationshipFields = getRelationshipFields(model);

    await Promise.all(
        relationshipFields.map(async field => {
            const relationshipRecords = await getRecordsForRelationship(ctx)({
                modelId: field.settings.foreignModel,
                whereIn: records.map(record => record[field.id])
            });

            state = addRecords(state, {
                modelId: field.settings.foreignModel,
                records: relationshipRecords
            });
        })
    );

    return state;
};
