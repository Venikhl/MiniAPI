import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// В данном случае в задании запрещенно использовать CSS файлы. Поэтому чтобы придать странице относительно приятный вид - я использовал простой bootstrap.

function App() {
  // Состояния для хранения данных о задачи
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = async () => {
    if (title && description && deadline) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/tasks', {
          title: title,
          description: description,
          deadline: deadline,
        });
        setTasks([...tasks, response.data]);
        setTitle('');
        setDescription('');
        setDeadline('');
      } catch (error) {
        alert('Ошибка при добавлении задачи');
      }
    } else {
      alert('Заполните все поля');
    }
  };

  const removeTask = async (id) => {
    if (id) {
      try {
        await axios.delete(`http://127.0.0.1:8000/tasks/${id}`);
        setTasks(tasks.filter(item => item.id !== id));
      } catch (error) {
        alert('Ошибка при удалении задачи');
      }
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/tasks');
      setTasks(response.data);
    } catch (error) {
      alert('Ошибка при загрузке задач');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Список задач</h1>
      <div className="mb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control mb-2"
          placeholder="Название задачи"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control mb-2"
          placeholder="Описание задачи"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="form-control mb-2"
        />
        <button
          onClick={addTask}
          className="btn btn-success w-100"
        >
          Добавить задачу
        </button>
      </div>
      <ul className="list-group">
        {tasks.length === 0 ? (
          <li className="list-group-item">Пока желаний нет</li>
        ) : (
          tasks.map((item) => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{item.title} - {item.description} - {formatDate(item.deadline)}</span>
              <button
                onClick={() => removeTask(item.id)}
                className="btn btn-danger btn-sm"
              >
                Удалить
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;

// Для улучшения кода в продакшн можно сделать несколько вещей;
// Во-первых, стоит использовать мемоизацию функций, чтобы избежать их повторного выполнения и перерендеринга слишком часто.
// Во-вторых, добавить валидацию данных как на стороне бэкенда, так и на фронтенде, чтобы избежать непредвиденных ошибок и, например, SQL инъекций.
// В-третьих, можно улучшить стилизацию:
// 1) Добавить индикаторы загрузки для случаев, когда запрос обрабатывается дольше ожидаемого времени.
// 2) Добавить всплывающие сообщения для подтверждения удаления задачи, чтобы пользователь был уверен, что задача удалена.
// 3) Улучшить стили, чтобы страница выглядела более привлекательно и не была слишком пустой.
// 4) Добавить дополнительный функционал на сайт, если это необходимо.
// В-четвертых, улучшить асинхронность запросов, чтобы не блокировать пользовательский интерфейс, особенно когда приложение станет более сложным и тяжёлым.