Framework7.prototype.plugins.debug = function (app, params) {
    // exit if not enabled
    if (!params) return;
 



    return {
        hooks: {
            appInit: function () {
                console.log ('appInit');
            },
            navbarInit: function (navbar, pageData) {
                console.log('navbarInit '+ pageData.name);
            },
            pageInit: function (pageData) {
                console.log('pageInit '+ pageData.name);
            },
            pageBeforeInit: function (pageData) {
                console.log('pageBeforeInit '+ pageData.name);
            },
            pageBeforeAnimation: function (pageData) {
                console.log('pageBeforeAnimation '+ pageData.name);
            },
            pageAfterAnimation: function (pageData) {
                console.log('pageAfterAnimation '+ pageData.name);
            },
            pageBeforeRemove: function (pageData) {
                console.log('pageBeforeRemove '+ pageData.name);
            },
            addView: function (view) {
                console.log('addView ', view);
            },
            loadPage: function (view, url, content) {
                console.info('loadPage ', view, url, content);
            },
            goBack: function (view, url, preloadOnly) {
                console.log('goBack ', view, url, preloadOnly);
            },
            swipePanelSetTransform: function (views, panel, percentage) {
                console.log('swipePanelSetTransform ', views, panel, percentage);
            }
        }
    };
};

// JSON.stringify