const getResource = require("./getResource");

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
    const fields = model.fields

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
    model.fields.filter(field => field.type === "relationship");

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
    console.log(params);
    let state = {};

    const model = getResource(ctx)("Model", params.modelId);

    const [row] = await ctx.db.query(
        `SELECT * FROM \`${model.tableName}\` WHERE id = ? LIMIT 1`,
        [params.recordId]
    );
    const record = transform(model, row);

    // Add records
    state = addRecords(state, {
        modelId: params.modelId,
        records: [record]
    });

    const relationshipFields = getRelationshipFields(model);

    await Promise.all(
        relationshipFields.map(async field => {
            const relationshipRecords = await getRecordsForRelationship(ctx)({
                modelId: field.settings.foreignModel,
                whereIn: record[field.id]
            });

            state = addRecords(state, {
                modelId: field.settings.foreignModel,
                records: relationshipRecords
            });
        })
    );

    return state;
};
