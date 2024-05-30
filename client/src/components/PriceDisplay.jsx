import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Container, VStack, Heading } from '@chakra-ui/react';

function PriceDisplay() {
  const [prices, setPrices] = useState({
    btcPrice: null,
    wethPrice: null,
    wavaxPrice: null
  });
  const websocketRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }

      const ws = new WebSocket('ws://localhost:2021');
      websocketRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connection established.");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'btcPrice':
            setPrices(prevPrices => ({ ...prevPrices, btcPrice: data.price }));
            break;
          case 'wethPrice':
            setPrices(prevPrices => ({ ...prevPrices, wethPrice: data.price }));
            break;
          case 'avaxPrice':
            setPrices(prevPrices => ({ ...prevPrices, avaxPrice: data.price }));
            break;
          default:
            break;
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed. Attempting to reconnect...");
        setTimeout(connectWebSocket, 45000);  // Try to reconnect every 5 seconds
      };
    };

    connectWebSocket();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  return (
    <Container centerContent mt="5">
      <Box borderWidth="1px" borderRadius="lg" mb={5} bg="white" color='blue'>
        <VStack spacing={1}>
          <Heading mb="4">Cryptocurrency Prices</Heading>
          <Text fontSize="xl">BTC: ${prices.btcPrice || 'Loading...'}</Text>
          <Text fontSize="xl">WETH: ${prices.wethPrice || 'Loading...'}</Text>
          <Text fontSize="xl">WAVAX: ${prices.wavaxPrice || 'Loading...'}</Text>
        </VStack>
      </Box>
    </Container>
  );
}

export default PriceDisplay;
