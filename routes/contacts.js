const express = require('express')
const router = express.Router();

const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });

router.get('/home', async (req, res) => {
    const contacts = await req.db.findContacts();
    res.json({contacts: contacts});
})

router.get('/create', async (req, res) => {
    res.render('create');
})

router.put('/create', async (req, res) => {
    const result =  await geocoder.geocode(req.body.address);
    if(result.length >= 1){
        const address = result[0].formattedAddress;
        const lat = result[0].latitude;
        const lng = result[0].longitude;
        res.json({address: address, latitude: lat, longitude: lng});
    }
    else if (result.length == 0){
        res.json({result: 'No Address Found'})
    }
})

router.post('/create', async (req, res) => {
    console.log("post create");
    const id = await req.db.createContact(req.body)
    console.log("please redirect")
    res.redirect('/');
})

module.exports = router;