# TODO Application

A simple Django-based TODO application that allows users to create, edit, delete, and manage their tasks with due dates.

## Features

- 🍄 **Super Mario Brothers Theme**: Retro 8-bit design with custom pixel art background and fonts.
- 📅 **Smart Datepicker**: Integrated Flatpickr for easy date and time selection.
- ✅ Create new TODO items
- ✏️ Edit existing TODOs
- 🗑️ Delete TODOs
- ✅ Mark TODOs as completed or incomplete
- 📋 View all TODOs in a clean list interface

## Technologies Used

- **Backend**: Django 5.2
- **Database**: SQLite
- **Frontend**: HTML, CSS (Super Mario Theme), Flatpickr
- **Python**: 3.x

## Prerequisites

- Python 3.x installed
- Virtual environment (recommended)

## Installation

1. **Clone the repository (if you haven't already):**
   ```bash
   git clone <repository-url>
   cd ai-dev-tools-zoomcamp-hw/homework-1
   ```

2. **Create a virtual environment:**
   ```bash
   python3 -m venv venv
   ```

3. **Activate the virtual environment:**
   
   On macOS/Linux:
   ```bash
   source venv/bin/activate
   ```
   
   On Windows:
   ```bash
   venv\Scripts\activate
   ```

4. **Install dependencies:**
   ```bash
   pip install django
   ```

5. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

## Running the Application

```bash
source venv/bin/activate
python manage.py runserver
```

## Running Tests

To run the automated test suite:

```bash
source venv/bin/activate
python manage.py test
```

The application will be available at `http://127.0.0.1:8000/`

## Project Structure

```
homework-1/
├── config/              # Django project settings
├── todo/                # Todo application
│   ├── migrations/      # Database migrations
│   ├── static/          # Static files (CSS, images)
│   ├── templates/       # HTML templates
│   └── ...
├── manage.py            # Django management script
├── db.sqlite3           # SQLite database (created after migrations)
└── venv/                # Virtual environment (created locally, not in git)
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