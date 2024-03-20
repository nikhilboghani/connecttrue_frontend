import { useDisclosure } from "@chakra-ui/hooks"
import { ViewIcon } from "@chakra-ui/icons"
import {Modal,ModalOverlay,ModalContent,
        ModalHeader,ModalFooter,ModalBody,
        ModalCloseButton, Button, Image,
} from "@chakra-ui/react"
import { Text } from "@chakra-ui/layout"
import { IconButton } from "@chakra-ui/button"



function ProfileModel( {user ,children }) {
 
  const { isOpen, onOpen, onClose } = useDisclosure();

    return (
    <>
    {children ?(
        <span onClick={onOpen}>
            {children}
        </span>
    ) : (
        <IconButton display ={{base:"flex"}} icon = {<ViewIcon/>} onClick={onOpen} />
    )}

<Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered  >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
              fontWeight="bold"
              fontFamily="work sans"
                fontSize="3xl"
                justifyContent="center"
                display="flex"
          > {user.name} 
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" alignItems="center"  flexDirection="column" >
                <Image
                    boxSize="150px"
                    borderRadius="full"
                    src={user.pic}
                    alt={user.name}
                 />  
                 <Text 
                   fontSize={{ base: "28px", md: "30px" }}
                   fontFamily="Work sans"
                 >
                  Email: {user.email}
                 </Text>
                
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={onClose}
            >
                Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  );
};

export default ProfileModel