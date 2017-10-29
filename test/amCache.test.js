const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AMCache = require('../lib/amCache');

// Declaring
let stringData = "Tiago Gouvêa";
let simpleObject = {name: stringData, age: 36};
let objectArray = [stringData, simpleObject];
let dbUrl = "mongodb://127.0.0.1/mongoose_it_test_db";

// Let's test it

test('Write and read String', () => {
    let key = "key1";
    AMCache.set(key, stringData);
    let data = AMCache.get(key);
    expect(data).toBe(stringData);
});

test('Write, read, update and delete a String', () => {
    let key = "key6";
    AMCache.set(key, stringData);
    expect(AMCache.get(key)).toBe(stringData);
    AMCache.set(key,stringData+stringData);
    expect(AMCache.get(key)).toBe(stringData+stringData);
    AMCache.del(key);
    expect(AMCache.get(key)).toBe(undefined);
});

test('Write and read Simple Object', () => {
    let key = "key2";
    AMCache.set(key, simpleObject);
    let data = AMCache.get(key);
    expect(data).toEqual(simpleObject);
});

test('Write and read Array of Objects', () => {
    let key = "key3";
    AMCache.set(key, objectArray);
    let data = AMCache.get(key);
    expect(data).toEqual(objectArray);
});

test('Write and read using Object as key', () => {
    let key = simpleObject;
    AMCache.set(key, simpleObject);
    let data = AMCache.get(key);
    expect(data).toEqual(simpleObject);
});

test('Write one Lean Mongoose Model object and read it as simple object', async () => {
    // Connect, define schema and create a record
    let connection = mongoose.createConnection(dbUrl);
    let FooSchema = new Schema({name: String});
    let Foo = connection.model('Foo', FooSchema);
    let foo = new Foo({name: stringData});
    let record = await Foo.create(foo, {new: true});

    // Test it!
    let key = "key4";
    AMCache.set(key, record);
    let data = AMCache.get(key);
    expect(data).toEqual(record.toObject());
});

test('Write two Lean Mongoose Model objects and read it as simple object', async () => {
    // Connect, define schema and create a record
    let records = await createRecords(2);

    // Test it!
    let key = "key5 ";
    AMCache.set(key, records);
    let data = AMCache.get(key);
    expect(data).toEqual(records);
});

// Create some test records
async function createRecords(number) {
    let connection = mongoose.createConnection(dbUrl);
    let FooSchema = new Schema({name: String});
    let Foo = connection.model('Foo', FooSchema);
    let records = [];
    for (let i = 0; i < number; i++) {
        let foo = new Foo({name: stringData + " (" + i + ") " + new Date().toISOString()});
        let record = await Foo.create(foo, {new: true, lean:true});
        records.push(record);
    }
    return number === 1 ? records[0] : records;
}
