// (() => {
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
const onloadActive = document.querySelector('.user-options__option--first');
const sortBtn = document.querySelector('.sort-tasks');

const normalTasks = [];
const importantTasks = [];
let doneTasks = [];
let newOrder = 'ascending';
let movedIds = [];
let currentlyEdited;
let stars;
let allTasks = [];
let active = allTasks;
let id;

const moveToDone = function (id) {
    const checked = allTasks.findIndex(tsk => tsk.id === Number(id));
    if (allTasks[checked].importance === 'normal') {
        const checkedNormal = normalTasks.findIndex(tsk => tsk === allTasks[checked]);
        normalTasks.splice(checkedNormal, 1);
    } else {
        const checkedImportant = importantTasks.findIndex(tsk => tsk === allTasks[checked]);
        importantTasks.splice(checkedImportant, 1);
    }
    const [moved] = allTasks.splice(checked, 1);
    movedIds.push(moved.id);
    doneTasks.push(moved);
    removeFromLocalStorage(moved);
    saveMovedIds();
    saveMovedTasks();
    renderData(active);
}


const doneTasksHandler = function () {
    const checkIcons = document.querySelectorAll('.task__icon--check');
    checkIcons.forEach(icon => icon.addEventListener('click', (e) => {
        const target = e.target.closest('.task').dataset.id;
        if (active === doneTasks) return
        moveToDone(target);
    }))
}

const changeImportance = function (id) {
    const clicked = allTasks.findIndex(tsk => tsk.id === Number(id));
    const changed = allTasks[clicked];
    changed.importance === 'normal' ? changed.importance = 'important' : changed.importance = 'normal';
    if (changed.importance === 'normal') {
        const idx = importantTasks.findIndex(tsk => tsk.id === allTasks[clicked].id);
        importantTasks.splice(idx, 1);
        normalTasks.push(changed);
    } else {
        const idx = normalTasks.findIndex(tsk => tsk.id === allTasks[clicked].id);
        normalTasks.splice(idx, 1);
        importantTasks.push(changed);
    }
    renderData(active);
}

const importanceHandler = function () {
    stars = [...document.querySelectorAll('.task__star')];
    stars.forEach(star => star.addEventListener('click', (e) => {
        const target = e.target.closest('.task').dataset.id;
        changeImportance(target);
    }))
}

const addData = function (title, info, date, importance) {
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
    addClickedBtnStyles(onloadActive);
}

const renderData = function (data) {
    tasksContainer.innerHTML = '';
    data.forEach((obj) => {
        const div = `
            <div class="task" data-id='${obj.id}'>
                <div class="task__txt-wrap">
                    <h2 class="task__heading">
                        ${obj.title}
                    </h2>
                    <div class="task__info">
                        <p task__info-txt>
                            ${obj.info}
                        </p>
                    </div>
                    <div class="task__date">
                        <i class="fa-solid fa-calendar"></i>
                        ${obj.date}
                    </div>
                </div>
                <i class="fa-solid fa-star task__star ${obj.importance === 'important' ? 'task__star--important' : ''}"></i>
                ${data === doneTasks ? 
                `<div class="task__btns">
                    <div class="task__btn-del">
                        <i class="fa-solid fa-xmark task__icon task__icon--delete"></i>
                    </div>
                 </div>` : 
                `<div class="task__btns">
                    <div class="task__btn-edit">
                        <i class="fa-solid fa-pen-to-square task__icon task__icon--edit"></i>
                    </div>
                    <div class="task__btn-close">
                        <i class="fa-solid fa-check task__icon task__icon--check"></i>
                    </div>
                </div>`}
            </div>`
        tasksContainer.insertAdjacentHTML('beforeend', div);
    })
    menageHandlers();
    getSavedMovedTasks();
    if (!localStorage.getItem('id')) setLocalStorage();
    updateLocalStorage();
}

const menageHandlers = function() {
    importanceHandler();
    doneTasksHandler();
    editTaskHandler();
    deleteTaskHandler();
}

const addClickedBtnStyles = function (target) {
    userOptions.forEach(option => option.classList.remove('user-options__option--active'));
    target.classList.add('user-options__option--active');
}

