
-----

# Finance Tracker Frontend (Vue.js)

## 🌟 Project Overview

This repository contains the frontend client for the **Finance Tracker** application. Built with **Vue.js 3**, this Single-Page Application (SPA) provides a modern and intuitive user interface for managing personal finances. It consumes a secure REST API to visualize income, track expenses, and generate financial reports.

The project showcases best practices in frontend development, including:

* **Component-based architecture** with the Composition API.
* **Centralized state management** using Pinia.
* **Secure API communication** with Axios and JWT authentication.
* **Internationalization** support with `vue-i18n`.
* **Responsive design** for an optimal experience on both desktop and mobile devices.

## 🚀 Key Features

* **Secure Authentication:** User registration and login with JWT authentication.
* **Dashboard:** A dynamic dashboard displaying financial summaries, charts of expenses and income by category, and recent transactions.
* **Transaction Management:** Add new transactions with a modal form.
* **Category Management:** Add and manage custom categories for transactions.
* **Multi-language Support:** Easily switch between English, Russian, and French.
* **Responsive UI:** A mobile-first design that adapts gracefully to various screen sizes, featuring a collapsed sidebar on mobile devices.

## 🛠️ Technology Stack

* **Framework:** Vue.js 3 (with Composition API and `<script setup>`)
* **Language:** TypeScript
* **State Management:** Pinia
* **Routing:** Vue Router
* **Styling:** Bootstrap 5
* **Icons:** Font Awesome
* **Charts:** Chart.js
* **API Client:** Axios
* **Localization:** `vue-i18n`

## ⚙️ Getting Started

### 1\. Prerequisites

Make sure you have Node.js and npm installed. **This frontend requires the backend API to be running to function correctly.**

### 2\. Backend API

The REST API for this application is built with Spring Boot. You can find the source code and setup instructions here:

* **Backend Repository:** [https://github.com/smerteliko/finance-tracker-backend-spring](https://github.com/smerteliko/finance-tracker-backend-spring)

### 3\. Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/smerteliko/finance-tracker-frontend-vue.git
    cd finance-tracker-frontend-vue
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### 4\. Configuration

Create a `.env` file in the root of the project to specify the backend API URL.

```
VITE_API_URL=http://localhost:8080/api
```

### 5\. Running the Application

To start the development server, run:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### 6\. Running Tests

To run the unit tests with Vitest, run:

```bash
npm run test
```

This command will execute all tests and provide a detailed report.

## 📈 Project Structure

The project follows a standard Vue 3 project structure, organized to promote maintainability and scalability:

* **`src/components/`**: Reusable components like `BalanceCard.vue` and `TransactionFormModal.vue`.
* **`src/views/`**: Main application pages, such as `Dashboard.vue` and `Login.vue`.
* **`src/stores/`**: Pinia stores for centralized state management.
* **`src/i18n/`**: Localization files for multi-language support.
* **`src/assets/`**: Global assets and styles.

## 🤝 Contributing

I welcome any suggestions and feedback for improvement. If you find a bug or want to propose a new feature, please create a **GitHub Issue** or a **Pull Request**.


-----

## 👨‍💻 Contact

* **Name:** Nikolay Makarov
* **GitHub:** https://github.com/smerteliko
* **LinkedIn:** https://www.linkedin.com/in/nikolay-makarov/