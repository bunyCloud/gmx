import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Button,
  VStack,
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
  Box,
  Select,
  Text,
  Input,
} from '@chakra-ui/react';
import { AppContext } from '../../AppContext';
import Reader from "./contracts/Reader.json";
import PositionRouter from "./contracts/PositionRouter.json";
import SizeDelta from './micro/SizeDelta';


const GmxClosePosition = () => {
  const {erc20ABI, account } = useContext(AppContext); // Assuming account holds the user's Ethereum address
  const [amountIn, setAmountIn] = useState('');
  const [minOut, setMinOut] = useState(0);
  const [sizeDelta, setSizeDelta] = useState('0');
  const [acceptablePrice, setAcceptablePrice] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [callbackTarget, setCallbackTarget] = useState('');
  const [tokenInAddress, setTokenInAddress] = useState("");
  const usdc = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E";
  const wavax = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
  const weth = "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB";
  const executionFee = ethers.utils.parseUnits("0.02", "ether"); // 0.02 ETH

  const handleDepositToken = (event) => {
    const selectedToken = event.target.value;
    switch (selectedToken) {
      case "weth":
        setTokenInAddress(weth);
        break;
      case "wavax":
        setTokenInAddress(wavax);
        break;
      case "usdc":
        setTokenInAddress(usdc);
        break;
      default:
        setTokenInAddress('');
    }
  };


  

  const handleCreateDecreasePosition = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(PositionRouter.address, PositionRouter.abi, signer);

      const tx = await contract.createDecreasePosition(
        [weth], // path
        weth, // indexToken
        ethers.utils.parseUnits(amountIn, 'ether'),
        minOut,
        sizeDelta,
        true, // isLong
        acceptablePrice,
        executionFee,
        ethers.utils.formatBytes32String(referralCode),
        callbackTarget,
        { value: executionFee }
      );
      await tx.wait();
    } catch (error) {
      console.error(error);
    }
  };




  return (
    <VStack spacing={4}>
      
      <FormControl>
      <FormLabel>Token</FormLabel>
      <Box>
      <Text>Selected: {tokenInAddress === wavax ? "WAVAX" : tokenInAddress === weth ? "WETH" : "USDC"}</Text>
          <Select placeholder="Select Token" onChange={handleDepositToken}>
            <option value="weth">WETH</option>
            <option value="wavax">WAVAX</option>
            <option value="usdc">USDC</option>
          </Select>
      </Box>
   
      {/* Amount In Input */}
      <FormControl>
        <FormLabel>Amount In</FormLabel>
        <NumberInput value={amountIn} onChange={setAmountIn}>
          <NumberInputField placeholder="Amount In (ETH)" />
        </NumberInput>
      </FormControl>


      {/*  */}
      <FormControl>
        <FormLabel>Size Delta</FormLabel>
        <Input
          value={sizeDelta}
          onChange={(e) => setSizeDelta(e.target.value)}
          placeholder="Size Delta"
        />
      </FormControl> 
    <SizeDelta size={sizeDelta}/>

      {/* Acceptable Price Input */}
      <FormControl>
        <FormLabel>Acceptable Price</FormLabel>
        <Input
          value={acceptablePrice}
          onChange={(e) => setAcceptablePrice(e.target.value)}
          placeholder="Acceptable Price"
        />
      </FormControl>

     
</FormControl>
      <Button onClick={handleCreateDecreasePosition}>Create Decrease Position</Button>
    </VStack>
  );
};

export default GmxClosePosition;
