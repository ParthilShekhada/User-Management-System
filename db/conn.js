const mongoose=require("mongoose")
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://0.0.0.0:27017/userManagementSystem',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true

    }
)
    .then(() => console.log("connection succesful..."))
    .catch((err) => console.log(err))


