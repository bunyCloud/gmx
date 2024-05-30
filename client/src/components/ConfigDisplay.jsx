import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  Divider,
  Input,
  Button,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

function ConfigDisplay() {
  const [config, setConfig] = useState({});
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:2021');
    websocket.onopen = () => {
      console.log("WebSocket connected");
      websocket.send(JSON.stringify({ type: "getConfig" }));
    };
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "config") {
        console.log("Config received:", data.config);
        setConfig(data.config);
      }
    };
    setWs(websocket);
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const handleInputChange = (key, value) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      [key]: value
    }));
  };

  const updateConfig = () => {
    if (ws) {
      ws.send(JSON.stringify({
        type: "updateConfig",
        config: config
      }));
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box p={5} shadow="md" borderWidth="1px">
        <Text fontSize="xl">Configuration Data</Text>
        {Object.keys(config).map((key) => (
          <FormControl key={key} my={2}>
            <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
            <Input
              value={config[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
          </FormControl>
        ))}
        <Button colorScheme="blue" mt={4} onClick={updateConfig}>Update Config</Button>
      </Box>
    </VStack>
  );
}

export default ConfigDisplay;
