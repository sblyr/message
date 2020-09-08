module.exports = ctx => (type, id) => {
  return ctx.schema[type + "Datas"] ? ctx.schema[type + "Datas"][id] : null;
};
