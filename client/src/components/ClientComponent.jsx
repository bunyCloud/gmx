import React, { useState, useEffect } from 'react';
import { Box, Text, Container } from '@chakra-ui/react';

function ClientComponent() {
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:2021');

    socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'clientId') {
        setClientId(data.id);
        console.log(`Received Client ID: ${data.id}`);
      }
      // Handle other message types...
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <Container centerContent mt="10">
      <Box p="4" borderWidth="1px" borderRadius="sm">
        <Text fontSize="md">Client ID: {clientId}</Text>
      </Box>
    </Container>
  );
}

export default ClientComponent;
