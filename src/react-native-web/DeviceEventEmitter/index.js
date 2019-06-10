
const DeviceEventEmitter = {
    index: 0,
    listeners: new Map(),
    addListener: (eventName, callback) => {
        DeviceEventEmitter.index += 1;
        let map = null;
        if (!DeviceEventEmitter.listeners.has(eventName)) {
            map = new Map();
            DeviceEventEmitter.listeners.set(eventName, map);
        } else {
            map = DeviceEventEmitter.listeners.get(eventName);
        }
        const key = `DeviceEventEmitter-${DeviceEventEmitter.index}`;
        map.set(key, callback);
        const deEmitter = {
            remove: () => {
                map.delete(key);
            },
        };
        return deEmitter;
    },
    emit: (eventName, ...params) => {
        if (DeviceEventEmitter.listeners.has(eventName)) {
            const callbacks = DeviceEventEmitter.listeners.get(eventName);
            // eslint-disable-next-line no-restricted-syntax
            for (const callback of callbacks) {
                callback[1](...params);
            }
        }
    },
    removeAllListeners: (eventName) => {
        if (DeviceEventEmitter.listeners.has(eventName)) {
            DeviceEventEmitter.listeners.delete(eventName);
        }
    },
    removeListener: (eventName, callback) => {
        if (DeviceEventEmitter.listeners.has(eventName)) {
            DeviceEventEmitter.listeners.delete(eventName);
        }
    },
};

module.exports = DeviceEventEmitter;
