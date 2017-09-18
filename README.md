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
          name: match
          match: /tina/:code
        action:
          rewrite: /status/:code
          redirect: permanent
      -
        condition:
          name: match
          match: ^/js/(.*)$
        action:
          rewrite: /src/js/$1
```

### Configuration Parameters

`condition.match`: Express Path or RegExp corresponding to the url pattern to look for.

`action.rewrite`: Express Path or RegExp corresponding to the url pattern to rewrite.

`action.redirect`: If omitted, a rewrite action will be performed. When set to `permanent`, it'll redirect the request
with status code `301`; for all other values, it'll emit a `302`.

## Want to make your own plugin?

Just check out our [plugin development guide](https://www.express-gateway.io/docs/plugins/).
We can't wait to see your custom stuff in the Gateway!
