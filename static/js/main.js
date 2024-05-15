const modal = document.querySelector('.modal');
const responseDiv = document.querySelector('[name="response"]');

async function send_variable(){
    let response = await fetch('/post/ask-question',{
        method: 'POST',
        headers: {
            'Content-Type': 'text/html',
        },
        body: String(document.querySelector('[name="question"]').value),
    });
    response = await response.text();
    
    let code_end = false;
    let code_start = false;
    let code_string = '';
    response += '\n';
    let response_element = document.createElement('div');
    response_element.classList.add('paragraph');
    for (let i=0; i < response.split('\n').length; i++){
        let line = response.split('\n')[i];

        if (line.includes('```') && code_start !== true){
            code_start = true; 
        }else if (line.includes('```') && code_start) {
            code_end = true;
        }else if (code_start && !code_end) {
            code_string += line + '\n';
        }else if (code_end) {
            let html = `
                <pre><code class="language-html">${code_string}</code></pre>
            `;
            response_element.innerHTML += html;
            code_start = false;
            code_end = false;
            code_string = '';
        }else {
            let html = `<p>${line}</p>`;
            response_element.innerHTML += html;
        }
    }

    responseDiv.appendChild(response_element);
    responseDiv.scrollTop = responseDiv.scrollHeight;
}

async function send_ocr() {
    const currentTime = new Date();
    let response = await fetch('/get/ocr');
    const response_element = document.querySelector('[name="response"]');
   
    response += '\n';
    response_element.innerHTML += `<div class="paragraph"><p>${response}</p></div>`;
    responseDiv.scrollTop = responseDiv.scrollHeight;
}

function set_loading() {
    const button = document.querySelector('.submit-button');
    button.classList.add('is-loading');
}

function close_loading() {
    const button = document.querySelector('.submit-button');
    button.classList.remove('is-loading');
}


const tabslink = document.querySelectorAll('.tabs a');

tabslink.forEach(element => {
    element.addEventListener('click', (target) => {
        document.querySelectorAll('.tabs li').forEach(li => {
            li.classList.remove('is-active');
        });
        target.target.parentElement.classList.add('is-active');
    })
})

async function checkSelection() {
    const selection = document.querySelector('.selection').querySelector('.is-active');
    
    if (selection.getAttribute('data-type') == '1') {
        set_loading();
        await send_variable();
        close_loading();
    }else if (selection.getAttribute('data-type') == '4') {
        set_loading();
        await send_ocr(); 
        close_loading();
    }else if (selection.getAttribute('data-type') == '5') {
        document.querySelector('[name="question"]').value = document.querySelector('[name="question"]').value.replace(/(\r\n|\n|\r)/gm, " ");
    }
}

document.querySelector('.submit-button').addEventListener('click', async () => {
    await checkSelection();
})

document.querySelector('.clear-button').addEventListener('click', async () => {
    responseDiv.innerHTML = '';
    document.querySelector('[name="question"]').value = '';
    let response = await fetch('/get/clear-session');
    
    if (response) console.log(true); else console.log(false);
})
