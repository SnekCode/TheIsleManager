import { useContext, useEffect, useState} from "react";
import evrimaBg from "assets/EvrimaBackground.png";
import legacyBg from "assets/LegacyBackground.png";
import "./styles.scss";
import { AppGameContext } from "Providers/AppGameProvider";
import { apiSend } from "Hooks/useApi";
import { EChannels } from "Shared/channels";
import { EGameNames } from "Shared/gamenames";

// launch options https://appuals.com/steam-set-launch-options-and-full-list/#:~:text=How%20to%20Set%20Steam%20Launch%20Options%201%20Open,top%20left%20side%20of%20the%20client.%20See%20More.

// server connect string for legacy
// +connect 173.208.139.154:14030

// evirma server ip 107.155.104.66:14000

const games = {
  none: {
    name: "None",
    lowerName: "none",
    bg: "red",
    next: EGameNames.evrima,
    server: ""
  },
  evrima: {
    name: "Evrima",
    lowerName: EGameNames.evrima,
    bg: evrimaBg,
    next: EGameNames.legacy,
    server: {"": ""}
  },
  legacy: {
    name: "Legacy",
    lowerName: EGameNames.legacy,
    bg: legacyBg,
    next: EGameNames.evrima,
    server: {"Dry Reef": "173.208.139.154:14030", "test": 'dummy'}
  },
};

function GameSwitcher() {
  const { lock, setLock, loadedGame, playing, loadedStore, bothGamesInstalled } =
    useContext(AppGameContext);
  const [game, setGame] = useState(games[loadedGame]);
  const [lastGame, setLastGame] = useState(games[loadedGame]);
  const [gameServer, setGameServer] = useState("")
  const [autoConnect, setAutoConnect] = useState(false)


  useEffect(()=>{
    console.log("USE EFFECT");
    setGame(games[loadedGame])
    const keys = Object.keys(game.server)
    //@ts-expect-error its ok
    setGameServer(game.server[keys[0]])
  },[loadedGame])

  //@ts-expect-error but it is tho
  const handleGameChange = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(game);
    
         e.preventDefault()
        if(!bothGamesInstalled){
          alert(`you must install ${game.next}`)
          return
        } 

        if (game.name === "None") {
          apiSend(EChannels.configGame, lastGame.lowerName as EGameNames);
          return;
        }
        setGame((game) => {
          setLastGame(game); 
          return games[game.next]}
          );

        
        // ui only lock
        setLock(true);
        apiSend(EChannels.configGame, game.next);
      }

  return (
    <>
      <div
        className="splash"
        style={{ backgroundImage: `url(${games[loadedGame].bg})` }}
      ></div>
      <div className={bothGamesInstalled ? "splashClickArea" : "splashArea"}
        onClick={(e) => handleGameChange(e)}
      >
        <h2
          className={`${lock ? "locked" : "unlocked"} ${
            playing ? "playing" : ""
          } selectGame`}
          style={{ display: loadedStore ? "block" : "none"}}
        >
          Loaded Game: {game.name}
        </h2>
      </div>
      <div className="game-container">
        {game.name === "None" ? (
          <p className="errorMessage">
            {games[lastGame.next].name} is currently not installed or has not been ran yet. <br />
            Please install and run {games[lastGame.next].name} before switching to it.
            <br/>
            <br/>

            You may also swap to {lastGame.name} to continue playing.
          </p>
        ) : ( null )}
        <div className={`playButtonContainer`}>
          <button
            onClick={() => {
              if (lock) return;
              window.api.send(EChannels.startGame, [games[loadedGame].lowerName, autoConnect ? "+connect" : "", autoConnect ? gameServer : ""]);
            }}
            className={`${lock ? "locked" : "unlocked"} ${
              playing ? "playing" : ""
            } center playButton`}
            style={{ display: game.name === "None" ? "none" : "block" }}
          >
            Play Game
          </button>
          {game.lowerName === EGameNames.legacy ? <div style={{margin: 20}}>
            <div onClick={()=> setAutoConnect(!autoConnect)} style={{fontSize:18, fontWeight: 'bold', cursor:'pointer', userSelect:'none'}}>Auto Connect: <input style={{cursor:'pointer'}} onChange={()=> setAutoConnect(!autoConnect)} checked={autoConnect} type='checkbox'/></div>
            <select
              onChange={e => {
                console.log(e.target.value);
                
                setGameServer(e.target.value)
              }}
            >

            {Object.keys(game.server).map((el)=> {
              //@ts-expect-error its ok
              return <option value={game.server[el]}>{el}</option>
            })}
            </select>
            <div style={{color: 'lightblue'}}>{gameServer}</div>
          {/* 
          <div style={{margin:2}}>Auto Connect to {gameServer}</div> */}
          </div>: null}
        </div>
      </div>
    </>
  );
}

export default GameSwitcher;
