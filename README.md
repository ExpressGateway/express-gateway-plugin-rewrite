# express-gateway-plugin-rewrite

This plugin for [Express Gateway](https://express-gateway.io) makes it possible to redirect (rewrite internally or
redirect using HTTP codes) User to the specific URL based on
[Express Paths](https://expressjs.com/en/guide/routing.html) or RegExp Rules.

## Installation

Simply type from your shell environment:

```bash
eg plugin install express-gateway-plugin-rewrite
```

## Quick start

1. Make sure the plugin is listed in [system.config.yml file](https://www.express-gateway.io/docs/configuration/system.config.yml/).
This is done automatically for you if you used the command above.

2. Add the configuration keys to [gateway.config.yml file](https://www.express-gateway.io/docs/configuration/gateway.config.yml/).

```yaml
policies:
  -
    rewrite:
      -
        condition:
          name: pathmatch
          match: /tina/:code
        action:
          rewrite: /status/:code
          redirect: 302
      -
        condition:
          name: regexpmatch
          match: ^/js/(.*)$
        action:
          rewrite: /src/js/$1
```

### Configuration Parameters

`condition.pathmatch`: Express Path corresponding to the url pattern to look for.

`condition.regexpmatch`: RegExp corresponding to the url pattern to look for.

**Note:** if you provide both expression, the first one that will match will make the Gateway jump to the policy
directly.

`action.rewrite`: Express Path or RegExp corresponding to the url pattern to rewrite. The format should match the
one used in the condition.

`action.redirect`: If omitted, a rewrite action will be performed. When set to a number, it'll redirect the request
with the provided status code.

## Want to make your own plugin?

Just check out our [plugin development guide](https://www.express-gateway.io/docs/plugins/).
We can't wait to see your custom stuff in the Gateway!
