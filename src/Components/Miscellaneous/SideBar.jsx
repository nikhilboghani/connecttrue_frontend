import { Button, Tooltip ,Text, Menu, MenuButton, MenuList ,MenuItem, MenuDivider, Drawer,  DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, Toast, useToast,  } from '@chakra-ui/react';
import React from 'react'
import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar } from '@chakra-ui/react';
import { useChatState } from "../../Context/ChatProvider";
import ProfileModel from './ProfileModel';
// import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDisclosure } from '@chakra-ui/hooks';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UsersAccess/UserListItem';
import { Spinner } from '@chakra-ui/spinner';
import { useNavigate } from 'react-router-dom';


function SideBar() {
  const navigateTo = useNavigate()

const [search, setSearch] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [loading, setLoading] = useState(false);
const [loadingChat, setLoadingChat] = useState();

const { user = {} } = useChatState() || {};
const {setSelectedChat ,chats ,setChats} = useChatState();
const { isOpen, onOpen, onClose } = useDisclosure()


 const logoutHandler = () => {  

  localStorage.removeItem("userInfo");
 navigateTo("/")

 };

 const toast = useToast();


 const handleSearch = async () =>{
     if(!search){
      toast({
        title: "please enter something in search",
        position:"top-left",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
       return;
     }

       try {
        setLoading(true);

        const config = {
          headers :{
            Authorization: `Bearer ${user.token}`,
          }
        };

        const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/user?search=${search}`, config);
        setLoading(false);
        setSearchResults(data);
       } catch (error) {
        toast({
          title: "Something went wrong",
          discription: "failed to load data",
          position:"bottom-left",
          status: "error",
          duration: 3000,
          isClosable: true,
        
        })
       }
 }

 const accessChat = async (userId) => {
          try {
            setLoadingChat(true);
            const config = {
            headers :{
              "Content-type" :"application/json",
              Authorization: `Bearer ${user.token}`,
          }
        };

          const {data} =await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/chat` ,{userId} ,config);
            if(!chats.find((c)=> c._id === data._id)) setChats([data, ...chats]);

              setSelectedChat(data);
              setLoadingChat(false);
              onClose();

          } catch (error) {
            toast({
              title: "Error fetching the chat",
              discription: error.message,
              position:"bottom-left",
              status: "error",
              duration: 3000,
              isClosable: true,
            })
          }



 }

  return (
  <>
  <Box
   borderWidth="1px"
   borderRadius="lg"
   p="4"
   margin={2}
   boxShadow="md"
   bg="gray.100"
   display="flex"
   justifyContent="space-between"
  >
    <Tooltip
     label ="search for a chat"
     hasArrow 
     placement='bottom-end'
     >
        <Button 
           variant="ghost"
           borderWidth="1px"
           borderRadius="lg"
           p="2"
           boxShadow="md"
           bg="gray.200"
           _hover={{ bg: 'gray.300' }}
           onClick={onOpen}
           >
             <i class="fa-solid fa-magnifying-glass"></i>
             <Text display={{ base:"none" , md: "Flex"}} px="4">Search User</Text>
        
        </Button>
     </Tooltip>

       <Text fontFamily="work sans" fontSize="2xl" fontWeight="bold" >
        Connect True 
       </Text>

        <div>
          
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  
                      <Avatar name={user.name} src={user.pic} />

                    </MenuButton>

                    <MenuList>

                        <ProfileModel user={user}>
                          <MenuItem 
                            fontWeight="bold" 
                            fontFamily="work sans"
                          >Profile
                          </MenuItem>
                        </ProfileModel>
                    
                       <MenuDivider />
                        <MenuItem 
                        fontWeight="bold"
                         fontFamily="work sans"
                        onClick={logoutHandler}

                         > Log out
                          </MenuItem>
                    </MenuList>
                  </Menu>
        </div>  
  </Box>
  
     <Drawer  placement='left' onClose={onClose} isOpen={isOpen}   >
      <DrawerOverlay />

      <DrawerContent >
        <DrawerHeader   bg="gray.100" borderBottomWidth="1px">Search Users</DrawerHeader>
        <DrawerBody  bg="gray.100"  >
          <Box pb="4" display="flex" >
              <Input
              placeholder="Search Users"
              mr={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              
              />
              <Button onClick={handleSearch}> Go </Button>    
          </Box>
            {loading ? (
              <ChatLoading/>
              ) : (
                 searchResults?.map((user)=>(
                  <UserListItem
                  
                  key={user._id}
                  user={user}
                  handleFunction ={()=>accessChat(user._id)}
                  
                  />
                 ))
             )}
              {loadingChat && <Spinner ml ="auto" d="flex"/>}

        </DrawerBody>
      </DrawerContent>
     </Drawer>
  </>
  );
};

export default SideBar