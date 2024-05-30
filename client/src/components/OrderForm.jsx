import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Heading,
  Switch,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text
} from "@chakra-ui/react";
import DecreaseForm from "./DecreaseForm";

// Assuming token addresses are imported here
const wavax = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
// WETH
const weth = "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB";
// USDC
const usdc = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E";
// BTC.b
const btc = "0x152b9d0FdC40C096757F570A51E494bd4b943E50";

function OrderForm({
  websocket,
  size,
  collateral,
  collateralWei,
  targetPrice,
  name,
  isShort,
}) {
  const [indexToken, setIndexToken] = useState(wavax);
  const [sizeDelta, setSizeDelta] = useState(size);
  const [collateralToken, setCollateralToken] = useState(usdc);
  const [collateralDelta, setCollateralDelta] = useState(collateral);
  const [isLong, setIsLong] = useState("");
  const [triggerPrice, setTriggerPrice] = useState(targetPrice);
  const [triggerAboveThreshold, setTriggerAboveThreshold] = useState(true);

  useEffect(() => {
    if (isShort) {
      setIsLong(true);
    } else {
      setIsLong(false);
    }
    // Dynamically set the collateralToken based on the name
    switch (name) {
      case "WAVAX":
        setIndexToken(wavax);
        break;
      case "WETH":
        setIndexToken(weth);
        break;
      case "BTC":
        setIndexToken(btc);
        break;
      default:
        console.warn("Unsupported token name:", name);
    }
  }, [name, isShort]);

  const handleSendData = () => {
    const data = JSON.stringify({
      type: "createDecreaseOrder",
      indexToken,
      sizeDelta,
      collateralToken,
      collateralDelta,
      isLong,
      triggerPrice: parseFloat(triggerPrice),
      triggerAboveThreshold,
    });
    websocket && websocket.send(data);
  };

  return (
    <VStack >
      <Heading size="sm">Sell Order</Heading>

      <FormControl isRequired>
        <FormLabel htmlFor="sizeDelta">Position Size</FormLabel>
        <Input
          id="sizeDelta"
          type="number"
          value={sizeDelta}
          onChange={(e) => setSizeDelta(e.target.value)}
          placeholder="Enter size delta"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel htmlFor="collateralDelta">Collateral Delta</FormLabel>

        <Input
          id="collateralDelta"
          type="number"
          value={collateralDelta}
          onChange={(e) => setCollateralDelta(e.target.value)}
          placeholder="Enter collateral delta"
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="isLong" mb="0">
          Is Long
        </FormLabel>
        {isLong.toString()}
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="triggerPrice">Trigger Price</FormLabel>
        <Input
          id="triggerPrice"
          type="number"
          value={triggerPrice}
          onChange={(e) => setTriggerPrice(e.target.value)}
          placeholder="Enter trigger price"
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="triggerAboveThreshold" mb="0">
          Trigger Above Threshold
        </FormLabel>
        <Switch
          id="triggerAboveThreshold"
          isChecked={triggerAboveThreshold}
          onChange={(e) => setTriggerAboveThreshold(e.target.checked)}
        />
      </FormControl>
      <Button colorScheme="messenger" onClick={handleSendData}>
        Submit Sell Order
      </Button>
    </VStack>
    
  );
}

export default OrderForm;
