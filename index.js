var Event = (function () {
    var events = {};
    var eventMap = {};
    var offLineCache = {};
    var defaultNameSpace = '__default';

    var listen = function (eventName, fn, nameSpace) {
        var _nameSpace,
            _fn,
            _eventName,
            _uuid;
        if (nameSpace === undefined || typeof nameSpace === 'string') {
            _nameSpace = nameSpace === undefined ? defaultNameSpace : '__' + nameSpace;
        } else {
            console.error('Argument(nameSpace="__default") type is not String!');
            return;
        }
        if (typeof fn === 'function') {
            _fn = fn;
        } else {
            console.error('Argument(fn) type is not Function!');
            return;
        }
        if (typeof eventName === 'string') {
            _eventName = '_' + eventName;
        } else {
            console.error('Argument(eventName) type is not String!');
            return;
        }
        _uuid = uuid(6);
        eventMap[_uuid] = {
            nameSpace: _nameSpace,
            eventName: _eventName,
            fn: _fn
        };
        if (!events[_nameSpace]) {
            events[_nameSpace] = {};
        }
        if (events[_nameSpace][_eventName]) {
            events[_nameSpace][_eventName].push(_uuid);
        } else {
            events[_nameSpace][_eventName] = [_uuid];
        }
        run(_eventName, _nameSpace);
        return _uuid;
    };

    var trigger = function (eventName, data, nameSpace) {
        var _nameSpace,
            _eventName,
            _cache;
        if (nameSpace === undefined || typeof nameSpace === 'string') {
            _nameSpace = nameSpace === undefined ? defaultNameSpace : '__' + nameSpace;
        } else {
            console.error('Argument(nameSpace="__default") type is not String!');
            return;
        }
        if (typeof eventName === 'string') {
            _eventName = '_' + eventName;
        } else {
            console.error('Argument(eventName) type is not String!');
            return;
        }
        if (!offLineCache[_nameSpace]) {
            offLineCache[_nameSpace] = {};
        }
        if ( offLineCache[_nameSpace][_eventName]) {
            offLineCache[_nameSpace][_eventName].push(data);
        } else {
            offLineCache[_nameSpace][_eventName] = [data];
        }
        run(_eventName, _nameSpace);
    };
    /**
     * 
     * @param {String} type     listenerID or eventName or nameSpace   //required
     * @param {String} nameSpace nameSpace
     */
    var remove = function (type, nameSpace) {
        var len = arguments.length;
        switch (len) {
            case 1:
                if (eventMap[type]) {
                    var _uuid = type;
                    var _nameSpace = eventMap[_uuid]['nameSpace'];
                    var _eventName = eventMap[_uuid]['eventName'];
                    deleteEvent(_uuid);
                    delete eventMap[_uuid];
                    return;
                }
                if (events['__' + type]) {
                    var _values = Object.values(events['__' + type]);
                    _values = [].concat.apply([], _values);
                    _values.forEach(function (uuid) {
                    delete eventMap[uuid]; 
                    });
                    delete events['__' + type];
                    return;
                }
                if (events[defaultNameSpace] && events[defaultNameSpace]['_' + type]) {
                    events[defaultNameSpace]['_' + type].forEach(function (uuid) {
                        delete eventMap[uuid];
                    });
                    delete events[defaultNameSpace]['_' + type];
                    return;
                }
                console.error('remove failed!');
                break;
            case 2:
                if (events['__' + nameSpace] && events['__' + nameSpace]['_' + type]) {
                    events['__' + nameSpace]['_' + type].forEach(function (uuid) {
                        delete eventMap[uuid];
                    });
                    delete events['__' + nameSpace]['_' + type];
                } else {
                   console.error('remove failed!'); 
                }
                break;
            default:
                events = {};
                eventMap = {};
                offLineCache = {};
                break;
        }
    };
    /**
     * 
     * @param {String} eventName    eventName required.
     * @param {String} nameSpace    nameSpace required.
     */
    var run = function (eventName, nameSpace) {
        var emptyOffLineCache = false;
        if (!(events[nameSpace] && events[nameSpace][eventName])) {
            return;
        }
        if (!(offLineCache[nameSpace] && offLineCache[nameSpace][eventName])) {
            return;
        }
        offLineCache[nameSpace][eventName].forEach(function (data) {
            events[nameSpace][eventName].forEach(function (uuid) {
                if (eventMap[uuid]) {
                    emptyOffLineCache = true;
                    eventMap[uuid]['fn'](data);
                }
            });
        });
        if (emptyOffLineCache) {
            offLineCache[nameSpace][eventName] = null;
        }
        return;
    };

    var uuid = function (len) {
        var arr = [];
        for (var index = 0; index < len; index++) {
            arr.push((Math.random()*16|0).toString(16));
        }
        return arr.join('');
    };
    /**
     * 
     * @param {String} uuid     required
     */
    var deleteEvent = function (uuid) {
        var _nameSpace = eventMap[uuid]['nameSpace'];
        var _eventName = eventMap[uuid]['eventName'];
        var _index = events[_nameSpace][_eventName].indexOf(uuid);
        events[_nameSpace][_eventName].splice(_index, 1);
    };

    return {
        listen: listen,
        trigger: trigger,
        remove: remove
    };
})();

export default Event;