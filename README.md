
# External Facing API Demo

Building REST API's with authorization layers and the ability for customers to self service request credentials for the API can be a difficult task. This repository is intended to demonstrate how this can be done with the Okta Customer Identity Cloud.

### (Documentation is a Work in Progress 5/3/23)


## Features

- Provides a user interface to allow users to self service request a set of client credentials to access the API.
- Demonstrates how access token scopes can be used to authorize calls to the REST endpoints of the API.
- Demonstrates how to proxy the /token endpoint and to use a cache to limit the number of M2M tokens that are issued from Okta C.I.C.



## Demo

A working example of this application is currently deployed [here](https://cic-external-api.herokuapp.com/).

// TODO: add instructions for using the app.

// TODO: add video of logging in to app, requesting credentials, requesting a token with Postman, demonstrating the cache'd tokens and using the access token to access the API.

// TODO: add diagram of the application architecture

// TODO: add a short description of how the pieces work.


## Environment Variables

To run this project, you will need to create environment files (listed below). The `.env` file will contain variables which are present in every environment, while the `.env.development` file holds the environment values which are specific to your local machine's development enviroment. 

```txt
.env
.env.development
```

The `.env` file contains values which are present in every environment. It must contain the following 

```bash
VUE_APP_AUTH0_CLIENT_ID= <client-id-of-frontend-app>
VUE_APP_AUTH0_DOMAIN= <domain-of-auth0-tenant>
VUE_APP_CUSTOM_DOMAIN= <auth0-tenant-custom-domain>
VUE_APP_AUTH0_AUDIENCE= <auth0-api-identifier>

AUTH0_API_ID=< client-id-of-management-api-m2m-app>
AUTH0_API_CLIENT_SECRET= <client-secret-of-management-api-m2m-app>

REDIS_URL= <redis-url>
REDIS_PASSWORD= <redis-password>
REDIS_PORT= <redis-port>
```

To run the application on your local machine, you'll need a development environment file. 

`.env.development`
```txt
# Environment vars present only when built for <environment> (enviroment = development or production)
NODE_ENV=development
VUE_APP_MODE=development
VUE_APP_API_HOST=http://localhost:8081/api
VUE_APP_DOMAIN=http://localhost:8080
```



## Installation

### Setup Okta Customer Identity Cloud (CIC)

// TODO: instructions for configuring Auth0 to use this application.

### Setup REDIS Enterprise Cloud

// TODO: instructions for configuring REDIS

### Download and Run the Project

Make sure that you have [NodeJS](https://nodejs.org/en) (v18 +), `npm` (v8.19.x +) and `git` installed on your machine.

In a terminal, cd to your favorite project directory then clone this repository. 

```bash
cd myProjects
git clone https://github.com/WolbachAuth0/APIaaS-scaffold.git
```

Install the necessary node modules.

```bash
  cd this-project
  npm install
```

To run this locally you'll need to run two processes simultatneously - the front end Vue application and the backend Express.js application. Open a second terminal. In one terminal, run the api. 

```bash
npm run dev-api
```

In the other terminal run the vue app.

```bash
npm run dev-front
```

    
## Authors

- [@aaron.wolbach](https://www.github.com/WolbachAuth0)


## References

The following products form core technologies for this project. Links to them are provided for reference.

- [NodeJS](https://nodejs.org/en)
- [Okta CIC | Auth0](https://auth0.com)
- [REDIS Enterprise Cloud](https://redis.com/try-free/)
- [VueJS](https://vuejs.org/)
- [Vuetify](https://vuetifyjs.com/en/)
