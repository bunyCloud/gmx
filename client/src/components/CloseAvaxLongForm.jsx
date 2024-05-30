import React, { useState, useEffect } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Container
} from '@chakra-ui/react';

function CloseAvaxLongForm() {
  const [collateralIn, setCollateralIn] = useState('');
  const [decreaseSize, setDecreaseSize] = useState('');
  const [websocket, setWebsocket] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Create WebSocket connection.
    const ws = new WebSocket('ws://localhost:2021'); // Change URL as needed

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setWebsocket(ws);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'response') {
        toast({
          title: message.status === 'success' ? 'Success' : 'Error',
          description: message.status === 'success' ? 'Order successfully submitted.' : message.message,
          status: message.status,
          duration: 9000,
          isClosable: true,
        });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Clean up function
    return () => {
      ws.close();
    };
  }, []);

  const handleSubmit = () => {
    if (!websocket) {
      toast({
        title: "Error",
        description: "WebSocket is not connected.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const data = {
      type: 'closeAvaxLong',
      collateralIn: parseFloat(collateralIn),
      decreaseSize: parseFloat(decreaseSize)
    };

    websocket.send(JSON.stringify(data));
  };

  return (
    <Container maxW="container.sm" mt="2" >
    <VStack spacing={4} padding={5}>
      <FormLabel htmlFor='close avax long'>Close Avax Long</FormLabel>
      <FormControl isRequired>
        <FormLabel htmlFor='collateralIn'>Collateral In</FormLabel>
        <Input
          id='collateralIn'
          type='number'
          value={collateralIn}
          onChange={(e) => setCollateralIn(e.target.value)}
          placeholder='Enter collateral amount'
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='decreaseSize'>Decrease Size</FormLabel>
        <Input
          id='decreaseSize'
          type='number'
          value={decreaseSize}
          onChange={(e) => setDecreaseSize(e.target.value)}
          placeholder='Enter decrease size'
        />
      </FormControl>
      <Button colorScheme='blue' onClick={handleSubmit}>Submit Order</Button>
    </VStack>
    </Container>
  );
}

export default CloseAvaxLongForm;
