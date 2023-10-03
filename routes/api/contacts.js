const express = require('express')
const router = express.Router()
const ctrlContact = require('../../controller/contacts')
// middlewares
const validateContactId = require('../../middlewares/errorHandlerID');
const validateRequestBody = require('../../middlewares/errorHandlerBody');
const validateStatus = require('../../middlewares/errorHandlerStatus');
const authenticateToken = require('../../middlewares/tokenVerification')


// validate id for all routes
router.all('/:contactId', validateContactId);
router.all('/:contactId/favorite', validateContactId);
// Authentication middleware for all routes
router.all('/:contactId', authenticateToken);
router.all('/', authenticateToken);


// GET /api/contacts
router.get('/', ctrlContact.get)

// GET /api/contacts/:id
router.get('/:contactId', ctrlContact.getById)

// POST /api/contacts
router.post('/', validateRequestBody, ctrlContact.add)

// DELETE /api/contacts/:id
router.delete('/:contactId', ctrlContact.remove)

// PUT /api/contacts/:id
router.put('/:contactId', validateRequestBody, ctrlContact.update)

// PATCH / api / contacts /: contactId / favorite
router.patch('/:contactId/favorite', validateStatus, ctrlContact.updateStatus)

module.exports = router;

