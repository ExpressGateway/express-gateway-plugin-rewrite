const pathToRegExp = require('path-to-regexp');

module.exports = {
  version: '1.0.0',
  init: function (pluginContext) {
    pluginContext.registerPolicy({
      name: 'rewrite',
      policy: (actionParams) => {
        const compiledExp = pathToRegExp.compile(actionParams.rewrite);

        return (req, res, next) => {
          let toUrl = null;

          if (req.egContext.matchedCondition.plainRegEx)
            toUrl = req.url.replace(req.egContext.matchedCondition.plainRegEx, actionParams.rewrite);
          else
            toUrl = compiledExp(req.egContext.matchedCondition);

          if (!actionParams.redirect) {
            req.url = toUrl;
            return next();
          }

          res.statusCode = actionParams.redirect === 'permanent' ? 301 : 302;
          res.setHeader('Location', toUrl);
          res.end();
        }
      }
    });

    pluginContext.registerCondition({
      name: 'match',
      handler: (req, conditionConfig) => {
        let plainRegEx = null;

        const keys = [];
        const regExpFromPath = pathToRegExp(conditionConfig.match, keys);
        const extractedParameters =
          regExpFromPath.exec(req.url) ||
          ((plainRegEx = new RegExp(conditionConfig.match)).exec(req.url));

        if (extractedParameters !== null) {
          req.egContext.matchedCondition = { plainRegEx };
          keys.forEach((key, index) => { req.egContext.matchedCondition[key.name] = extractedParameters[index + 1] });

          return true;
        }

        return false;
      }
    });
  }
}
