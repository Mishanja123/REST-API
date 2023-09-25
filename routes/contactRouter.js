const { Router } = require('express');

const {contactController} = require('../controllers');
const {contactMiddleware} = require('../middlewares');


const router = Router();

router.use(contactMiddleware.readFile);

router
    .route('/')
    .get(contactController.getContacts)
    .post(contactMiddleware.checkContactData, contactMiddleware.createContact, contactController.createContact);

router.use('/:id',contactMiddleware.checkContactId);
router
    .route('/:id')
    .get(contactMiddleware.getContactById, contactController.getContactById)
    .delete(contactMiddleware.deleteContact, contactController.deleteContact)
    .put(contactMiddleware.checkContactData, contactMiddleware.updateContact, contactController.updateContact);

router
    .route('/:id/favorite')
    .patch(contactMiddleware.checkStatusContact, contactMiddleware.updateStatusContact, contactController.updateStatusContact);


module.exports = router;


 