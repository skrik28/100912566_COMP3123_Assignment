const Employee = require('../models/Employee');

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employees', error: err });
    }
};

exports.createEmployee = async (req, res) => {
    const newEmployee = new Employee(req.body);

    try {
        const savedEmployee = await newEmployee.save();
        res.status(201).json({
            message: 'Employee created successfully.',
            employee_id: savedEmployee._id
        });
    } catch (err) {
        res.status(400).json({ message: 'Error creating employee', error: err });
    }
};

exports.getEmployeeById = async (req, res) => {
    const { eid } = req.params;

    try {
        const employee = await Employee.findById(eid);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employee', error: err });
    }
};

exports.updateEmployee = async (req, res) => {
    const { eid } = req.params;
    try {
        await Employee.findByIdAndUpdate(eid, req.body);
        res.status(200).json({ message: 'Employee details updated successfully.' });
    } catch (err) {
        res.status(400).json({ message: 'Error updating employee', error: err });
    }
};

exports.deleteEmployee = async (req, res) => {
    const { eid } = req.query;

    try {
        await Employee.findByIdAndDelete(eid);
        res.status(204).json({ message: 'Employee deleted successfully.' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting employee', error: err });
    }
};
