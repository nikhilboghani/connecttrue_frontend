import React, { useState } from 'react'
import { useDisclosure } from '@chakra-ui/hooks';
import { Button } from '@chakra-ui/button';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { useToast } from '@chakra-ui/toast';
import { useChatState } from '../../Context/ChatProvider';
import { FormControl } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import axios from 'axios';
import UserListItem from '../UsersAccess/UserListItem';
import UserBadgeItem from '../UsersAccess/UserBadgeItem';
import { Box } from '@chakra-ui/layout';
import { wrap } from 'framer-motion';


const apiUrl = process.env.REACT_APP_BACKEND_URL;
function GroupChatModel({children}) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName , setGroupChatName]= useState("");
    const [selectedUsers, setSelectedUsers]= useState([]);
    const [search , setSearch]= useState("");
    const [searchResult , setSearchResult]= useState([]);
    const [loading , setLoading]= useState(false);

    const toast = useToast();
    const {user, chats,setChats } = useChatState();

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
  
  
   const handleGroup = (userToadd)=>{
        if(selectedUsers.includes(userToadd)){
         toast({
            title:"user already added",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position:"top"
         });
         return;
     }
      setSelectedUsers([...selectedUsers, userToadd]);
   };

   const handleDelete = (deleteUser)=>{
        setSelectedUsers(selectedUsers.filter((sel)=> sel._id !== deleteUser._id))
   }

    const handleSubmit = async ()=>{
        if(!groupChatName || !selectedUsers){
            toast({
                title:"please fill all fields",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position:"top"
            });
            return;
        }

          try {
              const config = {
                headers :{
                    Authorization: `Bearer ${user.token}`,
                },
              };
                const {data} = await axios.post(`/api/chat/group`,
                 {
                  name: groupChatName,
                  users: JSON.stringify(selectedUsers.map((user)=>user._id)),   
                },config);
                setChats( [data, ...chats]);
                onClose();

                toast({
                    title:"group chat created",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position:"bottom"               
                })

          } catch (error) {
              toast({
                title: "Error",
                description: error.response.data,
                status: "error",
                duration: 3000,
                isClosable: true,
                position:"bottom"
            });
            console.log(error);
          }

    }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
              display="flex "
              justifyContent="center" 
              fontSize= "35px"
              fontFamily="work sans"
          
          >create group chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
             display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <FormControl>
                   <Input placeholder='enter chatname' mb="3"
                      onChange={(e)=>setGroupChatName(e.target.value)}
                   />
              </FormControl>
              <FormControl>
                   <Input placeholder='add users' mb="1"
                      onChange={(e)=> handleSearch(e.target.value)}
                   />
              </FormControl>
                       <Box display="flex" flexWrap={wrap}>
                        {selectedUsers?.map(user=>(
                          <UserBadgeItem 
                           key={user._id}
                            user={user} 
                            handleFunction={()=> handleDelete(user)} 
                          />
                        ))}
                         </Box>


                      {loading?(<div>loading...</div>
                      ):(
                        searchResult?.map((user)=>(
                           <UserListItem
                           key={user._id } 
                           user ={user}
                           handleFunction={()=>handleGroup(user)}
                             />))
                                   
                      )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'  onClick={handleSubmit}>
               create group
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModel