const { contextBridge, ipcRenderer } = require('electron')

console.log('preload.js');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('api', {
  configGame: (name) => {
    console.log('configGame', name);
    ipcRenderer.send('configGame', name);
  },
  startGame: (name) => {
    console.log('startGame');
    ipcRenderer.send('startGame', name);
  }
})

contextBridge.exposeInMainWorld('init', {
  setupLegacy: () => {
    ipcRenderer.send('setupLegacy');
  }
})

ipcRenderer.on('showMessage', (event, arg) => {
  // write arg to p tag with id of message
  const messageElement = document.querySelector('#message');
  messageElement.innerHTML = arg;
  messageElement.style.display = 'block';
})

ipcRenderer.on('hideMessage', (event, arg) => {
  const messageElement = document.querySelector('#message');
  messageElement.style.display = 'none';
})


ipcRenderer.on('lock', (event, arg) => {
  if(arg){
    // lock all buttons
    document.querySelectorAll('button').forEach((button) => {
      button.disabled = true;
    })
  }else{
    // unlock all buttons
    document.querySelectorAll('button').forEach((button) => {
      button.disabled = false;
    })
  }
})

ipcRenderer.on("init", (event, arg) => {
  if(arg === 'init'){
    //hide all elements under body
    document.querySelectorAll('body *').forEach((element) => {
      element.style.display = 'none';
    })
    // show init setup button
    document.querySelector('#init-setup').style.display = 'block';
  }else if (arg === 'evrima'){
    // hide all elements under body
    document.querySelectorAll('body *').forEach((element) => {
      element.style.display = 'none';
    })
    // show evrima instructions
    document.querySelector('#evrima-instructions').style.display = 'block';
    ipcRenderer.send('checkEvrima');
  }else if(arg === 'complete'){
    // send message back to stop install check
    ipcRenderer.send('stopCheckEvrima');

    // hide all elements under body
    document.querySelectorAll('body *').forEach((element) => {
      element.style.display = 'none';
    })
    // show buttons
    document.querySelector('#start-legacy').style.display = 'block';
    document.querySelector('#start-evrima').style.display = 'block';
    // show config buttons
    document.querySelector('#config-legacy').style.display = 'block';
    document.querySelector('#config-evrima').style.display = 'block';
  }
  // always show footer
  document.querySelector('footer').style.display = 'block';
})