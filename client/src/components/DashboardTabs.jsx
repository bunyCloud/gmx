import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Container } from '@chakra-ui/react';
import SettingsDisplay from './SettingsDisplay'; // Import SettingsDisplay component
import AccountData from './AccountData';
import IntroDisplay from './IntroDisplay';
import ConfigDisplay from './ConfigDisplay';

function DashboardTabs() {
    return (
        <Container maxW="container.md" mt="5">
            <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                <Tab color='white'>Info</Tab>
                    <Tab color='white'>Account</Tab>
                    <Tab color='whhite'>Settings</Tab>
                </TabList>
                <TabPanels>
                <TabPanel>
                        <IntroDisplay />
                    </TabPanel>
                    <TabPanel>
                        <AccountData />
                    </TabPanel>
                    <TabPanel>
                        <ConfigDisplay />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    );
}

export default DashboardTabs;
