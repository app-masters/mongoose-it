const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const connectionData = require('./connectionData');

const mongooseCacheIt = require('../lib/mongooseCacheIt');

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

test('Delete all records', async ()=> {
    await Foo.find({}).remove();
    await Bar.find({}).remove();
    expect(true).toEqual(true);
});


// Create
test('Create some records', async ()=> {
    records = await connectionData.createRecords(recordsToBeCreated);
    expect(records.length).toEqual(recordsToBeCreated);
});


// Cache
test('Cache all', async ()=> {
    records = await Foo.cacheAll();

    record = records[0];
    // console.log(records);
    // console.log(record);
    expect(records.length).toBeGreaterThanOrEqual(recordsToBeCreated);
});

test('FindItByIdCache', async ()=> {
    // Get the first record
    let cacheRecord = await Foo.findItByIdCache(record._id);

    expect(cacheRecord._id).toEqual(record._id);
});

test('Flush cache', async ()=> {
    Foo.flushAll();
    expect(true).toEqual(true);
});

test('FindItByIdCache', async ()=> {
    // Get the first record
    let cacheRecord = await Foo.findItByIdCache(record._id);

    expect(cacheRecord._id).toEqual(record._id);
});

