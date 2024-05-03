let dataList = [];

function getContent() {
  if(window.location.pathname.includes("index.html"))
    updateTable();
  
  // Get input values
  const title = document.querySelector("#listID").value;
  const time = document.querySelector("#time").value;
  const priority = document.querySelector("#Plevel").value;

  // Validate input
  if (!title || !time) {
    alert("Please enter a title and time.");
    return;
  }
  
    // Check if the title already exists in dataList
    const titleExists = dataList.some(item => item.title === title);
    if (titleExists) {
      alert("Title already listed.");
      return;
    }
 
  // Create a new List object
  const list = new List(title, formatTime(time), priority);
  dataList.push(list);

  // Sort the list by time (optional)
  dataList.sort(sortByTime);

  //Calling the update table method after adding a contont on data
  updateTable();
  //clear the text in the input
  clearContent();
}

//function to clear table inputs
function clearContent(){
  document.querySelector('#myForm').reset();
}


// This function poerfomrs the "DONE" button, If the selected row are being considered done. This
//  funciton will remove the selector row in dataList storage and store it in the doneData storage
let doneData = []; // initialize a done list History
let selectedDone = '';
function contentDone(){

  dataList.forEach(element => {
    if(element.title == selectedDone){
      const list = new List(element.title, element.time, element.pLevel);
      doneData.push(list);
    
    }
  });


  //test
  console.log("*************DONE DATA***********")
  doneData.forEach(element => {
    console.log(element)
  });
  console.log("**********************************")
   //using Array.prototype.filter()
  //filter the match tittle out in the array 
  dataList = dataList.filter((word) => word.title !== selectedDone);
  updateTable();

}

let selectedDelete = '';
function contentDelete(){
  dataList = dataList.filter((word) => word.title !== selectedDelete);
  //update the session for storage update
  storeList();
  //update table
  updateTable();
}


function updateTable() {
  let tableList = document.querySelector(".contenL");

  // Clear previous content (optional)
  while (tableList.firstChild) {
    tableList.removeChild(tableList.firstChild);
  }


  //Every loop of this for of will create a cells for table to store the inputed content
  for (const listItem of dataList) {
    // Create a new table row
    const newRow = document.createElement("tr");

    // Create table cells
    const titleCell = document.createElement("td");
    const timeCell = document.createElement("td");
    const priorityCell = document.createElement("td");

    // Set cell content
    titleCell.textContent = listItem.title;
    timeCell.textContent = listItem.time;
    priorityCell.textContent = listItem.pLevel;

    // Add cells to the row
    newRow.appendChild(titleCell);
    newRow.appendChild(timeCell);
    //Deffirent color for priority levels
    if(priorityCell.textContent == 'LOW')
    newRow.appendChild(priorityCell).style.color = "YELLOW";
    if(priorityCell.textContent == 'MEDIUM')
    newRow.appendChild(priorityCell).style.color = "orange";
    if(priorityCell.textContent == 'HIGH')
    newRow.appendChild(priorityCell).style.color = "red";
    

    let content = [];
    let index = 0;
    // Add event listener for row selection/deselection (optional)
    newRow.addEventListener('click', function() {
      if (this.classList.contains('selected')) {
        content = [];
        // Deselect the current row and its cells
        this.classList.remove('selected');
        this.querySelectorAll('td').forEach(cell => cell.classList.remove('selected'));
      } else {
        content = [];
        // Deselect previously selected rows and their cells
        document.querySelectorAll('.selected').forEach(row => {
          row.classList.remove('selected');
          row.querySelectorAll('td').forEach(cell => cell.classList.remove('selected'));
        });
  
        // Select the current row and its cells
        this.classList.add('selected');
        this.querySelectorAll('td').forEach(cell => cell.classList.add('selected'));
      }
    
  
      // Retrieve content of all cells in the row (optional)
      console.log("Selected row: ")
      newRow.querySelectorAll('td').forEach(cell => {
        index++;
        if(index == 1){
          // Incase for delete or mark as done
          selectedDone = cell.textContent;
          selectedDelete = cell.textContent;
        }
       
         content.push(cell.textContent);
        
      });
      //seleted content elements
      console.log(content)
    });
    // Append the row to the table
    tableList.appendChild(newRow);
  }

}


function loadDoneTable() {
  let table = document.querySelector(".table")

  if (doneData.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-message';
    table.innerHTML = ''; // Clear the existing content
    emptyMessage.textContent = '"Content that has been selected will appear here."'
    table.appendChild(emptyMessage);
  } else {
    let rowsTable = document.querySelector(".contenD");
    for (const list of doneData) {
      // Create a new table row
      const newRow = document.createElement("tr");

      // Create table cells
      const titleCell = document.createElement("td");
      const timeCell = document.createElement("td");
      const priorityCell = document.createElement("td");

      titleCell.textContent = list.title;
      timeCell.textContent = list.time;
      priorityCell.textContent = list.pLevel;
      
      // Different color for priority levels
      if (priorityCell.textContent === 'LOW')
        priorityCell.style.color = "yellow";
      else if (priorityCell.textContent === 'MEDIUM')
        priorityCell.style.color = "orange";
      else if (priorityCell.textContent === 'HIGH')
        priorityCell.style.color = "red";

      newRow.appendChild(titleCell);
      newRow.appendChild(timeCell);
      newRow.appendChild(priorityCell);
      rowsTable.appendChild(newRow);
    }
  }
}


