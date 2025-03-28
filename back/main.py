from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Данные следуют простой структуре. У нас есть поле Task в котором расположены id, title, description и deadline.
# Поле id вначале инициализированно как None, так как оно будет указано при создании задачи.
class Task(BaseModel):
    id: int = None
    title: str
    description: str
    deadline: str

# Вместо базы данных использую массив. (Как было указано в задании)
tasks = []
id_counter = 1

# В пост запросе нам передаются все данные из фронта кроме id. Оно инициализируется здесь на бэке.
@app.post("/tasks")
def create_task(task: Task):
    global id_counter
    task_dict = task.dict()
    task_dict['id'] = id_counter
    tasks.append(task_dict)
    id_counter += 1
    return task_dict

# Для получения списка задач на фронте они передаются в порядке возрастания даты дедлайна.
@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return sorted(tasks, key=lambda x: datetime.strptime(x['deadline'], "%Y-%m-%d"))

# Удаление списка работает по полю id, которое передается на фронт с остальными полями в post запросе.
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return {"message": f"Задача {task_id} удалена!"}


# В качестве улучшения проекта для продакшена первое, что приходит на ум, — это добавление базы данных.
# Помимо этого, можно добавить регистрацию, если проект будет использоваться не как сайт, а как веб-приложение на телефоне.
# Ну и, конечно, всё зависит от того, какие цели в принципе преследует этот проект.
# Также я бы сделал структуру задач более обширной, например, добавил бы возможность создавать задачи со списками, например, список покупок в магазин.
# Можно было бы также добавить в проект календарь для более удобного отслеживания задач и их дедлайнов.
# Из логичных изменений для продакшена — перенести API и фронт на удалённые сервера вместо запуска на локальной машине.
# Так как запросы выполняются напрямую с клиента к API, необходимо настроить CORS. Если запускать проект в продакшене, то нужно будет создать сервер, который будет проксировать запросы с клиента на бэкенд.