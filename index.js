var ejs = require('ejs');
var path = require('path');
var _ = require('underscore');

// Routes cache
var routesStore;

function renderTemplate(routes, callback) {
    var tmpl = path.join(__dirname, './template.ejs');

    ejs.renderFile(tmpl, routes, {}, function(err, html) {
        if (err) throw err;
        callback(html);
    });
}

function getRoutes(routes) {
    // Array of routers
    if (_.isArray(routes)) {
        return _.reduce(routes, function(result, item) {
            return result.concat(buildRoutes(item.stack));
        }, []);

    // App default router
    } else if (routes._router) {
        return buildRoutes(routes._router.stack);
    }

    // Single route
    return buildRoutes(routes.stack);
}

function buildRoutes(routes) {
    return _.map(routes, function(route) {
        return {
            path: route.route.path,
            methods: _.keys(route.route.methods)
        };
    });
}

module.exports = function(routes, callback, options) {
    options = options || { cache: true };

    if (!options.cache || !routesStore) {
        routesStore = getRoutes(routes);
    }

    renderTemplate(routesStore, callback);
};
