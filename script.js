// DOM Element
const resultEl = document.getElementById("result");
const lengthEl = document.getElementById("length");
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");
const generateEl = document.getElementById("generate");
const clipboardEl = document.getElementById("clipboard");
const meta        = document.getElementById("metadata");
var password = [];
const randomFunction = {
    lower: getLowerPass,
    upper: getUpperPass,
    number: getNumPass,
    symbol: getSymbolPass
}
// generate btn event listener
generateEl.addEventListener('click',()=>{
    const length = Number(lengthEl.value);
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNum   = numbersEl.checked;
    const hasSym   = symbolsEl.checked;
    const metatags = meta.value;
    var tags = document.querySelectorAll("meta");
    resultEl.innerText = genPassword(hasLower,hasUpper,hasNum,hasSym,length);
    if(metatags !== '')
    {
        const values =  metatags.split(',');
        var metaAttributes = [];
        var metaValues = [];
        var tag = document.createElement('meta');
        for(var i=0;i<values.length;i++)
        {
            metaAttributes[i] = values[i].split("=")[0];
            metaValues[i] = values[i].split("=")[1];
            tag.setAttribute(metaAttributes[i],metaValues[i]);
        }
        document.querySelector("head").appendChild(tag);
        password.push(
            {
                lower:hasLower,
                upper:hasUpper,
                num:hasNum,
                symbol:hasSym,
                meta:[values],
                password: resultEl.innerText,
                length:length
            }
        )
        var index = checkPassword();
        if(index)
        {
            console.log(index);
            resultEl.innerText = password[index[0]].password;
        }
    }

});

function arraysEqual(a,b) {
    if (a instanceof Array && b instanceof Array) {
        if (a.length!=b.length)  // assert same length
            return false;
        for(var i=0; i<a.length; i++)  // assert each element equal
            if (!arraysEqual(a[i],b[i]))
                return false;
        return true;
    } else {
        return a==b;  // if not both arrays, should be the same
    }
}
function checkPassword()
{
    for(var i=0;i<password.length;i++)
    {
        if((password[i].lower == password[password.length-1].lower) && (password[i].upper == password[password.length-1].upper) && (password[i].num == password[password.length-1].num) && (password[i].symbol == password[password.length-1].symbol) && (arraysEqual(password[i].meta,password[password.length-1].meta)) && (password[i].length === password[password.length-1].length))
        {
           return[i,password.length-1];
        }
    }
}
// Copy password to clipboard
clipboardEl.addEventListener('click',()=>{
    const textarea = document.createElement('textarea');
    const password = resultEl.innerText;
    if(!password)
    {
        return;
    }
    else
    {
        textarea.value = password;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        alert("Password copied");
    }
})
// Generate password function
function genPassword(lower, upper, number, symbol, length)
{
    let generatedPass = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(
        item => Object.values(item)[0]
    );
    if(typesCount === 0)
    {
        return '';
    }
    for(var i=0;i<length;i+=typesCount)
    {
        typesArr.forEach(type=>{
            const functionName = Object.keys(type)[0];
            generatedPass += randomFunction[functionName]();
        });
    }
    const finalPassword = generatedPass.slice(0, length);
    return finalPassword;
}
// Generator Functions
function getLowerPass()
{
    return String.fromCharCode(Math.floor(Math.random()*26 + 97));
}
function getUpperPass()
{
    return String.fromCharCode(Math.floor(Math.random()*26 + 65));
}
function getNumPass()
{
    return String.fromCharCode(Math.floor(Math.random()*10 + 48));
}
function getSymbolPass()
{
    const symbols = '!@#$%^&*(){}[]=<>/,.';
	return symbols[Math.floor(Math.random() * symbols.length)];
}