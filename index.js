// index.js
const { core } = require("photoshop");

async function getBookContent(url, index) {
    const fullUrl = `http://192.168.1.6:1122/getBookContent?url=${encodeURIComponent(url)}&index=${index}`;
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
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const getContentBtn = document.getElementById("getContentBtn");
    const urlFld = document.getElementById("urlFld");
    const indexFld = document.getElementById("indexFld");
    const contentArea = document.getElementById("contentArea");
    const fontSizeControl = document.getElementById("fontSizeControl");
    const inputArea = document.querySelector(".input-area");
    const toggleInputBtn = document.getElementById("toggleInputBtn");

    if (getContentBtn && urlFld && indexFld && contentArea && fontSizeControl && inputArea && toggleInputBtn) {
        getContentBtn.addEventListener("click", async () => {
            const url = urlFld.value;
            const index = indexFld.value;

            if (!url || !index) {
                alert("Please enter both URL and Index.");
                return;
            }

            const result = await getBookContent(url, index);

            if (result.error) {
                alert(`Error: ${result.error}`);
                displayContent(`Error: ${result.error}`);
            } else if (result.data) {
                // Replace \n with actual line breaks
                const formattedContent = result.data.replace(/\\n/g, '\n');
                displayContent(formattedContent);
            } else {
                alert("No data found in the response.");
                displayContent("No data found in the response.");
            }
        });

        // Font Size Control
        fontSizeControl.addEventListener("change", () => {
            contentArea.style.fontSize = `${fontSizeControl.value}px`;
        });
        // Toggle Input Area
        toggleInputBtn.addEventListener("click", () => {
            inputArea.classList.toggle("show");
            if(inputArea.classList.contains("show")){
                toggleInputBtn.textContent = "Hide Input";
            }else{
                toggleInputBtn.textContent = "Show Input";
            }
        });
    }
});
