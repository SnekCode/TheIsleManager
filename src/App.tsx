import { useState } from "react";
import evrimaBg from "./assets/EvrimaBackground.png";
import legacyBg from "./assets/LegacyBackground.png";
import "./App.scss";

const games = {
  evrima: {
    name: "Evrima",
    bg: evrimaBg,
  },
  legacy: {
    name: "Legacy",
    bg: legacyBg,
  },
};

function App() {
  const [nextGame, setNextGame] = useState(games.evrima);
  const [game, setGame] = useState(games.legacy);

  return (
    <>
      <div
        className="splash"
        style={{ backgroundImage: `url(${game.bg})` }}
      ></div>
      <div className="game-container">
        <h2
          className="selectGame"
          onClick={() => {
            setGame(nextGame);
            setNextGame(game);
          }}
        >
          Select Your Version: {game.name}
        </h2>
          <div className="playButtonContainer">
            <div className="playButton">Play Game</div>
          </div>
      </div>
    </>
  );
}

export default App;
