var ejs = require('ejs');
var path = require('path');
var _ = require('underscore');

// Routes store
var routesStore;
var defaultConfig = {
    title: 'Express API Documentation',
    cache: true
};

function renderTemplate(routes, callback, options) {
    var tmpl = path.join(__dirname, './template.ejs');
    var data = {
        routes: routes,
        title: options.title
    };

    ejs.renderFile(tmpl, data, {}, function(err, html) {
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
    return _.reduce(routes, function(result, item) {
        if (item.route) {
            result.push({
                path: item.route.path,
                methods: _.keys(item.route.methods)
            });
        }
        return result;
    }, []);
}

module.exports = function(routes, callback, config) {
    var options = _.extend({}, defaultConfig, config);

    if (!options.cache || !routesStore) {
        routesStore = getRoutes(routes);
    }

    renderTemplate(routesStore, callback, options);
};
