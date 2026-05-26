# Bank System - Fullstack Application

A professional web application designed for managing bank accounts, cards, and financial transactions. The project features a complete full-stack architecture, split into a client-side application (React) and a server-side backend (Spring Boot).

## Description

This system provides users with a secure and intuitive interface for everyday banking operations. Users can undergo secure registration, issue new debit and credit cards, perform monetary transfers, pay for services, and track accumulated cashback. The system is engineered for reliability and includes automated background processes for generating financial reports.

## Tech Stack

**Frontend:**
* React.js
* Context API (for global user, card, and transaction state management)
* React Router (application routing)

**Backend:**
* Java
* Spring Boot
* Spring Data JPA
* Maven

**Infrastructure and Database:**
* Relational Database (with automatic schema initialization via `schema.sql`)
* Docker
* Docker Compose

## Key Features

* **Security:** Complete registration and authentication workflow. Critical actions are verified via OTP (one-time password) codes, alongside PIN code recovery and reset mechanisms.
* **Dashboard:** Main user screen providing an up-to-date summary of the total balance and a list of active cards.
* **Card Management:** Ability to issue new credit and debit cards, view detailed card credentials, and perform emergency card blocking.
* **Transactions:** Secure transfers between accounts, integration with third-party service payments, and a detailed transaction history log.
* **Loyalty Program:** Automated cashback calculation for transactions and the ability to transfer accumulated cashback back to the main balance.
* **Background Tasks:** Integrated scheduler (`CreditCardStatementScheduler`) for automatic, regular generation of credit card statements.

## Project Structure

```text
├── bank2/                         # Frontend application (React)
│   ├── src/components/            # Reusable UI components
│   ├── src/pages/                 # Application pages (Auth, Dashboard, Cards, etc.)
│   ├── src/contexts/              # Global state management logic
│   └── src/api/                   # API configurations and server requests
│
├── Backend/BankSystem/            # Backend application (Spring Boot)
│   ├── src/main/java/.../         # Controllers, services, DTOs, repositories, and entities
│   ├── src/main/resources/        # Configuration files (application.properties)
│   └── Dockerfile                 # Instructions for backend containerization
│
├── BankSystemDatabase/init/       # Directory containing schema.sql for DB initialization
└── docker-compose.yml             # Configuration file for running the infrastructure
Local Setup Instructions
Prerequisites
Ensure you have the following tools installed on your local machine:

Node.js (version 16 or higher)

Java Development Kit (JDK) (version 17 or higher)

Docker and Docker Compose

Option 1: Running the Infrastructure via Docker Compose
The root directory contains a docker-compose.yml file, allowing you to quickly spin up the database (with automatic schema.sql application) and, if configured, the backend service.

Open a terminal in the project root directory.

Run the command to build and start the containers:

Bash
docker-compose up -d --build
To stop the containers, run:

Bash
docker-compose down
Option 2: Isolated Development Setup
If you plan to modify the source code, it is more convenient to run the frontend and backend locally outside of containers (leaving only the database running in Docker).

1. Running the Backend (Spring Boot):
Navigate to the backend directory and run the application using the Maven Wrapper:

Bash
cd Backend/BankSystem
./mvnw spring-boot:run
The server will be available by default on port 8080 (or the port specified in your properties file).

2. Running the Frontend (React):
Open a new terminal window, navigate to the frontend directory, install dependencies, and start the development server:

Bash
cd bank2
npm install
npm start
The application will automatically open in your browser at http://localhost:3000.
