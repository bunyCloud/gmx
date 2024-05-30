import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Heading,
  Text
} from '@chakra-ui/react';

function IntroDisplay() {
  const [introData, setIntroData] = useState({
    name: '',
    author: '',
    version: '',
    license: '',
    network: '',
    exchange: '',
    description: ''
  });

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:2021'); // Make sure the port is correct

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'intro') {
        setIntroData(message.data);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <Container maxW="container.sm" mt="2" >
      <Heading mb="4">{introData.name}</Heading>
      <Table variant="simple">
        
        <Tbody>
          {Object.entries(introData).map(([key, value]) => {
            if (key !== 'name') { // Skip the name since it's used as a heading
              return (
                <Tr key={key}>
                  <Td>{key.charAt(0).toUpperCase() + key.slice(1)}</Td>
                  <Td>{value}</Td>
                </Tr>
              );
            }
            return null;
          })}
        </Tbody>
      </Table>
    </Container>
  );
}

export default IntroDisplay;
