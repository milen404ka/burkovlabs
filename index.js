document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});

class App {
    tasklists = [];

    moveTask = (taskID, direction) => {
        if (direction !== 'left' && direction !== 'right') return;

        let {
            tlIndex,
            taskIndex
        } = taskID.split('-T');

        tlIndex = Number(tlIndex.split('TL')[1]);
        taskIndex = Number(taskIndex);

        if (direction === 'left' && tlIndex === 0) return;
        if (direction === 'right' && tlIndex === this.tasklists.length - 1) return;

        const targetTlIndex = direction === 'left' ? tlIndex - 1 : tlIndex + 1;

        const taskName = this.tasklists[tlIndex].tasks[taskIndex];
        this.tasklists[tlIndex].deleteTask(taskIndex);
        this.tasklists[targetTlIndex].addTask(taskName);
    }

    init() {
        document.getElementById('add-tasklist-btn')
            .addEventListener('click', (event) => {
                event.target.style.display = 'none';

                const input = document.getElementById('add-tasklist-input');
                input.style.display = 'inherit';
                input.focus();
            });

        document.addEventListener('keydown', ({key}) => {
            if (key !== 'Escape') return;

           const input = document.getElementById('add-tasklist-input');

           if (input.style.display === 'none') return;

           input.value = '';
           input.style.display = 'none';

           const btn = document.getElementById('add-tasklist-btn');
           btn.style.display = 'inherit';
        });

        document.getElementById('add-tasklist-input')
            .addEventListener('keydown', ({key, target}) => {
                if (key !== 'Enter') return;

                if (target.value) {
                    this.tasklists.push(
                        new Tasklist(
                            target.value,
                        `TL${this.tasklists.length}`,
                            this.moveTask
                        )
                    );

                    this.tasklists[this.tasklists.length - 1].render();

                    target.value = '';
                }

                target.style.display = 'none';

                const btn = document.getElementById('add-tasklist-btn');
                btn.style.display = 'inherit';
            });
    }
}

class Tasklist {
    constructor(tlName, tlID, moveTask) {
        this.tlName = tlName;
        this.tlID = tlID;
        this.tasks = [];
        this.moveTask = moveTask;

    }

    addTaskButtonClick = () => {
        const taskName = prompt('Введите описание задачи: ');

        if (!taskName) return;

        this.addTask(taskName);
    };

    addTask = (taskName) => {
        this.tasks.push(taskName);

        document.querySelector(`#${this.tlID} .tasks`)
            .appendChild(
                this.renderTask(taskName, `${this.tlID}-T${this.tasks.length - 1}`)
            );
    }

    editTask = (taskID) => {
        const taskIndex = Number(taskID.split('-T')[1]);
        const oldTaskName = this.tasks[taskIndex];

        const taskName = prompt('Введите новое описание задачи: ', oldTaskName);

        if (!taskName || taskName === oldTaskName) return;

        this.tasks[taskIndex] = taskName;

        document.querySelector(`#${taskID} .task-description`)
            .innerHTML = taskName;
    };

    deleteTaskBtnClick = (taskID) => {
        const taskIndex = Number(taskID.split('-T')[1]);
        const taskName = this.tasks[taskIndex];

        const taskIsDeleted = confirm(`Задача '${taskName}' будет удалена. Прододжить?`);

        if (!taskIsDeleted) return;

        this.deleteTask(taskIndex);
    };

    deleteTask = (taskIndex) => {
        this.tasks.splice(taskIndex, 1);
        this.rerenderTasks();
    }

    rerenderTasks() {
        const tasksContainer = document.querySelector(`#${this.tlID} .tasks`)

        tasksContainer.innerHTML = '';
        this.tasks.forEach((task, index) => {
            tasksContainer.appendChild(
                this.renderTask(task, `${this.tlID}-T${index}`)
            );
        });
    }


    renderTask(taskName, taskID){
        const task = document.createElement('li');
        task.classList.add('task');
        task.id = taskID;

        const descr = document.createElement('p');
        descr.classList.add('task-description');
        descr.innerHTML = taskName;
        task.appendChild(descr);

        const controls = document.createElement('div');
        controls.classList.add('task-controls');

        const upperRow = document.createElement('div');
        upperRow.classList.add('task-controls-row');

        const leftBtn = document.createElement('button');
        leftBtn.classList.add('task-controls-btn');
        leftBtn.addEventListener('click', () => this.moveTask(taskID, 'left'));
        leftBtn.innerHTML = `
            <img src="assets/left-arrow.svg"
                 alt="Edit task left button"
            />`;

        upperRow.appendChild(leftBtn);

        const rightBtn = document.createElement('button');
        rightBtn.classList.add('task-controls-btn');
        rightBtn.addEventListener('click', () => this.moveTask(taskID, 'right'));
        rightBtn.innerHTML = `
            <img src="assets/right-arrow.svg"
                 alt="Edit task right button"
            />`;

        upperRow.appendChild(rightBtn);

        controls.appendChild(upperRow);

        const lowerRow = document.createElement('div');
        lowerRow.classList.add('task-controls-row');

        const editBtn = document.createElement('button');
        editBtn.classList.add('task-controls-btn');
        editBtn.addEventListener('click', () => this.editTask(taskID));
        editBtn.innerHTML = `
            <img src="assets/edit.svg"
                 alt="Edit task button"
            />`;

        lowerRow.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('task-controls-btn');
        deleteBtn.addEventListener('click', () => this.deleteTaskBtnClick(taskID));
        deleteBtn.innerHTML = `
                <img src="assets/delete.svg"
                 alt="Delete task button"
            />`;

        lowerRow.appendChild(deleteBtn);

        controls.appendChild(lowerRow);

        task.appendChild(controls);

        return task;
    }

    render() {
        const tasklist = document.createElement('li');
        tasklist.classList.add('tasklist');
        tasklist.id = this.tlID;

        const header = document.createElement('header');
        header.classList.add('tl-header');
        header.innerHTML = this.tlName;
        tasklist.appendChild(header);

        const section = document.createElement('section');
        section.classList.add('tl-tasks');

        const list = document.createElement('ul');
        list.classList.add('tasks');
        section.appendChild(list);
        tasklist.appendChild(section);

        const footer = document.createElement('footer');
        footer.classList.add('tl-footer');

        const button = document.createElement('button');
        button.classList.add('tl-add-task-btn');
        button.innerHTML = 'Добавить задачу';
        button.type = 'button';
        button.addEventListener('click', this.addTaskButtonClick);

        tasklist.appendChild(button);
        tasklist.appendChild(footer);

        const container = document.getElementById('tasklists');
        container.insertBefore(tasklist, container.lastElementChild);

    }
}