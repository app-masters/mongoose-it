// Same file at mongoose-it and node-lib - keep sync
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

let dbUrl = "mongodb://127.0.0.1/mongoose_it_test_db";
let connection, Foo, Bar;

function createConnectionAndSchemas(plugin){
    connection = mongoose.createConnection(dbUrl);
    // Bar model
    let barSchema = Schema({name: String});
    barSchema.plugin(plugin);
    Bar = connection.model('bar',barSchema);
    // Foo model
    let fooSchema = Schema({name: String, age: Number, bar: {type: ObjectId, ref: 'bar'}});
    fooSchema.plugin(plugin);
    Foo = connection.model('foo',fooSchema);
    return {connection, Foo, Bar};
}


// Create some test records
async function createRecords(number) {
    let records = [];
    for (let i = 0; i < number; i++) {
        // Bar
        let bar = new Bar({name: "Bar " + i +" "+ new Date().toISOString() });
        let barRecord = await bar.save();
        // Foo
        let foo = new Foo(
            {
                name: "Foo "+ i + " " + new Date().toISOString(),
                age: Math.floor((Math.random() * 100) + 1),
                bar: barRecord
            });
        let record = await foo.save();
        records.push(record);
    }
    return number === 1 ? records[0] : records;
}

module.exports = {
    createConnectionAndSchemas: createConnectionAndSchemas,
    createRecords: createRecords
};