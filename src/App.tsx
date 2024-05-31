import "./App.scss";
import GameSwitcher from "Pages/GameSwitcher/GameSwitcher";
import UpdateBar from "./Components/UpdateBar";
import {useContext} from 'react';
import {AppGameContext} from './Providers/AppGameProvider';
import GameSelector from './Components/GameSelector';
import {EGameNames} from '~/Shared/gamenames';
import Button from './Components/Button';

function App() {
  const { configState, loadedStore, saveConfigState} = useContext(AppGameContext);

  if(!loadedStore){
    return <></>
  }

  if(configState === "init"){
    return (
      <div>
        <UpdateBar/>
        <GameSelector name={EGameNames.legacy}/>
        <GameSelector name={EGameNames.evrima}/>
        <Button onClick={()=> saveConfigState("complete")}>Continue</Button>
      </div>
    )
  }

  return (
    <div>
      <UpdateBar />
      <GameSwitcher />
    </div>
  );
}

export default App;