const checkAddInputs = function () {
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

const editTask = function () {
    const newTitle = editTitle.value;
    const newInfo = editInfo.value;
    const newDate = editDate.value;
    currentlyEdited.title = newTitle;
    currentlyEdited.info = newInfo;
    currentlyEdited.date = newDate;
    renderData(active);
}

const checkEditInputs = function () {
    if (editDate.value === '' || editInfo.value === '', editTitle.value === '') return editTaskError.classList.remove('hidden')
    editTaskError.classList.add('hidden');
    popupEdit.classList.add('hidden');
    editTask();
}


const getEditedTask = function (id) {
    const clicked = allTasks.findIndex(tsk => tsk.id === Number(id));
    const data = allTasks[clicked];
    currentlyEdited = data;
    return data
}

const renderPreviousValues = function (target) {
    const data = getEditedTask(target);
    editTitle.value = data.title;
    editInfo.value = data.info;
    editDate.value = data.date;
}

const showTaskData = function (target) {
    renderPreviousValues(target);
    popupEdit.classList.remove('hidden');
}

const editTaskHandler = function () {
    const editIcons = document.querySelectorAll('.task__icon--edit');
    editIcons.forEach(icon => icon.addEventListener('click', (e) => {
        const target = e.target.closest('.task').dataset.id;
        showTaskData(target);
    }))
}

const sortTasksDescending = function () {
    const order = active.sort((a, b) => new Date(b.date) - new Date(a.date));
    renderData(order);
    newOrder = 'ascending';
}

const sortTasksAscending = function () {
    const order = active.sort((a, b) => new Date(a.date) - new Date(b.date));
    renderData(order);
    newOrder = 'descending';
}

const switchSorting = function () {
    newOrder === 'ascending' ? sortTasksAscending() : sortTasksDescending();
}

const deleteTaskHandler = function() {
    const deleteBtns = document.querySelectorAll('.task__btn-del');
    deleteBtns.forEach(btn => btn.addEventListener('click', (e) => {
    const target = e.target.closest('.task').dataset.id;
    const clicked = doneTasks.findIndex(tsk => tsk.id === +target);
    localStorage.removeItem(`moved${doneTasks[clicked].id}`);
    doneTasks.splice(clicked,1);
    renderData(doneTasks)
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
    const {
        value
    } = e.target.classList;
    value === 'popup popup--add' ? popupAdd.classList.add('hidden') : '';
});

popupEdit.addEventListener('click', (e) => {
    const {
        value
    } = e.target.classList;
    value === 'popup popup--edit' ? popupEdit.classList.add('hidden') : '';
});

sortBtn.addEventListener('click', switchSorting);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    checkAddInputs();
});

userOptionsList.addEventListener('click', (e) => {
    onloadActive.classList.remove('user-options__option--first');
    const target = e.target.closest('li');
    if (!target) return
    const {
        arr
    } = target.dataset;
    addClickedBtnStyles(target);
    switch (arr) {
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
    switchSorting(active);
})

const renderLocalStorage = function () {
    if (localStorage.length === 0) return
    for (let i = 0; i < localStorage.length - 1 + movedIds.length; i++) {
        if (localStorage.getItem(i) === null) continue
        allTasks.push(JSON.parse(localStorage.getItem(i)));
        JSON.parse(localStorage.getItem(i)).importance === 'normal' ? normalTasks.push(JSON.parse(localStorage.getItem(i))) : importantTasks.push(JSON.parse(localStorage.getItem(i)));
    }
    renderData(active);
}

const removeFromLocalStorage = function (removed) {
    const {
        id
    } = removed;
    localStorage.removeItem(id);
}

const saveMovedTasks = function() {
    doneTasks.forEach(tsk => {
        localStorage.setItem(`moved${tsk.id}`, JSON.stringify(tsk));
    })
}

const getSavedMovedTasks = function() {
    doneTasks = [];
    for (let i = 0; i < localStorage.length - 1; i++) {
        if (JSON.parse(localStorage.getItem(`moved${i}`)) === null) continue
        doneTasks.push(JSON.parse(localStorage.getItem(`moved${i}`)));
    }
}

const saveMovedIds = function () {
    localStorage.setItem('movedIds', JSON.stringify(movedIds));
}

const getSavedMovedIds = function () {
    localStorage.getItem('movedIds') === null ? movedIds = [] : movedIds = JSON.parse(localStorage.getItem('movedIds'));
}

const getLocalStorageId = function () {
    localStorage.getItem('id') === null ? id = 0 : id = +localStorage.getItem('id');
}

const updateLocalStorage = function () {
    allTasks.forEach(tsk => localStorage.setItem(`${tsk.id}`, JSON.stringify(tsk)));
    localStorage.setItem(`id`, JSON.stringify(id));
}

const setLocalStorage = function () {
    allTasks.forEach(task => localStorage.setItem(`${task.id}`, JSON.stringify(task)));
}

const init = function () {
    addClickedBtnStyles(onloadActive);
    getLocalStorageId();
    getSavedMovedIds();
    renderLocalStorage();
    sortTasksAscending();
}

init();
// })();