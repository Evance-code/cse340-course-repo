import { body, validationResult } from 'express-validator';
import { getAllCategories, getCategoryById, getProjectsByCategoryId, getCategoriesByProjectId, createCategory, updateCategory, updateCategoryAssignments } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Project Categories';
    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    const title = category.name;
    res.render('category', { title, category, projects });
};

const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';
    res.render('new-category', { title });
};

const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const title = 'Edit Category';
    res.render('edit-category', { title, category });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const project = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);
    const title = 'Assign Categories to Project';
    res.render('assign-categories', { title, project, categories, assignedCategories });
};

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

const processNewCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }

    const { name } = req.body;
    await createCategory(name);
    req.flash('success', 'Category added successfully!');
    res.redirect('/categories');
};

const processEditCategoryForm = async (req, res) => {
    const id = req.params.id;

    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-category/${id}`);
    }

    const { name } = req.body;
    await updateCategory(id, name);
    req.flash('success', 'Category updated successfully!');
    res.redirect('/categories');
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const categoryIds = req.body.categoryIds || [];
    const categoryIdsArray = Array.isArray(categoryIds) ? categoryIds : [categoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories assigned successfully!');
    res.redirect(`/project/${projectId}`);
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    showEditCategoryForm,
    showAssignCategoriesForm,
    processNewCategoryForm,
    processEditCategoryForm,
    processAssignCategoriesForm,
    categoryValidation
};