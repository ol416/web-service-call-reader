// index.js
const { core } = require("photoshop");

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
    currentIndex = indexFld.value.toString() || "0";
    indexDisplay.textContent = `Index: ${currentIndex}`;

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

        // Previous Index Button
        prevIndexBtn.addEventListener("click", async () => {
            currentIndex--;
            indexFld.value = currentIndex.toString();
            indexDisplay.textContent = `Index: ${currentIndex}`;
            if (urlFld.value) {
                await loadContent(urlFld.value, currentIndex);
                // 新增保存逻辑
                localStorage.setItem("index", indexFld.value);
            }
        });

        // Next Index Button
        nextIndexBtn.addEventListener("click", async () => {
            currentIndex++;
            indexFld.value = currentIndex.toString();
            indexDisplay.textContent = `Index: ${currentIndex}`;
            if (urlFld.value) {
                await loadContent(urlFld.value, currentIndex);
                // 新增保存逻辑
                localStorage.setItem("index", indexFld.value);
            }
        });
    }
});
