// setup of html elements
const form = document.getElementById("form");
const add = document.querySelector(".add");
const list = document.querySelector(".list");
const clear = document.querySelector(".clear");
const alert = document.querySelector(".alert");
const item = document.querySelector(".item");
// setting up default variables
let editFlag = false;
let editId = "";
let editElement;
// set back to default function
const setDefault = () => {
    editFlag = false;
    editId = "";
    item.value = "";
    add.innerHTML = "Add";
};
// displaying items when windows loads
window.addEventListener("DOMContentLoaded", setUpItems);

// setUpItems Function
function setUpItems() {
    const items = getLocalStorage();

    if (items.length > 0) {
        items.forEach((item) => {
            createItem(item.id, item.value);
        });
        clear.classList.add("active");
    }
}
// clear function
const clearData = () => {
    const grocery = document.querySelectorAll(".grocery-item");
    if (grocery.length > 0) {
        grocery.forEach((item) => {
            list.removeChild(item);
        });
    }
    clear.classList.remove("active");
    alertMessage("Data cleared successfully!!", "danger");
    setDefault();
    localStorage.removeItem("list");
};

// adding event listeners
form.addEventListener("submit", addItem);
clear.addEventListener("click", clearData);
// getting the value of localstorage
const getLocalStorage = () => {
    return localStorage.getItem("list") ?
        JSON.parse(localStorage.getItem("list")) :
        [];
};
// adding to the local storage
const addToLocalStorage = (id, value) => {
    const grocery = { id, value };
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
};
// deleteing items form localstorage
const deleteFromLocalStorage = (id) => {
    let items = getLocalStorage();

    items = items.filter((item) => {
        if (item.id != id) {
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));
};
// editing localStorageValue
const editLocalStorage = (id, value) => {
    let items = getLocalStorage();

    items = items.map((item) => {
        if (item.id == id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
};
// additem function for adding items
function addItem(e) {
    e.preventDefault();
    const id = new Date().getTime();
    const value = item.value;
    if (value && !editFlag) {
        createItem(id, value);
        alertMessage("Value added successfully!!", "success");
        setDefault();
        addToLocalStorage(id, value);
    }
    if (value && editFlag) {
        editElement.innerHTML = value;
        alertMessage("Value edited successfully!!", "success");
        editLocalStorage(editId, value);
        setDefault();
    }
    if (!value) {
        alertMessage("Please enter an item to add!!", "danger");
    }
}
// delete funciton
const deleteItem = (e) => {
    const element = e.currentTarget.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length === 0) {
        clear.classList.remove("active");
    }
    setDefault();
    deleteFromLocalStorage(id);
    alertMessage("Item deleted successfully!!", "danger");
};
// edit function
const editItem = (e) => {
    const element = e.currentTarget.parentElement;
    editElement = e.currentTarget.previousElementSibling;
    editFlag = true;
    editId = element.dataset.id;
    item.value = editElement.innerHTML;
    add.innerHTML = "Edit";
};

function alertMessage(text, color) {
    alert.innerHTML = text;
    alert.classList.add(`alert-${color}`);

    setTimeout(() => {
        alert.innerHTML = "";
        alert.classList.remove(`alert-${color}`);
    }, 1000);
}
// alert function for displaying message
function createItem(id, value) {
    let element = document.createElement("div");

    element.classList.add("grocery-item");
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p>${value}</p> &numsp;
    <button class="edit" type="button">Edit</button>
    <button class="delete" type="button">Delete</button>`;

    const del = element.querySelector(".delete");
    const edit = element.querySelector(".edit");
    del.addEventListener("click", deleteItem);
    edit.addEventListener("click", editItem);
    list.appendChild(element);
    clear.classList.add("active");
}