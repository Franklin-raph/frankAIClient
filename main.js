import 'boxicons';
const chatArea = document.getElementById('chatArea');
const form = document.querySelector("form");
const humanRequest = document.querySelector('.humanRequest')
const botAnswer = document.querySelector('.botAnswer')

let loadInterval;

function botLoader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if(element.textContent === "....."){
      element.textContent = "";
    }
  }, 300)
}

function botTyping(element, text){
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length){
      element.textContent += text.charAt(index);
      index++;
    }else{
      clearInterval(interval)
    }
  }, 20)
}

async function handleSubmit (e){
  e.preventDefault()
  
  const formData = new FormData(form)
  
  if (!formData.get("prompt")) {
    return;
  }

  botLoader(botAnswer)
  
  humanRequest.textContent = ""
  humanRequest.textContent = formData.get('prompt')

  chatArea.scrollTop = chatArea.scrollHeight
  // https://frankai.onrender.com/openai/chatGptClone
  const response = await fetch('https://frankai.onrender.com/openai/chatGptClone', {
      method: "POST",
      body: JSON.stringify({
        prompt: formData.get("prompt")
      }),
      headers: {
          'Content-Type':'application/json',
      }
  })
  
  const { data } = await response.json();
  if (response.ok) {
    console.log(data)
    clearInterval(loadInterval);
    botTyping(botAnswer, data.trim())

  } else {
    clearInterval(loadInterval);
    botTyping(botAnswer, "Oops!! something went wrong. Please try again later")
  }
}
form.addEventListener('submit', handleSubmit)
