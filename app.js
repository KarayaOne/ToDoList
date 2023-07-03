//Variables
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const groceryContainer = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');
let IdCounter = 0;

//edit option
let editElement;
let editFlag = false;
let editID = 0;


//******** EVENT LISTENERS *********
window.onload = function () {
    loadLocalStorage();
}
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearTasks);
list.addEventListener("click", handleTaskActions);

//********** FUNCTIONS **********
function handleTaskActions(e) {
    const deleteBtn = e.target.closest(".delete-btn");
    const editBtn = e.target.closest(".edit-btn");
    const text = e.target.closest(".grocery-item .title");

    if (deleteBtn) {
        const item = deleteBtn.closest(".grocery-item");
        list.removeChild(item);
        displayAlert("Task removed", "red");
        checkItemsCount();
        updateLocalStorage();
    }
    else if(editBtn) {
        editFlag=true;
        const item = editBtn.closest('.grocery-item');
        editElement=item;
        grocery.value = editElement.querySelector('.title').textContent;
        submitBtn.textContent="Edit";
    }
    else if (text) {
        text.classList.toggle("crossed-out");
        updateLocalStorage();
    }
}
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;

    if(value && !editFlag) {
        const listItem = document.createElement("article");
        listItem.classList.add("grocery-item");
        const id = generateID(); // Generate a new ID
        listItem.setAttribute("data-id", id); // Assign the new ID to the attribute
        listItem.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
            <button type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>`;

        list.appendChild(listItem);
        displayAlert("Item Added Successfully", "green");
        groceryContainer.classList.add('show-container');
        grocery.value = "";
        updateLocalStorage();
    }
    else if (value && editFlag) {
        editElement.querySelector('.title').textContent=value;
        displayAlert("Item edited successfully", "green");
        submitBtn.textContent="Submit";
        editFlag=false;
        grocery.value="";
        updateLocalStorage();
    }
    else {
        displayAlert("Enter a value", "red");
    }
}
function displayAlert (text, color) {
    alert.innerText = text;
    alert.style.backgroundColor = color;
    alert.classList.add('show-alert');
        setTimeout(() => {
            alert.classList.remove('show-alert');
          }, 800);
}
function clearTasks() {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
      // Reset the ID counter
      resetID();
      //remove classes and display alert
      displayAlert("All task removed", "red");
      groceryContainer.classList.remove('show-container');
      localStorage.clear();
}

function checkItemsCount() {
    const items = document.querySelectorAll('.grocery-item');
    items.length === 0 ? groceryContainer.classList.remove('show-container') :
    items.length !== 0 ? groceryContainer.classList.add('show-container') : undefined;
}


function generateID () {
    IdCounter++;
    return IdCounter;
}
function resetID() {
    IdCounter = 0;
    return IdCounter;
}

function updateLocalStorage() {
    const listHTML = list.innerHTML;
    localStorage.setItem('groceryList', listHTML);
    localStorage.setItem('countVal', IdCounter);
}
  
function loadLocalStorage() {
    const savedListHTML = localStorage.getItem('groceryList');
    IdCounter = localStorage.getItem('countVal');
  
    if (savedListHTML) {
      list.innerHTML = savedListHTML;
      checkItemsCount();
    }
}