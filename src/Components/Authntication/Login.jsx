import  {useState} from 'react'
import {  VStack } from '@chakra-ui/layout'
import { FormControl  ,FormLabel} from '@chakra-ui/form-control';
import { Input  ,InputGroup ,InputRightElement} from '@chakra-ui/input';
import { Button  , ButtonGroup} from '@chakra-ui/button';
import { useToast } from '@chakra-ui/toast';
import axios from 'axios'
import { useHistory } from 'react-router-dom'



function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)
    const [loading ,setLoading] = useState(false)

    const toast = useToast();
    const history = useHistory();

    const handleClick = () => setShow(!show);

    const submitHandler = async() => { 
      
        setLoading(true) 
          if(!email || !password){
            toast({
              title: "Error",
              description: "Please fill all the fields",
              status: "error",
              duration: 9000,
              isClosable: true,
              position: "bottom"
        });
        setLoading(false)
        return;

      };

      try{
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };  
        
        const {data} = await axios.post(
          `${import.meta.env.VITE_BACKEND_URI}/api/user/login`,
           {email, password},
            config
         );

         toast({
          title: "Login Success",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "bottom"
         });

         localStorage.setItem("userInfo", JSON.stringify(data));
         setLoading(false)
          history.push("/chats");
      }
      catch(error){
        toast({
          title: "Error occured",
          description: error.response.data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "bottom"
        });
        setLoading(false)
        }
      };

    
  return (
   <VStack spacing= "5px" >

        <FormControl  id='E-mail' isRequired >
                <FormLabel> E-mail</FormLabel>
                     <Input 
                          placeholder="Enter Your E-mail"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                     />   
        </FormControl>

        <FormControl  id='password' isRequired >
             <FormLabel> password</FormLabel>
                    
                 <InputGroup>
                     
                    <Input 
                     type={show ? 'text' : 'password'}
                     placeholder="Enter Your password"
                     value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />  

                    <InputRightElement width="4.5rem">
                    <Button  colorScheme=' blue'  h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? 'Hide' : 'Show'}
                    </Button>
                    </InputRightElement>
             </InputGroup>             
        </FormControl>
         <br/>
            <Button 
          
             borderRadius="lg"
             colorScheme='blue'
             width={'100%'}
             onClick={submitHandler}
             color= "white" 
              isLoading={loading} 
            >
             Login here
            </Button>

             <Button 
             borderRadius="lg"
             colorScheme='red'
             width={'100%'}
             color= "white"
             onClick = {()=>{
                setEmail("nikpatel16444@gmail.com")
                setPassword("12345")
             }}  
            >
              Get Guest user credentials
            </Button>
    </VStack>
  )
 }

export default Login