import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Container } from '@chakra-ui/react';

function AvaxPriceDisplay() {
  const [avaxPrice, setAvaxPrice] = useState(null);
  const websocketRef = useRef(null);

  useEffect(() => {
    function connect() {
      // Clear previous WebSocket connection if any
      if (websocketRef.current) {
        websocketRef.current.close();
      }

      // Establish a new WebSocket connection
      const socket = new WebSocket('ws://localhost:2021');
      websocketRef.current = socket;

      socket.onopen = () => {
        console.log("WebSocket connection established.");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'avaxPrice') {
          setAvaxPrice(data.price);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed. Attempting to reconnect...");
        // Attempt to reconnect every 5 seconds
        setTimeout(connect, 25000);
      };
    }

    connect();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  return (
    <Container centerContent mt="10">
      <Box p="4" borderWidth="1px" borderRadius="lg">
        {avaxPrice ? (
          <Text fontSize="xl">AVAX: ${avaxPrice}</Text>
        ) : (
          <Text fontSize="xl">Loading AVAX Price...</Text>
        )}
      </Box>
    </Container>
  );
}

export default AvaxPriceDisplay;
