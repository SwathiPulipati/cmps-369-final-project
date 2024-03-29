require('dotenv').config();
const Database = require('./db');
const bcrypt = require('bcryptjs')

class ContactDB{
    constructor(){
        this.db = new Database();
    }

    async initialize(){
        await this.db.connect();

        await this.db.schema('Contact', [
            { name: 'id', type: 'INTEGER' },
            { name: 'title', type: 'TEXT' },
            { name: 'first_name', type: 'TEXT' },
            { name: 'last_name', type: 'TEXT' },
            { name: 'phone', type: 'TEXT' },
            { name: 'email', type: 'TEXT' },
            { name: 'address', type: 'TEXT' },
            { name: 'contact_by_email', type: 'INTEGER' },
            { name: 'contact_by_phone', type: 'INTEGER' },
            { name: 'contact_by_mail', type: 'INTEGER' },
            { name: 'latitude', type: 'REAL' },
            { name: 'longitude', type: 'REAL' }
        ], 'id');

        await this.db.schema('Users', [
            { name: 'id', type: 'INTEGER' },
            { name: 'first_name', type: 'TEXT' },
            { name: 'last_name', type: 'TEXT' },
            { name: 'username', type: 'TEXT' },
            { name: 'password', type: 'TEXT' }
        ], 'id');

    }

    // async addDefaultData(){
    //     const salt = bcrypt.genSaltSync(10);
    //     const hash = bcrypt.hashSync('rcnj', salt); 
    //     const id = await this.createUser('Scott', 'Frees', 'cmps369', hash);

    //     const c = {
    //         first: 'Example',
    //         last: 'Example',
    //         phone: '123-456-7890',
    //         email: 'example@example.com',      
    //         street: '123 Example Road',        
    //         city: 'Example',
    //         state: 'Example',
    //         zip: '12345',
    //         country: 'USA',
    //         by_phone: 'on',
    //         by_email: 'on'
    //     }
    //     for (let i = 0; i < 4; i++) {
    //         const id = await this.createContact(c);
    //     }
    // }

    async createUser(first, last, username, password) {
        const id = await this.db.create('Users', [
            { column: 'first_name', value: first },
            { column: 'last_name', value: last },
            { column: 'username', value: username },
            { column: 'password', value: password },
        ])
        return id;
    }

    async createContact(r){
        const id = await this.db.create('Contact', [
            { column: 'title', value: r.title },
            { column: 'first_name', value: r.first_name },
            { column: 'last_name', value: r.last_name },
            { column: 'phone', value: r.phone },
            { column: 'email', value: r.email },
            { column: 'address', value: r.address },
            { column: 'contact_by_email', value: r.contact_by_email ? 1 : 0 },
            { column: 'contact_by_phone', value: r.contact_by_phone ? 1 : 0 },
            { column: 'contact_by_mail', value: r.contact_by_mail ? 1 : 0 },
            { column: 'latitude', value: r.latitude },
            { column: 'longitude', value: r.longitude }
        ])
        return id;
    }

    async editContact(id, r){
        await this.db.update('Contact', [
                { column: 'title', value: r.title },
                { column: 'first_name', value: r.first_name },
                { column: 'last_name', value: r.last_name },
                { column: 'phone', value: r.phone },
                { column: 'email', value: r.email },
                { column: 'address', value: r.address },
                { column: 'contact_by_email', value: r.contact_by_email ? 1 : 0 },
                { column: 'contact_by_phone', value: r.contact_by_phone ? 1 : 0 },
                { column: 'contact_by_mail', value: r.contact_by_mail ? 1 : 0 },
                { column: 'latitude', value: r.latitude },
                { column: 'longitude', value: r.longitude }
            ],
            [{column: 'id', value: id}]
        )
        
    }

    async findContacts(){
        const contacts = await this.db.read('Contact', []);
        return contacts;
    }

    async filterContacts(query){
        const contacts = await this.db.filter('Contact', [
            {column: 'first_name', value: query},
            {column: 'last_name', value: query}
        ]);
        return contacts;
    }

    async findSingleContact(id){
        const contacts = await this.db.read('Contact', [{column: 'id', value: id}]);
        if (contacts.length > 0) 
            return contacts[0];
        else
            return undefined;
    }

    async findUserByUsername(username){
        const us = await this.db.read('Users', [{ column: 'username', value: username }]);
        if (us.length > 0) 
            return us[0];
        else 
            return undefined;       
    }

    async deleteContact(id){
        await this.db.delete('Contact', [{column: 'id', value: id}])
    }
}

module.exports = ContactDB;