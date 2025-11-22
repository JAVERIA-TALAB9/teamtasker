🚀 TeamTasker: Modern Task Management App (Dev Bypass Mode)
TeamTasker is a simple, modern task management application built with React and Tailwind CSS. It features a dashboard, a detailed task list with filtering, a settings page, and modal-based task creation/editing.

✨ Key Features
Dashboard View: Provides an overview of metrics (Teams, Members, Outstanding Tasks) and a simple task distribution chart.

Task List: A comprehensive table view of all tasks with filtering options (Search, Status, Assignee, Team, Tag).

CRUD Operations: Full functionality to Create, Read (view details), Update (edit/change status), and Delete tasks.

Theme Toggle: Built-in Light/Dark mode switching on the fly.

Local Login Bypass: For rapid development and testing, the Firebase authentication has been bypassed to allow instant access with any credentials.

Mock Data: Utilizes mock team and task data when running in the Firebase bypass mode.

⚠️ Important Note: Dev Bypass Mode
This repository is currently configured for Development/Local Testing.

The FirebaseProvider and LoginScreen components have been modified to implement a Local Login Bypass:

To Sign In: Enter any text into the Email field and click "Sign In" or "Sign Up."

The application will immediately grant access and set a mock userId, allowing you to bypass the need for a live Firebase connection.

The FirestoreContext is running in mock mode (db is null), and the data displayed in the application is generated locally using createMockTasks().

If you wish to re-enable Firebase authentication, you must revert the logic in FirebaseProvider and implement the actual sign-in/sign-up logic in LoginScreen.

🛠️ Technologies Used
React: Frontend library for building the user interface.

Tailwind CSS: Utility-first CSS framework for rapid styling.

Firebase SDK Imports (Placeholder): Imports are present for future integration with Firestore and Firebase Auth, though currently bypassed.

Lucide Icons: Simple and modern icon set used throughout the application.

⚙️ Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
You need a modern web environment setup, typically:

Node.js (LTS version)

npm or yarn

Installation
Clone the repository:

Bash

git clone https://github.com/your-username/teamtasker.git
cd teamtasker
Install dependencies: (Assuming a standard React project structure where App.jsx is the main component)

Bash

npm install
# or
yarn install🚀 TeamTasker: Modern Task Management App (Dev Bypass Mode)
TeamTasker is a simple, modern task management application built with React and Tailwind CSS. It features a dashboard, a detailed task list with filtering, a settings page, and modal-based task creation/editing.

✨ Key Features
Dashboard View: Provides an overview of metrics (Teams, Members, Outstanding Tasks) and a simple task distribution chart.

Task List: A comprehensive table view of all tasks with filtering options (Search, Status, Assignee, Team, Tag).

CRUD Operations: Full functionality to Create, Read (view details), Update (edit/change status), and Delete tasks.

Theme Toggle: Built-in Light/Dark mode switching on the fly.

Local Login Bypass: For rapid development and testing, the Firebase authentication has been bypassed to allow instant access with any credentials.

Mock Data: Utilizes mock team and task data when running in the Firebase bypass mode.

⚠️ Important Note: Dev Bypass Mode
This repository is currently configured for Development/Local Testing.

The FirebaseProvider and LoginScreen components have been modified to implement a Local Login Bypass:

To Sign In: Enter any text into the Email field and click "Sign In" or "Sign Up."

The application will immediately grant access and set a mock userId, allowing you to bypass the need for a live Firebase connection.

The FirestoreContext is running in mock mode (db is null), and the data displayed in the application is generated locally using createMockTasks().

If you wish to re-enable Firebase authentication, you must revert the logic in FirebaseProvider and implement the actual sign-in/sign-up logic in LoginScreen.

🛠️ Technologies Used
React: Frontend library for building the user interface.

Tailwind CSS: Utility-first CSS framework for rapid styling.

Firebase SDK Imports (Placeholder): Imports are present for future integration with Firestore and Firebase Auth, though currently bypassed.

Lucide Icons: Simple and modern icon set used throughout the application.

⚙️ Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
You need a modern web environment setup, typically:

Node.js (LTS version)

npm or yarn

Installation
Clone the repository:

Bash

git clone https://github.com/your-username/teamtasker.git
cd teamtasker
Install dependencies: (Assuming a standard React project structure where App.jsx is the main component)

Bash

npm install
# or
yarn install
How to Run
Start the development server:

Bash

npm start
# or
yarn start
Open your browser to the address shown in the terminal (usually http://localhost:3000).

On the login screen, enter any email (e.g., dev@test.com) and click Sign In. You will be instantly redirected to the dashboard.
How to Run
Start the development server:

Bash

npm start
# or
yarn start
Open your browser to the address shown in the terminal (usually http://localhost:3000).

On the login screen, enter any email (e.g., dev@test.com) and click Sign In. You will be instantly redirected to the dashboard.
TeamTasker is a simple, modern task management application built with React and Tailwind CSS. It features a dashboard, a detailed task list with filtering, a settings page, and modal-based task creation/editing.

✨ Key Features
Dashboard View: Provides an overview of metrics (Teams, Members, Outstanding Tasks) and a simple task distribution chart.

Task List: A comprehensive table view of all tasks with filtering options (Search, Status, Assignee, Team, Tag).

CRUD Operations: Full functionality to Create, Read (view details), Update (edit/change status), and Delete tasks.

Theme Toggle: Built-in Light/Dark mode switching on the fly.

Local Login Bypass: For rapid development and testing, the Firebase authentication has been bypassed to allow instant access with any credentials.

Mock Data: Utilizes mock team and task data when running in the Firebase bypass mode.

⚠️ Important Note: Dev Bypass Mode
This repository is currently configured for Development/Local Testing.

The FirebaseProvider and LoginScreen components have been modified to implement a Local Login Bypass:

To Sign In: Enter any text into the Email field and click "Sign In" or "Sign Up."

The application will immediately grant access and set a mock userId, allowing you to bypass the need for a live Firebase connection.

The FirestoreContext is running in mock mode (db is null), and the data displayed in the application is generated locally using createMockTasks().

If you wish to re-enable Firebase authentication, you must revert the logic in FirebaseProvider and implement the actual sign-in/sign-up logic in LoginScreen.

🛠️ Technologies Used
React: Frontend library for building the user interface.

Tailwind CSS: Utility-first CSS framework for rapid styling.

Firebase SDK Imports (Placeholder): Imports are present for future integration with Firestore and Firebase Auth, though currently bypassed.

Lucide Icons: Simple and modern icon set used throughout the application.

⚙️ Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
You need a modern web environment setup, typically:

Node.js (LTS version)

npm or yarn

Installation
Clone the repository:

Bash

git clone https://github.com/your-username/teamtasker.git
cd teamtasker
Install dependencies: (Assuming a standard React project structure where App.jsx is the main component)

Bash

npm install
# or
yarn install
How to Run
Start the development server:

Bash

npm start
# or
yarn start
Open your browser to the address shown in the terminal (usually http://localhost:3000).

On the login screen, enter any email (e.g., dev@test.com) and click Sign In. You will be instantly redirected to the dashboard.
