# TODO List with Web Storage API

[view demo](https://bayirdan.github.io/todo-list/)

---

**To Do List, yapılacakları not etmek için kullanılan, basit ama kullanışlı bir uygulamadır. Hadi bir To Do List uygulaması yapalım.**

- İlk olarak HTML yapısı ile başlayalım

```
<form id="my-form">
  <input
    type="text"
    name=""
    id="input-text"
    placeholder="write something ..."
  />
  <button>
    <i class="fas fa-plus"></i>
  </button>
</form>

<ul id="list"></ul>
```

İçerisinde, girilen text değerinin almak için bir input, submit etmek için de button bulunan bir form yapısı oluşturuldu. Sonrasında da yapılacakların listeleneceği bir ul yapısı oluşturuldu.

- İstenilen özelliklerde bir görsel düzenlemeden sonra script yapısı ile devam edelim.

```
const myForm = document.querySelector("#my-form");
const myList = document.querySelector("#list");
const myInput = document.querySelector("input[type=text]");
```

Form için, yapılacakların listeleneceği yapı için ve eklenecek görev için değişkenler tanımlandı.

```
const tasks = JSON.parse(localStorage.getItem("items")) || [];
if (tasks.length > 0) {
  tasks.forEach((task) => {
    addList(task);
  });
}
```

Görevlerin kayıt altında tutulacağı bir array oluşturuldu, önceden eklenen görevlerin olma durumu için de LocalStorage kontrol edildi. Eğer önceden eklenen görevler varsa array o görevlere göre belirlendi, yoksa da boş array olarak belirlendi.

```
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
  myInput.value = "";
  addList(task);
});
```

Form için 'submit' eventListener'i eklendi, gelen text değeri boş ise geri return edildi. İçerisinde id, görev ve check edilme durumunun tutulacağı bir obje oluşturuldu, oluşturulan obje tasks array'ine push edildi, input temizlendi ve görev, listeye eklenmek için `addList()` fonksiyonuna gönderildi.

```
function addList(task) {
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
    myList.append(item);
}
```

Görevin check edilme durumu aslında ilk ekleme için değil de sonradan check edilme durumu için eklendi.

Yapılacakların listeneceği ul yapısı için, li elementi oluşturuldu. Oluşturulan li elementine, check ve delete işlemleri için data-key değeri eklendi. data-key değeri de her görevde oluşturulan, benzersiz bir id olan `Date.now()`

li yapısına button ve p elementleri eklendi, gerekli değerler dinamik olarak verildi.

Son olarak oluşturulan yapı, ul yapısına eklendi.

```
myList.addEventListener("click", (e) => {
  const taskId = e.target.parentElement.dataset.key;

  if (e.target.classList.contains("my-checkbox")) {
    taskCheck(taskId);
  }

  if (e.target.classList.contains("delete")) {
    taskDelete(taskId);
  }
});
```

e.target yardımı ile delete ve check etme işlemi aynı fonksiyonda kullanıldı.

Hangi göreve tıklandığına e.target ile ulaşıldı, o görevin data-key'i, array içerisindeki arama için kullanılmak üzere taskId değişkenine atandı.

Tıklanma durumuna göre delete ve check fonksiyonları çalıştırıldı.

Burada değineceğim bir diğer konu, delete butonu içerisinde `<i>` class'ı bulunduğu için, her çöp kutusu simgesi tıklandığında butonun değil de `<i>` class'ının dönmesi. Bu durumun engellenmesi için css'de `<i>` class'ına `pointer-events: none` özelliği eklendi, böylelikle click event'i `<i>` için değil buton için çalışmış oldu.

```
function taskCheck(taskId) {
  taskIndex = tasks.findIndex((task) => task.id === taskId);
  tasks[taskIndex].done = !tasks[taskIndex].done;
  addList(tasks[taskIndex]);
}
```

taskId ile bulunan index değerine ait görev, tekrar `addList()` fonksiyonuna gönderildi. `addList()` fonksiyonunda check güncellemesi için bir değişiklik yapıldı.

```
const checkItem = document.querySelector(`[data-key='${task.id}']`);

if (checkItem) {
    myList.replaceChild(item, checkItem);
  } else {
    myList.append(item);
  }
```

`addList()` fonksiyonuna eklenen `checkItem` değeri ile, daha önceden eklenmiş görevin kontrolü yapıldı ve eğer ki varsa yeni görev tekrardan eklenmek yerine eski görevle değiştirildi `myList.replaceChild(item, checkItem)`

```
function taskDelete(taskId) {
  taskIndex = tasks.findIndex((task) => task.id === taskId);
  tasks.splice(taskIndex, 1);
  myList.children[taskIndex].remove();
}
```

taskId ile bulunan index değerine ait görev `splice()` fonksiyonu ile silindi.

```
function localUpdate(task) {
  localStorage.setItem("items", JSON.stringify(task));
}
```

Local Storage işlemleri için ayrı bir fonksiyon oluşturuldu, her add, check ve delete işlemlerinden sonra bu fonksiyon çalıştırıldı ve Local Storage güncellendi.
