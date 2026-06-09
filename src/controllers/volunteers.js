import { addVolunteer, removeVolunteer, getProjectsByUserId } from '../models/volunteers.js';

const processAddVolunteer = async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.session.user.user_id;
    try {
        await addVolunteer(userId, projectId);
        req.flash('success', 'You have successfully volunteered for this project!');
    } catch (error) {
        console.error('Error adding volunteer:', error);
        req.flash('error', 'Failed to volunteer for this project.');
    }
    res.redirect(`/project/${projectId}`);
};

const processRemoveVolunteer = async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.session.user.user_id;
    try {
        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have been removed as a volunteer for this project.');
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'Failed to remove volunteering.');
    }
    res.redirect(`/project/${projectId}`);
};

const showVolunteeringPage = async (req, res) => {
    const userId = req.session.user.user_id;
    const projects = await getProjectsByUserId(userId);
    const title = 'My Volunteering';
    res.render('volunteering', { title, projects });
};

export { processAddVolunteer, processRemoveVolunteer, showVolunteeringPage };