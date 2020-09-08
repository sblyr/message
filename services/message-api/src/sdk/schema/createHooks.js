const moment = require('moment')

const addDefaultValue = (state, id, resolver) => {
  state.defaultValueById = state.defaultValueById || {};
  state.defaultValue = state.defaultValue || [];

  const defaultValue = {
    id,
    resolver
  };

  state.defaultValueById[defaultValue.id] = defaultValue;
  state.defaultValue.push(defaultValue.id);
};

const addFormula = (state, id, components) => {
  state.formulaById = state.formulaById || {};
  state.formula = state.formula || [];

  const resolver = [...components].pop();
  const dependencies = components.slice(0, components.length - 1);

  const formula = {
    id,
    dependencies,
    resolver
  };

  state.formulaById[formula.id] = formula;
  state.formula.push(formula.id);
};

module.exports = (state = {}) => {
  addDefaultValue(state, "Subscription.planId", () => () => "PLAN_1");
  addDefaultValue(state, "Subscription.status", () => () => "ACTIVE");
  addFormula(state, "Subscription.startDate", [
    ctx => () => {
      const today = moment();
      return today
        .clone()
        .startOf("year")
        .toDate();
    }
  ]);
  addFormula(state, "Subscription.currentPeriodStart", [
    ctx => () => {
      const today = moment();
      return today
        .clone()
        .startOf("year")
        .toDate();
    }
  ]);
  addFormula(state, "Subscription.currentPeriodEnd", [
    ctx => () => {
      const today = moment();
      return today
        .clone()
        .startOf("year")
        .add(1, "year")
        .toDate();
    }
  ]);
  return state;
};
