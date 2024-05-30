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
  Text,
  useDisclosure,
  HStack
} from '@chakra-ui/react';
import ActionTabs from './ActionTabs';
import DecreaseForm from './DecreaseForm';

function ShortPositionsTable() {
  const [positionsData, setPositionsData] = useState({
    wavaxShortPosition: [],
    wavaxLongPosition: [],
    btcShortPosition: [],
    btcLongPosition: [],
    wethShortPosition: [],
    wethLongPosition: [],
  });
  const websocketRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDecreaseOpen, onOpen: onDecreaseOpen, onClose: onDecreaseClose } = useDisclosure();
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
        if (message.type === 'allPositions') {
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

  const handleDecreaseModalOpen = (position) => {
    setActivePosition(position);
    onDecreaseOpen();
  };

  const getTotalSize = () => {
    return Object.values(positionsData).flat().reduce((acc, position) => acc + parseFloat(position.size), 0);
  };

  const renderPositionRows = (positionsArray) => {
    return positionsArray.map((position, index) => (
      <Tr key={index}>
        
        <Td style={{ width: '50px' }}>{position.positionIndex}</Td>
        <Td>{position.name}</Td>
        <Td>{position.positionIndex === 0 ? 'Long': 'Short'}</Td>
        <Td>${position.size}</Td>
        <Td>${position.collateral}</Td>
        <Td>{position.entryPrice}</Td>
        <Td>{position.hasProfit}</Td>
        <Td>{position.deltaPercentage}</Td>
        <Td>{position.delta}</Td>
        <Td>${position.sellPrice}</Td>
        <Td>
          <HStack spacing={2} justify='right'>
            <Button colorScheme='teal' onClick={() => handleModalOpen(position)}>Action</Button>
            
          </HStack>
        </Td>
      </Tr>
    ));
  };

  return (
    <Container maxW="container.lg" mt="3" bg='whitesmoke' color='darkblue'>
      <Heading mb="3">Position Data</Heading>
      <Box overflowX="auto">
      <Table variant="simple" size="small" style={{ tableLayout: 'fixed', width: '100%' }}>

  <Thead>
    <Tr>
    <Th style={{ width: '50px' }}>#</Th> 
      <Th></Th>
      <Th>Type</Th>
      <Th>Size</Th>
      <Th>In</Th>
      <Th>Avg.</Th>
      <Th>Profit?</Th>
      <Th>%</Th>
      <Th>Delta</Th>
      <Th>Sell</Th>
      <Th style={{ position: 'sticky', right: 0, background: 'white', zIndex: 1, textAlign: 'right' }}>Action</Th>

    </Tr>
  </Thead>
  <Tbody>
    {renderPositionRows(positionsData.wavaxShortPosition)}
    {renderPositionRows(positionsData.wavaxLongPosition)}
    {renderPositionRows(positionsData.btcShortPosition)}
    {renderPositionRows(positionsData.btcLongPosition)}
    {renderPositionRows(positionsData.wethShortPosition)}
    {renderPositionRows(positionsData.wethLongPosition)}
  </Tbody>
</Table>

      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Action</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ActionTabs
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

      
      <Box mt="4">
        <Text>Total Size: ${getTotalSize().toFixed(2)}</Text>
      </Box>
    </Container>
  );
}

export default ShortPositionsTable;
