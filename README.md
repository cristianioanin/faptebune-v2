# fapte-bune
Informal School of IT, Final Project

Implementation of a simple donations platform for health and social-care cases. The website should allow for easy social-login, entities registration/authentication and should be connected to a client-management application.
For the time being, only CMS application is implemented alongside our backend implementation.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.1.

## Development server

This app uses concurrently npm module to load 2 scripts concurrently.
Run `npm install` to install all dependencies for the backend Express server.
Run `npm run admin-install` to install all dependencies needed for the Angular app on the frontend.
Run `npm run dev` to start the project in a development environment. This will run two scripts concurrently, starting the server on `http://localhost:3000` and the Angular app on `http://localhost:4200/`.
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### Database
A MongoDB database is configured for the data-layer, and Express makes use of mongoose module to interact with the database. All document definitions are available in `./server/models`

#### Authentication/Authorization
Passport.js was used to implement authentication on the backend, configuring the following strategies for it:
  * passport-local
  * passport-facebook-token
  * passport-google-plus-token
  
All strategies emit a JWT token and validate it before accessing any sensitive routes. Middleware were configured for authentication and authorization: see `./server/helpers/routesHelpers.js` for more details. The client is responsible for storing the emitted token and set it in the headers `Authorization: ${retrieved-token-from-localStorage}` for any following requests.

![Landing Sign-in page for admin CMS](/screenshots/2019-03-10.png)

#### REST API
The API provides a few public, like GET methods for all records or an unique record:
  * GET: `http://localhost:3000/ngos`
  * GET: `http://localhost:3000/ngos/:id`
  * GET: `http://localhost:3000/ngos/:id/donations`
  
![List of NGO records](/screenshots/2019-03-10%20(1).png)
  
Other sensitive routes are authorized through the middlewares implemented on the backend, authorizing the editing or deletion if credentials provided match the records ownership or if the user has administrative privileges:
  * POST: `http://localhost:3000/ngos` (only if authenticated)
  * PUT: `http://localhost:3000/ngos/:id` (only if authenticated AND ( owner of the record || admin ))
  * DELETE: `http://localhost:3000/ngos/:id/donations/:id` (only if authenticated AND admin)

Detail view on NGO record:

![NGO detail view](/screenshots/2019-03-10%20(2).png)

![NGO detail view - continued](/screenshots/2019-03-10%20(3).png)


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
