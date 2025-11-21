window.addEventListener('DOMContentLoaded', () => {

    for (let i = 0; i < localStorage.length; i++) {
        var keyName = localStorage.key(i);
        var value = localStorage.getItem(keyName);
        AddTasks(value);
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

    if (content === "") {
        var elementNullValue = document.createElement("div");
        elementNullValue.innerHTML = `<p id="elementNullValue" class="text-red-500">Erreur: veuillez entrer une valeur</p>`;
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
            elementNullValue.innerHTML = `<p id="elementNullValue" class="text-red-500">Erreur: il existe déjà une taches nommée ainsi</p>`;
            inputTasks.value = "";
            return (document.getElementById("nullValue").appendChild(elementNullValue));
        };
    };

    var element = document.createElement("div");
    element.innerHTML = `
        <div class="task bg-gray-100 rounded-md px-4 py-2 my-2 flex gap-4">
            <input type="checkbox" class="w-4"/>
            <p class="flex items-center">${content}</p>
            <a onclick="Edit()" class="bg-green-500 rounded-md w-12 text-center p-2 cursor-pointer">Edit</a>
            <a onclick="Del(this, '${encodeURIComponent(content)}')" class="bg-red-500 rounded-md w-12 text-center p-2 cursor-pointer">Del</a>
        </div>
    `;
    document.getElementById("areaTasks").appendChild(element);

    if (inputText !== "") {
        var key = Date.now().toString(); // timestamp
        localStorage.setItem(key, content);
        inputTasks.value = "";
    };
};  

function Edit() {

}

function Del(content) {
    var target = decodeURIComponent(content);
    console.log(target);
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem(localStorage.key(i)) === target) {
            localStorage.removeItem(localStorage.key(i));
            break;
        }
    }

    var inner = content.closest('.task');
    if ( inner && inner.parentElement) inner.parentElement.remove();
}

function Reboot() {
    localStorage.clear();
    if (document.getElementById("areaTasks")) {
        document.getElementById("areaTasks").innerHTML = "";
    };
};
