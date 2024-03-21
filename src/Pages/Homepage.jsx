import React from 'react';
import { Container, Box, Text ,Center } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import SignUp from '../Components/Authntication/SignUp';
import Login from '../Components/Authntication/Login';
// import { useHistory } from "react-router-dom";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';




function Homepage() {
  
  const  navigateTo = useNavigate()
  // const history = useHistory();
 
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"))
        
       if(user)
           navigateTo('/chats')
       

    }, [history]);
 
 
  return (
    <Container maxW='xl' centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={4}
       
        width="100%"
        m="40px 0px 15px 0px"
        color='black'
        textShadow='1px 1px 2px #000000'
       >
        <Center>
             <Text fontSize="4xl" fontFamily= "work sans">Connect True !</Text>
          </Center>    
       
      </Box>
      <br /> <br />
      <Box
        d="flex"
        justifyContent="center"
        p={4}
        bg="aliceblue"
        width="100%"
        borderRadius="2xl"
        borderWidth="1px"
      >
        <Tabs variant='soft-rounded' isFitted>
          <TabList>
            <Tab fontFamily="work sans" width="50%" _selected={{ color: 'black', bg: "#a0bbf5" }}>Login</Tab>
            <Tab fontFamily="work sans" width="50%" _selected={{ color: 'black', bg: '#a0bbf5' }}>SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;

