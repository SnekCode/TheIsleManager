import { useContext, useEffect, useState } from "react";
import evrimaBg from "assets/EvrimaBackground.png";
import legacyBg from "assets/LegacyBackground.png";
import "./styles.scss";
import { AppGameContext } from "Providers/AppGameProvider";
import { useApiReceiveEffect, useApiSend } from "Hooks/useApi";
import { EChannels } from "Shared/channels";
import { EGameNames } from "Shared/gamenames";

const games = {
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

  useEffect(() => {
    setGame(games[loadedGame]);
  }, [loadedGame]);

  useApiReceiveEffect(EChannels.configGame, (data: EGameNames) => {
    //fail case if data returns current loaded game to ui
    console.log("config game", data);
    
      setGame(games[data]);
      setLoadedGame(data);
  });

  return (
    <>
      <div
        className="splash"
        style={{ backgroundImage: `url(${games[loadedGame].bg})` }}
      ></div>
      <div className="game-container">
        <h2
          className={`${lock ? "locked" : "unlocked"} ${
            playing ? "playing" : ""
          } selectGame`}
          style={{ display: loadedStore ? "block" : "none"}}
          onClick={() => {
            if (lock) return;
            setGame(games[game.next]);
            // ui only lock
            setLock(true);
            useApiSend(EChannels.configGame, game.next);
          }}
        >
          Select Your Version: {game.name}
        </h2>
        <div className={`playButtonContainer`}>
          <button
            onClick={() => {
              if (lock) return;
              window.api.send(EChannels.startGame, games[loadedGame].lowerName);
            }}
            className={`${lock ? "locked" : "unlocked"} ${
              playing ? "playing" : ""
            } center playButton`}
          >
            Play Game
          </button>
        </div>
      </div>
    </>
  );
}

export default GameSwitcher;
