🚀 Project Name
Overview
This is a [Brief, compelling description of your app - e.g., "single-page application for real-time user leaderboard and analytics"]. Built using the Laravel 11+ (latest) framework with Inertia.js for a modern, reactive frontend experience.

This application uses SQLite as the default database engine for simple, portable development and testing.

💻 Prerequisites
Ensure you have the following installed on your local machine:

PHP: Version 8.2 or higher.

Composer: Latest version.

Node.js & npm/Yarn: Latest stable version for managing frontend assets.

Git: For version control.

⚙️ Installation and Setup
Follow these steps to get the application running on your local development environment.

1. Clone the Repository
Bash

git clone [YOUR_REPOSITORY_URL]
cd [your-project-name]
2. Install Dependencies
Install the backend (PHP) and frontend (JavaScript) dependencies:

Bash

composer install
npm install
3. Environment Configuration
Create your environment file by copying the example:

Bash

cp .env.example .env
Generate a unique application key:

Bash

php artisan key:generate
Ensure your .env file is configured for SQLite:

Code snippet

# Database Settings
DB_CONNECTION=sqlite
# DB_DATABASE=./database/database.sqlite  <- (This is the default if DB_DATABASE is omitted)
4. Database Setup
Since we are using SQLite, we first need to create the database file, then run migrations:

Create the empty SQLite file:

Bash

touch database/database.sqlite
Run the migrations and seed the database with initial data:

Bash

php artisan migrate --seed
5. Run the Application
Start the Laravel development server and compile the frontend assets:

Bash

# Terminal 1: Start Laravel server
php artisan serve

# Terminal 2: Compile and watch frontend assets (Vite)
npm run dev
The application should now be accessible at http://127.0.0.1:8000.

🧪 Running Tests
The application uses Pest for robust feature and unit testing.

To run all tests:

Bash

php artisan test
(Optional) If you wish to use a separate in-memory database for testing (recommended): Ensure your phpunit.xml or .env.testing file contains:

XML

<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
🤝 Contributing
We welcome contributions! If you find a bug or have a suggestion, please open an Issue or submit a Pull Request.

📄 License
This project is licensed under the MIT License.