import { useContext, useEffect, useState } from "react";
import evrimaBg from "./assets/EvrimaBackground.png";
import legacyBg from "./assets/LegacyBackground.png";
import "./App.scss";
import { AppGameContext } from "./Providers/AppGameProvider";
import { useApiReceiveEffect, useApiSend } from "./Hooks/useApi";
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

function App() {
  const [game, setGame] = useState(games.legacy);
  const { lock, setLock, setLoadedGame, loadedGame, playing } =
    useContext(AppGameContext);

  useEffect(() => {
    setGame(games[loadedGame]);
  }, []);

  useApiReceiveEffect(EChannels.configGame, (data: EGameNames) => {
    if (data !== game.lowerName) {
      setLoadedGame(data);
      setGame(games[data]);
    } else {
      setLoadedGame(data);
    }
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
          <div
            onClick={() => {
              if (lock) return;
              window.api.send(EChannels.startGame, games[loadedGame].lowerName);
            }}
            className={`${lock ? "locked" : "unlocked"} ${
              playing ? "playing" : ""
            } playButton`}
          >
            Play Game
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
