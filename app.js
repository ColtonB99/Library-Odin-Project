// Template for The Books
const BookHTMLTemplate = `<div class="book book{BookNumber}">
<div class="top-row">
    <p class="book-header bold">{Book Title}</p>
    <button class="delete-button"></button>
</div>
<div class="middle-row">
    <p class="author">By: {Author}</p>
    <p class="pagecount">{TotalPages} Pages</p>
</div>
<div class="bottom-row">
    <button class="read-unread bold">{Read}</button>
</div>
</div>`;


var BookTitle = document.querySelector(".CreateBookMenu-Overlay .BookTitle");
var AuthorName = document.querySelector(".CreateBookMenu-Overlay .AuthorName");
var TotalPages = document.querySelector(".CreateBookMenu-Overlay .TotalPages");
var ReadIt = document.querySelector(".CreateBookMenu-Overlay .Read-Unread-Checkbox");
var errorElement = document.querySelector(".CreateBookMenu-Overlay .errorShow");

var Books = [];


// Create the 3 Starter Books
const onLaunchData = [
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        pages: 208,
        read: false
    },
    {
        title: "Harry Potter and the Order of the Phoenix",
        author: "J.K Rowling",
        pages: 766,
        read: true
    },
    {
        title: "The Catcher in the Rye",
        author: "J. D. Salinger",
        pages: 288,
        read: false
    }
];

// Create Books
for (const data of onLaunchData) {
    let book = new Book(data.title, data.author, data.pages, data.read);
    Books.push(book);
    // Now Build Book In DOM
    let Library = document.querySelector(".library");
    Library.innerHTML += book.BookTemplate;
    book.rendered = true;
}

updateAnalytics();




function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read ? "Read" : "Not Read";
    this.BookNumber = Books.length + 1;
    this.BookTemplate = BookHTMLTemplate.replace("{BookNumber}", `${this.BookNumber}`).replace("{Book Title}", this.title).replace("{Author}", this.author).replace("{TotalPages}", this.pages).replace("{Read}", this.read).replace('class="read-unread bold"', `class="read-unread bold ${this.read}"`).replaceAll(`\n`, "");
    this.rendered = false;
}   

function CreateBook() {
    // Update Book Creation Menu Item Values To Their Current State
    if (BookTitle.value != "" && AuthorName.value != "" && TotalPages.value != "") {

        // Check for Duplicate Books
        let isDuplicate = false;
        for (let i = 0; i < Books.length; i++) {
            if (Books[i].title === BookTitle.value && Books[i].author === AuthorName.value) {
                isDuplicate = true;
                break;
            }
        }

        if (isDuplicate) {
            errorElement.textContent = "* Book Already Exists In Library";
            errorElement.style.display = "block";
            return; // Don't proceed if it's a duplicate
        }

        let book = new Book(BookTitle.value, AuthorName.value, TotalPages.value, ReadIt.checked);
        Books.push(book);

        // Now Build Book In DOM
        let Library = document.querySelector(".library");
        Library.innerHTML += book.BookTemplate;

        book.rendered = true;
        CloseMenu();
    } else {
        errorElement.textContent = "* Please fill out all fields.";
        errorElement.style.display = "block";
    }    

    updateAnalytics();
}



// Add Read/Unread Button Functionality to the Library
document.querySelector(".library").addEventListener("click", function(event) {
    const readUnreadButton = event.target.closest(".read-unread");
    if (readUnreadButton) {
        if (readUnreadButton.textContent === "Read") {
            readUnreadButton.textContent = "Not Read";
            readUnreadButton.classList.add("Not");
            updateAnalytics();
        } else {
            readUnreadButton.textContent = "Read";
            readUnreadButton.classList.remove("Not");
            updateAnalytics();
        }
    }

    // Update Total Read
});

// Add Delete Button Functionality to the Library
document.querySelector(".library").addEventListener("click", function(event) {
    const deleteButton = event.target.closest(".delete-button");
    if (deleteButton) {
        deleteButton.parentElement.parentElement.remove();
        updateAnalytics();
    }
});

function updateAnalytics() {

    // Define Analytics Elements
    let headerTotalBooks = document.querySelector(".TotalBooks");
    let headerTotalRead = document.querySelector(".TotalRead");

    let BookList = document.querySelector(".library").querySelectorAll(".book");
    let NotRead = document.querySelector(".library").querySelectorAll(".read-unread.Not.Read");
    let calculatedReadTotal = BookList.length - NotRead.length;

    headerTotalBooks.textContent = `Total Books: ${BookList.length}`;
    headerTotalRead.textContent = `Total Read: ${calculatedReadTotal}`;

}


// HANDLE MENU CLOSING AND OPENING
function OpenMenu() {
    // Clear Menu (For some reason directly calling the "BookTitle" variable wasn't working)
    BookTitle.value = "";
    AuthorName.value = "";
    TotalPages.value = "";
    ReadIt.checked = false;
    errorElement.style.display = "none";

    // Show Menu
    document.querySelector(".CreateBookMenu-Overlay").style.display = "flex";
}

function CloseMenu() {
    // Hide Menu
    document.querySelector(".CreateBookMenu-Overlay").style.display = "none";
}

var overlay = document.querySelector(".CreateBookMenu-Overlay");
var wrapper = document.querySelector(".CreateBookMenu-Wrapper");

overlay.addEventListener("click", function(event) {
    // Handle click on overlay
    // console.log("Overlay clicked");
    CloseMenu();
});

wrapper.addEventListener("click", function(event) {
    event.stopPropagation(); // Prevent click on wrapper from reaching overlay
    // console.log("Wrapper clicked");
});

