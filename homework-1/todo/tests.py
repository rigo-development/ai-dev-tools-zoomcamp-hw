from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from .models import Todo
from .forms import TodoForm
import datetime

class TodoModelTest(TestCase):
    def test_todo_creation(self):
        todo = Todo.objects.create(title="Test Todo", description="Test Description")
        self.assertTrue(isinstance(todo, Todo))
        self.assertEqual(todo.__str__(), todo.title)
        self.assertFalse(todo.completed)

class TodoFormTest(TestCase):
    def test_valid_form(self):
        data = {'title': 'Test Todo', 'description': 'Test Description', 'due_date': '2025-12-31 12:00'}
        form = TodoForm(data=data)
        self.assertTrue(form.is_valid())

    def test_invalid_form(self):
        data = {'title': '', 'description': 'Test Description'}
        form = TodoForm(data=data)
        self.assertFalse(form.is_valid())

class TodoViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.todo = Todo.objects.create(title="Test Todo", description="Test Description")

    def test_todo_list_view(self):
        response = self.client.get(reverse('todo_list'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'todo/todo_list.html')
        self.assertContains(response, "Test Todo")

    def test_todo_create_view(self):
        response = self.client.post(reverse('todo_create'), {
            'title': 'New Todo',
            'description': 'New Description',
            'due_date': '2025-12-31 12:00'
        })
        self.assertEqual(response.status_code, 302) # Redirects after success
        self.assertEqual(Todo.objects.count(), 2)

    def test_todo_update_view(self):
        response = self.client.post(reverse('todo_update', args=[self.todo.pk]), {
            'title': 'Updated Todo',
            'description': 'Updated Description',
            'due_date': '2025-12-31 12:00'
        })
        self.assertEqual(response.status_code, 302)
        self.todo.refresh_from_db()
        self.assertEqual(self.todo.title, 'Updated Todo')

    def test_todo_delete_view(self):
        response = self.client.post(reverse('todo_delete', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)
        self.assertEqual(Todo.objects.count(), 0)

    def test_todo_toggle_complete(self):
        response = self.client.post(reverse('todo_toggle_complete', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)
        self.todo.refresh_from_db()
        self.assertTrue(self.todo.completed)
