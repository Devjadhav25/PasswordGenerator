const inputSlider =document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copymsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolcheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateButton= document.querySelector(".generatepassword");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols =  '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password ="";
let passwordLength =10;
let checkCount =0;

//set strength circel color
setIndicator("#ccc")


handleSlider();
// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;

}
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    //shadow
}
function getRndInteger(min, max){
    return Math.floor(Math.random()*(max-min))+min;

}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);

}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false; 
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolcheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym)  &&
        passwordLength>=6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText= "copied";

    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
       copyMsg.classList.add("active");
       

    setTimeout(() =>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    // fisher yates method
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }
    let str ="";
    array.forEach(eL => {
        str += eL
    });
    return str;

}

function handleCheckBox(){
    checkCount=0;
    allCheckBox.forEach((Checkbox)=>{
        if(Checkbox.checked)
            checkCount++;
    });

    if(passwordLength< checkCount){
        passwordLength= checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (Checkbox)=>{
    Checkbox.addEventListener('change', handleCheckBox);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength= e.target.value;
    handleSlider();
    
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
    
})

generateButton.addEventListener('click',() =>{
    if(checkCount == 0)
         return;

    if(passwordLength <checkCount){
        passwordLength= checkCount;
        handleSlider();
    }

    // lets start the journey to find password
    console.log("starting the journey");
    password="";

    // lets put the items given in checkbox

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolcheck.checked){
    //     password += generateSymbol();
    // }

    let funcarr= [];
    
    if(uppercaseCheck.checked)
        funcarr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcarr.push(generateLowerCase);

    if(numberCheck.checked)
        funcarr.push(generateRandomNumber);


    if(symbolcheck.checked)
        funcarr.push(generateSymbol);


    // required addition

    for(let i=0; i<funcarr.length; i++){
        password+= funcarr[i]();
    }
    console.log("required adddition");
    // remaining addition
    for(let i=0; i<passwordLength-funcarr.length; i++){
        let randIndex = getRndInteger(0 , funcarr.length);
        console.log("randIndex" + randIndex);
        password += funcarr[randIndex]();
    }
    console.log("remaining adddition");
    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("shufflepassword");

    // show the password in display
    passwordDisplay.value = password;
    console.log("display");

    // strength indication
    calcStrength();
})


