import { body, validationResult } from 'express-validator';
import { getUpcomingProjects, getProjectDetails, createProject, updateProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const id = req.params.id;
    const project = await getProjectDetails(id);
    const categories = await getCategoriesByProjectId(id);
    const title = project.title;
    res.render('project', { title, project, categories });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';
    res.render('new-project', { title, organizations });
};

const showEditProjectForm = async (req, res) => {
    const id = req.params.id;
    const project = await getProjectDetails(id);
    const organizations = await getAllOrganizations();
    const title = 'Edit Service Project';
    res.render('edit-project', { title, project, organizations });
};

const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Project title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required')
        .isLength({ max: 1000 })
        .withMessage('Project description cannot exceed 1000 characters'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ max: 200 })
        .withMessage('Location cannot exceed 200 characters'),
    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Please provide a valid date'),
    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .isInt()
        .withMessage('Please select a valid organization')
];

const processNewProjectForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;
    await createProject(title, description, location, date, organizationId);
    req.flash('success', 'Service project added successfully!');
    res.redirect('/projects');
};

const processEditProjectForm = async (req, res) => {
    const id = req.params.id;

    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${id}`);
    }

    const { title, description, location, date, organizationId } = req.body;
    await updateProject(id, title, description, location, date, organizationId);
    req.flash('success', 'Service project updated successfully!');
    res.redirect(`/project/${id}`);
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    showEditProjectForm,
    processNewProjectForm,
    processEditProjectForm,
    projectValidation
};