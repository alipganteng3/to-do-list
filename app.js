const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const tasklist = document.getElementById("task-list");
const searchInput = document.getElementById("search-input"); // input search

let tasks = [];

// ====== 🔹 Fungsi untuk menyimpan ke localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ====== 🔹 Fungsi untuk memuat dari localStorage
function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}

// ====== 🔹 Fungsi renderTasks dengan parameter opsional filter
function renderTasks(filter = "") {
  tasklist.innerHTML = "";

  tasks.forEach((task, index) => {
    // Jika filter aktif dan tidak cocok, lewati
    if (filter && !task.text.toLowerCase().includes(filter.toLowerCase())) {
      return;
    }

    const li = document.createElement("li");

    // Elemen teks tugas
    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.style.display = "block";
    li.appendChild(taskText);

    // Tanggal pembuatan
    const taskDate = document.createElement("small");
    const createdDate = new Date(task.createdAt);
    taskDate.textContent = `${createdDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
    taskDate.style.display = "block";
    taskDate.style.fontSize = "0.8em";
    taskDate.style.color = "gray";
    li.appendChild(taskDate);

    // Tombol edit
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    li.appendChild(editBtn);

    // Tombol hapus
    const delBtn = document.createElement("button");
    delBtn.textContent = "Hapus";
    delBtn.classList.add("delete-btn");
    li.appendChild(delBtn);

    // ====== 🔸 Event tombol edit
    editBtn.onclick = () => {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = task.text;
      editInput.style.flex = "1";

      li.insertBefore(editInput, taskText);
      li.removeChild(taskText);
      li.removeChild(taskDate); // sembunyikan tanggal saat edit

      editBtn.textContent = "Simpan";
      editInput.focus();

      editBtn.onclick = () => {
        const updatedTask = editInput.value.trim();
        if (updatedTask !== "") {
          tasks[index].text = updatedTask;
          saveTasks(); // simpan perubahan ke localStorage
          renderTasks(searchInput.value); // render ulang
        } else {
          alert("Tugas tidak boleh kosong!");
          editInput.focus();
        }
      };
    };

    // ====== 🔸 Event tombol hapus
    delBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks(); // update localStorage
      renderTasks(searchInput.value); // render ulang
    };

    tasklist.appendChild(li);
  });
}

// ====== 🔹 Event tambah tugas
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const newTaskText = input.value.trim();
  if (newTaskText !== "") {
    const newTask = {
      text: newTaskText,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveTasks(); // simpan ke localStorage
    renderTasks(searchInput.value); // render dengan filter aktif
    input.value = "";
    input.focus();
  }
});

// ====== 🔹 Event pencarian
searchInput.addEventListener("input", function () {
  const keyword = searchInput.value.trim();
  renderTasks(keyword);
});

// ====== 🔹 Render awal
loadTasks(); // ambil dari localStorage
renderTasks(); // tampilkan ke layar
