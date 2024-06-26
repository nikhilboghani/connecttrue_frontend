import React, { useEffect, useState } from 'react'
import { useChatState } from '../Context/ChatProvider';
import {  useToast } from '@chakra-ui/react';
import axios from 'axios';
import { Box } from '@chakra-ui/layout';
import { AddIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/button';
import { Text } from '@chakra-ui/layout';
import { Stack } from '@chakra-ui/layout';
import ChatLoading from './ChatLoading';
import { getSender } from "../config/ChatLogics";
import GroupChatModel from "./Miscellaneous/GroupChatModel";

function MyChats({ fetchAgain}) {

  const [loggedUser ,setLoggedUser]= useState();
  const { user, setUser,selectedChat ,setSelectedChat ,chats ,setChats } = useChatState();

  const toast = useToast();

  const fetchChats = async ()=>{
    try {
        const config = {
          headers :{
            Authorization: `Bearer ${user.token}`,
          
          },
        };
        const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/chat`, config);
        setChats(data);
    } catch (error) {

      toast({
        title: "Error",
        description: "failed to load chats",
        status: "error",
        duration: 3000,
        isClosable: true,
        position:"bottom-left"
      });
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]); 



  return (
      <Box
        display={{base:selectedChat ? "none" : "flex" , md:"flex"}}
        flexDirection="column"
        alignItems= "center"
        p="3"
        bg="gray.100"
        w={{base:"100%" , md:"30%"}}
        borderRadius="lg"
        borderWidth="1px"   
      >
        <Box
        pb={2}
        px={2}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        >
          My Chats  
          <GroupChatModel>
            <Button
               d="flex"
              
                fontSize={{ base: "18px", md: "10px", lg:"15px" }}
                 rightIcon={<AddIcon />}
               >
                  New Group Chat
          </Button>
          </GroupChatModel>       
        </Box>     
        <Box 
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden" 
        >
          {console.log("chats",chats)}
          {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                 <Text>
                 
                  {!(chat.isGroupChat === 'true')
                    ? chat.users[0].name
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
          </Box> 
      </Box>
  )
}

export default MyChats