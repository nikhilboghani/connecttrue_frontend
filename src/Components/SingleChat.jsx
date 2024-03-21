import { Box, Text } from "@chakra-ui/layout";
import { IconButton } from "@chakra-ui/button";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import ProfileModel from "./Miscellaneous/ProfileModel"; // Make sure to import your ProfileModel component
import { useChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import UpdateGroupChatModel from "./Miscellaneous/UpdateGroupChatModel"; // Make sure to import your UpdateGroupChatModel component
import { useDisclosure } from "@chakra-ui/hooks";
import { Spinner } from "@chakra-ui/spinner";
import {  useState ,useEffect } from "react";
import { FormControl, Input } from "@chakra-ui/react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import "../Components/styles.css"
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:3000";
const apiUrl = process.env.REACT_APP_BACKEND_URL;

var  socket , selectedChatCompare;


function SingleChat({ fetchAgain, setFetchAgain }) {

    const toast = useToast();

    const { user, selectedChat, setSelectedChat } = useChatState();
    const [messages , setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState([])
    const [SocketConnection, setSocketConnection] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

   const defaultOptions ={
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
   }



    const fetchMessages = async () => {
         if(!selectedChat) return;

         try {
             const config ={
                    headers : {
                        "Authorization" : `Bearer ${user.token}`
                    }
                };
                setLoading(true);
                const {data} = await axios.get(`${apiUrl}/api/chat/message/${selectedChat._id}`, config);
                setMessages(data);
                setLoading(false);

                socket.emit("join chat", selectedChat._id);

         } catch (error) {
             toast({
                    title: "Error",
                    description: "Failed to send message",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
         }
    };

        useEffect(() => {
         socket = io(ENDPOINT); 
         socket.emit("setup", user);
         socket.on("connected", () => setSocketConnection(true));
         socket.on("typing", () => setIsTyping(true));
         socket.on("stop typing", () => setIsTyping(false));
        }, []);


    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;

    }, [selectedChat]);

    useEffect(() => {
        socket.on("new message", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });





    const sendMessage = async(e) => {
        if (e.key === "Enter" && newMessage) {
            try {
                const config ={
                    headers : {
                        "Content-Type" : "application/json",
                        "Authorization" : `Bearer ${user.token}`
                    }
                }
                
                const {data} = await axios.post("/api/chat/message" ,{
                    content : newMessage,
                    chatId : selectedChat._id
                
                },config);

                   

                socket.emit("new message", data);
                setNewMessage("");
                    setMessages([...messages, data])

            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to send message",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            }
        }
    };


     

    const typingHandler  = (e) => {
        setNewMessage(e.target.value)
        //typing indicator

           if(!SocketConnection) return;
           if(!typing){
               setTyping(true);
               socket.emit("typing", selectedChat._id);
           }
          let lastTypingTime = new Date().getTime();
          var timerLength = 3000;

           setTimeout(() => {
                var timeNow = new Date().getTime();
                var timeDiff = timeNow - lastTypingTime;

                if(timeDiff >= timerLength && typing){
                    socket.emit("stop typing", selectedChat._id);
                    setTyping(false);
                }
           }, timerLength); 
    };
    
    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        fontFamily="work sans"
                        pb="3"
                        px="2"
                        w="100%"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                            />
                        {(selectedChat.isGroupChat === 'true') ? (
                            <>
                            {selectedChat.chatName.toUpperCase()}
                                  <UpdateGroupChatModel
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        ) : (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                            </>
                        )}
                    </Text>

                    <Box
                        display="flex"
                        h="100%"
                        w="100%"
                        flexDirection="column"
                        justifyContent="flex-end"
                        bg="white"
                        p="3"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        { loading ?(

                        <Spinner 
                            size="xl"
                            w="20"
                            h="20"
                            alignSelf="center"
                            margin="auto"   
                        />

                        ) : (
                        <div className="messages">
                            <ScrollableChat messages = {messages}/>
                        </div>
                        )}

                       <FormControl onKeyDown={sendMessage} isRequired mt="3">
                     
                       {isTyping? <div>
                        <Lottie
                            options={defaultOptions}
                            width={70}
                            style={{marginBottom:15 , marginLeft :0}}
                        />
                            </div> : <></>}
                        <Input
                            variant="filled"
                            placeholder="Type a message"
                            bg="gray.100"
                            onChange ={typingHandler}
                            value={newMessage}
                        
                        />

                       </FormControl>

                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb="3" fontFamily="work sans">
                        Click on a user to start chat..!!
                    </Text>
                </Box>
            )}
        </>
    );
}

export default SingleChat;
