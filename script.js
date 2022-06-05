(()=> {    
    const plusBtn = document.querySelector('.create-task'); 
    const popupAdd = document.querySelector('.popup--add');
    const popupEdit = document.querySelector('.popup--edit');
    const form = document.querySelector('.task-form');
    const tasksContainer = document.querySelector('.tasks');
    const userOptionsList = document.querySelector('.user-options__list');
    const userOptions = document.querySelectorAll('.user-options__option');
    const editTitle = document.querySelector('.edit-task__input--title');
    const editInfo = document.querySelector('.edit-task__input--info');
    const editDate = document.querySelector('.edit-task__input--date');
    const editTaskForm = document.querySelector('.edit-task');
    const editTaskError = document.querySelector('.edit-task__error');
    const addError = document.querySelector('.task-form__error');
    const addTitle = document.querySelector('.task-form__input--title');
    const addAdditionalInfo = document.querySelector('.task-form__input--info');
    const addDate = document.querySelector('.task-form__input--date');

    const normalTasks = [];
    const importantTasks = [];
    const doneTasks = [];
    let currentlyEdited;
    let stars;
    let allTasks = [];
    let active;
    let id = 0;

    const moveToDone = function(id) {
        const checked = allTasks.findIndex(tsk => tsk.id === Number(id));
        if (allTasks[checked].importance === 'normal') {
            const checkedNormal = normalTasks.findIndex(tsk => tsk === allTasks[checked]);
            normalTasks.splice(checkedNormal,1);
        } else {
            const checkedImportant = importantTasks.findIndex(tsk => tsk === allTasks[checked]);
            importantTasks.splice(checkedImportant,1);
        }
        const [moved] = allTasks.splice(checked,1);
        doneTasks.push(moved);
        renderData(active = allTasks);
    }

    
    const doneTasksHandler = function() {
        const checkIcons = document.querySelectorAll('.task__icon--check');
        checkIcons.forEach(icon => icon.addEventListener('click', (e) => {
            const target = e.target.closest('.task').dataset.id;
            if (active === doneTasks) return
            moveToDone(target);
        }))
    }
    
    const changeImportance = function(id) {
        const clicked = allTasks.findIndex(tsk => tsk.id === Number(id));
        const changed = allTasks[clicked];
        changed.importance === 'normal' ? changed.importance = 'important' : changed.importance = 'normal';
        if (changed.importance === 'normal') {
            const idx = importantTasks.findIndex(tsk => tsk === allTasks[clicked]);
            importantTasks.splice(idx,1);
            normalTasks.push(changed);
        } else {
            const idx = normalTasks.findIndex(tsk => tsk === allTasks[clicked]);
            normalTasks.splice(idx,1);
            importantTasks.push(changed);
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
                        <i class="fa-solid fa-pen-to-square task__icon task__icon--edit"></i>
                        </div>
                        <div class="task__btn-close">
                        <i class="fa-solid fa-check task__icon task__icon--check"></i>
                        </div>
                        </div>
                        </div>`
                        tasksContainer.insertAdjacentHTML('beforeend', div);
                    })
                    stars = [...document.querySelectorAll('.task__star')];
                    importanceHandler();
                    doneTasksHandler();
                    editTaskHandler();
                }
                
                const addClickedBtnStyles = function(target) {
                    userOptions.forEach(option => option.classList.remove('user-options__option--active'));
        target.classList.add('user-options__option--active');
    }
    
    const checkAddInputs = function() {
        const checked = [...document.querySelectorAll('.task-form__radio')].find(radio => radio.checked).id;
        if (addDate.value === '' || addTitle.value === '' || addAdditionalInfo.value === '') {
            addError.classList.remove('hidden');
            return
        }
        addError.classList.add('hidden');
        popupAdd.classList.add('hidden');
        addData(addTitle.value, addAdditionalInfo.value, addDate.value, checked);
        renderData(allTasks);
        addTitle.value = '';
        addAdditionalInfo.value = '';
        addDate.value = ''; 
    }

    const editTask = function() {
        const newTitle = editTitle.value;
        const newInfo = editInfo.value;
        const newDate = editDate.value;
        currentlyEdited.title = newTitle;
        currentlyEdited.info = newInfo;
        currentlyEdited.date = newDate;
        renderData(active);
    }

    const checkEditInputs = function() {
        if (editDate.value === '' || editInfo.value === '', editTitle.value === '') return editTaskError.classList.remove('hidden')
        editTaskError.classList.add('hidden');
        popupEdit.classList.add('hidden');
        editTask();
    }


    const getEditedTask = function(id) {
        const clicked = allTasks.findIndex(tsk => tsk.id === Number(id));
        const data = allTasks[clicked];
        currentlyEdited = data;
        return data
    }

    const renderPreviousValues = function(target) {
        const data = getEditedTask(target);
        editTitle.value = data.title;
        editInfo.value = data.info;
        editDate.value = data.date;
    }

    const showTaskData = function(target) {
        renderPreviousValues(target);
        popupEdit.classList.remove('hidden');
    }

    const editTaskHandler = function() {
        const editIcons = document.querySelectorAll('.task__icon--edit');
        editIcons.forEach(icon => icon.addEventListener('click', (e) => {
            const target = e.target.closest('.task').dataset.id;
            showTaskData(target);
        }))
    }

    editTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        checkEditInputs();
    })
    
    plusBtn.addEventListener('click', () => {
        popupAdd.classList.remove('hidden');
    });
    
    popupAdd.addEventListener('click', (e) => {
        const {value} = e.target.classList;
        value === 'popup popup--add' ? popupAdd.classList.add('hidden') : '';
    });

    popupEdit.addEventListener('click', (e) => {
        const {value} = e.target.classList;
        value === 'popup popup--edit' ? popupEdit.classList.add('hidden') : '';
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        checkAddInputs();
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
        })();