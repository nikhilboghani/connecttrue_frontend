import { useDisclosure } from "@chakra-ui/hooks"
import { IconButton } from '@chakra-ui/button'
import { Modal, ModalBody, ModalCloseButton, ModalContent,
         ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import { ViewIcon } from "@chakra-ui/icons"
import { Button } from "@chakra-ui/button"
import { useChatState } from "../../Context/ChatProvider"
import { useToast } from "@chakra-ui/toast"
import { useState } from "react"
import { Box } from "@chakra-ui/layout"
import UserBadgeItem from "../UsersAccess/UserBadgeItem"
import { FormControl ,Input, Spinner } from "@chakra-ui/react"
import axios from "axios"
import UserListItem from "../UsersAccess/UserListItem"



function UpdateGroupChatModel({fetchAgain, setFetchAgain , fetchMessages}) {
  
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName , setGroupChatName]= useState("");
    const [search , setSearch]= useState("");
    const [searchResult , setSearchResult]= useState([]);
    const [loading , setLoading]= useState(false);
    const [renameLoading , setRenameLoading]= useState(false);

    const toast = useToast();

    const { user, selectedChat, setSelectedChat } = useChatState();
  
    // handling functions 

    const handleAddUser = async (user1)=>{

        if(selectedChat.users.find((u)=> u._id === user1._id)){
             toast({
                title: "User already in group!",
                status: "error",
                duration: 3000,
                isClosable: true,
                position:"bottom"
             });
              return;
        }

        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only Admin can Add users to group",
                status: "error",
                duration: 3000,
                isClosable: true,
                position:"bottom"
             });
              return;
        }
              try {

                setLoading(true);

                const config = {

                  headers :{
                     Authorization: `Bearer ${user.token}`
                    },
                };

           const {data} =  await axios.put("/api/chat/groupadd", {

                chatId : selectedChat._id,
                userId : user1._id,

           }, config);     

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);

              } catch (error) {
                toast({
                    title: "Error occurred!",
                    description: error.response.data.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position:"bottom-left"
                });
                setLoading(false);
              }
    };

      const handleRemove = async(user1)=>{

        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
            toast({
                title: "Only Admin can Remove users to group",
                status: "error",
                duration: 3000,
                isClosable: true,
                position:"bottom"
             });
              return;
        }

            try {

              setLoading(true);

                const config = {

                  headers :{
                     Authorization: `Bearer ${user.token}`
                    },
                };

                   const {data} =  await axios.put("/api/chat/groupremove", {

                chatId : selectedChat._id,
                userId : user1._id,

           }, config); 

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);

            } catch (error) {
                toast({
                    title: "Error occurred!",
                    description: error.response.data.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position:"bottom"
                });
                setLoading(false);
            }

      };  

      const handleRename = async()=>{

         if(!groupChatName){
           return;
         }

          try {

            setRenameLoading(true);
            const config = {
              headers :{
                Authorization: `Bearer ${user.token}`,
              },
            };

            const {data} = await axios.put("/api/chat/rename", {
              chatId: selectedChat._id,
              chatName: groupChatName,
            }, config);

              setSelectedChat(data);
              setFetchAgain(!fetchAgain);
              setRenameLoading(false);

          } catch (error) {

            toast({
              title: "Error",
              description: "failed to rename chat",
              status: "error",
              duration: 3000,
              isClosable: true,
              position:"bottom-left"
            });
                setRenameLoading(false);
          }
                setGroupChatName("");

      };

      const handleSearch = async  (query)=>{
      setSearch(query);
      if(!query){
        return
      }

       try {
            setLoading(true);
            const config = {
                headers :{
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.get(`${apiUrl}/api/user?search=${search}`, config);
            console.log(data);
            setSearchResult(data);
            setLoading(false);

       } catch (error) {
            toast({
                title: "Error",
                description: "failed to load chats",
                status: "error",
                duration: 3000,
                isClosable: true,
                position:"bottom-left"
            });
            console.log(error);
       }

   }

    return (
    <div>
     <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
              fontSize="35px"
              fontFamily="work sans"
              d="flex"
              justifyContent="center"          
          >  {selectedChat.chatName} </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
                <Box w="100%"  display="flex" flexWrap="wrap" pb="3">
                       {selectedChat.users.map((user)=>(
                          <UserBadgeItem 
                           key={user._id}
                            user={user} 
                            handleFunction={()=> handleRemove(user)} 
                          />
                        ))}
                </Box>

                <FormControl 
                  display="flex"
                >
                   <Input
                      placeholder="Enter new group name"
                      mb="3"
                      onChange={(e)=>setGroupChatName(e.target.value)}
                   />

                    <Button
                      variant= "solid"
                      colorScheme="blue"
                      ml="1"
                      isLoading={renameLoading}
                      onClick={handleRename}
                    >
                      Update
                    </Button>

                </FormControl>
                 
                  <FormControl>
                   <Input placeholder='add users' mb="1"
                      onChange={(e)=> handleSearch(e.target.value)}
                   />
              </FormControl>


                  {loading?(<Spinner/>
                      ):(
                        searchResult?.map((user)=>(
                           <UserListItem
                           key={user._id } 
                           user ={user}
                           handleFunction={()=>handleAddUser(user)}
                             />))
                                   
                      )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red'  onClick={()=>handleRemove(user)}>
               Leave Group
            </Button>
          
          </ModalFooter>
        </ModalContent>
      </Modal>

     </div>
  )
}

export default UpdateGroupChatModel
