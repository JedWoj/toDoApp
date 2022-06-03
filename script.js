(()=> {    
    const plusBtn = document.querySelector('.create-task'); 
    const popup = document.querySelector('.popup');
    const form = document.querySelector('.task-form');
    const normalTasks = [];
    const importantTasks = [];
    const allTasks = [...normalTasks, ...importantTasks];

    const addData = function(title, info, date, importance) {
        const obj = {
            title,
            info,
            date,
            importance
        }
        importance === 'important' ? importantTasks.push(obj) : normalTasks.push(obj);
    }

    const renderData = function() {

    }

    const checkInputs = function() {
        const error = document.querySelector('.task-form__error');
        let title = document.querySelector('.task-form__input--title').value;
        let additionalInfo = document.querySelector('.task-form__input--info').value;
        let date = document.querySelector('.task-form__input--date').value;
        const importance = [...document.querySelectorAll('.task-form__radio')].find(radio => radio.checked).id;
        if (date === '' || title === '' || additionalInfo === '') {
            error.classList.remove('hidden');
            return
        }
        error.classList.add('hidden');
        popup.classList.add('hidden');
        addData(title, additionalInfo, date, importance);
        renderData(); 
    }

    plusBtn.addEventListener('click', () => {
        popup.classList.remove('hidden');
    });
    
    popup.addEventListener('click', function(e) {
        const {value} = e.target.classList;
        if (value === 'popup') {
            popup.classList.add('hidden');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        checkInputs();
    });
})();