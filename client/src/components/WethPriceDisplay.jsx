import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Container } from '@chakra-ui/react';

function WethPriceDisplay() {
  const [wethPrice, setWethPrice] = useState(null);
  const websocketRef = useRef(null);

  useEffect(() => {
    function connect() {
      // Clean up previous WebSocket connection if it exists
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
        if (data.type === 'wethPrice') {
          setWethPrice(data.price);
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
        {wethPrice ? (
          <Text fontSize="xl">WETH: ${wethPrice}</Text>
        ) : (
          <Text fontSize="xl">Loading WETH Price...</Text>
        )}
      </Box>
    </Container>
  );
}

export default WethPriceDisplay;
