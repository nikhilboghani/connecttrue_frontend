import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    
    const [user, setUser] = useState( null);
    const [selectedChat ,setSelectedChat] = useState();
    const [chats ,setChats] = useState([])
   
    const history = useHistory();


    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
    }, []);

    
  const navigate = (path) => {
    if(history) {
      history.push(path)  
    }
  };

  useEffect(() => {
    if(!user) {
      navigate("/"); 
    }
    else{
        navigate("/chats");
    }
  }, [user, navigate]);

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