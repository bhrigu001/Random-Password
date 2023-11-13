const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lenghtNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='`~!@#$%^&*(){}[</]|\:",.?/'; 

let password="";
let passwordLength=10;
let checkCount=0;
 handleSlider();
 setIndicator("#ccc");

function shufflePassword(array){
    //Fischer Yates Method
    for(let i=array.length-1;i>=0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}


//set password Length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndmInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function getRndmNumber(){
    return getRndmInteger(0,9);
}

function getRndmLowerCase(){
    return String.fromCharCode(getRndmInteger(97,123));
}

function getRndmUpperCase(){
    return String.fromCharCode(getRndmInteger(65,91));
}

function generateSymbol(){
    const randmNum=getRndmInteger(0,symbols.length);
    return symbols.charAt(randmNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }

    //to make span of copy visible
    copyMsg.classList.add("active");

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    });
    //special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount; 
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(x)=>{
    passwordLength=x.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click',()=>{
   //none of the checkbox selected
   if(checkCount==0)return;

   if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
   }
   password="";
    //finding new password
    // if(uppercaseCheck.checked){
    //     password+=getRndmUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password+=getRndmLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password+=getRndmNumber();
    // }

    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

    let funcArr=[];
  
    if(uppercaseCheck.checked){
        funcArr.push(getRndmUpperCase);
    }
    
    if(lowercaseCheck.checked){
        funcArr.push(getRndmLowerCase);
    }

    if(numbersCheck.checked){
        funcArr.push(getRndmNumber);
    }

    if(symbolsCheck.checked){
        funcArr.push(generateSymbol); 
    }

    //ticked func addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    //remaining addition
    for(let i=0;i<(passwordLength-funcArr.length);i++){
        let rndmIndex=getRndmInteger(0,funcArr.length);
        password+=funcArr[rndmIndex]();
    }

    //Shuffling Password
    password=shufflePassword(Array.from(password));
    
    // showing in UI
    passwordDisplay.value=password;
     //calculate strength
     calcStrength();
})

