import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Text,
  Input,
  Button,
  useToast,
  HStack,
  Center,
  VStack
} from '@chakra-ui/react';

// Token addresses with their symbols for reference
const tokens = {
  wavax: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", // WAVAX
  weth: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", // WETH
  usdc: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", // USDC
  btc: "0x152b9d0FdC40C096757F570A51E494bd4b943E50"  // BTC
};

function DecreaseForm({ websocket, size, collateral,collateralWei, sizeWei, name, isShort }) {
  const [collateralTokenIn, setCollateralTokenIn] = useState('USDC'); // Default to USDC symbol
  const [indexToken, setIndexToken] = useState(tokens.weth);
  const [_amountIn, setAmount] = useState(collateralWei);
  const [sizeDelta, setDecreaseSize] = useState(sizeWei);
  const [isLong, setIsLong] = useState("");
  const toast = useToast();

  useEffect(() => {

    if (isShort) {
        setIsLong(true);
      } else {
        setIsLong(false);
      }
    // Dynamically set the index token based on the name
    switch (name) {
      case "WAVAX":
        setIndexToken(tokens.wavax);
        break;
      case "WETH":
        setIndexToken(tokens.weth);
        break;
      case "BTC":
        setIndexToken(tokens.btc);
        break;
      default:
        setIndexToken('Unknown Token');
        console.warn("Unsupported token name:", name);
    }
  }, [isShort, name]);

  const handleSendData = () => {
    const data = JSON.stringify({
      type: "closePosition",
      indexToken,
      _amountIn,
      sizeDelta,
      isLong
    });
    websocket && websocket.send(data);
  };



  return (
    <Box as="form" onSubmit={handleSendData} >
      <FormControl isRequired>
        <HStack><FormLabel>Collateral Token Symbol</FormLabel>
        <Text mt={-2} fontSize="md" fontWeight="bold">{collateralTokenIn}</Text></HStack>
      </FormControl>
      <FormControl isRequired mt={2}>
        <FormLabel>Index Token Symbol</FormLabel>
        <Text overflow='hidden' w='auto' mt={-1} fontSize="sm" fontWeight="bold">{indexToken}</Text>
      </FormControl>
      <FormControl isRequired mt={2}>
        <HStack><FormLabel>is long?</FormLabel>
        <Text mt={-2} fontWeight="bold">{isLong.toString()}</Text></HStack>
      </FormControl>
      <FormControl isRequired mt={2}>
        <FormLabel  htmlFor='collateral'>Amount Out</FormLabel>
        <Input
          id="collateral"
          type="number"
          value={_amountIn}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in"
        />
      </FormControl>
      <FormControl isRequired mt={2}>
        <FormLabel htmlFor='sizeDelta'>Decrease Size</FormLabel>
        <Input
          id="sizeDelta"
          type="number"
          value={sizeDelta}
          onChange={(e) => setDecreaseSize(e.target.value)}
          placeholder="Enter decrease size"
        />
      </FormControl>
      <Center>
      <Button  mt={6} colorScheme='messenger' type='submit'>Submit Decrease</Button>
      </Center>
    </Box>
  );
}

export default DecreaseForm;
