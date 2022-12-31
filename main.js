import 'boxicons';
const chatArea = document.getElementById('chatArea');
const form = document.querySelector("form");
const humanRequest = document.querySelector('.humanRequest')
const botAnswer = document.querySelector('.botAnswer')

const botImageLoader = document.querySelector('.botImageLoader')

const humanImageRequest = document.querySelector('.humanImageRequest')
const botImageAnswer = document.querySelector('.botImageAnswer')
const selectedItems = document.querySelectorAll('.item')

const createImagePage = document.getElementById("createImage")
const createCompletionPage = document.getElementById("createCompletion")

const createImageText = document.querySelector("#createImage #textArea")

const modal = document.querySelector(".modal")

const modalClose = document.querySelector('.modalClose').addEventListener('click', ()=> {
  modal.classList.remove('open')
})

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

async function handleCreateCompletion (e){
  e.preventDefault()
  const formData = new FormData(form)
  form.reset()
  if (!formData.get("prompt")) {
    modal.classList.add('open')
    return;
  }

  botLoader(botAnswer)
  
  humanRequest.textContent = ""
  humanRequest.textContent = formData.get('prompt')

  chatArea.scrollTop = chatArea.scrollHeight
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
    clearInterval(loadInterval);
    botTyping(botAnswer, data.trim())
    console.log(data.trim())

  } else {
    clearInterval(loadInterval);
    botTyping(botAnswer, "Oops!! something went wrong. Please try again later")
  }
}

async function handleImageGeneration(){
  if (!createImageText.value) {
    modal.classList.add('open')
    return;
  }

  botImageAnswer.src = ""
  botLoader(botImageLoader)
  
  humanImageRequest.textContent = ""
  humanImageRequest.textContent = createImageText.value

  console.log(createImageText.value)
  chatArea.scrollTop = chatArea.scrollHeight
  const response = await fetch('https://frankai.onrender.com/openai/imageGeneration', {
      method: "POST",
      body: JSON.stringify({
        prompt: createImageText.value
      }),
      headers: {
          'Content-Type':'application/json',
      }
  })

  createImageText.value = ""
  
  const { data } = await response.json();
  console.log(response)
  if (response.ok) {
    clearInterval(loadInterval);
    botImageAnswer.src = data
    console.log(data)

  } else {
    clearInterval(loadInterval);
    botTyping(botImageLoader, "Oops!! something went wrong. Please try again later")
  }
}

document.querySelector('.createCompletionBtn').addEventListener('click', handleCreateCompletion)

document.querySelector('.handleImageGenerationBtn').addEventListener('click', (e)=>{
  e.preventDefault()
  handleImageGeneration()
})




selectedItems.forEach((selectedItem, index) => {
  selectedItem.addEventListener('click', ()=>{
    selectedItems.forEach(unselectedBtn =>{
      unselectedBtn.classList.remove('activeItem')
    });
    selectedItems[index].classList.add('activeItem')

    if(selectedItem.innerText === "Generate Images"){
      createImagePage.style.display = "block"
      createCompletionPage.style.display = "none"
    }

    if(selectedItem.innerText === "Ask Me"){
      createImagePage.style.display = "none"
      createCompletionPage.style.display = "block"
    }
  })
})
