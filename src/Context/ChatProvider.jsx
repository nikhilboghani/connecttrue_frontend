import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const  navigateTo = useNavigate()
    
    const [user, setUser] = useState( null);
    const [selectedChat ,setSelectedChat] = useState();
    const [chats ,setChats] = useState([])
   


    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
    }, []);

    
 

  useEffect(() => {
    if(!user) {
      navigateTo("/"); 
    }
    else{
        navigateTo("/chats");
    }
  }, [user]);

    return (
        <ChatContext.Provider 
        value={{ user, setUser,selectedChat ,setSelectedChat ,chats ,setChats }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatState = () => {

    return useContext(ChatContext);
}


export default ChatProvider;