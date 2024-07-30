import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";

const inputEl = document.getElementById("input-el")
const ulEl = document.getElementById("ul-el")
const tabBtn = document.getElementById("tab-btn")
const remoteTabBtn = document.getElementById("remote-tab-btn")
let mySites = []
let lastloop = 0

let mySitesFromLocalStorage = JSON.parse(localStorage.getItem("mySites")) //declare a variable my sites from local storage, to be the parsed value from local storage. With the unique variable name you can store several arrays in local storage
console.log(mySitesFromLocalStorage)

//ON RENDER
if(mySitesFromLocalStorage) { //if I have some sites saved in local storage, I want to display them on render
    mySites = mySitesFromLocalStorage //give my array the values from local storage 
    displayMySites(mySites) //display it
}

//ADD OWN INPUT
document.getElementById("input-btn").addEventListener("click", function(){ //STARTED CREATING CODE HERE
    mySites.push(inputEl.value) //on user's input add the user's input to the array mySites
    inputEl.value = ""  //clear the input field so it looks pretty and UI indicates you added your input 

    mySitesFromLocalStorage = localStorage.setItem("mySites", JSON.stringify(mySites)) //IMPORTANT! THE WAY YOU GET YOUR ARRAY TO PERMANENTLY STAY LOCALLY - save the new input into local storage (the first argument is already a string, hence you only need to stringify the array) 
    displayMySites(mySites) //display all the inputs
})

//ADD CURRENT TAB
tabBtn.addEventListener("click", function(){
    // mySites.push(document.baseURI) This does not work for extension as it is saving the currect chrome extension uri instead of the current tab hence the code below from Stack overflow. It would work for browser.
    let queryInfo = {
        currentWindow: true, //the current window and not another one opened behind
        active: true //the current tab
    };

    chrome.tabs.query(queryInfo, function(tabs) {
    let url = tabs[0].url
    mySites.push(url)
    mySitesFromLocalStorage = localStorage.setItem("mySites", JSON.stringify(mySites))
    displayMySites(mySites)
    })
})

//LOOP TO DISPLAY ALL
function displayMySites(desiredArrayOfSites){ //instead of looping through mySites and slowing down the page, we can create one extra variable and keep adding the new mySites to it and only render the stored new variable with all mySites, instead of updating on every loop. Remember! DOM manipulation comes with a cost.
    let listItems = ""
    for (let i = 0; i < desiredArrayOfSites.length; i++) {
    listItems += `<li><a href="${desiredArrayOfSites[i]}" target="_blank">${desiredArrayOfSites[i]}</a></li>`
    }
    ulEl.innerHTML = listItems
}

//REMOVE LAST ADDED
remoteTabBtn.addEventListener("click", function(){
    mySites.pop()
    mySitesFromLocalStorage = localStorage.setItem("mySites", JSON.stringify(mySites))
    displayMySites(mySites)
})

//REMOVE ALL
document.getElementById("delete-btn").addEventListener("click", function(){
    ulEl.innerHTML = listItems = ""
    mySitesFromLocalStorage = localStorage.clear()
    mySites = []
})
