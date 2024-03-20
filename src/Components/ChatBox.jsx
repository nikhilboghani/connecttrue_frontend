import React from 'react'
import { Box } from '@chakra-ui/layout';
import { useChatState } from '../Context/ChatProvider';
import SingleChat from './SingleChat';

function ChatBox( {fetchAgain, setFetchAgain}) {

   const {selectedChat } = useChatState();

  return (
    <Box
       display={{base:selectedChat ? "flex" : "none" , md:"flex"}}
       alignItems="center"
       flexDir="column"
       p="3"
       bg="gray.100"
       w={{base:"100%" , md:"68%"}}
       borderRadius="lg"
       borderWidth="1px"
    
    >
      <SingleChat fetchAgain ={fetchAgain} setFetchAgain={setFetchAgain} />
           
    </Box>
  )
}

export default ChatBox