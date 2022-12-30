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

  const response = await fetch('http://localhost:8000/openai/chatGptClone', {
      method: "POST",
      body: JSON.stringify({
        prompt: formData.get("prompt")
      }),
      headers: {
          'Content-Type':'application/json',
      }
  })
  
  if (response.ok) {
    const { data } = await response.json();
    clearInterval(loadInterval);
    botTyping(botAnswer, data.trim())

  } else {
    clearInterval(loadInterval);
    botAnswer.textContent = "oops something went wrong";
  }
}
form.addEventListener('submit', handleSubmit)
