let AMCache = require('./amCache');
let util = require('./util');
let cache = AMCache.getNewInstance();

module.exports = function (schema) {
    // Cache methods

    // console.log("!!!!!!!!!!!", schema);
    schema.statics.cacheAll = async function (populate, sort) {
        if (!populate) populate = '';
        if (!sort) sort = '';

        let records = await this.find({}).populate(populate).sort(sort);

        // Clear the cache
        this.flushAll();

        // Store all on cache, by key
        records.map(record => record.cacheIt());

        cache.set("[[" + this.modelName + "]]", records);

        return records;
    };

    // @todo TEST - refactor
    schema.statics.getAllCache = async function (populate, sort) {
        let key = "[[" + this.modelName + "]]";
        // console.log("KEY", key);

        let records = cache.get(key);

        if (records) {
            return records;
        } else {
            return this.cacheAll();
        }
    };

    schema.statics.findItByIdCache = async function (id, populate) {
        if (!util.isValidObjectId(id))
            throw new Error("Invalid ID used on findItByIdCache at "+this.modelName);
        if (!populate) populate = '';
        let key = getModelKey(this.modelName, id);
        // console.log("KKeeyy",key);
        let record = cache.get(key);

        if (record === undefined) {
            // console.log("querying");
            record = await this.findById(id, {lean: false}).populate(populate);

            if (record) {
                record.cacheIt();
            }
        } else {
            // console.log("HYDRATE");
            // record = this.hydrate(record);
        }

        return record;
    };

    // @todo TEST - refactor
    schema.statics.findItOneCache = async function (findOrId) {
        findOrId = util.getFindObj(findOrId);
        // console.log("findItOneCache.findOrId", findOrId);
        let record = cache.get(findOrId);

        if (record === undefined) {
            // console.log("querying");
            record = await this.findOne(findOrId, {lean: false});
            // console.log("record", record);

            if (record) {
                // Cache it!
                // console.log("Cache it");
                cache.set(findOrId, record);
            }
        }

        return record;
    };

    schema.statics.findItCache = async function (findOrId, populate) {
        findOrId = util.getFindObj(findOrId);
        // console.log(">>>>>>>> findOrId", findOrId);
        let record = cache.get(findOrId);

        if (record === undefined) {
            // console.log("querying");
            record = await this.findIt(findOrId, populate);

            if (record) {
                // Cache it!
                cache.set(findOrId, record);
            }
        }

        return record;
    };

    // @todo TEST - refactor
    schema.statics.findItOneAndUpdateCache = async function findIt (find, data) {
        // console.log(">>> findItAndUpdate");
        let findOrId = util.getFindObj(find, '_id');
        // console.log('findItAndUpdate > findOrId',findOrId);
        let record = await this.findItOneAndUpdate(findOrId, data);

        // Update it on cache
        // console.log("setCache", findOrId);
        cache.set(findOrId, record);

        return record;
    };

    schema.statics.flushAll = async function () {
        // Clear the cache
        return cache.flushAll();
    };

    // Instance methods
    schema.methods.getCacheKey = function () {
        return getModelKey(this.constructor.modelName, this._id);
    };

    schema.methods.cacheIt = function () {
        let key = this.getCacheKey();
        // console.log("key", key);
        return cache.set(key, this);
    };

    function getModelKey (modelName, id) {
        return "[" + modelName + "]:" + id;
    };
};
