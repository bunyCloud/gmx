import React, { useState, useEffect } from 'react';
import { Container, Box, Table, Thead, Tbody, Tr, Th, Td, Text, Heading } from '@chakra-ui/react';

function SettingsDisplay() {
    const [settingsData, setSettingsData] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:2021');

        socket.onopen = () => {
            console.log("WebSocket connection established.");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'getConfig') {
                setSettingsData(data.data);
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <Container maxW="container.sm" mt="5" >
      <Heading mb="4">Settings</Heading>
            <Box p="4"  color="white">
                {settingsData ? (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Setting</Th>
                                <Th>Value</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            
                            <Tr>
                                <Td>Provider URL</Td>
                                <Td>{settingsData.providerUrl}</Td>
                            </Tr>
                            <Tr>
                                <Td>Sell Limit</Td>
                                <Td>{settingsData.sellLimit}</Td>
                            </Tr>
                            <Tr>
                                <Td>Loss Limit</Td>
                                <Td>{settingsData.lossLimit}</Td>
                            </Tr>
                            <Tr>
                                <Td>New Entry Limit</Td>
                                <Td>{settingsData.newEntryLimit}</Td>
                            </Tr>
                            <Tr>
                                <Td>Leverage</Td>
                                <Td>{settingsData.leverage}</Td>
                            </Tr>
                            <Tr>
                                <Td>Increase Size</Td>
                                <Td>{settingsData.increaseSize}</Td>
                            </Tr>
                            <Tr>
                                <Td>Decrease Size</Td>
                                <Td>{settingsData.decreaseSize}</Td>
                            </Tr>
                            <Tr>
                                <Td>Minimum Size</Td>
                                <Td>{settingsData.minSize}</Td>
                            </Tr>
                            <Tr>
                                <Td>Time Delay</Td>
                                <Td>{settingsData.timeDelay}</Td>
                            </Tr>
                            <Tr>
                                <Td>Cooldown Period</Td>
                                <Td>{settingsData.cooldownPeriod}</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                ) : (
                    <Text fontSize="xl">Loading Settings...</Text>
                )}
            </Box>
        </Container>
    );
}

export default SettingsDisplay;
