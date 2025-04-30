// index.js

async function getBookContent(url, index) {
    const getBookContentUrl = localStorage.getItem("getBookContentUrl");
    const fullUrl = `${getBookContentUrl}?url=${encodeURIComponent(url)}&index=${index}`;
    console.log("Requesting URL:", fullUrl);

    try {
        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Response data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return { error: error.message };
    }
}

function displayContent(content) {
    const contentArea = document.getElementById("contentArea");
    if (contentArea) {
        contentArea.textContent = content;
        contentArea.scrollTop = 0; // Scroll to top
    }
}

async function loadContent(url, index) {
    const contentArea = document.getElementById("contentArea");
    if (contentArea) {
        contentArea.textContent = "Loading...";
    }
    const result = await getBookContent(url, index);
    if (result.error) {
        alert(`Error: ${result.error}`);
        displayContent(`Error: ${result.error}`);
    } else if (result.data) {
        const formattedContent = result.data.replace(/\\n/g, '\n');
        displayContent(formattedContent);
    } else {
        alert("No data found in the response.");
        displayContent("No data found in the response.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const getContentBtn = document.getElementById("getContentBtn");
    const urlFld = document.getElementById("urlFld");
    const indexFld = document.getElementById("indexFld");
    const getBookContentUrlFld = document.getElementById("getBookContentUrlFld");
    const contentArea = document.getElementById("contentArea");
    const fontSizeControl = document.getElementById("fontSizeControl");
    const inputArea = document.querySelector(".input-area");
    const toggleInputBtn = document.getElementById("toggleInputBtn");
    const prevIndexBtn = document.getElementById("prevIndexBtn");
    const nextIndexBtn = document.getElementById("nextIndexBtn");
    const indexDisplay = document.getElementById("indexDisplay");

    // Initialize index
    let currentIndex = 0;
    indexDisplay.textContent = `Index: ${currentIndex}`;

    // Load saved values from localStorage
    urlFld.value = localStorage.getItem("url") || urlFld.value;
    indexFld.value = localStorage.getItem("index") || indexFld.value;
    getBookContentUrlFld.value = localStorage.getItem("getBookContentUrl") || getBookContentUrlFld.value;

    // 新增：根据indexFld的值更新currentIndex和indexDisplay
    indexDisplay.textContent = `Index: ${currentIndex}`;
    if (indexFld && indexFld.value) {
        currentIndex = parseInt(indexFld.value);
    }

    // Save values to localStorage on change
    urlFld.addEventListener("change", () => localStorage.setItem("url", urlFld.value));
    indexFld.addEventListener("change", () => localStorage.setItem("index", indexFld.value));
    getBookContentUrlFld.addEventListener("change", () => localStorage.setItem("getBookContentUrl", getBookContentUrlFld.value));

    if (getContentBtn && urlFld && indexFld && contentArea && fontSizeControl && inputArea && toggleInputBtn && prevIndexBtn && nextIndexBtn && indexDisplay && getBookContentUrlFld) {
        getContentBtn.addEventListener("click", async () => {
            const url = urlFld.value;
            const index = indexFld.value;
            currentIndex = parseInt(index);
            indexDisplay.textContent = `Index: ${currentIndex}`;

            if (!url || !index) {
                alert("Please enter both URL and Index.");
                return;
            }
            await loadContent(url, index);
        });

        // Font Size Control
        fontSizeControl.addEventListener("change", () => {
            contentArea.style.fontSize = `${fontSizeControl.value}px`;
        });
        // Toggle Input Area
        toggleInputBtn.addEventListener("click", () => {
            inputArea.classList.toggle("show");
            if (inputArea.classList.contains("show")) {
                toggleInputBtn.textContent = "Hide Input";
            } else {
                toggleInputBtn.textContent = "Show Input";
            }
        });
    }

    // Load bookshelf data on page load
    fetchBookshelfData();

    // Open the Bookshelf tab by default
    openTab(event, 'Bookshelf');
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

async function fetchBookshelfData() {
    const bookshelfArea = document.getElementById("bookshelfArea");
    if (bookshelfArea) {
        bookshelfArea.textContent = "Loading...";
    }
    try {
        const response = await fetch("http://192.168.1.6:1122/getBookshelf");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Bookshelf data:", data);
        displayBookshelf(data.data);
    } catch (error) {
        console.error("Error fetching bookshelf data:", error);
        bookshelfArea.textContent = `Error: ${error.message}`;
    }
}

function displayBookshelf(books) {
    const bookshelfArea = document.getElementById("bookshelfArea");
    if (bookshelfArea) {
        bookshelfArea.innerHTML = ""; // Clear existing content
        if (Array.isArray(books)) {
            books.forEach(book => {
                const bookElement = document.createElement("div");
                bookElement.textContent = book.bookName;
                bookElement.addEventListener("click", () => {
                    fetchChapterList(book.bookUrl);
                });
                bookshelfArea.appendChild(bookElement);
            });
        } else {
            bookshelfArea.textContent = "No books found.";
        }
    }
    console.log("Books in displayBookshelf:", books);
}

async function fetchChapterList(bookUrl) {
    const chapterListArea = document.getElementById("chapterListArea");
    if (chapterListArea) {
        chapterListArea.textContent = "Loading...";
    }
    try {
        const response = await fetch(`http://192.168.1.6:1122/getChapterList?url=${encodeURIComponent(bookUrl)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Chapter list data:", data);
        displayChapterList(data);
    } catch (error) {
        console.error("Error fetching chapter list data:", error);
        chapterListArea.textContent = `Error: ${error.message}`;
    }
}

function displayChapterList(chapters) {
    const chapterListArea = document.getElementById("chapterListArea");
    if (chapterListArea) {
        chapterListArea.innerHTML = ""; // Clear existing content
        if (Array.isArray(chapters)) {
            chapters.forEach(chapter => {
                const chapterElement = document.createElement("div");
                chapterElement.textContent = chapter.title;
                chapterElement.addEventListener("click", () => {
                    // Load content based on chapter index
                    const urlFld = document.getElementById("urlFld");
                    const indexFld = document.getElementById("indexFld");
                    urlFld.value = chapter.url;
                    indexFld.value = chapter.index;
                    loadContent(chapter.url, chapter.index);
                });
                chapterListArea.appendChild(chapterElement);
            });
        } else {
            chapterListArea.textContent = "No chapters found.";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const getContentBtn = document.getElementById("getContentBtn");
    const urlFld = document.getElementById("urlFld");
    const indexFld = document.getElementById("indexFld");
    const getBookContentUrlFld = document.getElementById("getBookContentUrlFld");
    const contentArea = document.getElementById("contentArea");
    const fontSizeControl = document.getElementById("fontSizeControl");
    const inputArea = document.querySelector(".input-area");
    const toggleInputBtn = document.getElementById("toggleInputBtn");
    const prevIndexBtn = document.getElementById("prevIndexBtn");
    const nextIndexBtn = document.getElementById("nextIndexBtn");
    const indexDisplay = document.getElementById("indexDisplay");

    // Initialize index
    let currentIndex = 0;
    indexDisplay.textContent = `Index: ${currentIndex}`;

    // Load saved values from localStorage
    urlFld.value = localStorage.getItem("url") || urlFld.value;
    indexFld.value = localStorage.getItem("index") || indexFld.value;
    getBookContentUrlFld.value = localStorage.getItem("getBookContentUrl") || getBookContentUrlFld.value;

    // 新增：根据indexFld的值更新currentIndex和indexDisplay
    indexDisplay.textContent = `Index: ${currentIndex}`;
    if (indexFld && indexFld.value) {
        currentIndex = parseInt(indexFld.value);
    }

    // Save values to localStorage on change
    urlFld.addEventListener("change", () => localStorage.setItem("url", urlFld.value));
    indexFld.addEventListener("change", () => localStorage.setItem("index", indexFld.value));
    getBookContentUrlFld.addEventListener("change", () => localStorage.setItem("getBookContentUrl", getBookContentUrlFld.value));

    if (getContentBtn && urlFld && indexFld && contentArea && fontSizeControl && inputArea && toggleInputBtn && prevIndexBtn && nextIndexBtn && indexDisplay && getBookContentUrlFld) {
        getContentBtn.addEventListener("click", async () => {
            const url = urlFld.value;
            const index = indexFld.value;
            currentIndex = parseInt(index);
            indexDisplay.textContent = `Index: ${currentIndex}`;

            if (!url || !index) {
                alert("Please enter both URL and Index.");
                return;
            }
            await loadContent(url, index);
        });

        // Font Size Control
        fontSizeControl.addEventListener("change", () => {
            contentArea.style.fontSize = `${fontSizeControl.value}px`;
        });
        // Toggle Input Area
        toggleInputBtn.addEventListener("click", () => {
            inputArea.classList.toggle("show");
            if (inputArea.classList.contains("show")) {
                toggleInputBtn.textContent = "Hide Input";
            } else {
                toggleInputBtn.textContent = "Show Input";
            }
        });
    }

    // Load bookshelf data on page load
    fetchBookshelfData();

    // Open the Bookshelf tab by default
    openTab(event, 'Bookshelf');
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

async function fetchBookshelfData() {
    const bookshelfArea = document.getElementById("bookshelfArea");
    if (bookshelfArea) {
        bookshelfArea.textContent = "Loading...";
    }
    try {
        const response = await fetch("http://192.168.1.6:1122/getBookshelf");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Bookshelf data:", data);
        displayBookshelf(data);
    } catch (error) {
        console.error("Error fetching bookshelf data:", error);
        bookshelfArea.textContent = `Error: ${error.message}`;
    }
}

function displayBookshelf(books) {
    const bookshelfArea = document.getElementById("bookshelfArea");
    if (bookshelfArea) {
        bookshelfArea.innerHTML = ""; // Clear existing content
        if (Array.isArray(books)) {
            books.forEach(book => {
                const bookElement = document.createElement("div");
                bookElement.textContent = book.bookName;
                bookElement.addEventListener("click", () => {
                    fetchChapterList(book.bookUrl);
                });
                bookshelfArea.appendChild(bookElement);
            });
        } else {
            bookshelfArea.textContent = "No books found.";
        }
    }
}

async function fetchChapterList(bookUrl) {
    const chapterListArea = document.getElementById("chapterListArea");
    if (chapterListArea) {
        chapterListArea.textContent = "Loading...";
    }
    try {
        const response = await fetch(`http://192.168.1.6:1122/getChapterList?url=${encodeURIComponent(bookUrl)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Chapter list data:", data);
        displayChapterList(data);
    } catch (error) {
        console.error("Error fetching chapter list data:", error);
        chapterListArea.textContent = `Error: ${error.message}`;
    }
}

function displayChapterList(chapters) {
    const chapterListArea = document.getElementById("chapterListArea");
    if (chapterListArea) {
        chapterListArea.innerHTML = ""; // Clear existing content
        if (Array.isArray(chapters)) {
            chapters.forEach(chapter => {
                const chapterElement = document.createElement("div");
                chapterElement.textContent = chapter.title;
                chapterElement.addEventListener("click", () => {
                    // Load content based on chapter index
                    const urlFld = document.getElementById("urlFld");
                    const indexFld = document.getElementById("indexFld");
                    urlFld.value = chapter.url;
                    indexFld.value = chapter.index;
                    loadContent(chapter.url, chapter.index);
                });
                chapterListArea.appendChild(chapterElement);
            });
        } else {
            chapterListArea.textContent = "No chapters found.";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const getContentBtn = document.getElementById("getContentBtn");
    const urlFld = document.getElementById("urlFld");
    const indexFld = document.getElementById("indexFld");
    const getBookContentUrlFld = document.getElementById("getBookContentUrlFld");
    const contentArea = document.getElementById("contentArea");
    const fontSizeControl = document.getElementById("fontSizeControl");
    const inputArea = document.querySelector(".input-area");
    const toggleInputBtn = document.getElementById("toggleInputBtn");
    const prevIndexBtn = document.getElementById("prevIndexBtn");
    const nextIndexBtn = document.getElementById("nextIndexBtn");
    const indexDisplay = document.getElementById("indexDisplay");

    // Initialize index
    let currentIndex = 0;
    indexDisplay.textContent = `Index: ${currentIndex}`;

    // Load saved values from localStorage
    urlFld.value = localStorage.getItem("url") || urlFld.value;
    indexFld.value = localStorage.getItem("index") || indexFld.value;
    getBookContentUrlFld.value = localStorage.getItem("getBookContentUrl") || getBookContentUrlFld.value;

    // 新增：根据indexFld的值更新currentIndex和indexDisplay
    indexDisplay.textContent = `Index: ${currentIndex}`;
    if (indexFld && indexFld.value) {
        currentIndex = parseInt(indexFld.value);
    }

    // Save values to localStorage on change
    urlFld.addEventListener("change", () => localStorage.setItem("url", urlFld.value));
    indexFld.addEventListener("change", () => localStorage.setItem("index", indexFld.value));
    getBookContentUrlFld.addEventListener("change", () => localStorage.setItem("getBookContentUrl", getBookContentUrlFld.value));

    if (getContentBtn && urlFld && indexFld && contentArea && fontSizeControl && inputArea && toggleInputBtn && prevIndexBtn && nextIndexBtn && indexDisplay && getBookContentUrlFld) {
        getContentBtn.addEventListener("click", async () => {
            const url = urlFld.value;
            const index = indexFld.value;
            currentIndex = parseInt(index);
            indexDisplay.textContent = `Index: ${currentIndex}`;

            if (!url || !index) {
                alert("Please enter both URL and Index.");
                return;
            }
            await loadContent(url, index);
        });

        // Font Size Control
        fontSizeControl.addEventListener("change", () => {
            contentArea.style.fontSize = `${fontSizeControl.value}px`;
        });
        // Toggle Input Area
        toggleInputBtn.addEventListener("click", () => {
            inputArea.classList.toggle("show");
            if (inputArea.classList.contains("show")) {
                toggleInputBtn.textContent = "Hide Input";
            } else {
                toggleInputBtn.textContent = "Show Input";
            }
        });
    }

    // Load bookshelf data on page load
    fetchBookshelfData();

    // Open the Bookshelf tab by default
    openTab(event, 'Bookshelf');
});
