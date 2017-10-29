const mongooseUtil = require('../lib/util');
const restful = require('node-restful');
const mongoose = restful.mongoose;

test('getFindObj - {}', ()=>{
    expect(mongooseUtil.getFindObj({})).toEqual({});
});

test('getFindObj - by string id', ()=>{
    let id = "59d27dac4e47a1b65f2be7d1";
    let oId = new mongoose.Types.ObjectId(id);
    let expects = {"_id":oId};
    expect(mongooseUtil.getFindObj(id)).toEqual(expects);
});

test('getFindObj - by ObjectId', ()=>{
    let id = "59d27dac4e47a1b65f2be7d1";
    let oId = new mongoose.Types.ObjectId(id);
    let expects = {"_id":oId};
    expect(mongooseUtil.getFindObj(oId)).toEqual(expects);
});

test('getFindObj - by Some arbitrary field', ()=>{
    let find = {"local.email":"tiago@appmasters.io"};
    let expects = find;
    expect(mongooseUtil.getFindObj(find)).toEqual(expects);
});

test('getFindObj - by Populated Object', ()=>{

    let userPopulated = {
        "_id": "59ba90b0fea07124bc21ccd0",
        "updated_at": "2017-09-14T20:29:26.046Z",
        "created_at": "2017-09-14T14:22:40.404Z",
        "__v": 1,
        "name": "João da Silva",
    };

    let id = "59ba90b0fea07124bc21ccd0";
    let oId = new mongoose.Types.ObjectId(id);
    // let expects = {"_id":oId};
    let expected = mongooseUtil.getFindObj(userPopulated);
    expect(expected._id.toString()).toEqual(oId.toString());
});

test('getFindObj - by objectId Array', ()=>{

    let id1 = "59d27dac4e47a1b65f2be7d1";
    let oId1 = new mongoose.Types.ObjectId(id1);

    let id2 = "59ba90b0fea07124bc21ccd0";
    let oId2 = new mongoose.Types.ObjectId(id2);
    let find = [oId1,oId2];

    // let id = "59ba90b0fea07124bc21ccd0";
    // let oId = new mongoose.Types.ObjectId(id);
    // let expects = {"_id":oId};

    expect(mongooseUtil.getFindObj(find)).toEqual(find);
});