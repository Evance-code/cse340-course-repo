-- Create organization table
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Insert organizations
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- Create project table
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);

-- Insert projects
INSERT INTO project (organization_id, title, description, location, date) VALUES
(1, 'Community Center Renovation', 'Renovating the local community center to improve facilities.', 'Dar es Salaam', '2026-06-01'),
(1, 'School Building Project', 'Building new classrooms for underprivileged schools.', 'Arusha', '2026-06-15'),
(1, 'Road Repair Initiative', 'Repairing damaged roads in rural communities.', 'Mwanza', '2026-07-01'),
(1, 'Water Well Construction', 'Constructing water wells for communities without clean water.', 'Dodoma', '2026-07-15'),
(1, 'Solar Panel Installation', 'Installing solar panels in off-grid communities.', 'Zanzibar', '2026-08-01'),
(2, 'Urban Garden Setup', 'Setting up urban gardens in local neighborhoods.', 'Dar es Salaam', '2026-06-05'),
(2, 'Composting Workshop', 'Teaching communities how to compost food waste.', 'Arusha', '2026-06-20'),
(2, 'Tree Planting Drive', 'Planting trees to restore deforested areas.', 'Mwanza', '2026-07-05'),
(2, 'Farmer Training Program', 'Training local farmers on sustainable farming techniques.', 'Dodoma', '2026-07-20'),
(2, 'Food Distribution Event', 'Distributing fresh produce to food-insecure families.', 'Zanzibar', '2026-08-05'),
(3, 'Park Cleanup', 'Cleaning up local parks to make them beautiful.', 'Dar es Salaam', '2026-06-10'),
(3, 'Food Drive', 'Collecting and distributing food to those in need.', 'Arusha', '2026-06-25'),
(3, 'Community Tutoring', 'Tutoring students in various subjects.', 'Mwanza', '2026-07-10'),
(3, 'Blood Donation Drive', 'Organizing a blood donation event for local hospitals.', 'Dodoma', '2026-07-25'),
(3, 'Elderly Care Visit', 'Visiting and assisting elderly people in care homes.', 'Zanzibar', '2026-08-10');

-- Create category table
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

-- Insert categories
INSERT INTO category (name) VALUES
('Construction'),
('Environment'),
('Education'),
('Health'),
('Food Security'),
('Community Development');

-- Create project_category junction table
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- Insert project_category associations
INSERT INTO project_category (project_id, category_id) VALUES
(1, 1), (1, 6),
(2, 1), (2, 3),
(3, 1), (3, 6),
(4, 1), (4, 4),
(5, 2), (5, 6),
(6, 2), (6, 5),
(7, 2), (7, 3),
(8, 2),
(9, 3), (9, 5),
(10, 5), (10, 6),
(11, 2), (11, 6),
(12, 5), (12, 6),
(13, 3),
(14, 4),
(15, 4), (15, 6);

-- Create roles table
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- Insert initial roles
INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);