// onclick funtion to delete all history of done data
function deleteAll() {
  //remove all the data from session
  sessionStorage.removeItem('doneData');
  doneData = [];
  loadDoneTable();
}








// Custom sorting function
function sortByTime(a, b) {
  const timeAValue = getTimeValue(a.time);
  const timeBValue = getTimeValue(b.time);
  return timeAValue - timeBValue;
}

// Function to convert time string to value
function getTimeValue(timeStr) {
  const [time, period] = timeStr.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  let convertedHours = hours;
  if (period === "PM" && hours !== 12) {
    convertedHours += 12;
  } else if (period === "AM" && hours === 12) {
    convertedHours = 0;
  }

  // Handle 12 PM as a special case for sorting (noon should come last)
  if (convertedHours === 12 && period === "PM") {
    convertedHours = 24; // Adjust hour for noon
  }

  return convertedHours * 60 + minutes;
}

// Function to format time consistently (optional)
function formatTime(timeInput) {
  const parts = timeInput.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Handle 00:00 as 12:00 AM
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${period}`;
}

// Class representing a to-do list item (optional)
class List {
  constructor(title, time, pLevel) {
    this.title = title;
    this.time = time;
    this.pLevel = pLevel;
  }
}
// Set current time
function setCurrentTime() {
  let currentTime = new Date();
  let hours = currentTime.getHours().toString().padStart(2, '0'); // Pad hours to 2 digits
  let minutes = currentTime.getMinutes().toString().padStart(2, '0'); // Pad minutes to 2 digits

  let timeString = hours + ':' + minutes;
  document.querySelector("#currentTime").value = timeString;
}

let intervalID; // Variable to store interval ID

// Update time periodically
function updateTime() {
  setCurrentTime(); // Set current time immediately
  clearInterval(intervalID); // Clear existing interval
  intervalID = setInterval(setCurrentTime, 1000); // Set new interval
}

// Call updateTime initially to start the clock
updateTime();






//This two function will store the data from the arrays into sessionStorage.
function storeDone(){
   sessionStorage.setItem('doneData', JSON.stringify(doneData));
}
function storeList(){
 sessionStorage.setItem('listData', JSON.stringify(dataList));

}



function contentHistory() {
  
//storedoneList in sessionStorage
storeDone();
  //store data to sessionStorage
  storeList();
    window.location.href="indexHistory.html";
}

function homePage() {
  
  dataList = [];
  window.location.href = "index.html";
}


//This function will check if the homePgae is loaded after that all the stored data
//from doneList and dataList in the session will be pass to dataList
function homePageLoaded() {
  //checks if the page is fully loaded and ready to be interact before running DOM.
  if (document.readyState === "complete" || document.readyState === "interactive") {
    console.log('window ready');
    // Retrieve data from sessionStorage (if applicable)
    const retrievedDone = JSON.parse(sessionStorage.getItem('doneData'));
    const retrievedData = JSON.parse(sessionStorage.getItem('listData'));

    // in js if the variable dont have a value it returns false. so if this
    // condition have value it will store the retreive dataList.
    if (retrievedData) {
      dataList = retrievedData;
    }

    if (retrievedDone) {
      doneData = retrievedDone;
    }


//
    console.log("*************DATA LIST RETREIVE*************")
dataList.forEach(element => {
  console.log(element)
});
    console.log("*********************************************\n\n")
    console.log("*************DONE LIST RETREIVE*************")
    doneData.forEach(element => {
      console.log(element)
    });
    console.log("*********************************************\n\n")
    //update table to print data retreived data.
    updateTable();
  } else {
    console.log('ERORR LOADING');
  }
}
//Similar funtion in the top but will just store the done data. this function will be loaded when the
//History page is fully loaded and ready to intract. and store the retreived data into doneData.
function historyPageLoaded(){
  if (document.readyState === "complete" || document.readyState === "interactive"){
    const retrievedData = JSON.parse(sessionStorage.getItem('doneData'));
    if(retrievedData) {
      for (let i = 0; i < retrievedData.length; i++) {
        doneData[i] = retrievedData[i];
      }

    }
    console.log("Expected done history")
    doneData.forEach(element => {
      console.log(element)
    });
    //perform the sorting on time, period.
      doneData.sort(sortByTime);
    loadDoneTable();
  }else {
    console.log('ERORR LOADING')
  }
}





