import { useContext, useEffect, useState } from "react";
import evrimaBg from "assets/EvrimaBackground.png";
import legacyBg from "assets/LegacyBackground.png";
import "./styles.scss";
import { AppGameContext } from "Providers/AppGameProvider";
import { useApiReceiveEffect, apiSend } from "Hooks/useApi";
import { EChannels } from "Shared/channels";
import { EGameNames } from "Shared/gamenames";

const games = {
  none: {
    name: "None",
    lowerName: "none",
    bg: "red",
    next: EGameNames.evrima,
  },
  evrima: {
    name: "Evrima",
    lowerName: EGameNames.evrima,
    bg: evrimaBg,
    next: EGameNames.legacy,
  },
  legacy: {
    name: "Legacy",
    lowerName: EGameNames.legacy,
    bg: legacyBg,
    next: EGameNames.evrima,
  },
};

function GameSwitcher() {
  const { lock, setLock, setLoadedGame, loadedGame, playing, loadedStore } =
    useContext(AppGameContext);
  const [game, setGame] = useState(games[loadedGame]);
  const [lastGame, setLastGame] = useState(games[loadedGame]);


  useEffect(() => {
    setGame(games[loadedGame])
  }, [loadedGame]);

  useApiReceiveEffect(EChannels.configGame, (data: EGameNames) => {
    if (data !== game.lowerName) {
      setLoadedGame(data);
      setGame(games[data]);
    } else {
      setLoadedGame(data);
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
              window.api.send(EChannels.startGame, games[loadedGame].lowerName);
            }}
            className={`${lock ? "locked" : "unlocked"} ${
              playing ? "playing" : ""
            } center playButton`}
            style={{ display: game.name === "None" ? "none" : "block" }}
          >
            Play Game
          </button>
        </div>
      </div>
    </>
  );
}

export default GameSwitcher;
