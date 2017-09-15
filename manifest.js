const httpRewriteMiddlewarare = require("http-rewrite-middleware");

module.exports = {
    version: '1.0.0',
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
                return true;
            }
        });
    }

}
