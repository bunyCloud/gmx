import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Heading,
} from '@chakra-ui/react';
import AvaxPriceDisplay from './AvaxPriceDisplay';

function TokenPrices() {
  const [tokenPrices, setTokenPrices] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:2021');

    socket.onopen = () => {
      console.log("WebSocket connection established.");
      // Request token prices
      socket.send(JSON.stringify({ type: 'requestTokenPrices' }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'tokenPrices') {
        setTokenPrices(message.data);
      }
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
    <Container maxW="container.sm" mt="0">
      <Heading mb="1">Token Prices</Heading>
      <Box overflowX="auto">
        <AvaxPriceDisplay />
      </Box>
    </Container>
  );
}

export default TokenPrices;
