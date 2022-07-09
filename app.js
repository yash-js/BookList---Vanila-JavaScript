// Book Class : Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class : Handle UI Tasks
class UI {
  static displayBook() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
    `;

    list.appendChild(row);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static deleteBook(ele) {
    if (ele.classList.contains("delete")) {
      ele.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
}

// Store Class : Handles Storage
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

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        return books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event : Display Books
document.addEventListener("DOMContentLoaded", UI.displayBook());

// Event : Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  // Get form Values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // Validate
  if (!title || !author || !isbn) {
    return UI.showAlert("All Fields are Required!", "danger");
  }

  // Instatiate Book
  const book = new Book(title, author, isbn);

  // Add Book to UI
  UI.addBookToList(book);

  // Add Book to store
  Store.addBook(book);

  // Show Success Message
  UI.showAlert("Book Added", "info");

  // Clear Fields
  UI.clearFields();
});

// Event : Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  // Remove From  UI
  UI.deleteBook(e.target);;
  // Remove From  Store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show Success Message
  UI.showAlert("Book Removed", "info");
});
