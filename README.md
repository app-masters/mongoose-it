# mongoose-it

### Mongoose-it

On you schema files add:

```
const mongooseIt = require('@app-masters/mongoose-it').mongooseIt;   

... your schema declaration ...   

var mongooseSchema = mongoose.Schema(schema, options);
mongooseSchema.plugin(mongooseIt);
var model = mongoose.model('user', mongooseSchema);
```

It will start mongoose to that model adding some new methods:

- findIt()
- findItOne()
- findItById()
- findItAndUpdate()
- findItOneAndUpdate()
- exists()

If you want to use cache:
- findItCache()
- findItOneCache()
- findItByIdCache()
- findItOneAndUpdateCache()

To work will whole schema cache:
- flushAll()
- cacheAll()
- getAllCache()

To use with and model object instance:
- getCacheKey()
- cacheIt()


### AMCache

Uses [node-cache]() to store and retrieve data from memory.

### MongooseCache-it

Internally used to provide cache methods to yours models.

### Util

Some mongoose useful functions to easy our work. 