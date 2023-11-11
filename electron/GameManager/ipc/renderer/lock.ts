import { ipcRenderer } from "electron";


ipcRenderer.on('lock', (_, arg) => {
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