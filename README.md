# StudyPlus API

StudyPlus is a backend API built with the [NestJS](https://nestjs.com/) framework. This project provides a robust and efficient structure for managing study-related data.

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Tests](#tests)
- [Contributing](#contributing)
- [License](#license)

## Introduction
StudyPlus is designed to manage study-related data effectively. This API supports various functionalities such as user authentication, data validation, and more, using the NestJS framework.

## Installation
To install the necessary dependencies, run the following command:
```bash
$ npm install
```

## Usage
To start the project, use the following commands:
- Development mode:
  ```bash
  $ npm run start
  ```
- Watch mode:
  ```bash
  $ npm run start:dev
  ```
- Production mode:
  ```bash
  $ npm run start:prod
  ```

## Scripts
The following scripts are available in the `package.json`:
- `build`: Builds the project using NestJS.
- `format`: Formats the code using Prettier.
- `start`: Starts the application.
- `start:dev`: Starts the application in watch mode.
- `start:debug`: Starts the application in debug mode.
- `start:prod`: Starts the application in production mode.
- `lint`: Lints the code using ESLint.
- `test`: Runs unit tests.
- `test:watch`: Runs unit tests in watch mode.
- `test:cov`: Runs tests and generates coverage reports.
- `test:debug`: Runs tests in debug mode.
- `test:e2e`: Runs end-to-end tests.

## Dependencies
Key dependencies used in this project:
- `@nestjs/common`
- `@nestjs/core`
- `@nestjs/jwt`
- `@nestjs/passport`
- `@nestjs/platform-express`
- `@nestjs/swagger`
- `@prisma/client`
- `bcrypt`
- `class-transformer`
- `class-validator`
- `nodemailer`
- `passport-jwt`
- `passport-local`
- `reflect-metadata`
- `rxjs`

## Tests
To run the tests, use the following commands:
- Unit tests:
  ```bash
  $ npm run test
  ```
- End-to-end tests:
  ```bash
  $ npm run test:e2e
  ```
- Test coverage:
  ```bash
  $ npm run test:cov
  ```

## Contributing
Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md).

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
