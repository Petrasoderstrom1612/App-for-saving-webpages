import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js"

const firebaseConfig = {databaseURL: "https://websites-tracker-app-default-rtdb.europe-west1.firebasedatabase.app/"}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const referenceInDB = ref(database, "leads")

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
        <li>
        <a target='_blank' href='${leads[i]}'>
        ${leads[i]}
        </a>
        </li>
        `
    }
    ulEl.innerHTML = listItems
}

onValue(referenceInDB, function(snapshot){ //this is like .addEventListener, see the structure, but instead it reacts onValue that means value changes in the database you created and it gives you a snapshot of the values in the database
    const snapshotDoesExist = snapshot.exists()
    if (snapshotDoesExist) {
    const snapshotValues = snapshot.val() //the object is big, we only want the firebase database
    const leads = Object.values(snapshotValues) //convert the values into an array
    render(leads)
    console.log(leads)
    }
})

deleteBtn.addEventListener("dblclick", function() {
    remove(referenceInDB)
    ulEl.innerHTML = ""
})

inputBtn.addEventListener("click", function() {
    push(referenceInDB, inputEl.value) //you need two parameters, the database and the standart
    inputEl.value = ""
})