window.addEventListener('DOMContentLoaded', () => {

    for (let i = 0; i < localStorage.length; i++) {
        var keyName = localStorage.key(i);
        var value = localStorage.getItem(keyName);
        AddTasks(value);
    }

    var filter = document.getElementById('filter');
    if (filter) filter.addEventListener('change', applyFilter);
    applyFilter();


    var inputTasks = document.getElementById('inputTasks');
    if (inputTasks) {
        inputTasks.addEventListener('keydown', function(onClickEnter) {
            if (onClickEnter.key === 'Enter') {
                onClickEnter.preventDefault();
                AddTasks();
            }
        });
    }


    var area = document.getElementById('areaTasks');
    if (area) {
        area.addEventListener('change', function(task) {
            var target = task.target;
            if (target.type === 'checkbox') {
                target.id = target.checked ? 'complete' : 'incomplete';
                applyFilter();
            }
        });
    }
});



function AddTasks(text) {
    var inputTasks = document.getElementById("inputTasks");
    var inputText = inputTasks && typeof inputTasks.value === "string" ? inputTasks.value.trim() : "";
    var storeText = text != null ? String(text).trim() : "";

    var content = storeText !== "" ? storeText : inputText;

    if (document.getElementById('elementNullValue')) {
        document.getElementById('elementNullValue').remove();
    };

    if (DetectError(content, inputTasks, inputText)) {
        return;
    };

    var element = document.createElement("div");
    element.innerHTML = `
        <div class="task bg-gray-100 rounded-md px-8 py-2 my-2 flex items-start justify-between gap-4 container">
            <input id="incomplete" type="checkbox" class="self-center"/>
            <p class="self-center">${content}</p>
            <div class="flex gap-4 self-center">
                <a onclick="Edit('${content}')" class="self-center bg-green-500 rounded-md w-12 text-center p-2 cursor-pointer">Edit</a>
                <a onclick="Del('${content}')" class="self-center bg-red-500 rounded-md w-12 text-center p-2 cursor-pointer">Del</a>
                <div class="flex flex-col">
                    <a class="text-xl cursor-pointer">&#8613;</a>
                    <a class="text-xl cursor-pointer">&#8615;</a>
                </div>
            </div>
        </div>
    `;
    document.getElementById("areaTasks").appendChild(element);

    if (inputText !== "") {
        var key = Date.now().toString(); // timestamp
        localStorage.setItem(key, content);
        inputTasks.value = "";
    };

    updateTaskCount();
    applyFilter();
};


function Edit(content) {
    let foundKey = null;
    for (let i = 0; i < localStorage.length; i++) {
        var val = localStorage.getItem(localStorage.key(i));
        if (val && val.trim() === content.trim()) {
            foundKey = localStorage.key(i);
            content = val;
            break;
        }
    }

    var newValue = prompt('Modifier la tâche:', content).trim();
    if (newValue === '') {
        alert('Erreur: la valeur ne peut pas être vide');
        return;
    }

    for (let i = 0; i < localStorage.length; i++) {
        var val = localStorage.getItem(localStorage.key(i));
        if (val && val.trim() === newValue && localStorage.key(i) !== foundKey) {
            alert('Erreur: il existe déjà une tâche nommée ainsi');
            return;
        }
    }

    if (foundKey) {
        localStorage.setItem(foundKey, newValue);
    }

    var tasks = document.querySelectorAll('#areaTasks .task');
    for (var task of tasks) {
        var p = task.querySelector('p');
        if (p && p.textContent.trim() === content.trim()) {
            p.textContent = newValue;
            break;
        }
    }
}


function Del(content) {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem(localStorage.key(i)) === content) {
            localStorage.removeItem(localStorage.key(i));
            break;
        }
    }

    var tasks = document.querySelectorAll('#areaTasks .task');
    for (var i of tasks) {
        var p = i.querySelector('p');
        if (p && p.textContent.trim() === String(content).trim()) {
            i.remove();
            break;
        }
    }

    updateTaskCount();
}



function updateTaskCount() {
    var container = document.getElementById('areaTasks');
    var count = container ? container.querySelectorAll('.task').length : 0;
    var element = document.getElementById('taskCount');
    if (element) element.textContent = `Number of tasks: ${count}`;
}



function DetectError(content, inputTasks, inputText) {
    if (content === "") {
        var elementNullValue = document.createElement("div");
        elementNullValue.innerHTML = `<p id="elementNullValue" class="text-red-500 animate-bounce">Erreur: veuillez entrer une valeur</p>`;
        inputTasks.value = "";
        return (document.getElementById("nullValue").appendChild(elementNullValue));
    }
    
    else if (inputText !== "") {
        var inStorage = false;
        for (let i=0; i < localStorage.length; i++) {
            var duplicate = localStorage.getItem(localStorage.key(i));
            if (duplicate && duplicate.trim() === content) {
                inStorage = true;
                break;
            };
        };

        if (inStorage) {
            var elementNullValue = document.createElement("div");
            elementNullValue.innerHTML = `<p id="elementNullValue" class="text-red-500 animate-bounce">Erreur: il existe déjà une taches nommée ainsi</p>`;
            inputTasks.value = "";
            return (document.getElementById("nullValue").appendChild(elementNullValue));
        };
    };
}



function Reboot() {
    localStorage.clear();
    if (document.getElementById("areaTasks")) {
        document.getElementById("areaTasks").innerHTML = "";
    };
    updateTaskCount();
};




function applyFilter() {
    var filter = document.getElementById('filter');
    var value = filter ? filter.value : 'all';
    var tasks = document.querySelectorAll('#areaTasks .task');
    tasks.forEach(function(t) {
        var checkbox = t.querySelector('input[type="checkbox"]');
        var status = 'incomplete';
        if (checkbox) {
            status = checkbox.id ? checkbox.id : (checkbox.checked ? 'complete' : 'incomplete');
        }
        if (value === 'all') {
            t.style.display = '';
        } else if (value === 'completed') {
            t.style.display = (status === 'complete') ? '' : 'none';
        } else if (value === 'incomplete') {
            t.style.display = (status === 'incomplete') ? '' : 'none';
        }
    });
}
