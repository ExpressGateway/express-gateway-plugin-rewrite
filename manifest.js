const pathToRegExp = require("path-to-regexp");

module.exports = {
  version: '1.0.0',
  init: function (pluginContext) {
    pluginContext.registerPolicy({
      name: 'rewrite',
      policy: (actionParams) => {
        const compiled_exp = pathToRegExp.compile(actionParams.rewrite);
        return (req, res, next) => {
          const toUrl = compiled_exp(req.egContext.matchedCondition);
          if (!actionParams.redirect) {
            req.url = toUrl;
            return next();
          }

          res.statusCode = actionParams.redirect;
          res.setHeader('Location', toUrl);
          res.end();
        }
      }
    });

    pluginContext.registerCondition({
      name: 'match',
      handler: (req, conditionConfig) => {
        const keys = [];
        const regExp = pathToRegExp(conditionConfig.match, keys);

        const data = regExp.exec(req.url);

        if (data !== null) {
          req.egContext.matchedCondition = {};
          keys.forEach((key, index) => req.egContext.matchedCondition[key.name] = data[index + 1]);
          return true;
        }

        return false;
      }
    });
  }
}
