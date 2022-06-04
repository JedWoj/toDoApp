(()=> {    
    const plusBtn = document.querySelector('.create-task'); 
    const popup = document.querySelector('.popup');
    const form = document.querySelector('.task-form');
    const tasksContainer = document.querySelector('.tasks');
    // const showPlannedBtn = document.querySelector('.user-options__option--planned');
    // const showImportantBtn = document.querySelector('.user-options__option--important');
    // const showPendingBtn = document.querySelector('.user-options__option--pending');
    // const showDoneBtn = document.querySelector('.user-options__option--done');
    const userOptions = document.querySelector('.user-options__list');

    const normalTasks = [];
    const importantTasks = [];
    const doneTasks = [];
    let stars;
    let allTasks;

    const changeImportance = function(id) {
        const task = allTasks[id];
        task.importance === 'normal' ? task.importance = 'important' : task.importance = 'normal';
        renderData(allTasks);
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
            importance
        }
        importance === 'important' ? importantTasks.push(obj) : normalTasks.push(obj);
        allTasks = [...normalTasks, ...importantTasks];
    }

    const renderData = function(data) {
        tasksContainer.innerHTML = '';
        data.forEach((obj, id) => {
                const div = `<div class="task" data-id='${id}'>
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
                </div>`
                tasksContainer.insertAdjacentHTML('afterbegin', div);
        })
        stars = [...document.querySelectorAll('.task__star')];
        importanceHandler();
        console.log(normalTasks, importantTasks, allTasks)
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

    userOptions.addEventListener('click', (e) => {
        const target = e.target.closest('li');
        if (!target) return
        const {arr} = target.dataset;
        switch(arr) {
            case 'allTasks':
                renderData(allTasks);
                break;
            case 'normalTasks': 
                renderData(normalTasks);
                break;
            case 'importantTasks':
                renderData(importantTasks);
                break;
            case 'doneTasks': 
                renderData(doneTasks);
                break;
        }
    })
})();