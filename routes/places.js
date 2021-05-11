const express = require('express')
const Place = require('./../models/place')
const router = express.Router()
const multer = require('multer');



//define storage for the images
const storage = multer.diskStorage({
    //destination for files
    destination: function(request, file, callback) {
        callback(null, './public/uploads/images');
    },

    //add back the extension
    filename: function(request, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});

//upload parameters for multer
const upload = multer({
    // dest: 'uploads/',
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
});


router.get('/new', (req, res) => {
    res.render('places/new', { place: new Place() })

})

router.get('/edit/:id', async(req, res) => {
    const place = await Place.findById(req.params.id)
    res.render('places/edit', { place: place })
})

router.get('/:slug', async(req, res) => {
    const place = await Place.findOne({ slug: req.params.slug })
    if (place == null) res.redirect('/')
    res.render('places/show', { place: place })
})

router.put('/:id', async(req, res, next) => {
    req.place = await Place.findById(req.params.id)
        //     let place = req.place
        //     place.title = req.body.title
        //     place.description = req.body.description
        //     place.markdown = req.body.markdown
        //     try {
        //         place = await place.save()
        //         res.redirect(`/places/${place.slug}`)
        //     } catch (e) {
        //         res.render(`places/edit`, { place: place })
        //     }
        // })
    next()
}, saveArticleAndRedirect('edit'))


router.post('/', upload.single('image'), async(req, res) => {
    console.log(req.file)

    let place = new Place({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        img: req.file.filename,
    })
    try {
        place = await place.save()
        res.redirect(`/places/${place.slug}`)
    } catch (e) {
        console.log(e)
        res.render(`places/new`, { place: place })
    }
})

router.delete('/:id', async(req, res) => {
    await Place.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


function saveArticleAndRedirect(path) {
    return async(req, res) => {
        let place = req.place
        place.title = req.body.title
        place.description = req.body.description
        place.markdown = req.body.markdown
        try {
            place = await place.save()
            res.redirect(`/places/${place.slug}`)
        } catch (e) {
            res.render(`places/${path}`, { place: place })
        }
    }
}

module.exports = router