// @ts-check
/// <reference path="./node_modules/express-gateway/index.d.ts" />

const debug = require('debug')
const pathToRegExp = require('path-to-regexp');

const log = debug('express-gateway-plugin-rewrite')

/** @type {ExpressGateway.Plugin} */
const plugin = {
  version: '1.0.0',
  policies: ['rewrite'],
  init: function (pluginContext) {
    pluginContext.registerPolicy({
      name: 'rewrite',
      schema: {
        $id: 'http://express-gateway.io/schemas/policies/rewrite.json',
        type: 'object',
        properties: {
          rewrite: {
            type: 'string',
            description: `Express Path or RegExp corresponding to the url pattern to rewrite.
                          The format should match the one used in the condition.`

          },
          redirect: {
            type: 'integer',
            description: `If omitted, a rewrite action will be performed.
                          When set to a number, it'll redirect the request with the provided status code.`
          },
        }
      },
      policy: (actionParams) => {
        const compiledExp = pathToRegExp.compile(actionParams.rewrite);
        log('policy: executing', { compiledExp })

        return (req, res, next) => {
          let toUrl = null;
          log('policy inner function: executing')

          if (req.egContext.matchedCondition.plainRegEx) {
            log('policy inner function: matched condition plainRegEx', { plainRegex: req.egContext.matchedCondition.plainRegEx, rewrite: actionParams.rewrite })
            toUrl = req.url.replace(req.egContext.matchedCondition.plainRegEx, actionParams.rewrite);
          } else {
            log('policy inner function: !plainRegEx', { matchedCondition: req.egContext.matchedCondition })
            toUrl = decodeURIComponent(compiledExp(req.egContext.matchedCondition));
          }

          log('policy inner function: toUrl', { toUrl })

          if (!actionParams.redirect) {
            req.url = toUrl;
            log('policy inner function: set req.url', { reqUrl: req.url, toUrl })
            return next();
          }

          log('policy inner function: redirecting', { redirect: actionParams.redirect })
          res.redirect(actionParams.redirect, toUrl);
        }
      }
    });

    pluginContext.registerCondition({
      name: 'pathmatch',
      handler: (req, conditionConfig) => {
        log('pathmatch handler: executing')
        const keys = [];
        const regExpFromPath = pathToRegExp(conditionConfig.match, keys);
        const extractedParameters = regExpFromPath.exec(req.url);
        log('pathmatch handler: params', { regExpFromPath, extractedParameters })

        if (extractedParameters !== null) {
          req.egContext.matchedCondition = {};
          keys.forEach((key, index) => {
            req.egContext.matchedCondition[key.name] = extractedParameters[index + 1]
            log(`pathmatch handler: matchedCondition`, { matchedCondition: req.egContext.matchedCondition[key.name], key })
          });
          return true;
        }

        log('pathmatch handler: no extractedParameters')
        return false;
      },
      schema: {
        $id: 'http://express-gateway.io/schemas/conditions/pathmatch.json',
        type: 'object',
        properties: {
          match: {
            type: 'string',
            description: 'The url pattern to look for'
          }
        },
        required: ['match']
      }
    });


    pluginContext.registerCondition({
      name: 'regexpmatch',
      handler: (req, conditionConfig) => {
        log('regexpmatch handler: executing')
        const plainRegEx = new RegExp(conditionConfig.match);

        const extractedParameters = plainRegEx.exec(req.url);
        log('regexpmatch handler: params', { plainRegEx, extractedParameters })

        if (extractedParameters !== null) {
          req.egContext.matchedCondition = { plainRegEx };
          log(`regexpmatch handler: matchedCondition`, { matchedCondition: req.egContext.matchedCondition })
          return true;
        }

        log('regexpmatch handler: no extractedParameters')
        return false;
      },
      schema: {
        $id: 'http://express-gateway.io/schemas/conditions/regexpmatch.json',
        type: 'object',
        properties: {
          match: {
            type: 'string',
            description: 'The url pattern to look for'
          },
        },
        required: ['match']
      }
    });
  }
}

module.exports = plugin;
