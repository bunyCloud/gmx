import React, { useState, useEffect } from 'react';

function ConfigUpdater() {
  const [ws, setWs] = useState(null);
  const [sellLimit, setSellLimit] = useState('');
  const [lossLimit, setLossLimit] = useState('');
  const [newEntryLimit, setNewEntryLimit] = useState('');
  const [leverage, setLeverage] = useState('');
  const [increaseSize, setIncreaseSize] = useState('');
  const [decreaseSize, setDecreaseSize] = useState('');
  const [minSize, setMinSize] = useState('');
  const [cooldownPeriod, setCooldownPeriod] = useState('');

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:2021');
    websocket.onopen = () => console.log("WebSocket connected");
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "configUpdated") {
        console.log("Config updated:", data.config);
      }
    };

    setWs(websocket);

    return () => websocket.close();
  }, []);

  const updateConfig = () => {
    if (ws) {
      ws.send(JSON.stringify({
        type: "updateConfig",
        config: {
          sellLimit: parseFloat(sellLimit),
          lossLimit: parseFloat(lossLimit),
          newEntryLimit: parseFloat(newEntryLimit),
          leverage: parseInt(leverage),
          increaseSize: parseInt(increaseSize),
          decreaseSize: parseInt(decreaseSize),
          minSize: parseInt(minSize),
          cooldownPeriod: parseInt(cooldownPeriod),
        }
      }));
    }
  };

  return (
    <div>
      <input value={sellLimit} onChange={(e) => setSellLimit(e.target.value)} placeholder="Sell Limit" />
      <input value={lossLimit} onChange={(e) => setLossLimit(e.target.value)} placeholder="Loss Limit" />
      <input value={newEntryLimit} onChange={(e) => setNewEntryLimit(e.target.value)} placeholder="New Entry Limit" />
      <input value={leverage} onChange={(e) => setLeverage(e.target.value)} placeholder="Leverage" />
      <input value={increaseSize} onChange={(e) => setIncreaseSize(e.target.value)} placeholder="Increase Size" />
      <input value={decreaseSize} onChange={(e) => setDecreaseSize(e.target.value)} placeholder="Decrease Size" />
      <input value={minSize} onChange={(e) => setMinSize(e.target.value)} placeholder="Min Size" />
      <input value={cooldownPeriod} onChange={(e) => setCooldownPeriod(e.target.value)} placeholder="Cooldown Period" />
      <button onClick={updateConfig}>Update Config</button>
    </div>
  );
}

export default ConfigUpdater;
