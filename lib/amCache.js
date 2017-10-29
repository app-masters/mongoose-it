let cache;
const _ = require('lodash');

class AMCache {
    constructor () {
        // console.log("CONSTRUCTOR");
        const NodeCache = require("node-cache");
        cache = new NodeCache({stdTTL: 21.600, checkperiod: 1600, errorOnMissing: false}); // 1 day of cache
    }

    static getInstance () {
        // console.log("AMCache getInstance");
        if (!this.instance) { this.instance = new AMCache(); }
        return this.instance;
    }

    getNewInstance(){
        return new AMCache();
    }

    set (key, value) {
        key = this._fixKey(key);
        value = this._fixVal(value);

        // console.log("cache set " + key); //, value
        let val = cache.set(key, value);

        return val;
    }

    get (key) {
        key = this._fixKey(key);
        let value = cache.get(key);
        // console.log("cache get " + key); // value
        return value;
    }

    del (key) {
        key = this._fixKey(key);
        // console.log(">>>> del", key);
        return cache.del(key);
    }

    getStats () {
        return cache.getStats();
    }

    flushAll(){
        return cache.flushAll();
    }

    // Internals

    _fixKey (key) {
        if (typeof key === "object") {
            // console.log("cache key object to string");
            key = JSON.stringify(key);
        }
        return key;
    }

    _fixVal (val) {
        let type = typeof val;
        // console.log(type);
        if (type === "object") {
            let constructorName = val.constructor.name;
            // console.log(constructorName);
            if (constructorName === "Array") {
                for (let i = 0; i < val.length; i++) {
                    val[i] = this._fixVal(val[i]);
                }
            } else if (constructorName === "model") {
                // console.log("model to simple obj");
                val = val.toObject();
                // console.log(val.constructor.name);
            } if (constructorName === "Query" || constructorName === "Promise") {
                throw new Error("You cannot cache a query or promisse. Certify that you are awaiting before cache.");
            }
        }
        return val;
    }
}
AMCache.instance = null;

module.exports = AMCache.getInstance();
