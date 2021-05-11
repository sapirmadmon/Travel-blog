const express = require('express')
const placesRouter = require('./routes/places')
const Place = require('./models/place')
const app = express()
const mongoose = require("mongoose")
const methodOverride = require('method-override')


mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@hw3-places-api.cnwv7.mongodb.net`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});




app.set('view engine', 'ejs')


app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))



app.get('/', async(req, res) => {
    const places = await Place.find().sort({ createdAt: 'desc' })
    res.render('places/index', { places: places })
});


app.use(express.static('public'));

app.use('/places', placesRouter)
app.listen(3000)