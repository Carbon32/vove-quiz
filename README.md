<p align="center">
    <img
    src="https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=700&size=48&duration=3000&pause=1000&color=58A6FF&center=true&vCenter=true&width=500&lines=Vove%20Auth"
    alt="Vove Auth"
    />
</p>

<p align="center">
    A responsive authentication frontend built with Vue.js and TypeScript, designed to integrate with Gopher Auth and provide a complete user authentication and account management experience across web, Android, and desktop platforms.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Framework-Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Vue.js" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Package_Manager-npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm" />
  <img src="https://img.shields.io/badge/Platforms-Web%20%7C%20Android%20%7C%20Desktop-58A6FF?style=for-the-badge" alt="Supported Platforms" />
</p>

---

## Introduction

Some time ago, I decided to break down a large platform I had been developing and release its individual components as stand-alone projects. The platform consists of several subsystems, some of which I've decided to rewrite before releasing, while keeping the frontend largely intact since it requires little to no maintenance.

One of the first systems to be released was Gopher Auth, a Go-based authentication system designed to handle user accounts, authentication, and session management. Vove Auth is an example of how Gopher Auth can be integrated into a frontend application. Built with Vue.js and TypeScript, it provides the necessary pages, navigation, and account management functionality for a complete authentication experience.

## Features

### User Authentication

- **Account Registration:** Create new user accounts through the authentication interface.
- **User Login:** Authenticate existing accounts.
- **Session Handling:** Manage authenticated sessions throughout the application.
- **Password Recovery:** Provide a dedicated page for users who have forgotten their passwords.

### Profile and Account Management

- **Profile Page:** View account information and manage personal details.
- **E-mail Changes:** A dedicated page for changing account e-mail addresses.
- **Password Changes:** A dedicated page for updating account password.

### Navigation and User Interface

- **Landing Page:** A home page that ALLEGEDLY introduces the application.
- **About Page:** A dedicated page providing information about whatever you want.
- **Pre-configured Routing:** A navigation system with routes already set up.
- **Footer:** A shared footer across the application.
- **Error Page:** Display an appropriate page when a route is malformed or invalid.
- **Responsive Design:** An interface designed to look good on both desktop computers and mobile devices.

### Localization

- **Language Support:** Three languages are supported, translating pages is very easy and straightforward.

### Legal Pages (Dummy Pages)

- **Privacy Policy:** A dedicated page for privacy-related information.
- **Terms and Conditions:** A page for outlining the application's terms of use.

### Multi-Platform Support

Vove Auth supports building the application for multiple platforms:

- **Web:** Run the application in a web browser.
- **Android:** Package the application for Android devices.
- **Desktop:** Build the application as a desktop application.

---

## Requirements

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

Depending on the platform you want to build for, additional tools or platform-specific dependencies may be required.

You will also need a running instance of Gopher Auth or another authentication system that has the same endpoints and mechanics as Gopher Auth.

---

## Getting Started

Follow these steps to configure and run Vove Auth locally.

### 1. Install Dependencies

Clone the repository, navigate to the project directory, and install the required packages:

```bash
npm install
```

This installs the dependencies needed to develop and run the application.

### 2. Configure Environment Variables

Create a `.env` file in the project root and configure the public API endpoint for Gopher Auth.

> **Note:** The frontend depends on Gopher Auth for authentication and account management. Make sure the backend is running and accessible before testing these features.

### 3. Run the Application

Vove Auth includes three scripts for running or packaging the application, depending on your target platform.

#### Web

To run the application as a web application, execute:

```bash
bash web.sh
```

This starts the web application using the project's configured development workflow.

#### Android

To package the application for Android, execute:

```bash
bash android.sh
```

Make sure the required Android development tools are installed and configured before building.

#### Desktop

To package the application as a desktop application, execute:

```bash
bash desktop.sh
```

Ensure that any required desktop build dependencies are installed before running the script.

---

*Vove Auth provides a ready-to-configure frontend for Gopher Auth, combining authentication, account management, localization, and multi-platform support in a single Vue.js and TypeScript application.*
