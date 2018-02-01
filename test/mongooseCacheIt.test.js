const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const connectionData = require('./connectionData');

const mongooseCacheIt = require('../lib/mongooseCacheIt');
const _ = require('lodash');
// Declaring
let recordsToBeCreated = 2;

// Declare objects
let Foo, Bar, records, record;

// Let's test it


test('Define plugin to schema', () => {
    // Create all we need to begin
    let db = connectionData.createConnectionAndSchemas(mongooseCacheIt);
    Foo = db.Foo;
    Bar = db.Bar;
    // Check it
    expect(true).toBe(true);
});

test('Delete all records', async () => {
    await Foo.find({}).remove();
    await Bar.find({}).remove();
    expect(true).toEqual(true);
});


// Create
test('Create some records', async () => {
    records = await connectionData.createRecords(recordsToBeCreated);
    expect(records.length).toEqual(recordsToBeCreated);
});


// Cache
test('Cache all', async () => {
    records = await Foo.cacheAll();

    record = records[0];
    // console.log(records);
    // console.log(record);
    expect(records.length).toBeGreaterThanOrEqual(recordsToBeCreated);
});

test('FindItByIdCache', async () => {
    // Get the first record
    let cacheRecord = await Foo.findItByIdCache(record._id);

    expect(cacheRecord._id).toEqual(record._id);
});

test('FindItByIdCache populating data', async () => {
    // Get the first record
    let cacheRecord = await Foo.findItByIdCache(record._id);
    console.log("cacheRecord", cacheRecord);
    console.log("cacheRecord const", cacheRecord.constructor.name);
    expect(cacheRecord._id).toEqual(record._id);

    let populated = await Foo.populate(cacheRecord, 'bar');
    console.log("populated", populated);
    console.log("populated const", populated.constructor.name);
    expect(populated.bar._id).not.toBeNull();



    // Populated objects (not model), when hydrated, lost populates
    let hydrated;
    if (populated.constructor.name === "Object") {
        hydrated = Foo.hydrate(populated);
        console.log("hydrated", hydrated);
        console.log("hydrated const", hydrated.constructor.name);
        expect(hydrated.bar._id).not.toBeNull();
        hydrated.cacheIt();
    }
    // cacheRecord = cacheRecord.toObject();

    // console.log("cache 4", cacheRecord);
    // console.log("cache 4 const", cacheRecord.constructor.name);

    cacheRecord = await Foo.findItByIdCache(record._id);
    console.log("cacheRecord2", cacheRecord);
    console.log("cacheRecord2 const", cacheRecord.constructor.name);
    expect(cacheRecord.bar._id).not.toBeNull();

    populated = JSON.parse(JSON.stringify(populated));
    cacheRecord = JSON.parse(JSON.stringify(cacheRecord));
    // console.log(JSON.stringify(populated));
    // console.log(JSON.stringify(cacheRecord));
    // console.log(JSON.stringify(cacheRecord)===JSON.stringify(populated));

    console.log("isEqual",_.isEqual(populated,cacheRecord));

    hydrated = Foo.hydrate(cacheRecord);
    console.log("hydrated2", hydrated);
    console.log("hydrated2 const", hydrated.constructor.name);

    expect(hydrated.bar._id).not.toBeNull();
});

test('FindItByIdCache passing invalid Id', async () => {
    // Get the first record
    try {
        let cacheRecord = await Foo.findItByIdCache({_id: record.id});
        expect(false).toBe(true);
    } catch (e) {
        expect(true).toBe(true);
    }
});

test('Flush cache', async () => {
    Foo.flushAll();
    expect(true).toEqual(true);
});

test('FindItByIdCache', async () => {
    // Get the first record
    let cacheRecord = await Foo.findItByIdCache(record._id);
    expect(cacheRecord._id).toEqual(record._id);
});

// Create
test('Cache entity', async () => {
    records = await connectionData.createRecords(1);
    expect(records.length).toEqual(1);
    // try to save not a entity


    // Save just one
    let record = records[0];
    cache.cacheItEntity(record);


});
