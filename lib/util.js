const mongoose = require("mongoose");

// old mongooseUtil
class util {
    /**
     * Check if passed val are a validObjectId
     * It could be ObjectID object, a string that match ObjectID pattern
     * ** Duplicated (node-lib/util and mongoose-it/util)
     * @param val
     * @returns {boolean}
     */
    static isValidObjectId (val) {
        let typeOf;
        let constructorName;
        typeOf = typeof val;
        if (typeOf === "undefined") {
            throw new Error("getObjectId with undefined findOrId");
        }

        if (typeOf !== "String") {
            constructorName = val.constructor.name;
        }

        if (typeOf === 'object' && constructorName === "ObjectID") {
            return true;
        }
        if (typeOf === "String") {
            return new RegExp("^[0-9a-fA-F]{24}$").test(val);
        }

        return false;
    }

    /**
     * Extract ids from a object array
     * @TODO return unique ids, distinct - ES6 > let unique = [...new Set(myArray)];
     * @param records
     * @param keyField
     * @returns {Array}
     */
    static extractIds (records, keyField) {
        if (!keyField) {
            keyField = "_id";
        }
        let ids = [];
        if (records && records.length > 0) {
            ids = records.map(record => {
                return record[keyField];
            });
            // let nids = ids.filter(util.onlyUnique); // returns ['a', 1, 2, '1']
            // ids = nids;
            let items = [];
            let output = [];
            let l = ids.length;
            for (let i = 0; i < l; i++) {
                if (items[ids[i]]) continue;
                items[ids[i]] = true;
                output.push(ids[i]);
            }
            ids = output;
        }
        return ids;
    }

    // https://stackoverflow.com/questions/1960473/unique-values-in-an-array
    static onlyUnique (value, index, self) {
        return self.indexOf(value) === index;
    }

    /**
     * Return a find object
     * 1 - {}
     * 2 - Passing a id string
     * 3 - Passing a ObjectId
     * 4 - By Populated Object
     * 5 - By a Model
     * 6 - By Some arbitrary field
     * 7 - By array
     * @param findOrId
     * @param keyAttribute
     * @returns {*}
     */
    static getFindObj (findOrId, keyAttribute) {
        // It must have a keyAttribute
        if (!keyAttribute) {
            keyAttribute = "_id";
        }

        // Get Types
        let typeOf;
        let constructorName;
        typeOf = typeof findOrId;
        if (typeOf === "undefined") {
            throw new Error("getObjectId with undefined findOrId");
        }

        if (typeOf !== "String") {
            constructorName = findOrId.constructor.name;
        }

        // console.log('..... findOrId', findOrId);
        // console.log('typeOf', typeOf);
        // console.log('constructorName', constructorName);

        // 2 - Passing a id string
        if (typeOf === 'string' && constructorName === "String") {
            let id = new mongoose.Types.ObjectId(findOrId);
            let find = {};
            find[keyAttribute] = id;
            return find;
        }

        // 3 - Passing a ObjectId
        if (typeOf === 'object' && constructorName === "ObjectID") {
            let find = {};
            find[keyAttribute] = findOrId;
            return find;
        }

        if (typeOf === 'object' && (constructorName === "Object" || constructorName === "model")) {
            // console.log("findOrId[keyAttribute]",findOrId[keyAttribute]);

            // 1 - {}
            if (Object.keys(findOrId).length === 0) {
                return findOrId;
            }

            // 4 - By Populated Object
            if (findOrId[keyAttribute]) {
                let find = {};

                // It's a object id?
                if (this.isValidObjectId(findOrId[keyAttribute])) {
                    find[keyAttribute] = new mongoose.Types.ObjectId(findOrId[keyAttribute]);
                    return find;
                } else {
                    find[keyAttribute] = findOrId[keyAttribute];
                    return find;
                }
            }

            // 5 - By Model

            // 6 - By Some arbitrary field
            if (typeOf === 'object' && constructorName === "Object") {
                // let find = {};
                // find[keyAttribute] = findOrId;
                return findOrId;
            }
        }

        // 7 - By array
        if (typeOf === 'object' && constructorName === "Array") {
            // console.log(findOrId);
            return findOrId;
            // let find = {};
            // find[keyAttribute] = findOrId;
            // return find;
        }

        console.log('..... findOrId', findOrId);
        console.log('typeOf', typeOf);
        console.log('constructorName', constructorName);

        throw new Error("Nothing found!");

        return false;

        // Just a object id object like 59d3e6b4783631da9cdea859

        if (constructorName === "model") {
            // id = findOrId[keyAttribute];
        } else if (constructorName === 'Object' && Object.keys(findOrId).length === 0) {
            // Just {}
            return findOrId;
        } else if (typeof findOrId !== 'object') {
            // id = findOrId;
        } else {
            // console.log("BBB");
            // Just a object like {myCrazyFind: "someValue"}
            return findOrId;
            // console.log(' ');
            // console.log('>>>> FAIL getObjectId FAIL <<<<');
            // console.log('> Type or Constructor not recognized on getObjectId <');
            // console.log('findOrId',findOrId);
            // console.log('typeOf',typeOf);
            // console.log('constructorName',constructorName);
            // console.log('-------------------------------');
            // console.log(' ');
            // throw new Error("Type not recognized on getObjectId", constructorName);
            // id = null;
            // console.log("BBBB");
        }
    }


    // @TODO test it!
    static limitRecords (data, limit, sort, fill = false) {
        console.log('length, limit', data.length, limit);
        let result = data;
        if (data.length < limit) {
            console.log('Less recors than needed in limiRecords, will it fill ?', fill);
            if (fill) {
                for (let i = data.length; i < limit; i++) {
                    let j = Math.floor((Math.random() * data.length));
                    result.push(data[j]);
                }
            }
        }
        if (sort) {
            result = result.sort(() => 0.5 - Math.random()); // shuffles the array
        }
        if (result.length > limit) {
            result = result.slice(0, limit);
        }
        return result;

        // if (sort) {
        //     let i = 0;
        //     if (data.length < limit) {
        //         console.log('Less records than needed in limitRecords, will it fill?', fill);
        //         if (fill) {
        //             let length = fill ? limit : data.length;
        //             for (i = 0; i < length; i++) {
        //                 let i = Math.floor((Math.random() * data.length));
        //                 result.push(data[i]);
        //             }
        //         }
        //     } else {
        //         for (i = 0; i < limit; i++) {
        //             let length = data.length;
        //             let i = Math.floor((Math.random() * length));
        //             result.push(data[i]);
        //             data.splice(i, 1);
        //         }
        //     }
        // }
        // result = result.sort(() => 0.5 - Math.random()); // shuffles the array
        // return result;
    }
}

module.exports = util;
