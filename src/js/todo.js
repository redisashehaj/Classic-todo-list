const container = document.querySelector('.todo-main');

//getList() will return all the item saved in the local storage, if none an empty array

const getList = () => {
    const todos = localStorage.getItem('todos');
    if (todos === null) {
        return [];
    }
    return JSON.parse(todos);
}

//addTasks() will create a new object, save it and display it

const addTasks = (title, description) => {
    const todos = getList();
    const newTodo = { title, description, done: 'no' };
    todos.unshift(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));
    appendTasks();
}

//appendTasks() will clear the container, and append each element to the DOM

const appendTasks = () => {
    container.innerHTML = '';
    const todos = getList();
    todos.forEach((task, index) => {
        const done = task.done === 'no' ? '' : 'done';

        container.innerHTML += `
            <article id="${index}" class="todo-article ${done}">
                <h1>${task.title}</h1>
                <p>${task.description}</p>
                ${task.done === 'no' ? '' : '<button class="todo-remove">Remove</button>'}
            </article>
        `;
    });
}

//changeStatus() will change the status of the elements; the tasks marked as done are shown in the bottom of the list

const changeStatus = (index) => {
    const todos = getList();

    if (todos[index].done === 'no') {
        todos[index].done = 'yes';
        const moveTask = todos.splice(index, 1);
        todos.unshift(moveTask[0]);
    } else {
        todos[index].done = 'no';
        const moveTask = todos.splice(index, 1);
        todos.push(moveTask[0]);
    }

    localStorage.setItem('todos', JSON.stringify(todos));
    appendTasks();
}

//removeTask() will remove a todo which is marked as done already

const removeTask = (index) => {
    const todos = getList();
    todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    appendTasks();
}

const form = document.querySelector('#todo-form');

form.addEventListener('submit', (e) => {
    e.preventDefault(); //normaly when a form is submitted, the browser will attempt to submit the form to the server; preventDefault() will prevent it from happening
    const title = document.querySelector('#todo-title');
    const description = document.querySelector('#todo-description');
    addTasks(title.value, description.value);

    title.value = '';
    description.value = '';
});

//the following eventListener will help know which item you are clicking on ('target') and fire up the action

container.addEventListener('click', (e) => {
    if (e.target.classList.contains('todo-remove')) {
        removeTask(e.target.parentNode.getAttribute('id'));
    } else if (e.target.parentNode.classList.contains('todo-article')) {
        changeStatus(e.target.parentNode.getAttribute('id'));
    }
});

appendTasks();