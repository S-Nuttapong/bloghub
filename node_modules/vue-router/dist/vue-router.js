/*!
  * vue-router v4.0.0-alpha.1
  * (c) 2020 Eduardo San Martin Morote
  * @license MIT
  */
var VueRouter = (function (exports, vue) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var NavigationType;
    (function (NavigationType) {
        NavigationType["pop"] = "pop";
        NavigationType["push"] = "push";
    })(NavigationType || (NavigationType = {}));
    var NavigationDirection;
    (function (NavigationDirection) {
        NavigationDirection["back"] = "back";
        NavigationDirection["forward"] = "forward";
        NavigationDirection["unknown"] = "";
    })(NavigationDirection || (NavigationDirection = {}));
    // starting point for abstract history
    var START_PATH = '';
    var START = {
        fullPath: START_PATH,
    };
    // Generic utils
    /**
     * Transforms an URI into a normalized history location
     * @param parseQuery
     * @param location URI to normalize
     * @returns a normalized history location
     */
    function parseURL(parseQuery, location) {
        var path = '', query = {}, searchString = '', hash = '';
        // Could use URL and URLSearchParams but IE 11 doesn't support it
        var searchPos = location.indexOf('?');
        var hashPos = location.indexOf('#', searchPos > -1 ? searchPos : 0);
        if (searchPos > -1) {
            path = location.slice(0, searchPos);
            searchString = location.slice(searchPos + 1, hashPos > -1 ? hashPos : location.length);
            query = parseQuery(searchString);
        }
        if (hashPos > -1) {
            path = path || location.slice(0, hashPos);
            // keep the # character
            hash = location.slice(hashPos, location.length);
        }
        // no search and no query
        path = path || location;
        return {
            fullPath: location,
            path: path,
            query: query,
            hash: hash,
        };
    }
    /**
     * Stringify a URL object
     * @param stringifyQuery
     * @param location
     */
    function stringifyURL(stringifyQuery, location) {
        var query = location.query ? stringifyQuery(location.query) : '';
        return location.path + (query && '?') + query + (location.hash || '');
    }
    /**
     * Strips off the base from the beginning of a location.pathname
     * @param pathname location.pathname
     * @param base base to strip off
     */
    function stripBase(pathname, base) {
        return ((base && pathname.indexOf(base) === 0 && pathname.replace(base, '')) ||
            pathname);
    }
    function normalizeHistoryLocation(location) {
        return {
            // to avoid doing a typeof or in that is quite long
            fullPath: location.fullPath || location,
        };
    }

    // import { RouteLocationNormalized } from '../types'
    function computeScrollPosition(el) {
        return el
            ? {
                x: el.scrollLeft,
                y: el.scrollTop,
            }
            : {
                x: window.pageXOffset,
                y: window.pageYOffset,
            };
    }
    function getElementPosition(el, offset) {
        var docEl = document.documentElement;
        var docRect = docEl.getBoundingClientRect();
        var elRect = el.getBoundingClientRect();
        return {
            x: elRect.left - docRect.left - offset.x,
            y: elRect.top - docRect.top - offset.y,
        };
    }
    var hashStartsWithNumberRE = /^#\d/;
    function scrollToPosition(position) {
        var normalizedPosition = null;
        if ('selector' in position) {
            // getElementById would still fail if the selector contains a more complicated query like #main[data-attr]
            // but at the same time, it doesn't make much sense to select an element with an id and an extra selector
            var el = hashStartsWithNumberRE.test(position.selector)
                ? document.getElementById(position.selector.slice(1))
                : document.querySelector(position.selector);
            if (el) {
                var offset = position.offset || { x: 0, y: 0 };
                normalizedPosition = getElementPosition(el, offset);
            }
            // TODO: else dev warning?
        }
        else {
            normalizedPosition = {
                x: position.x,
                y: position.y,
            };
        }
        if (normalizedPosition) {
            window.scrollTo(normalizedPosition.x, normalizedPosition.y);
        }
    }

    var cs = console;
    /**
     * Creates a normalized history location from a window.location object
     * @param location
     */
    function createCurrentLocation(base, location) {
        var pathname = location.pathname, search = location.search, hash = location.hash;
        // allows hash based url
        if (base.indexOf('#') > -1) {
            // prepend the starting slash to hash so the url starts with /#
            return normalizeHistoryLocation(stripBase('/' + hash, base));
        }
        var path = stripBase(pathname, base);
        return normalizeHistoryLocation(path + search + hash);
    }
    function useHistoryListeners(base, historyState, location) {
        var listeners = [];
        var teardowns = [];
        // TODO: should it be a stack? a Dict. Check if the popstate listener
        // can trigger twice
        var pauseState = null;
        var popStateHandler = function (_a) {
            var state = _a.state;
            cs.info('popstate fired', state);
            cs.info('currentState', historyState);
            var from = location.value;
            var fromState = historyState.value;
            var to = createCurrentLocation(base, window.location);
            location.value = to;
            historyState.value = state;
            if (pauseState && pauseState.fullPath === from.fullPath) {
                cs.info('❌ Ignored because paused for', pauseState.fullPath);
                // reset pauseState
                pauseState = null;
                return;
            }
            var deltaFromCurrent = fromState
                ? state.position - fromState.position
                : '';
            var distance = deltaFromCurrent || 0;
            console.log({ deltaFromCurrent: deltaFromCurrent });
            // Here we could also revert the navigation by calling history.go(-distance)
            // this listener will have to be adapted to not trigger again and to wait for the url
            // to be updated before triggering the listeners. Some kind of validation function would also
            // need to be passed to the listeners so the navigation can be accepted
            // call all listeners
            listeners.forEach(function (listener) {
                listener(location.value, from, {
                    distance: distance,
                    type: NavigationType.pop,
                    direction: distance
                        ? distance > 0
                            ? NavigationDirection.forward
                            : NavigationDirection.back
                        : NavigationDirection.unknown,
                });
            });
        };
        function pauseListeners() {
            cs.info("\u23F8 for " + location.value.fullPath);
            pauseState = location.value;
        }
        function listen(callback) {
            // setup the listener and prepare teardown callbacks
            listeners.push(callback);
            var teardown = function () {
                var index = listeners.indexOf(callback);
                if (index > -1)
                    listeners.splice(index, 1);
            };
            teardowns.push(teardown);
            return teardown;
        }
        function beforeUnloadListener() {
            var history = window.history;
            if (!history.state)
                return;
            history.replaceState(__assign(__assign({}, history.state), { scroll: computeScrollPosition() }), '');
        }
        function destroy() {
            for (var _i = 0, teardowns_1 = teardowns; _i < teardowns_1.length; _i++) {
                var teardown = teardowns_1[_i];
                teardown();
            }
            teardowns = [];
            window.removeEventListener('popstate', popStateHandler);
            window.removeEventListener('beforeunload', beforeUnloadListener);
        }
        // setup the listeners and prepare teardown callbacks
        window.addEventListener('popstate', popStateHandler);
        window.addEventListener('beforeunload', beforeUnloadListener);
        return {
            pauseListeners: pauseListeners,
            listen: listen,
            destroy: destroy,
        };
    }
    function useHistoryStateNavigation(base) {
        var history = window.history;
        /**
         * Creates a state object
         */
        function buildState(back, current, forward, replaced, computeScroll) {
            if (replaced === void 0) { replaced = false; }
            if (computeScroll === void 0) { computeScroll = false; }
            return {
                back: back,
                current: current,
                forward: forward,
                replaced: replaced,
                position: window.history.length,
                scroll: computeScroll ? computeScrollPosition() : null,
            };
        }
        // private variables
        var location = {
            value: createCurrentLocation(base, window.location),
        };
        var historyState = { value: history.state };
        // build current history entry as this is a fresh navigation
        if (!historyState.value) {
            changeLocation(location.value, {
                back: null,
                current: location.value,
                forward: null,
                // the length is off by one, we need to decrease it
                position: history.length - 1,
                replaced: true,
                scroll: computeScrollPosition(),
            }, true);
        }
        function changeLocation(to, state, replace) {
            var url = base + to.fullPath;
            try {
                // BROWSER QUIRK
                // NOTE: Safari throws a SecurityError when calling this function 100 times in 30 seconds
                var newState = replace
                    ? __assign(__assign({}, historyState.value), state) : state;
                history[replace ? 'replaceState' : 'pushState'](newState, '', url);
                historyState.value = state;
            }
            catch (err) {
                cs.log('[vue-router]: Error with push/replace State', err);
                // Force the navigation, this also resets the call count
                window.location[replace ? 'replace' : 'assign'](url);
            }
        }
        function replace(to, data) {
            var normalized = normalizeHistoryLocation(to);
            // cs.info('replace', location, normalized)
            var state = __assign(__assign({}, buildState(historyState.value.back, 
            // keep back and forward entries but override current position
            normalized, historyState.value.forward, true)), data);
            if (historyState)
                state.position = historyState.value.position;
            changeLocation(normalized, state, true);
            location.value = normalized;
        }
        function push(to, data) {
            var normalized = normalizeHistoryLocation(to);
            // Add to current entry the information of where we are going
            // as well as saving the current position
            // TODO: the scroll position computation should be customizable
            var currentState = __assign(__assign({}, historyState.value), { forward: normalized, scroll: computeScrollPosition() });
            changeLocation(currentState.current, currentState, true);
            var state = __assign(__assign(__assign({}, buildState(location.value, normalized, null)), { position: currentState.position + 1 }), data);
            changeLocation(normalized, state, false);
            location.value = normalized;
        }
        return {
            location: location,
            state: historyState,
            push: push,
            replace: replace,
        };
    }
    function createWebHistory(base) {
        if (base === void 0) { base = ''; }
        var historyNavigation = useHistoryStateNavigation(base);
        var historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location);
        function back(triggerListeners) {
            if (triggerListeners === void 0) { triggerListeners = true; }
            go(-1, triggerListeners);
        }
        function forward(triggerListeners) {
            if (triggerListeners === void 0) { triggerListeners = true; }
            go(1, triggerListeners);
        }
        function go(distance, triggerListeners) {
            if (triggerListeners === void 0) { triggerListeners = true; }
            if (!triggerListeners)
                historyListeners.pauseListeners();
            history.go(distance);
        }
        var routerHistory = __assign(__assign({ 
            // it's overriden right after
            // @ts-ignore
            location: historyNavigation.location.value, base: base,
            back: back,
            forward: forward,
            go: go }, historyNavigation), historyListeners);
        Object.defineProperty(routerHistory, 'location', {
            get: function () { return historyNavigation.location.value; },
        });
        return routerHistory;
    }

    /**
     * Creates a in-memory based history. The main purpose of this history is to handle SSR. It starts in a special location that is nowhere.
     * It's up to the user to replace that location with the starter location.
     * @param base - Base applied to all urls, defaults to '/'
     * @returns a history object that can be passed to the router constructor
     */
    function createMemoryHistory(base) {
        if (base === void 0) { base = ''; }
        var listeners = [];
        // TODO: make sure this is right as the first location is nowhere so maybe this should be empty instead
        var queue = [START];
        var position = 0;
        function setLocation(location) {
            position++;
            if (position === queue.length) {
                // we are at the end, we can simply append a new entry
                queue.push(location);
            }
            else {
                // we are in the middle, we remove everything from here in the queue
                queue.splice(position);
                queue.push(location);
            }
        }
        function triggerListeners(to, from, _a) {
            var direction = _a.direction, distance = _a.distance;
            var info = {
                direction: direction,
                distance: distance,
                type: NavigationType.pop,
            };
            for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
                var callback = listeners_1[_i];
                callback(to, from, info);
            }
        }
        var routerHistory = {
            // rewritten by Object.defineProperty
            location: START,
            base: base,
            replace: function (to) {
                var toNormalized = normalizeHistoryLocation(to);
                // remove current entry and decrement position
                queue.splice(position--, 1);
                setLocation(toNormalized);
            },
            push: function (to, data) {
                setLocation(normalizeHistoryLocation(to));
            },
            listen: function (callback) {
                listeners.push(callback);
                return function () {
                    var index = listeners.indexOf(callback);
                    if (index > -1)
                        listeners.splice(index, 1);
                };
            },
            destroy: function () {
                listeners = [];
            },
            back: function (shouldTrigger) {
                if (shouldTrigger === void 0) { shouldTrigger = true; }
                this.go(-1, shouldTrigger);
            },
            forward: function (shouldTrigger) {
                if (shouldTrigger === void 0) { shouldTrigger = true; }
                this.go(1, shouldTrigger);
            },
            go: function (distance, shouldTrigger) {
                if (shouldTrigger === void 0) { shouldTrigger = true; }
                var from = this.location;
                var direction = 
                // we are considering distance === 0 going forward, but in abstract mode
                // using 0 for the distance doesn't make sense like it does in html5 where
                // it reloads the page
                distance < 0 ? NavigationDirection.back : NavigationDirection.forward;
                position = Math.max(0, Math.min(position + distance, queue.length - 1));
                if (shouldTrigger) {
                    triggerListeners(this.location, from, {
                        direction: direction,
                        distance: distance,
                    });
                }
            },
        };
        Object.defineProperty(routerHistory, 'location', {
            get: function () { return queue[position]; },
        });
        return routerHistory;
    }

    function createWebHashHistory(base) {
        if (base === void 0) { base = ''; }
        // Make sure this implementation is fine in terms of encoding, specially for IE11
        return createWebHistory('/#' + base);
    }

    function isRouteLocation(route) {
        return typeof route === 'string' || (route && typeof route === 'object');
    }

    var START_LOCATION_NORMALIZED = vue.markNonReactive({
        path: '/',
        name: undefined,
        params: {},
        query: {},
        hash: '',
        fullPath: '/',
        matched: [],
        meta: {},
        redirectedFrom: undefined,
    });
    // make matched non enumerable for easy printing
    Object.defineProperty(START_LOCATION_NORMALIZED, 'matched', {
        enumerable: false,
    });

    var _a, _b, _c, _d, _e, _f;
    // we could use symbols, but this is for IE9 only and there is
    // not Symbol support anyway
    var isRouterError = '__RouterError';
    /**
     * Generic Error coming from the Router.
     */
    var RouterError = /** @class */ (function (_super) {
        __extends(RouterError, _super);
        /**
         * Creates a Router specific Error
         *
         * @param message Error Message
         */
        function RouterError(message) {
            var _newTarget = this.constructor;
            var _this = _super.call(this, message) || this;
            // @ts-ignore for IE inheritance support
            _this[_a] = true;
            // restore prototype chain
            var actualProto = _newTarget.prototype;
            if (Object.setPrototypeOf) {
                Object.setPrototypeOf(_this, actualProto);
            }
            else {
                _this.__proto__ = actualProto;
            }
            return _this;
        }
        RouterError.is = function (error) {
            // only IE9 seems to break the inheritance chain
            // and set Error as the name
            if (error.name === 'Error') {
                // @ts-ignore for IE inheritance support
                return error[isRouterError];
            }
            else {
                return error instanceof RouterError;
            }
        };
        Object.defineProperty(RouterError.prototype, "name", {
            get: function () {
                return this.constructor.name;
            },
            enumerable: true,
            configurable: true
        });
        return RouterError;
    }(Error));
    _a = isRouterError;
    var isNoRouteMatchError = '__NoRouteMatchError';
    var NoRouteMatchError = /** @class */ (function (_super) {
        __extends(NoRouteMatchError, _super);
        function NoRouteMatchError(location, currentLocation) {
            var _this = _super.call(this, 'No match for\n' +
                JSON.stringify(location) +
                (currentLocation
                    ? '\nwhile being at\n' + JSON.stringify(currentLocation)
                    : '')) || this;
            // @ts-ignore for IE inheritance support
            _this[_b] = true;
            return _this;
        }
        NoRouteMatchError.is = function (error) {
            // only IE9 seems to break the inheritance chain
            // and set Error as the name
            if (error.name === 'Error') {
                // @ts-ignore for IE inheritance support
                return error[isNoRouteMatchError];
            }
            else {
                return error instanceof NoRouteMatchError;
            }
        };
        return NoRouteMatchError;
    }(RouterError));
    _b = isNoRouteMatchError;
    var isInvalidRouteMatch = '__InvalidRouteMatch';
    /**
     * Error used when the matcher fails to resolve a location
     */
    var InvalidRouteMatch = /** @class */ (function (_super) {
        __extends(InvalidRouteMatch, _super);
        function InvalidRouteMatch(location) {
            var _this = 
            // TODO: improve the error to include currentLocation and use it for more cases
            _super.call(this, "Cannot redirect using a relative location:\n" + stringifyRoute(location) + "\nUse the function redirect and explicitly provide a name") || this;
            // @ts-ignore for IE inheritance support
            _this[_c] = true;
            return _this;
        }
        InvalidRouteMatch.is = function (error) {
            // only IE9 seems to break the inheritance chain
            // and set Error as the name
            if (error.name === 'Error') {
                // @ts-ignore for IE inheritance support
                return error[isInvalidRouteMatch];
            }
            else {
                return error instanceof InvalidRouteMatch;
            }
        };
        return InvalidRouteMatch;
    }(RouterError));
    _c = isNoRouteMatchError;
    var isNavigationGuardRedirect = '__NavigationGuardRedirect';
    /**
     * Error used when rejecting a navigation because of a redirection. Contains
     * information about where we where trying to go and where we are going instead
     */
    var NavigationGuardRedirect = /** @class */ (function (_super) {
        __extends(NavigationGuardRedirect, _super);
        // TODO: refactor order of arguments
        // TODO: refactor into parent class NavigationError
        function NavigationGuardRedirect(from, to) {
            var _this = _super.call(this, "Redirected from \"" + from.fullPath + "\" to \"" + stringifyRoute(to) + "\" via a navigation guard") || this;
            // @ts-ignore for IE inheritance support
            _this[_d] = true;
            _this.from = from;
            _this.to = to;
            return _this;
        }
        NavigationGuardRedirect.is = function (error) {
            // only IE9 seems to break the inheritance chain
            // and set Error as the name
            if (error.name === 'Error') {
                // @ts-ignore for IE inheritance support
                return error[isNavigationGuardRedirect];
            }
            else {
                return error instanceof NavigationGuardRedirect;
            }
        };
        return NavigationGuardRedirect;
    }(RouterError));
    _d = isNoRouteMatchError;
    var isNavigationAborted = '__NavigationAborted';
    /**
     * Navigation aborted by next(false)
     */
    var NavigationAborted = /** @class */ (function (_super) {
        __extends(NavigationAborted, _super);
        function NavigationAborted(to, from) {
            var _this = _super.call(this, "Navigation aborted from \"" + from.fullPath + "\" to \"" + to.fullPath + "\" via a navigation guard") || this;
            // @ts-ignore for IE inheritance support
            _this[_e] = true;
            _this.from = from;
            _this.to = to;
            return _this;
        }
        NavigationAborted.is = function (error) {
            // only IE9 seems to break the inheritance chain
            // and set Error as the name
            if (error.name === 'Error') {
                // @ts-ignore for IE inheritance support
                return error[isNavigationAborted];
            }
            else {
                return error instanceof NavigationAborted;
            }
        };
        return NavigationAborted;
    }(RouterError));
    _e = isNavigationAborted;
    var isNavigationCancelled = '__NavigationCancelled';
    /**
     * Navigation canceled by the user by pushing/replacing a new location
     * TODO: is the name good?
     */
    // @ts-ignore RouterError is a constructor
    var NavigationCancelled = /** @class */ (function (_super) {
        __extends(NavigationCancelled, _super);
        function NavigationCancelled(to, from) {
            var _this = _super.call(this, "Navigation cancelled from \"" + from.fullPath + "\" to \"" + to.fullPath + "\" with a new `push` or `replace`") || this;
            // @ts-ignore for IE inheritance support
            _this[_f] = true;
            _this.from = from;
            _this.to = to;
            return _this;
        }
        NavigationCancelled.is = function (error) {
            // only IE9 seems to break the inheritance chain
            // and set Error as the name
            if (error.name === 'Error') {
                // @ts-ignore for IE inheritance support
                return error[isNavigationCancelled];
            }
            else {
                return error instanceof NavigationCancelled;
            }
        };
        return NavigationCancelled;
    }(RouterError));
    _f = isNavigationCancelled;
    var propertiesToLog = [
        'params',
        'query',
        'hash',
    ];
    function stringifyRoute(to) {
        if (typeof to === 'string')
            return to;
        if ('path' in to)
            return to.path;
        var location = {};
        for (var _i = 0, propertiesToLog_1 = propertiesToLog; _i < propertiesToLog_1.length; _i++) {
            var key = propertiesToLog_1[_i];
            // @ts-ignore
            if (key in to)
                location[key] = to[key];
        }
        return JSON.stringify(location, null, 2);
    }

    // default pattern for a param: non greedy everything but /
    var BASE_PARAM_PATTERN = '[^/]+?';
    var BASE_PATH_PARSER_OPTIONS = {
        sensitive: false,
        strict: false,
        start: true,
        end: true,
    };
    // Special Regex characters that must be escaped in static tokens
    var REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
    /**
     * Creates a path parser from an array of Segments (a segment is an array of Tokens)
     *
     * @param segments array of segments returned by tokenizePath
     * @param extraOptions optional options for the regexp
     * @returns a PathParser
     */
    function tokensToParser(segments, extraOptions) {
        var options = __assign(__assign({}, BASE_PATH_PARSER_OPTIONS), extraOptions);
        // the amount of scores is the same as the length of segments except for the root segment "/"
        var score = [];
        // the regexp as a string
        var pattern = options.start ? '^' : '';
        // extracted keys
        var keys = [];
        for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
            var segment = segments_1[_i];
            // the root segment needs special treatment
            var segmentScores = segment.length ? [] : [90 /* Root */];
            // allow trailing slash
            if (options.strict && !segment.length)
                pattern += '/';
            for (var tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
                var token = segment[tokenIndex];
                // resets the score if we are inside a sub segment /:a-other-:b
                var subSegmentScore = 40 /* Segment */ +
                    (options.sensitive ? 0.25 /* BonusCaseSensitive */ : 0);
                if (token.type === 0 /* Static */) {
                    // prepend the slash if we are starting a new segment
                    if (!tokenIndex)
                        pattern += '/';
                    pattern += token.value.replace(REGEX_CHARS_RE, '\\$&');
                    subSegmentScore += 40 /* Static */;
                }
                else if (token.type === 1 /* Param */) {
                    var value = token.value, repeatable = token.repeatable, optional = token.optional, regexp = token.regexp;
                    keys.push({
                        name: value,
                        repeatable: repeatable,
                        optional: optional,
                    });
                    var re_1 = regexp ? regexp : BASE_PARAM_PATTERN;
                    // the user provided a custom regexp /:id(\\d+)
                    if (re_1 !== BASE_PARAM_PATTERN) {
                        subSegmentScore += 10 /* BonusCustomRegExp */;
                        // make sure the regexp is valid before using it
                        try {
                            new RegExp("(" + re_1 + ")");
                        }
                        catch (err) {
                            throw new Error("Invalid custom RegExp for param \"" + value + "\" (" + re_1 + "): " +
                                err.message);
                        }
                    }
                    // when we repeat we must take care of the repeating leading slash
                    var subPattern = repeatable ? "((?:" + re_1 + ")(?:/(?:" + re_1 + "))*)" : "(" + re_1 + ")";
                    // prepend the slash if we are starting a new segment
                    if (!tokenIndex)
                        subPattern = optional ? "(?:/" + subPattern + ")" : '/' + subPattern;
                    if (optional)
                        subPattern += '?';
                    pattern += subPattern;
                    subSegmentScore += 20 /* Dynamic */;
                    if (optional)
                        subSegmentScore += -8 /* BonusOptional */;
                    if (repeatable)
                        subSegmentScore += -20 /* BonusRepeatable */;
                    if (re_1 === '.*')
                        subSegmentScore += -50 /* BonusWildcard */;
                }
                segmentScores.push(subSegmentScore);
            }
            // an empty array like /home/ -> [[{home}], []]
            // if (!segment.length) pattern += '/'
            score.push(segmentScores);
        }
        // only apply the strict bonus to the last score
        if (options.strict && options.end) {
            var i = score.length - 1;
            score[i][score[i].length - 1] += 0.7000000000000001 /* BonusStrict */;
        }
        // TODO: dev only warn double trailing slash
        if (!options.strict)
            pattern += '/?';
        if (options.end)
            pattern += '$';
        // allow paths like /dynamic to only match dynamic or dynamic/... but not dynamic_somethingelse
        else if (options.strict)
            pattern += '(?:/|$)';
        var re = new RegExp(pattern, options.sensitive ? '' : 'i');
        function parse(path) {
            var match = path.match(re);
            var params = {};
            if (!match)
                return null;
            for (var i = 1; i < match.length; i++) {
                var value = match[i] || '';
                var key = keys[i - 1];
                params[key.name] = value && key.repeatable ? value.split('/') : value;
            }
            return params;
        }
        function stringify(params) {
            var path = '';
            // for optional parameters to allow to be empty
            var avoidDuplicatedSlash = false;
            for (var _i = 0, segments_2 = segments; _i < segments_2.length; _i++) {
                var segment = segments_2[_i];
                if (!avoidDuplicatedSlash || path[path.length - 1] !== '/')
                    path += '/';
                avoidDuplicatedSlash = false;
                for (var _a = 0, segment_1 = segment; _a < segment_1.length; _a++) {
                    var token = segment_1[_a];
                    if (token.type === 0 /* Static */) {
                        path += token.value;
                    }
                    else if (token.type === 1 /* Param */) {
                        var value = token.value, repeatable = token.repeatable, optional = token.optional;
                        var param = value in params ? params[value] : '';
                        if (Array.isArray(param) && !repeatable)
                            throw new Error("Provided param \"" + value + "\" is an array but it is not repeatable (* or + modifiers)");
                        var text = Array.isArray(param) ? param.join('/') : param;
                        if (!text) {
                            // do not append a slash on the next iteration
                            if (optional)
                                avoidDuplicatedSlash = true;
                            else
                                throw new Error("Missing required param \"" + value + "\"");
                        }
                        path += text;
                    }
                }
            }
            return path;
        }
        return {
            re: re,
            score: score,
            keys: keys,
            parse: parse,
            stringify: stringify,
        };
    }
    /**
     * Compares an array of numbers as used in PathParser.score and returns a
     * number. This function can be used to `sort` an array
     * @param a first array of numbers
     * @param b second array of numbers
     * @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
     * should be sorted first
     */
    function compareScoreArray(a, b) {
        var i = 0;
        while (i < a.length && i < b.length) {
            var diff = b[i] - a[i];
            // only keep going if diff === 0
            if (diff)
                return diff;
            i++;
        }
        // if the last subsegment was Static, the shorter segments should be sorted first
        // otherwise sort the longest segment first
        if (a.length < b.length) {
            return a.length === 1 && a[0] === 40 /* Static */ + 40 /* Segment */
                ? -1
                : 1;
        }
        else if (a.length > b.length) {
            return b.length === 1 && b[0] === 40 /* Static */ + 40 /* Segment */
                ? 1
                : -1;
        }
        return 0;
    }
    /**
     * Compare function that can be used with `sort` to sort an array of PathParser
     * @param a first PathParser
     * @param b second PathParser
     * @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
     */
    function comparePathParserScore(a, b) {
        var i = 0;
        var aScore = a.score;
        var bScore = b.score;
        while (i < aScore.length && i < bScore.length) {
            var comp = compareScoreArray(aScore[i], bScore[i]);
            // do not return if both are equal
            if (comp)
                return comp;
            i++;
        }
        // if a and b share the same score entries but b has more, sort b first
        return bScore.length - aScore.length;
        // this is the ternary version
        // return aScore.length < bScore.length
        //   ? 1
        //   : aScore.length > bScore.length
        //   ? -1
        //   : 0
    }

    var ROOT_TOKEN = {
        type: 0 /* Static */,
        value: '',
    };
    var VALID_PARAM_RE = /[a-zA-Z0-9_]/;
    function tokenizePath(path) {
        if (!path)
            return [[]];
        if (path === '/')
            return [[ROOT_TOKEN]];
        // remove the leading slash
        if (path[0] !== '/')
            throw new Error('A non-empty path must start with "/"');
        function crash(message) {
            throw new Error("ERR (" + state + ")/\"" + buffer + "\": " + message);
        }
        var state = 0 /* Static */;
        var previousState = state;
        var tokens = [];
        // the segment will always be valid because we get into the initial state
        // with the leading /
        var segment;
        function finalizeSegment() {
            if (segment)
                tokens.push(segment);
            segment = [];
        }
        // index on the path
        var i = 0;
        // char at index
        var char;
        // buffer of the value read
        var buffer = '';
        // custom regexp for a param
        var customRe = '';
        function consumeBuffer() {
            if (!buffer)
                return;
            if (state === 0 /* Static */) {
                segment.push({
                    type: 0 /* Static */,
                    value: buffer,
                });
            }
            else if (state === 1 /* Param */ ||
                state === 2 /* ParamRegExp */ ||
                state === 3 /* ParamRegExpEnd */) {
                if (segment.length > 1 && (char === '*' || char === '+'))
                    crash("A repeatable param (" + buffer + ") must be alone in its segment. eg: '/:ids+.");
                segment.push({
                    type: 1 /* Param */,
                    value: buffer,
                    regexp: customRe,
                    repeatable: char === '*' || char === '+',
                    optional: char === '*' || char === '?',
                });
            }
            else {
                crash('Invalid state to consume buffer');
            }
            buffer = '';
        }
        function addCharToBuffer() {
            buffer += char;
        }
        while (i < path.length) {
            char = path[i++];
            if (char === '\\' && state !== 2 /* ParamRegExp */) {
                previousState = state;
                state = 4 /* EscapeNext */;
                continue;
            }
            switch (state) {
                case 0 /* Static */:
                    if (char === '/') {
                        if (buffer) {
                            consumeBuffer();
                        }
                        finalizeSegment();
                    }
                    else if (char === ':') {
                        consumeBuffer();
                        state = 1 /* Param */;
                        // } else if (char === '{') {
                        // TODO: handle group (or drop it)
                        // addCharToBuffer()
                    }
                    else {
                        addCharToBuffer();
                    }
                    break;
                case 4 /* EscapeNext */:
                    addCharToBuffer();
                    state = previousState;
                    break;
                case 1 /* Param */:
                    if (char === '(') {
                        state = 2 /* ParamRegExp */;
                        customRe = '';
                    }
                    else if (VALID_PARAM_RE.test(char)) {
                        addCharToBuffer();
                    }
                    else {
                        consumeBuffer();
                        state = 0 /* Static */;
                        // go back one character if we were not modifying
                        if (char !== '*' && char !== '?' && char !== '+')
                            i--;
                    }
                    break;
                case 2 /* ParamRegExp */:
                    if (char === ')') {
                        // handle the escaped )
                        if (customRe[customRe.length - 1] == '\\')
                            customRe = customRe.slice(0, -1) + char;
                        else
                            state = 3 /* ParamRegExpEnd */;
                    }
                    else {
                        customRe += char;
                    }
                    break;
                case 3 /* ParamRegExpEnd */:
                    // same as finalizing a param
                    consumeBuffer();
                    state = 0 /* Static */;
                    // go back one character if we were not modifying
                    if (char !== '*' && char !== '?' && char !== '+')
                        i--;
                    break;
                default:
                    crash('Unknown state');
                    break;
            }
        }
        if (state === 2 /* ParamRegExp */)
            crash("Unfinished custom RegExp for param \"" + buffer + "\"");
        consumeBuffer();
        finalizeSegment();
        return tokens;
    }

    function createRouteRecordMatcher(record, parent, options) {
        var parser = tokensToParser(tokenizePath(record.path), options);
        var matcher = __assign(__assign({}, parser), { record: record,
            parent: parent, 
            // these needs to be populated by the parent
            children: [] });
        if (parent) {
            // both are aliases or both are not aliases
            // we don't want to mix them because the order is used when
            // passing originalRecord in Matcher.addRoute
            if (!matcher.record.aliasOf === !parent.record.aliasOf)
                parent.children.push(matcher);
            // else TODO: save alias children to be able to remove them
        }
        return matcher;
    }

    function createRouterMatcher(routes, globalOptions) {
        // normalized ordered array of matchers
        var matchers = [];
        var matcherMap = new Map();
        function getRecordMatcher(name) {
            return matcherMap.get(name);
        }
        // TODO: add routes to children of parent
        function addRoute(record, parent, originalRecord) {
            var mainNormalizedRecord = normalizeRouteRecord(record);
            // we might be the child of an alias
            mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
            var options = __assign(__assign({}, globalOptions), record.options);
            // generate an array of records to correctly handle aliases
            var normalizedRecords = [mainNormalizedRecord];
            if ('alias' in record) {
                var aliases = typeof record.alias === 'string' ? [record.alias] : record.alias;
                for (var _i = 0, aliases_1 = aliases; _i < aliases_1.length; _i++) {
                    var alias = aliases_1[_i];
                    normalizedRecords.push(__assign(__assign({}, mainNormalizedRecord), { path: alias, 
                        // we might be the child of an alias
                        aliasOf: originalRecord
                            ? originalRecord.record
                            : mainNormalizedRecord }));
                }
            }
            var matcher;
            for (var _a = 0, normalizedRecords_1 = normalizedRecords; _a < normalizedRecords_1.length; _a++) {
                var normalizedRecord = normalizedRecords_1[_a];
                var path = normalizedRecord.path;
                // Build up the path for nested routes if the child isn't an absolute
                // route. Only add the / delimiter if the child path isn't empty and if the
                // parent path doesn't have a trailing slash
                if (parent && path[0] !== '/') {
                    var parentPath = parent.record.path;
                    var connectingSlash = parentPath[parentPath.length - 1] === '/' ? '' : '/';
                    normalizedRecord.path =
                        parent.record.path + (path && connectingSlash + path);
                }
                // create the object before hand so it can be passed to children
                matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
                var children = mainNormalizedRecord.children;
                for (var i = 0; i < children.length; i++) {
                    addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
                }
                // if there was no original record, then the first one was not an alias and all
                // other alias (if any) need to reference this record when adding children
                originalRecord = originalRecord || matcher;
                insertMatcher(matcher);
            }
            return function () {
                // since other matchers are aliases, they should should be removed by any of the matchers
                removeRoute(matcher);
            };
        }
        function removeRoute(matcherRef) {
            // TODO: remove aliases (needs to keep them in the RouteRecordMatcher first)
            if (typeof matcherRef === 'string') {
                var matcher = matcherMap.get(matcherRef);
                if (matcher) {
                    matcherMap.delete(matcherRef);
                    matchers.splice(matchers.indexOf(matcher), 1);
                    matcher.children.forEach(removeRoute);
                }
            }
            else {
                var index = matchers.indexOf(matcherRef);
                if (index > -1) {
                    matchers.splice(index, 1);
                    if (matcherRef.record.name)
                        matcherMap.delete(matcherRef.record.name);
                    matcherRef.children.forEach(removeRoute);
                }
            }
        }
        function getRoutes() {
            return matchers;
        }
        function insertMatcher(matcher) {
            var i = 0;
            // console.log('i is', { i })
            while (i < matchers.length &&
                comparePathParserScore(matcher, matchers[i]) >= 0)
                i++;
            // console.log('END i is', { i })
            // while (i < matchers.length && matcher.score <= matchers[i].score) i++
            matchers.splice(i, 0, matcher);
            // only add the original record to the name map
            if (matcher.record.name && !isAliasRecord(matcher))
                matcherMap.set(matcher.record.name, matcher);
        }
        /**
         * Resolves a location. Gives access to the route record that corresponds to the actual path as well as filling the corresponding params objects
         * @param location MatcherLocation to resolve to a url
         * @param currentLocation MatcherLocationNormalized of the current location
         */
        function resolve(location, currentLocation) {
            var matcher;
            var params = {};
            var path;
            var name;
            if ('name' in location && location.name) {
                matcher = matcherMap.get(location.name);
                if (!matcher)
                    throw new NoRouteMatchError(location);
                name = matcher.record.name;
                // TODO: merge params with current location. Should this be done by name. I think there should be some kind of relationship between the records like children of a parent should keep parent props but not the rest
                // needs an RFC if breaking change
                params = location.params || currentLocation.params;
                // throws if cannot be stringified
                path = matcher.stringify(params);
            }
            else if ('path' in location) {
                matcher = matchers.find(function (m) { return m.re.test(location.path); });
                // matcher should have a value after the loop
                // no need to resolve the path with the matcher as it was provided
                // this also allows the user to control the encoding
                path = location.path;
                if (matcher) {
                    // TODO: dev warning of unused params if provided
                    params = matcher.parse(location.path);
                    name = matcher.record.name;
                }
                // location is a relative path
            }
            else {
                // match by name or path of current route
                matcher = currentLocation.name
                    ? matcherMap.get(currentLocation.name)
                    : matchers.find(function (m) { return m.re.test(currentLocation.path); });
                if (!matcher)
                    throw new NoRouteMatchError(location, currentLocation);
                name = matcher.record.name;
                params = location.params || currentLocation.params;
                path = matcher.stringify(params);
            }
            var matched = [];
            var parentMatcher = matcher;
            while (parentMatcher) {
                // reversed order so parents are at the beginning
                // const { record } = parentMatcher
                // TODO: check resolving child routes by path when parent has an alias
                matched.unshift(parentMatcher.record);
                parentMatcher = parentMatcher.parent;
            }
            return {
                name: name,
                path: path,
                params: params,
                matched: matched,
                meta: matcher ? matcher.record.meta : {},
            };
        }
        // add initial routes
        routes.forEach(function (route) { return addRoute(route); });
        return { addRoute: addRoute, resolve: resolve, removeRoute: removeRoute, getRoutes: getRoutes, getRecordMatcher: getRecordMatcher };
    }
    /**
     * Normalizes a RouteRecord. Transforms the `redirect` option into a `beforeEnter`
     * @param record
     * @returns the normalized version
     */
    function normalizeRouteRecord(record) {
        var components;
        var beforeEnter;
        if ('redirect' in record) {
            components = {};
            var redirect_1 = record.redirect;
            beforeEnter = function (to, from, next) {
                next(typeof redirect_1 === 'function' ? redirect_1(to) : redirect_1);
            };
        }
        else {
            components =
                'components' in record ? record.components : { default: record.component };
            beforeEnter = record.beforeEnter;
        }
        return {
            path: record.path,
            components: components,
            // record is an object and if it has a children property, it's an array
            children: record.children || [],
            name: record.name,
            beforeEnter: beforeEnter,
            meta: record.meta || {},
            leaveGuards: [],
            aliasOf: undefined,
        };
    }
    /**
     * Checks if a record or any of its parent is an alias
     * @param record
     */
    function isAliasRecord(record) {
        while (record) {
            if (record.record.aliasOf)
                return true;
            record = record.parent;
        }
        return false;
    }

    function guardToPromiseFn(guard, to, from) {
        return function () {
            return new Promise(function (resolve, reject) {
                var next = function (valid) {
                    // TODO: handle callback
                    if (valid === false)
                        reject(new NavigationAborted(to, from));
                    else if (isRouteLocation(valid)) {
                        reject(new NavigationGuardRedirect(to, valid));
                    }
                    else
                        resolve();
                };
                guard(to, from, next);
            });
        };
    }

    function extractComponentsGuards(matched, guardType, to, from) {
        return __awaiter(this, void 0, void 0, function () {
            var guards;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        guards = [];
                        return [4 /*yield*/, Promise.all(matched.map(function (record) { return __awaiter(_this, void 0, void 0, function () {
                                var name_1, component, resolvedComponent, guard;
                                return __generator(this, function (_a) {
                                    // TODO: cache async routes per record
                                    for (name_1 in record.components) {
                                        component = record.components[name_1];
                                        resolvedComponent = component;
                                        guard = resolvedComponent[guardType];
                                        if (guard) {
                                            guards.push(guardToPromiseFn(guard, to, from));
                                        }
                                    }
                                    return [2 /*return*/];
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, guards];
                }
            });
        });
    }
    function applyToParams(fn, params) {
        var newParams = {};
        for (var key in params) {
            var value = params[key];
            newParams[key] = Array.isArray(value) ? value.map(fn) : fn(value);
        }
        return newParams;
    }
    function isSameRouteRecord(a, b) {
        // since the original record has an undefined value for aliasOf
        // but all aliases point to the original record, this will always compare
        // the original record
        return (a.aliasOf || a) === (b.aliasOf || b);
    }
    function isSameLocationObject(a, b) {
        var aKeys = Object.keys(a);
        var bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length)
            return false;
        var i = 0;
        var key;
        while (i < aKeys.length) {
            key = aKeys[i];
            if (key !== bKeys[i])
                return false;
            if (!isSameLocationObjectValue(a[key], b[key]))
                return false;
            i++;
        }
        return true;
    }
    function isSameLocationObjectValue(a, b) {
        if (typeof a !== typeof b)
            return false;
        // both a and b are arrays
        if (Array.isArray(a))
            return (a.length === b.length &&
                a.every(function (value, i) { return value === b[i]; }));
        return a === b;
    }

    /**
     * Create a list of callbacks that can be reset. Used to create before and after navigation guards list
     */
    function useCallbacks() {
        var handlers = [];
        function add(handler) {
            handlers.push(handler);
            return function () {
                var i = handlers.indexOf(handler);
                if (i > -1)
                    handlers.splice(i, 1);
            };
        }
        function reset() {
            handlers = [];
        }
        return {
            add: add,
            list: function () { return handlers; },
            reset: reset,
        };
    }

    /**
     * Encoding Rules
     * ␣ = Space
     * Path: ␣ " < > # ? { }
     * Query: ␣ " < > # & =
     * Hash: ␣ " < > `
     *
     * On top of that the RFC3986 (https://tools.ietf.org/html/rfc3986#section-2.2) defines some extra characters to be encoded. Most browsers do not encode them in encodeURI https://github.com/whatwg/url/issues/369 so it may be safer to also encode !'()*. Leaving unencoded only ASCII alphanum plus -._~
     * This extra safety should be applied to query by patching the string returned by encodeURIComponent
     * encodeURI also encodes [\]^
     * \ should be encoded to avoid ambiguity. Browsers (IE, FF, C) transform a \ into a / if directly typed in
     * ` should also be encoded everywhere because some browsers like FF encode it when directly written while others don't
     * Safari and IE don't encode "<>{}` in hash
     */
    // const EXTRA_RESERVED_RE = /[!'()*]/g
    // const encodeReservedReplacer = (c: string) => '%' + c.charCodeAt(0).toString(16)
    var HASH_RE = /#/g; // %23
    var AMPERSAND_RE = /&/g; // %26
    var SLASH_RE = /\//g; // %2F
    var EQUAL_RE = /=/g; // %3D
    var IM_RE = /\?/g; // %3F
    var ENC_BRACKET_OPEN_RE = /%5B/g; // [
    var ENC_BRACKET_CLOSE_RE = /%5D/g; // ]
    var ENC_CARET_RE = /%5E/g; // ^
    var ENC_BACKTICK_RE = /%60/g; // `
    var ENC_CURLY_OPEN_RE = /%7B/g; // {
    var ENC_PIPE_RE = /%7C/g; // |
    var ENC_CURLY_CLOSE_RE = /%7D/g; // }
    function commonEncode(text) {
        return encodeURI('' + text)
            .replace(ENC_PIPE_RE, '|')
            .replace(ENC_BRACKET_OPEN_RE, '[')
            .replace(ENC_BRACKET_CLOSE_RE, ']');
    }
    function encodeQueryProperty(text) {
        return commonEncode(text)
            .replace(HASH_RE, '%23')
            .replace(AMPERSAND_RE, '%26')
            .replace(EQUAL_RE, '%3D')
            .replace(ENC_BACKTICK_RE, '`')
            .replace(ENC_CURLY_OPEN_RE, '{')
            .replace(ENC_CURLY_CLOSE_RE, '}')
            .replace(ENC_CARET_RE, '^');
    }
    function encodePath(text) {
        return commonEncode(text)
            .replace(HASH_RE, '%23')
            .replace(IM_RE, '%3F');
    }
    function encodeParam(text) {
        return encodePath(text).replace(SLASH_RE, '%2F');
    }
    function decode(text) {
        try {
            return decodeURIComponent(text);
        }
        catch (err) {
             vue.warn("Error decoding \"" + text + "\". Using original value");
        }
        return text;
    }

    /**
     * Transform a queryString into a query object. Accept both, a version with the leading `?` and without
     * Should work as URLSearchParams
     * @param search
     * @returns a query object
     */
    function parseQuery(search) {
        var query = {};
        // avoid creating an object with an empty key and empty value
        // because of split('&')
        if (search === '' || search === '?')
            return query;
        var hasLeadingIM = search[0] === '?';
        var searchParams = (hasLeadingIM ? search.slice(1) : search).split('&');
        for (var i = 0; i < searchParams.length; ++i) {
            var _a = searchParams[i].split('='), key = _a[0], rawValue = _a[1];
            key = decode(key);
            // avoid decoding null
            var value = rawValue == null ? null : decode(rawValue);
            if (key in query) {
                // an extra variable for ts types
                var currentValue = query[key];
                if (!Array.isArray(currentValue)) {
                    currentValue = query[key] = [currentValue];
                }
                currentValue.push(value);
            }
            else {
                query[key] = value;
            }
        }
        return query;
    }
    /**
     * Stringify an object query. Works like URLSearchParams. Doesn't prepend a `?`
     * @param query
     */
    function stringifyQuery(query) {
        var search = '';
        for (var key in query) {
            if (search.length)
                search += '&';
            var value = query[key];
            key = encodeQueryProperty(key);
            if (value == null) {
                // only null adds the value
                if (value !== undefined)
                    search += key;
                continue;
            }
            // keep null values
            var values = Array.isArray(value)
                ? value.map(function (v) { return v && encodeQueryProperty(v); })
                : [value && encodeQueryProperty(value)];
            for (var i = 0; i < values.length; i++) {
                // only append & with i > 0
                search += (i ? '&' : '') + key;
                if (values[i] != null)
                    search += ('=' + values[i]);
            }
        }
        return search;
    }
    /**
     * Transforms a RawQuery intoe a NormalizedQuery by casting numbers into
     * strings, removing keys with an undefined value and replacing undefined with
     * null in arrays
     * @param query
     */
    function normalizeQuery(query) {
        var normalizedQuery = {};
        for (var key in query) {
            var value = query[key];
            if (value !== undefined) {
                normalizedQuery[key] = Array.isArray(value)
                    ? value.map(function (v) { return (v == null ? null : '' + v); })
                    : value == null
                        ? value
                        : '' + value;
            }
        }
        return normalizedQuery;
    }

    var routerKey = 'router';
    var routeKey = 'route';
    function useRouter() {
        return vue.inject(routerKey);
    }
    function useRoute() {
        return vue.inject(routeKey);
    }

    function useLink(props) {
        var router = vue.inject(routerKey);
        var route = vue.computed(function () { return router.resolve(vue.unref(props.to)); });
        var href = vue.computed(function () { return router.createHref(route.value); });
        var activeRecordIndex = vue.computed(function () {
            var currentMatched = route.value.matched[route.value.matched.length - 1];
            return router.currentRoute.value.matched.findIndex(isSameRouteRecord.bind(null, currentMatched));
        });
        var isActive = vue.computed(function () {
            return activeRecordIndex.value > -1 &&
                includesParams(router.currentRoute.value.params, route.value.params);
        });
        var isExactActive = vue.computed(function () {
            return activeRecordIndex.value ===
                router.currentRoute.value.matched.length - 1 &&
                isSameLocationObject(router.currentRoute.value.params, route.value.params);
        });
        // TODO: handle replace prop
        // const method = unref(rep)
        function navigate(e) {
            if (e === void 0) { e = {}; }
            // TODO: handle navigate with empty parameters for scoped slot and composition api
            if (guardEvent(e))
                router.push(route.value);
        }
        return {
            route: route,
            href: href,
            isActive: isActive,
            isExactActive: isExactActive,
            navigate: navigate,
        };
    }
    var Link = vue.defineComponent({
        name: 'RouterLink',
        props: {
            to: {
                type: [String, Object],
                required: true,
            },
        },
        setup: function (props, _a) {
            var slots = _a.slots, attrs = _a.attrs;
            var link = vue.reactive(useLink(props));
            var elClass = vue.computed(function () { return ({
                'router-link-active': link.isActive,
                'router-link-exact-active': link.isExactActive,
            }); });
            return function () {
                return vue.h('a', __assign(__assign({ 'aria-current': link.isExactActive ? 'page' : null, onClick: link.navigate, href: link.href }, attrs), { class: elClass.value }), slots.default && slots.default(link));
            };
        },
    });
    function guardEvent(e) {
        // don't redirect with control keys
        if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
            return;
        // don't redirect when preventDefault called
        if (e.defaultPrevented)
            return;
        // don't redirect on right click
        if (e.button !== undefined && e.button !== 0)
            return;
        // don't redirect if `target="_blank"`
        // @ts-ignore getAttribute does exist
        if (e.currentTarget && e.currentTarget.getAttribute) {
            // @ts-ignore getAttribute exists
            var target = e.currentTarget.getAttribute('target');
            if (/\b_blank\b/i.test(target))
                return;
        }
        // this may be a Weex event which doesn't have this method
        if (e.preventDefault)
            e.preventDefault();
        return true;
    }
    function includesParams(outter, inner) {
        var _loop_1 = function (key) {
            var innerValue = inner[key];
            var outterValue = outter[key];
            if (typeof innerValue === 'string') {
                if (innerValue !== outterValue)
                    return { value: false };
            }
            else {
                if (!Array.isArray(outterValue) ||
                    outterValue.length !== innerValue.length ||
                    innerValue.some(function (value, i) { return value !== outterValue[i]; }))
                    return { value: false };
            }
        };
        for (var key in inner) {
            var state_1 = _loop_1(key);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return true;
    }

    // TODO: make it work with no symbols too for IE
    var matchedRouteKey = Symbol();
    var View = vue.defineComponent({
        name: 'RouterView',
        props: {
            name: {
                type: String,
                default: 'default',
            },
        },
        setup: function (props, _a) {
            var attrs = _a.attrs;
            var route = vue.inject(routeKey);
            var depth = vue.inject('routerViewDepth', 0);
            vue.provide('routerViewDepth', depth + 1);
            var matchedRoute = vue.computed(function () { return route.value.matched[depth]; });
            var ViewComponent = vue.computed(function () { return matchedRoute.value && matchedRoute.value.components[props.name]; });
            vue.provide(matchedRouteKey, matchedRoute);
            return function () {
                return ViewComponent.value
                    ? vue.h(ViewComponent.value, __assign({}, attrs))
                    : null;
            };
        },
    });

    var isClient = typeof window !== 'undefined';
    function createRouter(_a) {
        var _this = this;
        var history = _a.history, routes = _a.routes, scrollBehavior = _a.scrollBehavior;
        var matcher = createRouterMatcher(routes, {});
        var beforeGuards = useCallbacks();
        var afterGuards = useCallbacks();
        var currentRoute = vue.ref(START_LOCATION_NORMALIZED);
        var pendingLocation = START_LOCATION_NORMALIZED;
        if (isClient && 'scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        function createHref(to) {
            return history.base + to.fullPath;
        }
        var encodeParams = applyToParams.bind(null, encodeParam);
        var decodeParams = applyToParams.bind(null, decode);
        function addRoute(parentOrRoute, route) {
            var parent;
            var record;
            if (typeof parentOrRoute === 'string') {
                parent = matcher.getRecordMatcher(parentOrRoute);
                record = route;
            }
            else {
                record = parentOrRoute;
            }
            return matcher.addRoute(record, parent);
        }
        function removeRoute(name) {
            var recordMatcher = matcher.getRecordMatcher(name);
            if (recordMatcher) {
                matcher.removeRoute(recordMatcher);
            }
            else {
                // TODO: adapt if we allow Symbol as a name
                vue.warn("Cannot remove non-existant route \"" + name + "\"");
            }
        }
        function getRoutes() {
            return matcher.getRoutes().map(function (routeMatcher) { return routeMatcher.record; });
        }
        function resolve(location, currentLocation) {
            // const objectLocation = routerLocationAsObject(location)
            currentLocation = currentLocation || currentRoute.value;
            if (typeof location === 'string') {
                var locationNormalized = parseURL(parseQuery, location);
                var matchedRoute_1 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
                return __assign(__assign(__assign({}, locationNormalized), matchedRoute_1), { params: decodeParams(matchedRoute_1.params), redirectedFrom: undefined });
            }
            var matchedRoute = 
            // for same reason TS thinks location.params can be undefined
            matcher.resolve('params' in location
                ? __assign(__assign({}, location), { params: encodeParams(location.params) }) : location, currentLocation);
            // put back the unencoded params as given by the user (avoid the cost of decoding them)
            // TODO: normalize params if we accept numbers as raw values
            matchedRoute.params =
                'params' in location
                    ? location.params
                    : decodeParams(matchedRoute.params);
            return __assign(__assign({ fullPath: stringifyURL(stringifyQuery, __assign(__assign({}, location), { path: matchedRoute.path })), hash: location.hash || '', query: normalizeQuery(location.query) }, matchedRoute), { redirectedFrom: undefined });
        }
        function push(to) {
            return pushWithRedirect(to, undefined);
        }
        function pushWithRedirect(to, redirectedFrom) {
            return __awaiter(this, void 0, void 0, function () {
                var toLocation, from, force, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            toLocation = (pendingLocation =
                                // Some functions will pass a normalized location and we don't need to resolve it again
                                typeof to === 'object' && 'matched' in to ? to : resolve(to));
                            from = currentRoute.value;
                            force = to.force;
                            // TODO: should we throw an error as the navigation was aborted
                            if (!force && isSameLocation(from, toLocation))
                                return [2 /*return*/, from];
                            toLocation.redirectedFrom = redirectedFrom;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, navigate(toLocation, from)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            if (NavigationGuardRedirect.is(error_1)) {
                                // push was called while waiting in guards
                                if (pendingLocation !== toLocation) {
                                    triggerError(new NavigationCancelled(toLocation, from));
                                }
                                // preserve the original redirectedFrom if any
                                return [2 /*return*/, pushWithRedirect(error_1.to, redirectedFrom || toLocation)];
                            }
                            else {
                                // TODO: write tests
                                if (pendingLocation !== toLocation) {
                                    triggerError(new NavigationCancelled(toLocation, from));
                                }
                            }
                            triggerError(error_1);
                            return [3 /*break*/, 4];
                        case 4:
                            finalizeNavigation(toLocation, from, true, 
                            // RouteLocationNormalized will give undefined
                            to.replace === true);
                            return [2 /*return*/, currentRoute.value];
                    }
                });
            });
        }
        function replace(to) {
            var location = typeof to === 'string' ? { path: to } : to;
            return push(__assign(__assign({}, location), { replace: true }));
        }
        function navigate(to, from) {
            return __awaiter(this, void 0, void 0, function () {
                var guards, leavingRecords, _i, leavingRecords_1, record, _a, _b, guard, _c, _d, guard, _e, _f, record, _g, _h, beforeEnter;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0: return [4 /*yield*/, extractComponentsGuards(from.matched.filter(function (record) { return to.matched.indexOf(record) < 0; }).reverse(), 'beforeRouteLeave', to, from)];
                        case 1:
                            // all components here have been resolved once because we are leaving
                            // TODO: refactor both together
                            guards = _j.sent();
                            leavingRecords = extractChangingRecords(to, from)[0];
                            for (_i = 0, leavingRecords_1 = leavingRecords; _i < leavingRecords_1.length; _i++) {
                                record = leavingRecords_1[_i];
                                for (_a = 0, _b = record.leaveGuards; _a < _b.length; _a++) {
                                    guard = _b[_a];
                                    guards.push(guardToPromiseFn(guard, to, from));
                                }
                            }
                            // run the queue of per route beforeRouteLeave guards
                            return [4 /*yield*/, runGuardQueue(guards)
                                // check global guards beforeEach
                            ];
                        case 2:
                            // run the queue of per route beforeRouteLeave guards
                            _j.sent();
                            // check global guards beforeEach
                            guards = [];
                            for (_c = 0, _d = beforeGuards.list(); _c < _d.length; _c++) {
                                guard = _d[_c];
                                guards.push(guardToPromiseFn(guard, to, from));
                            }
                            // console.log('Guarding against', guards.length, 'guards')
                            return [4 /*yield*/, runGuardQueue(guards)
                                // check in components beforeRouteUpdate
                            ];
                        case 3:
                            // console.log('Guarding against', guards.length, 'guards')
                            _j.sent();
                            return [4 /*yield*/, extractComponentsGuards(to.matched.filter(function (record) { return from.matched.indexOf(record) > -1; }), 'beforeRouteUpdate', to, from)
                                // run the queue of per route beforeEnter guards
                            ];
                        case 4:
                            // check in components beforeRouteUpdate
                            guards = _j.sent();
                            // run the queue of per route beforeEnter guards
                            return [4 /*yield*/, runGuardQueue(guards)
                                // check the route beforeEnter
                            ];
                        case 5:
                            // run the queue of per route beforeEnter guards
                            _j.sent();
                            // check the route beforeEnter
                            guards = [];
                            for (_e = 0, _f = to.matched; _e < _f.length; _e++) {
                                record = _f[_e];
                                // do not trigger beforeEnter on reused views
                                if (record.beforeEnter && from.matched.indexOf(record) < 0) {
                                    if (Array.isArray(record.beforeEnter)) {
                                        for (_g = 0, _h = record.beforeEnter; _g < _h.length; _g++) {
                                            beforeEnter = _h[_g];
                                            guards.push(guardToPromiseFn(beforeEnter, to, from));
                                        }
                                    }
                                    else {
                                        guards.push(guardToPromiseFn(record.beforeEnter, to, from));
                                    }
                                }
                            }
                            // run the queue of per route beforeEnter guards
                            return [4 /*yield*/, runGuardQueue(guards)
                                // check in-component beforeRouteEnter
                                // TODO: is it okay to resolve all matched component or should we do it in order
                            ];
                        case 6:
                            // run the queue of per route beforeEnter guards
                            _j.sent();
                            return [4 /*yield*/, extractComponentsGuards(to.matched.filter(function (record) { return from.matched.indexOf(record) < 0; }), 'beforeRouteEnter', to, from)
                                // run the queue of per route beforeEnter guards
                            ];
                        case 7:
                            // check in-component beforeRouteEnter
                            // TODO: is it okay to resolve all matched component or should we do it in order
                            guards = _j.sent();
                            // run the queue of per route beforeEnter guards
                            return [4 /*yield*/, runGuardQueue(guards)];
                        case 8:
                            // run the queue of per route beforeEnter guards
                            _j.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        /**
         * - Cleans up any navigation guards
         * - Changes the url if necessary
         * - Calls the scrollBehavior
         */
        function finalizeNavigation(toLocation, from, isPush, replace) {
            // a more recent navigation took place
            if (pendingLocation !== toLocation) {
                return triggerError(new NavigationCancelled(toLocation, from), isPush);
            }
            // remove registered guards from removed matched records
            var leavingRecords = extractChangingRecords(toLocation, from)[0];
            for (var _i = 0, leavingRecords_2 = leavingRecords; _i < leavingRecords_2.length; _i++) {
                var record = leavingRecords_2[_i];
                record.leaveGuards = [];
            }
            // only consider as push if it's not the first navigation
            var isFirstNavigation = from === START_LOCATION_NORMALIZED;
            // change URL only if the user did a push/replace and if it's not the initial navigation because
            // it's just reflecting the url
            if (isPush) {
                if (replace || isFirstNavigation)
                    history.replace(toLocation);
                else
                    history.push(toLocation);
            }
            // accept current navigation
            currentRoute.value = vue.markNonReactive(toLocation);
            // TODO: this doesn't work on first load. Moving it to RouterView could allow automatically handling transitions too maybe
            // TODO: refactor with a state getter
            var state = isPush || !isClient ? {} : window.history.state;
            handleScroll(toLocation, from, state && state.scroll).catch(function (err) {
                return triggerError(err, false);
            });
            // navigation is confirmed, call afterGuards
            for (var _a = 0, _b = afterGuards.list(); _a < _b.length; _a++) {
                var guard = _b[_a];
                guard(toLocation, from);
            }
            markAsReady();
        }
        // attach listener to history to trigger navigations
        history.listen(function (to, _from, info) { return __awaiter(_this, void 0, void 0, function () {
            var toLocation, from, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        toLocation = resolve(to.fullPath);
                        // console.log({ to, matchedRoute })
                        pendingLocation = toLocation;
                        from = currentRoute.value;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, navigate(toLocation, from)];
                    case 2:
                        _a.sent();
                        finalizeNavigation(toLocation, from, false);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        if (NavigationGuardRedirect.is(error_2)) {
                            // TODO: refactor the duplication of new NavigationCancelled by
                            // checking instanceof NavigationError (it's another TODO)
                            // a more recent navigation took place
                            if (pendingLocation !== toLocation) {
                                return [2 /*return*/, triggerError(new NavigationCancelled(toLocation, from), false)];
                            }
                            triggerError(error_2, false);
                            // the error is already handled by router.push
                            // we just want to avoid logging the error
                            pushWithRedirect(error_2.to, toLocation).catch(function () { });
                        }
                        else if (NavigationAborted.is(error_2)) {
                            console.log('Cancelled, going to', -info.distance);
                            // TODO: test on different browsers ensure consistent behavior
                            history.go(-info.distance, false);
                        }
                        else {
                            triggerError(error_2, false);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Initialization and Errors
        var readyHandlers = useCallbacks();
        var errorHandlers = useCallbacks();
        var ready;
        /**
         * Trigger errorHandlers added via onError and throws the error as well
         * @param error error to throw
         * @param shouldThrow defaults to true. Pass false to not throw the error
         */
        function triggerError(error, shouldThrow) {
            if (shouldThrow === void 0) { shouldThrow = true; }
            markAsReady(error);
            errorHandlers.list().forEach(function (handler) { return handler(error); });
            if (shouldThrow)
                throw error;
        }
        /**
         * Returns a Promise that resolves or reject when the router has finished its
         * initial navigation. This will be automatic on client but requires an
         * explicit `router.push` call on the server. This behavior can change
         * depending on the history implementation used e.g. the defaults history
         * implementation (client only) triggers this automatically but the memory one
         * (should be used on server) doesn't
         */
        function isReady() {
            if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
                return Promise.resolve();
            return new Promise(function (resolve, reject) {
                readyHandlers.add([resolve, reject]);
            });
        }
        /**
         * Mark the router as ready, resolving the promised returned by isReady(). Can
         * only be called once, otherwise does nothing.
         * @param err optional error
         */
        function markAsReady(err) {
            if (ready)
                return;
            ready = true;
            readyHandlers
                .list()
                .forEach(function (_a) {
                var resolve = _a[0], reject = _a[1];
                return (err ? reject(err) : resolve());
            });
            readyHandlers.reset();
        }
        // Scroll behavior
        function handleScroll(to, from, scrollPosition) {
            return __awaiter(this, void 0, void 0, function () {
                var position;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!scrollBehavior)
                                return [2 /*return*/];
                            return [4 /*yield*/, vue.nextTick()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, scrollBehavior(to, from, scrollPosition || null)];
                        case 2:
                            position = _a.sent();
                            console.log('scrolling to', position);
                            scrollToPosition(position);
                            return [2 /*return*/];
                    }
                });
            });
        }
        var router = {
            currentRoute: currentRoute,
            addRoute: addRoute,
            removeRoute: removeRoute,
            getRoutes: getRoutes,
            push: push,
            replace: replace,
            resolve: resolve,
            beforeEach: beforeGuards.add,
            afterEach: afterGuards.add,
            createHref: createHref,
            onError: errorHandlers.add,
            isReady: isReady,
            history: history,
            install: function (app) {
                applyRouterPlugin(app, this);
            },
        };
        return router;
    }
    function applyRouterPlugin(app, router) {
        // TODO: remove as any
        app.component('RouterLink', Link);
        app.component('RouterView', View);
        var started = false;
        // TODO: can we use something that isn't a mixin?
        // TODO: this initial navigation is only necessary on client, on server it doesn't make sense
        // because it will create an extra unecessary navigation and could lead to problems
        if (isClient)
            app.mixin({
                beforeCreate: function () {
                    if (!started) {
                        router.push(router.history.location.fullPath).catch(function (err) {
                            console.error('Unhandled error', err);
                        });
                        started = true;
                    }
                },
            });
        // TODO: merge strats?
        app.provide('router', router);
        app.provide('route', router.currentRoute);
    }
    function runGuardQueue(guards) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, guards_1, guard;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, guards_1 = guards;
                        _a.label = 1;
                    case 1:
                        if (!(_i < guards_1.length)) return [3 /*break*/, 4];
                        guard = guards_1[_i];
                        return [4 /*yield*/, guard()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function extractChangingRecords(to, from) {
        var leavingRecords = [];
        var updatingRecords = [];
        var enteringRecords = [];
        // TODO: could be optimized with one single for loop
        for (var _i = 0, _a = from.matched; _i < _a.length; _i++) {
            var record = _a[_i];
            if (to.matched.indexOf(record) < 0)
                leavingRecords.push(record);
            else
                updatingRecords.push(record);
        }
        for (var _b = 0, _c = to.matched; _b < _c.length; _b++) {
            var record = _c[_b];
            if (from.matched.indexOf(record) < 0)
                enteringRecords.push(record);
        }
        return [leavingRecords, updatingRecords, enteringRecords];
    }
    function isSameLocation(a, b) {
        return (a.name === b.name &&
            a.path === b.path &&
            a.hash === b.hash &&
            isSameLocationObject(a.query, b.query) &&
            a.matched.length === b.matched.length &&
            a.matched.every(function (record, i) { return isSameRouteRecord(record, b.matched[i]); }));
    }

    function onBeforeRouteLeave(leaveGuard) {
        var instance = vue.getCurrentInstance();
        if (!instance) {
            
                vue.warn('onRouteLeave must be called at the top of a setup function');
            return;
        }
        // TODO: fix wrong type
        var matched = vue.inject(matchedRouteKey, {}).value;
        if (!matched) {
            
                vue.warn('onRouteLeave must be called at the top of a setup function');
            return;
        }
        // @ts-ignore
        matched.leaveGuards.push(leaveGuard.bind(instance.proxy));
    }

    exports.Link = Link;
    exports.START_LOCATION = START_LOCATION_NORMALIZED;
    exports.View = View;
    exports.createMemoryHistory = createMemoryHistory;
    exports.createRouter = createRouter;
    exports.createWebHashHistory = createWebHashHistory;
    exports.createWebHistory = createWebHistory;
    exports.onBeforeRouteLeave = onBeforeRouteLeave;
    exports.useRoute = useRoute;
    exports.useRouter = useRouter;

    return exports;

}({}, Vue));
