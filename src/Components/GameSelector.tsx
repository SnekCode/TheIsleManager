// react component that asks the user to select where the game (param) is installed using an input then update the store using apiSave

import {apiRetrieve, useApiInvoke, apiSend} from '@/Hooks/useApi';
import {useState, useEffect} from 'react';
import {EChannels} from '~/Shared/channels';
import {EGameNames} from '~/Shared/gamenames';

declare module "react" {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        webkitdirectory?: string;
    }
}

const GameSelector: React.FC<{name:EGameNames.legacy | EGameNames.evrima}> = ({name}) => {
    const [path, setPath] = useState<string>("");
    const [isInstalled, setIsInstalled] = useState(false)
    const storeInstallPath = name + "InstallPath" as "legacyInstallPath" | "evrimaInstallPath"
    const storeIsInstalled = name + "Install" as "legacyInstall" | "evrimaInstall"

    console.log(isInstalled);
    

    useEffect(()=> {
        apiRetrieve(storeInstallPath, setPath)
        apiRetrieve(storeIsInstalled, setIsInstalled)
      }, [])

    
    function clearPath(){
        setPath("")
        setIsInstalled(false)
        apiSend(EChannels.unInstallPath, name)
    }


    async function getDir(data: any[]){
        const [bool, path] = data
        setIsInstalled(bool)
        setPath(path)
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
            {/* <input id={name+"input"} type='file' webkitdirectory="" datatype='.exe' onChange={getDir}/>*/}
            <button onClick={()=>useApiInvoke(EChannels.changeInstallPath, [name], getDir)
            } style={{display:'block', textTransform:"capitalize"}}>Select {name} install Path</button>
            {/* <label style={{display:'block', textTransform:"capitalize"}} htmlFor={name+"input"} >Choose install path for {name}</label> */}
            {path ? <div>Current Path: {path}</div>: ""}
            {path && !isInstalled ? <label htmlFor={name+"input"} style={{color: "red",textTransform:"capitalize"}}>This is not an {name} game folder</label> : ""}
            {/* <button onClick={handlePathSubmit}>Submit</button> */}
        </div>
    );
    }
}


    export default GameSelector