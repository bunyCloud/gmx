import React from 'react';
import { Box, Container, HStack, Heading } from '@chakra-ui/react'
import ShortPositionsTable from './components/ShortPositionsTable';
import AvaxPriceDisplay from './components/AvaxPriceDisplay';
import WethPriceDisplay from './components/WethPriceDisplay';
import BtcPriceDisplay from './components/BtcPriceDisplay';
import ClientComponent from './components/ClientComponent';
import DashboardTabs from './components/DashboardTabs';
import LongPositionsTable from './components/LongPositionsTable';
import PositionsTable from './components/PositionsTable';

function App() {
  return (
    <div className="App">
    <Box bg='blue' color='white' p={5}>
      <Heading>BUNY</Heading>
    </Box>
    <Box m='10px' bg='blue' color='white' p={3}>
    <ClientComponent/>
      <DashboardTabs />
      <Container maxW="container.sm" mt="1">
      <Heading mb="1">Token Prices</Heading>
      <HStack mb={4} mt={-4}>
      <Box overflowX="auto">
        <AvaxPriceDisplay />
      </Box>
      <Box overflowX="auto">
        <WethPriceDisplay />
      </Box>
      <Box overflowX="auto">
        <BtcPriceDisplay />
      </Box>
      </HStack>
    </Container>
      <PositionsTable />
      

      </Box>
    </div>
  );
}

export default App;
