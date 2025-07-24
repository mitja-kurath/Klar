import { useState } from "react";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");

  return (
    <div>
        <h1 className="text-3xl font-bold underline">
    Hello world!
  </h1>
    </div>

  )
}

export default App;
