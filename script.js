let correctCityCountry = false;
const errorBox = document.querySelector('.errorBox');
let students = [];
let viewTable = document.querySelector('.viewTable');

function validateScoreSize(input){
    if (input.value < 0) {
        input.value = 0;
      } else if (input.value > 100) {
        input.value = 100;
      }
    
}

function validatePincodeSize(input){
    if (input.value < 111111) {
        input.value = "Enter Pin";
      } else if (input.value > 999999) {
        input.value = 999999;
      }

}

function validateCityCountry() {
  const cityInput = document.getElementById("city");
  const countryInput = document.getElementById("country");
  
  const city = cityInput.value;
  const country = countryInput.value;
  
  const searchQuery = `${city}, ${country}`;
  const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`;
  
  fetch(apiUrl)
    .then(data => data.json())
    .then(response => {
    
       if (response.length > 0) {
         errorBox.style.display = "none"
         console.log("Valid city and country");
         correctCityCountry = true;
       } else {
        correctCityCountry = false;
        errorBox.style.display = "block"
        errorBox.innerHTML = 
        `
            <p style="color:red">Invalid City or Country</p>
        `
        console.log("Invalid city or country");
     }
    })
    .catch(error => {
      errorBox.style.display = "none"
      console.log("An error occurred during the request:", error);
    });
}

// Display and hide Functions for each option

function displayInput(){
    document.querySelector('.input_div').style.display = "block";
}

function hideInput(){
    document.querySelector('.input_div').style.display = "none";
}

function displayTable(){
    viewTable.style.display = "block";
    let stringStudents = students.map(obj => JSON.stringify(obj, null, 2)).join('\n');
    viewTable.innerHTML = `
        <pre>${stringStudents}</pre>
    `
}

function hideTable(){
    viewTable.style.display = "none";
}

function storeInput(){
    validateCityCountry()
    
    if(document.getElementById('name').value.trim() === ""){
        errorBox.style.display = "block"
        errorBox.innerHTML = 
        `
            <p style="color:red">Empty Name</p>
        `
    }
    else if(document.getElementById('address').value.trim() == ""){
        errorBox.style.display = "block"
        errorBox.innerHTML = 
        `
            <p style="color:red">Empty Address</p>
        `
    }
    else if(document.getElementById('pincode').value == ""){
        errorBox.style.display = "block"
        errorBox.innerHTML = 
        `
            <p style="color:red">Empty pincode</p>
        `
    }
    else if(document.getElementById('sat').value == ""){
        errorBox.style.display = "block"
        errorBox.innerHTML = 
        `
            <p style="color:red">Empty SAT score</p>
        `
    }
    else{
        let data = {
            name: document.getElementById('name').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById("city").value.trim(),
            country: document.getElementById("country").value.trim(),
            pincode: Number.parseInt(document.getElementById("pincode").value),
            sat_score: Number.parseInt(document.getElementById("sat").value), 
            passed: "Fail"
        }

        if(data.sat_score > 30){
          data.passed = "Pass"
        }

        document.getElementById('name').value = document.getElementById('address').value = document.getElementById("city").value = document.getElementById("country").value = document.getElementById("pincode").value = document.getElementById("sat").value = "";

        console.log(data);
        students.push(data);
        errorBox.style.display = "none";
        document.querySelector('.input_div').style.display = "none";
    }
}

function displayRank(){
    let stdName = document.getElementById('rankInput').value;
    
   
    const sortedStudents = students.sort((a, b) => b.sat_score - a.sat_score);
    
    let currentRank = 1;
    let previousScore = null;

    sortedStudents.forEach((student, index) => {
        if (student.sat_score !== previousScore) {
            student.rank = currentRank;
        }
        student.rank = currentRank;
        previousScore = student.sat_score;
        currentRank++;
    });

    console.log(sortedStudents);

    let disrank = 0;

    sortedStudents.forEach( (s) =>{
        if(s.name == stdName){
            disrank = s.rank;
        }
    } )

    document.getElementById('rankInput').value = "";

    document.getElementById('rankBox').innerText =  `
        Name : ${stdName} - Rank: ${disrank}
    `
}

function hideRank(){
    document.querySelector('.rankTable').style.display = 'none';
}

function updateRecord(){
    
    let errorName = true;
    const uname = document.getElementById('updateName').value;
    const uval = document.getElementById('updateValue').value;

    students.forEach((s) => {
        if(s.name === uname){
            s.sat_score = uval;
            errorName = false;
        }
    })

    if(errorName){
        errorBox.style.display = "block";
        errorBox.innerHTML = 
        `
            <p style="color:red">Invalid name</p>
        `
    }
    console.log("value Updated", students);
    hideUpdate()
}

function hideUpdate(){
    document.getElementById('updateTable').style.display = 'none';
}

function deleteRecord(){
    let errorName = true;
    const dname = document.getElementById('deleteName').value;

    students.forEach((s) => {
        if(s.name === dname){
            students.pop(s);
            errorName = false;
        }
    })

    if(errorName){
        errorBox.style.display = "block";
        errorBox.innerHTML = 
        `
            <p style="color:red">Invalid name</p>
        `
    }
}

function hideDelete(){
    document.getElementById('deleteTable').style.display = 'none';
}

function evaluateInput(){
    switch(document.getElementById('menu').value){
        case 'insert':
            hideDelete()
            hideUpdate();
            hideRank();
            hideTable();
            displayInput();
            return console.log("Insertion");
        case 'view':
            hideDelete()
            hideUpdate();
            hideRank()
            hideInput()
            displayTable();
            return console.log("View");
        case 'rank':
            hideDelete()
            hideUpdate()
            document.querySelector('.rankTable').style.display = 'block';
            hideInput()
            hideTable();
            return console.log("Rank");
        case 'update':
            hideDelete()
            document.getElementById('updateTable').style.display = 'block';
            hideRank()
            hideInput()
            hideTable();
            return console.log("Update");
        case 'delete':
            document.getElementById('deleteTable').style.display = 'block';
            hideUpdate();
            hideRank()
            hideInput()
            hideTable();
            return console.log("Delete");
    }
}