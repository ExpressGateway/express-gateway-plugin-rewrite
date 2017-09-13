const httpRewriteMiddlewarare = require("httpRewriteMiddleware");

module.exports = {
    version: 'v1',
    init: function (pluginContext) {
        pluginContext.registerPolicy({
            name: 'rewrite',
            policy: (actionParams) => {
                return (req, res, next) => {

                }
            }
        });

        pluginContext.registerCondition({
            name: 'match',
            handler: (req, conditionConfig) => {

            }
        });
    }

}
