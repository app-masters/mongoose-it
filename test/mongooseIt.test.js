const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseIt = require('../lib/mongooseIt');
const ObjectId = mongoose.Schema.Types.ObjectId;

const connectionData = require('./connectionData');

// Declaring
let recordsToBeCreated = 2;


// Declare objects
let Foo, Bar, records, record;

// Let's test it

test('Define plugin to schema', () => {
    // Create all we need to begin
    let db = connectionData.createConnectionAndSchemas(mongooseIt);
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

// Find

test('FindIt', async ()=> {
    records = await Foo.findIt({},'bar','name');
    // console.log(records);
    expect(records.length).toBeGreaterThanOrEqual(recordsToBeCreated);
});

/// !!!!!!!!!!! UFJF BUG SAMPLE {obj:{ob1:true}, _id: {$in: [1,2]}}

