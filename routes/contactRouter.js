const { Router } = require('express');

const {contactController} = require('../controllers');
const {authMiddleware, contactMiddleware} = require('../middlewares');
const { userSubEnum } = require('../constants');


const router = Router();


router.use(authMiddleware.protect);

// router.use(authMiddleware.allowFor(userSubEnum.STARTER, userSubEnum.PRO, userSubEnum.DEFOULT))
router
    .route('/')
    .get(contactController.getContacts)
    .post(contactMiddleware.checkCreateContactData, contactController.createContact);

router.use('/:id',contactMiddleware.checkContactId);
router
    .route('/:id')
    .get(contactController.getContactById)
    .delete(contactController.deleteContactById)
    .put(contactMiddleware.checkUpdateContactData, contactController.updateContactById);

router
    .route('/:id/favorite')
    .patch(contactMiddleware.checkStatusContact, contactController.updateStatusContactById);


module.exports = router;


 