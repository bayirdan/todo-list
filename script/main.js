const myForm = document.querySelector("#my-form");
const myList = document.querySelector("#list");
const myInput = document.querySelector("input[type=text]");

const tasks = JSON.parse(localStorage.getItem("items")) || [];
if (tasks.length > 0) {
  tasks.forEach((task) => {
    addList(task);
  });
}

// ADD TASK LISTENER
myForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = myInput.value.trim();
  if (text == null || text === "") return;
  const task = {
    id: Date.now().toString(),
    text,
    done: false,
  };
  tasks.push(task);
  localUpdate(tasks);
  myInput.value = "";
  addList(task);
});

// DELETE AND CHECKED TASK LISTENER
myList.addEventListener("click", (e) => {
  if (
    !e.target.classList.contains("my-checkbox") &
    !e.target.classList.contains("delete")
  )
    return;

  const taskId = e.target.parentElement.dataset.key;

  if (e.target.classList.contains("my-checkbox")) {
    taskCheck(taskId);
  }

  if (e.target.classList.contains("delete")) {
    taskDelete(taskId);
  }
});

// ADD TASK
function addList(task) {
  const checkItem = document.querySelector(`[data-key='${task.id}']`);

  const isChecked = task.done ? "checked" : "";

  const item = document.createElement("li");
  item.setAttribute("data-key", task.id);
  item.innerHTML = `
    <button class="my-checkbox ${isChecked}"></button>
    <p>${task.text}</p>
    <button class="delete">
      <i class="far fa-trash-alt"></i>
    </button>
    `;
  if (checkItem) {
    myList.replaceChild(item, checkItem);
  } else {
    myList.append(item);
  }
}

// CHECK TASK
function taskCheck(taskId) {
  taskIndex = tasks.findIndex((task) => task.id === taskId);
  tasks[taskIndex].done = !tasks[taskIndex].done;
  localUpdate(tasks);
  addList(tasks[taskIndex]);
}

// DELETE TASK
function taskDelete(taskId) {
  taskIndex = tasks.findIndex((task) => task.id === taskId);
  tasks.splice(taskIndex, 1);
  myList.children[taskIndex].remove();
  localUpdate(tasks);
}

// LOCALSTORAGE UPDATE

function localUpdate(task) {
  localStorage.setItem("items", JSON.stringify(task));
}
