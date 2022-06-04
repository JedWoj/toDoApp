// (()=> {    
    const plusBtn = document.querySelector('.create-task'); 
    const popup = document.querySelector('.popup');
    const form = document.querySelector('.task-form');
    const tasksContainer = document.querySelector('.tasks');
    const userOptionsList = document.querySelector('.user-options__list');
    const userOptions = document.querySelectorAll('.user-options__option');

    const normalTasks = [];
    const importantTasks = [];
    const doneTasks = [];
    let stars;
    let allTasks = [];
    let active;
    let id = 0;

    const changeImportance = function(id) {
        const task = allTasks[id];
        task.importance === 'normal' ? task.importance = 'important' : task.importance = 'normal';
        if (task.importance === 'normal') {
            const idx = importantTasks.findIndex(tsk => tsk === allTasks[id]);
            importantTasks.splice(idx,1);
            normalTasks.push(task);
        } else {
            const idx = normalTasks.findIndex(tsk => tsk === allTasks[id]);
            normalTasks.splice(idx,1);
            importantTasks.push(task);
        }
        renderData(active);
    }

    const importanceHandler = function() {
        stars.forEach(star => star.addEventListener('click', (e) => {
            const target =  e.target.closest('.task').dataset.id;
            changeImportance(target);
        }))
    }

    const addData = function(title, info, date, importance) {
        const obj = {
            title,
            info,
            date,
            importance,
            id,
        }
        id++;
        importance === 'important' ? importantTasks.push(obj) : normalTasks.push(obj);
        allTasks.push(obj);
        active === undefined ? active = allTasks : active = active;
    }

    const renderData = function(data) {
        tasksContainer.innerHTML = '';
        data.forEach((obj) => {
                const div = `<div class="task" data-id='${obj.id}'>
                    <div class="task__txt-wrap">
                        <h2 class="task__heading">
                            ${obj.title}
                        </h2>
                        <div class="task__info">
                            ${obj.info}
                        </div>
                        <div class="task-date">
                            <i class="fa-solid fa-calendar"></i>
                            ${obj.date}
                        </div>
                    </div>
                    <i class="fa-solid fa-star task__star ${obj.importance === 'important' ? 'task__star--important' : ''}"></i>
                    <div class="task__btns">
                        <div class="task__btn-edit">
                            <i class="fa-solid fa-pen-to-square task__icon"></i>
                        </div>
                        <div class="task__btn-close">
                            <i class="fa-solid fa-xmark task__icon"></i>
                        </div>
                    </div>
                </div>`
                tasksContainer.insertAdjacentHTML('beforeend', div);
        })
        stars = [...document.querySelectorAll('.task__star')];
        importanceHandler();
    }

    const addClickedBtnStyles = function(target) {
        userOptions.forEach(option => option.classList.remove('user-options__option--active'));
        target.classList.add('user-options__option--active');
    }

    const checkInputs = function() {
        const error = document.querySelector('.task-form__error');
        const title = document.querySelector('.task-form__input--title');
        const additionalInfo = document.querySelector('.task-form__input--info');
        const date = document.querySelector('.task-form__input--date');
        const checked = [...document.querySelectorAll('.task-form__radio')].find(radio => radio.checked).id;
        if (date.value === '' || title.value === '' || additionalInfo.value === '') {
            error.classList.remove('hidden');
            return
        }
        error.classList.add('hidden');
        popup.classList.add('hidden');
        addData(title.value, additionalInfo.value, date.value, checked);
        renderData(allTasks);
        title.value = '';
        additionalInfo.value = '';
        date.value = ''; 
    }

    plusBtn.addEventListener('click', () => {
        popup.classList.remove('hidden');
    });
    
    popup.addEventListener('click', function(e) {
        const {value} = e.target.classList;
        value === 'popup' ? popup.classList.add('hidden') : '';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        checkInputs();
    });

    userOptionsList.addEventListener('click', (e) => {
        const target = e.target.closest('li');
        if (!target) return
        const {arr} = target.dataset;
        addClickedBtnStyles(target);
        switch(arr) {
            case 'allTasks':
                renderData(allTasks);
                active = allTasks;
                break;
            case 'normalTasks': 
                renderData(normalTasks);
                active = normalTasks;
                break;
            case 'importantTasks':
                renderData(importantTasks);
                active = importantTasks;
                break;
            case 'doneTasks': 
                renderData(doneTasks);
                active = doneTasks;
                break;
        }
    })
// })();