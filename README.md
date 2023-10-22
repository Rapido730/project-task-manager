# Projectify

## Deployed link

- I deployed the project on netlify.
- [Link](https://project-management-251.netlify.app/)

## Description

Projectify is a _Project Management System_ which helps manager and employees to track task progress of project.

- Developing a Project Management System will help teams work more efficiently, collaborate effectively, and achieve project goals with greater accountability.
- It simplifies task management, improves team collaboration, and ensures timely project completion, promoting efficiency, transparency, and accountability in workflow.
- I learned about how to manage RDBMS and fetching proper queries from database.

## Skills

- Next.js
- TypeScript
- MongoDB
- Tailwind CSS
- Redux
- Bootstrap
- NextAuth.js
- mongoose
- drag and drop

## Installation

- Clone the repo.
- Using `npm install` install all dependencies.
- Start development server `npm run dev`

## Pages

### Home page

- using sign in button at top-right corner user can signin/register for the application.

![](https://hackmd.io/_uploads/HJcaz6zMp.png)

- As you login and head for dashboard.

### Dashboard

- In this page user can see his/her designation (manager/employee) which assigned by admin.
- It showcase all prject related to the user.
- Using more button on project we can see all task related to particular project.

![](https://hackmd.io/_uploads/B1S5mpzfp.png)

#### As Manager

- User can access only project which assigned to them.
- Has all access to change attributes of project :

  - Can change name of the project.
  - Delete project.
  - Create a new project.

- Access regarding task :
  - Add a new task and assign it to any employee.
  - Change status of task (Todo/Inprogress/InReview/Completed).
  - Delete a task.
  - Can change the employee working on the task.
  - Edit all attributes of tasks.

#### As Employee (Developer)

- User can access project which related to him/her with atleast one task.
- And can view only task which are assigned to him/her in that project.
- User has only view access for the project attributes.
- Access reagrding task:
  - Change status of task (Todo/Inprogress/InReview/Completed).

## Features

- Authentication
- Project Mangement
- Drag and drop feature to change status of task.
- Mutliple role
