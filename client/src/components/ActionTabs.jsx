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
  Text,
} from "@chakra-ui/react";
import DecreaseForm from "./DecreaseForm";
import OrderForm from "./OrderForm";

// Assuming token addresses are imported here
const wavax = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
// WETH
const weth = "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB";
// USDC
const usdc = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E";
// BTC.b
const btc = "0x152b9d0FdC40C096757F570A51E494bd4b943E50";

function ActionTabs({
  websocket,
  size,
  sizeWei,
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


  return (
    <Tabs isFitted variant="enclosed">
      <TabList mb="1em">
        <Tab>Decrease</Tab>
        <Tab>Increase</Tab>
        <Tab>Sell Order</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <DecreaseForm
            websocket={websocket}
            size={size}
            sizeWei={sizeWei}
            collateral={collateral}
            collateralWei={collateralWei}
            targetPrice={targetPrice}
            name={name}
            isShort={isShort}
          />
        </TabPanel>

        <TabPanel>Increase Position</TabPanel>
        <TabPanel>
          <OrderForm
            websocket={websocket}
            size={size}
            collateral={collateral}
            collateralWei={collateralWei}
            targetPrice={targetPrice}
            name={name}
            isShort={isShort}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default ActionTabs;
