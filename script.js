const addForm = document.querySelector("#addForm");
const single = document.querySelector("#single");
const check = document.getElementById("Switch");
const editForm = document.querySelector("#editForm");
const dataWrap = document.querySelector("#dataWrap");
const taskHeads = ["name", "age", "activeStatus"];

const readFromStorage = (key = "users", dataType = "array") => {
  let data;
  try {
    data = JSON.parse(localStorage.getItem(key)) || [];
    if (!Array.isArray(data) && dataType == "array")
      throw new Error("data is not an array");
  } catch (e) {
    data = [];
  }
  return data;
};
const editFromStorage = (users, user) => {
  let index = users.findIndex((u) => u.id === user.id);
  users.splice(index, 1, user);
  writeToStorage(users);
};

const createUserObject = (addForm) => {
  let user = { id: Date.now() };
  taskHeads.forEach((head) => {
    if (head === "activeStatus") {
      if (check.checked) {
        user[head] = "active";
      } else {
        user[head] = "not active";
      }
    } else {
      user[head] = addForm.elements[head].value;
    }
  });
  return user;
};
const writeToStorage = (data, key="users") => {
    localStorage.setItem(key, JSON.stringify(data))
}
const createMyOwnEle = (eleTag, parent, txtContent = null, classes = null) => {
  const myNewElement = document.createElement(eleTag);
  if (classes) myNewElement.classList = classes;
  if (txtContent) myNewElement.innerText = txtContent;
  parent.appendChild(myNewElement);
  return myNewElement;
};
const delUser = (users, i) => {
  users.splice(i, 1);
  writeToStorage(users);
  draw(users);
};
const change = (users, i) => {
    users[i].activeStatus === "active" ? users[i].activeStatus = "not active"
    :users[i].activeStatus = "active";
  writeToStorage(users);
  draw(users);
};

const editUser = (user) => {
  writeToStorage(user, "user");
  window.location.href = "edit.html";
};
const showSingle = (user) => {
  writeToStorage(user, "item");
  window.location.href = "single.html";
};
const draw = (users) => {
  dataWrap.innerHTML = "";
  if (users.length == 0) {
    let tr = createMyOwnEle("tr", dataWrap, null, "alert alert-danger");
    let td = createMyOwnEle("td", tr, "no data found", "alert alert-danger");
    td.setAttribute("colspan", "5");
  }
  users.forEach((user, i) => {
    let tr = createMyOwnEle("tr", dataWrap);
    createMyOwnEle("td", tr, user.id);
    createMyOwnEle("td", tr, user.name);
    createMyOwnEle("td", tr, user.age);
    createMyOwnEle("td", tr, user.activeStatus);
    let td = createMyOwnEle("td", tr);
    let activeStatusBtn = createMyOwnEle(
      "button",
      td,
      "change",
      "btn btn-secondary mx-2"
    );
    activeStatusBtn.addEventListener("click", () => change(users, i));
    let editBtn = createMyOwnEle("button", td, "edit", "btn btn-warning mx-2");
    editBtn.addEventListener("click", () => editUser(users[i]));
    let showBtn = createMyOwnEle("button", td, "show", "btn btn-success mx-2");
    showBtn.addEventListener("click", () => showSingle(users[i]));
    let delBtn = createMyOwnEle("button", td, "delete", "btn btn-danger mx-2");
    delBtn.addEventListener("click", () => delUser(users, i));
  });
};
if (addForm) {
  addForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const user = createUserObject(this);
    const users = readFromStorage();
    users.push(user);
    writeToStorage(users);
    window.location.href = "index.html";
  });
  check.addEventListener("click", () => {
    check.checked ?document.getElementById("Toggle").innerText = "active"
    :  document.getElementById("Toggle").innerText = "not active";
  });
}
if (dataWrap) {
  const users = readFromStorage();
  draw(users);
}
  if (editForm) {
    const userName = document.querySelector("#userName");
    const userAge = document.querySelector("#userAge ");
    const activeToggleEdit = document.querySelector("#activeToggleEdit");
    const checkEdit = document.getElementsByClassName("check")[0];
    let user = readFromStorage("user", "object");
    let users = readFromStorage();
    users.length === 0 ?  user = {}:  userName.value = user.name;
    userAge.value = user.age;
       if (user.activeStatus === "not active") {
      checkEdit.removeAttribute("checked");
      activeToggleEdit.innerText = "not active";
    } else {
      checkEdit.setAttribute("checked", "checked");
      activeToggleEdit.innerText = "active";
    }
    checkEdit.addEventListener("click", () => {  
      checkEdit.checked ? activeToggleEdit.innerText = "active":  activeToggleEdit.innerText = "not active";
    });
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    user.name = userName.value;
    user.age = userAge.value;
    user.activeStatus = activeToggleEdit.innerText;
    editFromStorage(users, user);
    window.location.href = "index.html";
  });
}
if(single){
    const user= readFromStorage("item", "object")
    if(Array.isArray(user)) createMyOwnEle("div", single, "no data to show", "alert alert-danger")
    else createMyOwnEle("div", single, user.name, "alert alert-secondary")
}