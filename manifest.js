const pathToRegExp = require('path-to-regexp');

module.exports = {
  version: '1.0.0',
  policies: ['rewrite'],
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
            toUrl = decodeURIComponent(compiledExp(req.egContext.matchedCondition));

          if (!actionParams.redirect) {
            req.url = toUrl;
            return next();
          }

          res.redirect(actionParams.redirect, toUrl);
        }
      }
    });

    pluginContext.registerCondition({
      name: 'pathmatch',
      handler: (req, conditionConfig) => {
        const keys = [];
        const regExpFromPath = pathToRegExp(conditionConfig.match, keys);
        const extractedParameters = regExpFromPath.exec(req.url);

        if (extractedParameters !== null) {
          req.egContext.matchedCondition = {};
          keys.forEach((key, index) => { req.egContext.matchedCondition[key.name] = extractedParameters[index + 1] });
          return true;
        }

        return false;
      }
    });


    pluginContext.registerCondition({
      name: 'regexpmatch',
      handler: (req, conditionConfig) => {
        const plainRegEx = new RegExp(conditionConfig.match);

        const extractedParameters = plainRegEx.exec(req.url);

        if (extractedParameters !== null) {
          req.egContext.matchedCondition = { plainRegEx };
          return true;
        }

        return false;
      }
    });
  }
}
