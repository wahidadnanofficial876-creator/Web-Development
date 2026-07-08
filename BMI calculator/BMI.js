//selction of elements
const inputHeight=document.querySelector('#input-height');
const inputWeight=document.querySelector('#input-weight');
const calculateButton=document.querySelector('#calculate-button');
const results=document.querySelector('ul');
const tableBody = document.querySelector("#table-body");
//calculating BMI
function calculateBMI()
{
    let weight=Number(inputWeight.value);
    let height=Number(inputHeight.value);
    
    let BMI=(weight) / (height*height);
    return BMI;
}
//adding events
calculateButton.addEventListener('click',
    ()=>{
        showResults();
    }
)
function getCategory(bmi)
{
    if(bmi < 18.5)
        return "Underweight";

    if(bmi < 25)
        return "Normal";

    return "Overweight";
}
//show results
function showResults()
{
     tableBody.innerHTML = "";

    const bmi = calculateBMI();

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${inputHeight.value}</td>
        <td>${inputWeight.value}</td>
        <td>${bmi.toFixed(2)}</td>
        <td>${getCategory(bmi)}</td>
    `;

    tableBody.appendChild(row);
    
}
