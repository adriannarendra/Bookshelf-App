var books = [];

const submitButtonFalse = document.getElementById('submit-button-negative');
const submitButtonTrue = document.getElementById('submit-button-positive');
const RENDER_BOOKS = 'render-books';
const STORAGE_KEY = 'bookshelf-storage-key';

function checkStorage() {
    if (typeof Storage === undefined) {
        return false;
    }

    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    if (checkStorage()) {
        const storedBooks = localStorage.getItem(STORAGE_KEY);
        books = storedBooks ? JSON.parse(storedBooks) : [];

        dispatchEvent(new Event(RENDER_BOOKS));    
    }
})

window.addEventListener(RENDER_BOOKS, function () {
    const unreadBOOKSList = document.getElementById('uncompleted-books-list');
    unreadBOOKSList.innerHTML = '';

    const readBOOKSList = document.getElementById('completed-books-list');
    readBOOKSList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            unreadBOOKSList.append(bookElement);
        } else {
            readBOOKSList.append(bookElement);
        }
    }    
});

submitButtonFalse.addEventListener('click', function (event) {
    addBook(false);
    event.preventDefault();
    document.getElementById('name').value = '';
});

submitButtonTrue.addEventListener('click', function (event) {
    addBook(true);
    event.preventDefault();
    document.getElementById('name').value = '';
});



function addBook(isCompleted) {
    const name = document.getElementById('name').value;

    if (name === '') {
        return alert('Nama tidak boleh kosong!');
    }

    const generatedId = generateId();
    const bookObject = makeBookObject(name, generatedId, isCompleted);
    books.push(bookObject);

    if (checkStorage()) {
        const booksString = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, booksString);
    }

    dispatchEvent(new Event(RENDER_BOOKS));    
}



function generateId() {
    return +new Date()
}

function makeBookObject(name, id, isCompleted) {
    return {
        id: id,
        name: name,
        isCompleted: isCompleted,
    }
}

function findBookId(id) {
    // nyari book dari array books yang id-nya sama dengan parameter id
    // ininih fungsi array cuy
    return books.find(book => book.id === id);
}

function findBookIndex(id) {
    // nyari book dari array books yang id-nya sama dengan parameter id
    // ininih fungsi array cuy
    return books.findIndex(book => book.id === id);
}

function addBookToDoneReading(id) {
    const bookItemId = findBookId(id);
    
    if (bookItemId == null) return;

    bookItemId.isCompleted = true;

    if (checkStorage()) {
        const booksString = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, booksString);
    }
    dispatchEvent(new Event(RENDER_BOOKS));
}

function addBookToNotRead(id) {
    const bookItemId = findBookId(id);
    
    if (bookItemId == null) return;

    bookItemId.isCompleted = false;

    if (checkStorage()) {
        const booksString = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, booksString);
    }
    dispatchEvent(new Event(RENDER_BOOKS));
}

function deleteBook(id) {
    const bookItemIndex = findBookIndex(id);

    if (bookItemIndex === -1) return;
    
    books.splice(bookItemIndex, 1);

    if (checkStorage()) {
        const booksString = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, booksString);
    }
    dispatchEvent(new Event(RENDER_BOOKS));
}

function makeBook(book) {
    const bookContainer = document.createElement('div');
    const title = document.createElement('h3');
    const buttonContainer = document.createElement('div');
    const deleteBookButtton = document.createElement('button');

    bookContainer.classList.add('book');

    title.innerText = book.name;

    if (!book.isCompleted) {
        const doneButton = document.createElement('button');
        doneButton.innerText = 'selesai baca';
        doneButton.classList.add('btn', 'btn-green');
        doneButton.addEventListener('click', function () {
            addBookToDoneReading(book.id);
        });
        buttonContainer.appendChild(doneButton);
    } else {
        const reReadButton = document.createElement('button');
        reReadButton.innerText = 'baca ulang';
        reReadButton.classList.add('btn', 'btn-blue');
        reReadButton.addEventListener('click', function () {
            addBookToNotRead(book.id);
        });
        buttonContainer.appendChild(reReadButton);
    }

    deleteBookButtton.innerText = 'hapus';
    deleteBookButtton.classList.add('btn', 'btn-red')
    deleteBookButtton.addEventListener('click', function () {
        deleteBook(book.id);
    });
    buttonContainer.appendChild(deleteBookButtton);

    bookContainer.appendChild(title);
    bookContainer.appendChild(buttonContainer);
    
    return bookContainer;
}