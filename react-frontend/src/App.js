import logo from "./logo.svg";
import "./App.css";
import Message from "./components/Message";
import PDF from "./components/PDF";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Message></Message>
        <PDF></PDF>
      </header>
    </div>
  );
}

export default App;
