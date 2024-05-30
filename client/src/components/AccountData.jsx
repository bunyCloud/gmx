import React, { useEffect, useState } from 'react';
import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Box
} from '@chakra-ui/react';

function AccountData() {
  const [accountData, setAccountData] = useState({
    accountAddress: '',
    providerUrl: '',
    balances: {}
  });

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:2021');

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'accountData') {
        setAccountData(data.data);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Clean up function to close WebSocket connection when component unmounts
    return () => {
      socket.close();
    };
  }, []);

  return (
    <Container maxW="container.sm" mt="2" >
      <Heading mb="4">Account Data</Heading>
      <Box mb="2">
        <strong>Account Address:</strong> {accountData.accountAddress}
      </Box>
      <Table variant="simple">
        <Thead >
          <Tr>
            <Th color='white'>Token</Th>
            <Th color='white'>Balance</Th>
            <Th color='white'>Minimum Balance</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(accountData.balances).map(([key, value]) => (
            <Tr key={key}>
              <Td>{key}</Td>
              <Td>{value.balance}</Td>
              <Td>{value.minBalance}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
}

export default AccountData;
