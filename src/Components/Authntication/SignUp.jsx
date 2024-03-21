import  {useState} from 'react'
import {  VStack } from '@chakra-ui/layout'
import { FormControl  ,FormLabel} from '@chakra-ui/form-control';
import { Input  ,InputGroup ,InputRightElement} from '@chakra-ui/input';
import { Button  , ButtonGroup} from '@chakra-ui/button';
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

function Signup() {
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmpassword, setconfirmpassword] = useState()
  const [pic , setPic] = useState()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const history = useHistory()

    const handleClick = () => setShow(!show)

    const postDetail = (pics) => { 
    
          setLoading(true)

          if (pics === undefined) {
            toast({
              title: 'Please Select A Image',
              status: 'warning',
              duration: 5000,
              isClosable: true,
              position: "bottom"
            });
            return;
          }

          if(pics.type === 'image/jpeg' || pics.type === 'image/png' || pics.type === 'image/jpg'){
             
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', 'ConnectTrue');
            data.append('cloud_name', 'nikhilboghani');

            fetch('https://api.cloudinary.com/v1_1/nikhilboghani/image/upload', {
              method: 'post',
              body: data,
            })
            .then((res) => res.json())
            .then((data) => {
              setPic(data.url.toString());
              console.log(pics); 
              setLoading(false)
            })
          }
             else {
            toast({
                title: 'Please Select A Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position : "bottom"
            });
            setLoading(false)
            return;
          }


     };

    const submitHandler = async() => {  
        setLoading(true);
        
        if(!name || !email || !password || !confirmpassword ){
            toast({
                title: 'Please Fill All The Fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position : "bottom"
            });
            setLoading(false)
            return;
        }

        if(password !== confirmpassword){
            toast({
                title: 'Password and Confirm Password Should Be Same',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position : "bottom"
            });
           
            return;
        }

        try{
          const config = {
            headers : {
              'Content-type' : 'application/json',
            },
          };

          const {data} = await axios.post(
            `${import.meta.env.VITE_BACKEND_URI}/api/user` ,
            {name , email , password , pic},
            config
          );
          toast({
            title: 'User Registered Successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position : "bottom",
          });

           localStorage.setItem('userInfo' , JSON.stringify(data));

            setLoading(false);
            history.push("/chats");

        }
        catch(error){  
           toast({
            title: 'Error Occured',
            discription: error.response.data.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position : "bottom",
           });
           setLoading(false);
        }

     };

       return (
    <VStack spacing= "5px" >

        <FormControl  id='First-name' isRequired >
                <FormLabel> Name</FormLabel>
                     <Input 
                          placeholder="Enter Your Name"
                         onChange={(e) => setName(e.target.value)}
                     />   
        </FormControl>

        <FormControl  id='E-mail' isRequired >
                <FormLabel> E-mail</FormLabel>
                     <Input 
                          placeholder="Enter Your E-mail"
                          onChange={(e) => setEmail(e.target.value)}
                     />   
        </FormControl>

        <FormControl  id='password' isRequired >
             <FormLabel> password</FormLabel>
                    
                 <InputGroup>
                     
                    <Input 
                     type={show ? 'text' : 'password'}
                     placeholder="Enter Your password"
                    onChange={(e) => setPassword(e.target.value)}
                    />  

                    <InputRightElement width="4.5rem">
                    <Button colorScheme=' blue'  h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? 'Hide' : 'Show'}
                    </Button>
                    </InputRightElement>
             </InputGroup>             
        </FormControl>

         <FormControl  id='confirmpassword' isRequired >
             <FormLabel>confirm password</FormLabel>
                    
                 <InputGroup>
                     
                    <Input 
                     type={show ? 'text' : 'password'}
                     placeholder="confirm Your password"
                    onChange={(e) => setconfirmpassword(e.target.value)}
                    />  

                    <InputRightElement width="4.5rem">
                    <Button colorScheme=' blue'  h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? 'Hide' : 'Show'}
                    </Button>
                    </InputRightElement>
             </InputGroup>             
        </FormControl>


        <FormControl id='pic' >
            <FormLabel>Upload your pic</FormLabel>
            <Input
                padding={2}
                type="file"
                accept="image/*"
                onChange={(e) => postDetail(e.target.files[0])}
            />
        </FormControl>
            <br/>
        <Button 
          
             borderRadius="lg"
             colorScheme='blue'
             width={'100%'}
             onClick={submitHandler}
             color= "white"
             isLoading = {loading}
            
            >
              Sign Up
            </Button>
    </VStack>
  )
    }


export default Signup