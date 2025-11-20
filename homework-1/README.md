# TODO Application

A simple Django-based TODO application that allows users to create, edit, delete, and manage their tasks with due dates.

## Features

- ✅ Create new TODO items
- ✏️ Edit existing TODOs
- 🗑️ Delete TODOs
- 📅 Assign due dates to tasks
- ✅ Mark TODOs as completed or incomplete
- 📋 View all TODOs in a clean list interface

## Technologies Used

- **Backend**: Django 5.2
- **Database**: SQLite
- **Frontend**: HTML, CSS (basic styling)
- **Python**: 3.x

## Prerequisites

- Python 3.x installed
- Virtual environment (recommended)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd homework-1
   ```

2. **Activate the virtual environment:**
   ```bash
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install django
   ```

4. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

## Running the Application

```bash
source venv/bin/activate
python manage.py runserver
```

The application will be available at `http://127.0.0.1:8000/`

## Project Structure

```
homework-1/
├── config/              # Django project settings
├── todo/                # Todo application
│   ├── migrations/      # Database migrations
│   ├── templates/       # HTML templates
│   └── ...
├── manage.py            # Django management script
├── db.sqlite3           # SQLite database
└── venv/                # Virtual environment
```

## Usage

1. Open the application in your browser
2. Click "Add New Todo" to create a task
3. Fill in the title, description, and due date
4. Use the buttons to edit, delete, or toggle completion status
5. All changes are saved automatically to the database

## Contributing

Feel free to submit issues and enhancement requests!

---

*Built with Django for AI Dev Tools Zoomcamp Homework 1*