const express = require('express');
const {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');
const { body, param, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/employees', getAllEmployees);
router.post('/employees', [
    body('first_name').notEmpty().withMessage('First name is required.'),
    body('last_name').notEmpty().withMessage('Last name is required.'),
    body('email').isEmail().withMessage('Invalid email format.'),
    body('position').notEmpty().withMessage('Position is required.'),
    body('salary').isNumeric().withMessage('Salary must be a number.'),
    body('date_of_joining').isISO8601().withMessage('Invalid date format.'),
    body('department').notEmpty().withMessage('Department is required.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }
    await createEmployee(req, res);
});

router.get('/employees/:eid', auth, [
    param('eid').isMongoId().withMessage('Invalid employee ID format.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }
    await getEmployeeById(req, res);
});

router.put('/employees/:eid', auth, [
    param('eid').isMongoId().withMessage('Invalid employee ID format.'),
    body('position').optional().notEmpty().withMessage('Position cannot be empty.'),
    body('salary').optional().isNumeric().withMessage('Salary must be a number.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }
    await updateEmployee(req, res);
});

router.delete('/employees', auth, [
    query('eid').isMongoId().withMessage('Invalid employee ID format.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }
    await deleteEmployee(req, res);
});


router.get('/employees/search', auth, [
    query('criteria').isIn(['department', 'position']).withMessage('Invalid search criteria'),
    query('query').notEmpty().withMessage('Search query is required')
  ], async (req, res) => {
    const { criteria, query } = req.query;
    const searchQuery = { [criteria]: new RegExp(query, 'i') };
    const employees = await Employee.find(searchQuery);
    res.json(employees);
  });

module.exports = router;
