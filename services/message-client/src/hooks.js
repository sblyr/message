const hooks = {
    "HasMany.onRequest": async params => {

    },
    "HasOne.onRequest": async params => {

    },
    "Table.onRecordClick": async params => {

        alert(`Table.onRecordClick ${JSON.stringify(params)}`)
    },
    "relationship.onRecordClick": async params => {

        alert(`relationship.onRecordClick ${JSON.stringify(params)}`)
    }
}

export default hooks