import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const firebaseConfig = {databaseURL: "https://websites-tracker-app-default-rtdb.europe-west1.firebasedatabase.app/"};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInDB = ref(database, "leads");

const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");

function render(leads) {
    let listItems = "";
    for (let key in leads) {
        listItems += `
        <span onclick="deleteItem('${key}')">
            <p>
                ${leads[key]}
            </p>
        </span>
        `;
    }
    ulEl.innerHTML = listItems;
}

window.deleteItem = function(key) {
    const itemRef = ref(database, `leads/${key}`);
    remove(itemRef).then(() => {
        console.log(`Item with key ${key} deleted successfully`);
    }).catch((error) => {
        console.error(`Failed to delete item with key ${key}: `, error);
    });
};

onValue(referenceInDB, function(snapshot) {
    const snapshotDoesExist = snapshot.exists();
    if (snapshotDoesExist) {
        const snapshotValues = snapshot.val();
        render(snapshotValues);
    } else {
        ulEl.innerHTML = "";
    }
});

deleteBtn.addEventListener("dblclick", function() {
    remove(referenceInDB).then(() => {
        ulEl.innerHTML = "";
        console.log("All items deleted successfully");
    }).catch((error) => {
        console.error("Failed to delete all items: ", error);
    });
});

inputBtn.addEventListener("click", function() {
    push(referenceInDB, inputEl.value).then(() => {
        inputEl.value = "";
        console.log("Item added successfully");
    }).catch((error) => {
        console.error("Failed to add item: ", error);
    });
});
