import bot from './assets/bot.svg'
import user from './assets/user.svg'


const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')
const Desc = document.querySelector('#Desc')
const P = document.getElementById('intro')

const text="Codex is an advanced artificial intelligence designed to answer your questions and assist you in various tasks. Just type your query in the chatbox below, and Codex will provide you with helpful responses!"

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()
    Desc.style.display="none";
   

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv);

    const response = await fetch('https://codegpt-seyi.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            
            prompt: data.get('prompt')
        })
    })


    clearInterval(loadInterval)
    messageDiv.innerHTML = " "
    // console.log(response);
    if (response.ok) {
        const resp = await response.json();
        // console.log(resp.choices[0].text);
        const parsedData = resp.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData);

        // const pElement=document.createElement('p');
        // pElement.textContent="";
        // P.Element.addEventListener('click',()=> changeInput());
        // historyElement.append(pElement);
        
    } else {
        const err = await response.text();

        messageDiv.innerHTML = "Something went wrong";
        alert(err);
    }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
})
P.addEventListener('onload',typeText(P,text))