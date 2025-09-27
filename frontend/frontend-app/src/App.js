import { useState } from "react";

const gifts = ['candy', 'toys', 'soft drinks']

function App() {

  const [gift, setGift] = useState()
  const randomGift = () => {
    const index = Math.floor(Math.random() * gifts.length)
    console.log(gifts[index]);

  }

  return (
    <div className="App" style={{ padding: 30 }}>
      <h1>Hello World</h1>
      <button onClick={randomGift} >Random Gift</button>
    </div>
  );
}

export default App;
