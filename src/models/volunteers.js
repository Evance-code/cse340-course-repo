import db from './db.js';

const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteer (user_id, project_id)
        VALUES ($1, $2)
        RETURNING volunteer_id;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows[0];
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    await db.query(query, [userId, projectId]);
};

const getVolunteersByProjectId = async (projectId) => {
    const query = `
        SELECT u.user_id, u.name, u.email
        FROM users u
        JOIN volunteer v ON u.user_id = v.user_id
        WHERE v.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

const getProjectsByUserId = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date,
               o.name AS organization_name, o.organization_id
        FROM project p
        JOIN volunteer v ON p.project_id = v.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE v.user_id = $1
        ORDER BY p.date;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

const isUserVolunteering = async (userId, projectId) => {
    const query = `
        SELECT volunteer_id FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

export { addVolunteer, removeVolunteer, getVolunteersByProjectId, getProjectsByUserId, isUserVolunteering };