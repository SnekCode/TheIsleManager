// react component that asks the user to select where the game (param) is installed using an input then update the store using apiSave

import {apiRetrieve, apiSave, apiSend, useApiReceiveEffect, useApiSendEffect, useApiInvoke} from '@/Hooks/useApi';
import {useState} from 'react';
import {EChannels} from '~/Shared/channels';

declare module "react" {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        webkitdirectory?: string;
    }
}

const GameSelector: React.FC<{name:"legacy" | "evrima"}> = ({name}) => {
    const [path, setPath] = useState<string>("");
    const [isInstalled, setIsInstalled] = useState(false)
    const storeName = name + "InstallPath" as "legacyInstallPath" | "evrimaInstallPath"
    

    function clearPath(){
        setPath("")
        apiSave(storeName, "")
        setIsInstalled(false)
    }

    async function getDir(e:React.ChangeEvent<HTMLInputElement>) {
        const firstFile = e.target.files? e.target.files[0] : undefined
        let dirArray = firstFile?.path.split("\\")
        dirArray = dirArray?.slice(0, dirArray.length - 1)
        const pathName = dirArray?.join("\\") ?? ""
        setPath(pathName)
        // apiSend(EChannels.changeInstallPath, [name, pathName])
        useApiInvoke(EChannels.changeInstallPath, [name, pathName], setIsInstalled)
      }

    if(isInstalled){
        return (
        <div style={{margin:42}}>
            <label style={{display:'block', textTransform:"capitalize"}} >{name} Install Path: {path}</label>
            <button id={name+"button"} onClick={clearPath}>Clear</button>
        </div>  
        )
    }else{
    return (
        <div style={{margin:42}}>
            <input id={name+"input"} type='file' webkitdirectory="" datatype='.exe' onChange={getDir}/>
            <label style={{display:'block', textTransform:"capitalize"}} htmlFor={name+"input"} >Choose install path for {name}</label>
            {path ? <label htmlFor={name+"input"} style={{color: "red"}}>This is not an Isle game folder</label> : ""}
            {/* <button onClick={handlePathSubmit}>Submit</button> */}
        </div>
    );
    }
}


    export default GameSelector