var fs = require('fs');
var path = require('path');
var _ = require('underscore');

// Template and Routes cache
var template;
var routesStore;

function renderTemplate(tmpl, routes, callback, options) {
    if (!options.cache || !routesStore) {
        routesStore = getRoutes(routes);
    }

    callback(tmpl({
        routes: routesStore
    }));
}

function getRoutes(routes) {
    if (routes._router) {
        // Express app default router
        console.log('-- is express app');
        return buildRoutes(routes._router.stack);
    } else if (_.isArray(routes)) {
        // Express router array
        console.log('-- is router array');
        // _.each()
        // return buildRoutes(routes);
    }

    // Express single route
    console.log('-- is single route');
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

    if (template) {
        renderTemplate(template, routes, callback, options);
    } else {
        fs.readFile(path.join(__dirname, './template.ejs'), 'utf8', function(err, data) {
            if (err) throw err;

            template = _.template(data);
            renderTemplate(template, routes, callback, options);
        });
    }
};
