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
    const id = await req.db.createContact(req.body)
    res.redirect('/');
})

router.get('/:id', async (req, res) => {
    res.render('info', {id: req.params.id});
})

router.put('/:id', async (req, res) => {
    if (!isNaN(req.params.id)){
        const contact = await req.db.findSingleContact(req.params.id);
        res.json({c: contact}); 
    }
})

router.get('/:id/edit', async (req, res) => {
    res.render('edit', {id: req.params.id});
})

router.put('/:id/edit', async (req, res) => {
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

router.post('/:id/edit', async (req, res) => {
    const id = await req.db.editContact(req.params.id, req.body.c)
    res.redirect('/' +req.params.id);
})

router.delete('/:id/delete', async (req, res) => {
    await req.db.deleteContact(req.params.id);
    res.redirect('/')
})

module.exports = router;