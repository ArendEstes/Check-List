//select elements
const clear = document.querySelector(".clear");
const dateElement = document.getElementById('date');
const list = document.getElementById("list");
const input = document.getElementById("input");
let addButton = document.getElementById("addButton");

// class names
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

// show todays date
const options = {weekday : "long", month: "short", day : "numeric"};
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-us", options);

//variables
let LIST, id;

let data = localStorage.getItem("TODO"); //sets data to JSON saved on app in local storage

// if variable data has saved data uses loadList to create list and sets id # for next item
// if no data LIST array is set and id to 0
if(data){
    LIST = JSON.parse(data);
    id = LIST.length;
    loadList(LIST);
} else{
    LIST = [];
    id = 0;
}
// creates list of items in DOM from LIST array
function loadList(list){
    list.forEach(item=>{
        addToDo(item.name, item.id, item.done, item.trash);
    })
}

// clears items when clear icon is clicked
clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
})

//sets HTML for added items
function addToDo(toDo, id, done, trash){
    if(trash){ return; }
    
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item = `<li class="item">
    <i class="fa ${DONE} co" job="complete" id=${id}></i>
    <p class="text ${LINE}" id=${id}>${toDo}</p>
    <i class="fa fa-trash-o de" job="delete" id=${id}></i>
</li>`;

    const position = "beforeend";

    list.insertAdjacentHTML(position, item);
}

// uses addToDo to create HTML for new item
// adds item to LIST array
// saves new LIST data to local storage
function addItem(){
    const toDo = input.value;

    if(toDo){
        addToDo(toDo, id, false, false);
        
        LIST.push({
            name: toDo,
            id: id,
            done: false,
            trash: false
        })

        localStorage.setItem("TODO", JSON.stringify(LIST));

        id ++;
    }
    input.value = "";
}

// updates item text from input over item
// updates LIST array and local storage
function updateItem(){
    if(list.querySelector(".edit")){
        const edited = list.querySelector(".edit").value;
        const listItem = list.querySelector(".edit").parentNode;
        const editId = listItem.id;

        listItem.innerHTML = edited;
        
        LIST[editId].name = edited;

        localStorage.setItem("TODO", JSON.stringify(LIST));
        
    }
}

// adds item when user hits enter key for new items
// also updates items with enter key
document.addEventListener("keyup", function(event){
    if(event.keyCode === 13){
        addItem();
        updateItem();
    }
})

// adds item with add button
addButton.addEventListener("click", function(){
    addItem();
})

// checks and unchecks circle for complete
// lines through item if complete
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    LIST[element.id].done = LIST[element.id].done ? false: true;
}

// removes item from list when trash can clicked
function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true;
}

// removes input box from item when other area is clicked
function removeInput(){
    const deselect = list.querySelector(".edit").parentNode;
    deselect.innerHTML = LIST[deselect.id].name;
}

// creates input box to edit item when item is clicked
function createEditInput(element){
    element.innerHTML = "<input type='text' class='edit'>";
    const inputEdit = document.getElementsByClassName("edit")[0];
    inputEdit.value = LIST[element.id].name;
}


// determines what action to take during click
list.addEventListener("click", function(event){
    const element = event.target;
    const elementClass = element.classList;

    //if click is not over current input item, this removes input box
    if(!elementClass.contains("edit")){
        if(list.querySelector(".edit")){
            removeInput();
        }
    }

    // looks for clicks over complete circle, trash, and to do items
    if(elementClass.contains("co")){
        completeToDo(element);
    } else if(elementClass.contains("de")){
        removeToDo(element);
    } else if(elementClass.contains("text")){
        createEditInput(element);
    } 
    
    
    localStorage.setItem("TODO", JSON.stringify(LIST));
})