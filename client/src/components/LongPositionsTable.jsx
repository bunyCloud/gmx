import React, { useState, useEffect, useRef } from 'react';
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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import OrderForm from './OrderForm';

function LongPositionsTable() {
  const [positionsData, setPositionsData] = useState({
    wavaxLongPosition: [],
    btcLongPosition: [],
    wethLongPosition: []
  });
  const websocketRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activePosition, setActivePosition] = useState(null);

  useEffect(() => {
    function connect() {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      const socket = new WebSocket('ws://localhost:2021');
      websocketRef.current = socket;

      socket.onopen = () => console.log("WebSocket connection established.");
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'allLongPositions') {
          setPositionsData(prevState => ({
            ...prevState,
            ...message.data
          }));
        }
      };
      socket.onerror = (error) => console.error("WebSocket error:", error);
      socket.onclose = () => {
        console.log("WebSocket connection closed. Attempting to reconnect...");
        setTimeout(connect, 30000);  // Adjust timeout as needed
      };
    }
    connect();
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const handleModalOpen = (position) => {
    setActivePosition(position);
    onOpen();
  };

  const renderPositionRows = (positionsArray) => {
    return positionsArray.map((position, index) => (
      <Tr key={index}>
        <Td>{position.positionIndex}</Td>
        <Td>{position.name}</Td>
        <Td>{position.isShort === true ? 'Long' : 'Short'}</Td>
        <Td>${position.size}</Td>
        <Td>${position.collateral}</Td>
        <Td>{position.entryPrice}</Td>
        <Td>{position.lastIncreasedTime}</Td>
        <Td>{position.deltaPercentage}</Td>
        <Td color={position.hasProfit ? 'red.500' : 'green.500'}>{position.delta}</Td>
        <Td>{position.sellPrice}</Td>
        <Td>
          <Button onClick={() => handleModalOpen(position)}>Create Order</Button>
        </Td>
      </Tr>
    ));
  };

  return (
    <Container maxW="container.lg" mt="3" bg='whitesmoke' color='darkblue'>
      <Heading mb="3">Long Data</Heading>
      <Box overflowX="auto">
        <Table variant="simple" size='small'>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Size</Th>
              <Th>Collateral</Th>
              <Th>Avg.</Th>
              <Th>Last Inc.</Th>
              <Th>Delta%</Th>
              <Th>Delta</Th>
              <Th>Sell</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {renderPositionRows(positionsData.wavaxLongPosition)}
            {renderPositionRows(positionsData.btcLongPosition)}
            {renderPositionRows(positionsData.wethLongPosition)}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OrderForm
              websocket={websocketRef.current}
              size={activePosition ? activePosition.size : ''}
              collateral={activePosition ? activePosition.collateral : ''}
              collateralWei={activePosition ? activePosition.collateralWei : ''}
              targetPrice={activePosition ? activePosition.sellPrice : ''}
              name={activePosition ? activePosition.name : ''}
              isShort={activePosition ? activePosition.isShort : ''}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default LongPositionsTable;
