class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.getElementById("book-list");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td class="btn-delete-style"><a class="button-delete" href="#" >X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(element) {
    if (element.classList.contains("button-delete")) {
      element.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, classType) {
    const div = document.createElement("div");
    div.className = `alert ${classType}`;
    div.appendChild(document.createTextNode(message));
    const bookContainer = document.querySelector(".book-app-container");
    const form = document.querySelector(".book-form");
    bookContainer.insertBefore(div, form);
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  static clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static deleteBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

document.addEventListener("DOMContentLoaded", UI.displayBooks);

const form = document.querySelector(".book-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill all the inputs!!!", "danger");
    // alert("please fill al the inputs");
  } else {
    const book = new Book(title, author, isbn);
    UI.addBookToList(book);
    Store.addBook(book);
    UI.showAlert("Book Added", "succes");
    UI.clearFields();
  }
});

const bookList = document.getElementById("book-list");

bookList.addEventListener("click", (e) => {
  UI.deleteBook(e.target);
  Store.deleteBook(e.target.parentElement.previousElementSibling.textContent);
  UI.showAlert("Book Deleted", "deleted");
});
