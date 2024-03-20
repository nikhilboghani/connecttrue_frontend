import { useChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideBar from "../Components/Miscellaneous/SideBar";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import { useState } from "react";


function ChatPage () {

const {user = {}} = useChatState() || {};

const [fetchAgain, setFetchAgain] = useState(false)
  
  return (
    <div style={{width :"100%"}}>
      {user && <SideBar /> }

      <Box 
        display="flex" 
        justifyContent="space-between" 
        width="100%" 
        height="91.5vh" 
        p={10}
       
      >
          {user &&  <MyChats  
                fetchAgain ={fetchAgain}  
          />}
          {user && <ChatBox
                fetchAgain ={fetchAgain} setFetchAgain={setFetchAgain} 
          
          />}
      </Box>

    </div>
  );
};

export default ChatPage