const mongoose = require("mongoose");
const util = require("./util");

module.exports = function (schema) {
    schema.statics.findIt = async function findIt (find, populate, sort) {
        if (!populate) populate = '';
        if (!sort) sort = '';
        let findOrId = util.getFindObj(find, '_id');
        // console.log(">>> findIt find", find);
        // console.log(">>> findIt findOrId", findOrId);
        return this.find(findOrId).populate(populate).sort(sort);
    };

    /// DOWN HERE EVERYTHING MUST BE UPDATED! AND TESTED!

    // Just register cache plugin
    const mongooseCacheIt = require('./mongooseCacheIt');
    schema.plugin(mongooseCacheIt);

    // schema.statics.findItCache = async function findIt (find, populate, sort) {
    //     if (!populate) populate = '';
    //     if (!sort) sort = '';
    //     let findOrId = util.getFindObj(find, '_id');
    //     console.log(">>> findItCache", findOrId);
    //     // console.log(">>> findIt find", find);
    //     // console.log(">>> findIt findOrId", findOrId);
    //
    //     let value = AMCache.get(findOrId);
    //     if (value) {
    //         console.log("    from cache");
    //         return value;
    //     } else {
    //         console.log("    get on database");
    //         let records = await mongoose.model(modelName).find(findOrId).populate(populate).sort(sort);
    //         if (records !== null) { AMCache.set(findOrId, records); }
    //         // console.log("record", record);
    //         return records;
    //     }
    // };
    //
    // schema.statics.findItOne = async function findIt (find, populate, sort) {
    //     if (!populate) populate = '';
    //     if (!sort) sort = '';
    //     let findOrId = util.getFindObj(find, '_id');
    //     // console.log(">>> findIt findOrId", findOrId);
    //     return mongoose.model(modelName).findOne(findOrId).populate(populate).sort(sort);
    // };
    //

    schema.statics.findItOne = async function (id, populate) {
        if (!populate) populate = '';
        let findOrId = util.getFindObj(id, '_id');
        // console.log(">>> findIt findOrId", findOrId);
        return mongoose.model(this.modelName).findOne(findOrId).populate(populate);
    };

    schema.statics.findItById = async function (id, populate) {
        if (!populate) populate = '';
        let findOrId = util.getFindObj(id, '_id');
        // console.log(">>> findIt findOrId", findOrId);
        return mongoose.model(this.modelName).findById(findOrId).populate(populate);
    };

    // schema.statics.findItOneCache = async function findIt (find, populate, sort) {
    //     if (!populate) populate = '';
    //     if (!sort) sort = '';
    //     let init1 = new Date().getTime();
    //     let findOrId = util.getFindObj(find, '_id');
    //     let end1 = new Date().getTime();
    //     console.log(' -> spend on findOrId', end1 - init1);
    //     // console.log(">>> findIt findOrId", findOrId);
    //     let init3 = new Date().getTime();
    //     let value = AMCache.get(findOrId);
    //     let end3 = new Date().getTime();
    //     console.log(' -> spend on cache.get', end3 - init3);
    //
    //     if (value) {
    //         console.log("    from cache");
    //         return value;
    //     } else {
    //         console.log("    get on database");
    //         let record = await mongoose.model(modelName).findOne(findOrId).populate(populate).sort(sort);
    //         if (record !== null) { AMCache.set(findOrId, record); }
    //         // console.log("record", record);
    //         return record;
    //     }
    // };

    schema.statics.findItAndUpdate = async function findIt (find, data) {
        // console.log(">>> findItAndUpdate");
        let findOrId = util.getFindObj(find, '_id');
        // console.log('findItAndUpdate > findOrId',findOrId);
        return mongoose.model(this.modelName).update(findOrId, data, {new: true});
    };

    schema.statics.findItOneAndUpdate = async function findIt (find, data) {
        // console.log(">>> findItAndUpdate");
        let findOrId = util.getFindObj(find, '_id');
        // console.log('findItAndUpdate > findOrId',findOrId);
        return mongoose.model(this.modelName).findOneAndUpdate(findOrId, data, {new: true});
    };

    // schema.statics.findOneAndUpdateCache = async function findIt (find, data) {
    //     // console.log(">>> findItAndUpdate");
    //     let findOrId = util.getFindObj(find, '_id');
    //     // console.log('findItAndUpdate > findOrId',findOrId);
    //
    //     let record = await mongoose.model(modelName).findOneAndUpdate(findOrId, data, {new: true});
    //     // Update it on cache
    //     // console.log("findOneAndUpdateCache setCache", findOrId);
    //     // console.log("findOneAndUpdateCache record", record);
    //     AMCache.set(findOrId, record);
    //
    //     return record;
    // };

    schema.statics.exists = async function exists (findOrId) {
        findOrId = util.getFindObj(findOrId);
        // console.log('exists > findOrId', findOrId);
        let thisExists = await mongoose.model(this.modelName).find(findOrId, {_id: 1}).limit(1);
        // console.log('exists', thisExists);
        return thisExists && thisExists.length > 0;
    };

    schema.statics.getModelName = function () {
        return this.modelName;
    };
};
