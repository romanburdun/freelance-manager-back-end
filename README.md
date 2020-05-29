## Freelance Manager backend

The application created for project and finance management of freelancers. 
There are CRUD operations for users, clients, freelance platform, projects, tasks, project invoices, business expenses and pomodoro sessions.
The user can reset password using reset password link sent via an email, which is handled by SendGrid mail.
The user can record details of clients' projects and set tasks to be completed. Each client assigned to the freelance platform and each project assigned to the client.
The application can calculate profit based on total invoices and total expenses data from the beginning of current England's tax year and download all uploaded invoices and expenses along with generated CSV files.


### Dependencies

 * MongoDB
 * pm2

### Before running the application
Please configure .env files for the application located in config folder. There are environment variables for MongoDB, JWT and e-mail services tokens.

### install and use

```
npm install
npm run dev // for development
npm run prod // for production

```



