import { useContext, useEffect, useState } from "react";
import evrimaBg from "assets/EvrimaBackground.png";
import legacyBg from "assets/LegacyBackground.png";
import "./styles.scss";
import { AppGameContext } from "Providers/AppGameProvider";
import { useApiReceiveEffect, apiSend } from "Hooks/useApi";
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
    server: "107.155.104.66:14000"
  },
  legacy: {
    name: "Legacy",
    lowerName: EGameNames.legacy,
    bg: legacyBg,
    next: EGameNames.evrima,
    server: "173.208.139.154:14030"
  },
};

function GameSwitcher() {
  const { lock, setLock, setLoadedGame, loadedGame, playing, loadedStore } =
    useContext(AppGameContext);
  const [game, setGame] = useState(games[loadedGame]);
  const [lastGame, setLastGame] = useState(games[loadedGame]);
  const [gameServer, setGameServer] = useState(games[loadedGame].server)
  const [autoConnect, setAutoConnect] = useState(false)


  useEffect(() => {
    setGame(games[loadedGame])
  }, [loadedGame]);

  useApiReceiveEffect(EChannels.configGame, (data: EGameNames) => {
    if (data !== game.lowerName) {
      setLoadedGame(data);
      setGame(games[data]);
      
    } else {
      setLoadedGame(data);
      setGameServer(games[data].server)
    }
  });

  const handleGameChange = () => {
            if (lock) return;
            if (game.name === "None") {
              setLock(true);
              apiSend(EChannels.configGame, lastGame.lowerName);
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
      <div className="splashClickArea"
        onClick={() => handleGameChange()}
      >
        <h2
          className={`${lock ? "locked" : "unlocked"} ${
            playing ? "playing" : ""
          } selectGame`}
          style={{ display: loadedStore ? "block" : "none"}}
          onClick={() => handleGameChange()}
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
          <div style={{display:"flex"}}>
          <input onChange={()=> setAutoConnect(!autoConnect)} checked={autoConnect} type='checkbox'/>
          <div style={{margin:2}}>Auto Connect to {gameServer}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GameSwitcher;
