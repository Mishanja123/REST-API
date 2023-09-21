const { Router } = require('express');

const {contactController} = require('../controllers');
const {contactMiddleware} = require('../middlewares');


const router = Router();

router.use(contactMiddleware.readFile);

router
    .route('/')
    .get(contactController.getContacts)
    .post(contactMiddleware.createContact, contactController.createContact);

router.use('/:id',contactMiddleware.checkContactId);
router
    .route('/:id')
    .get(contactController.getContactById)
    .delete(contactMiddleware.findIndex, contactController.deleteContact)
    .put(contactMiddleware.findIndex, contactMiddleware.updateContact, contactController.updateContact);


module.exports = router;


 