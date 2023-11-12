import "./App.scss";
import GameSwitcher from "Pages/GameSwitcher/GameSwitcher";
import UpdateBar from "./Components/UpdateBar";

function App() {
  return (
    <div>
      <UpdateBar />
      <GameSwitcher />
    </div>
  );
}

export default App;
