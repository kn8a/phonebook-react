import React, { useEffect, useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  useToast,
  InputLeftElement,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  useDisclosure,
  InputGroup,
} from '@chakra-ui/react';
import Contact from '../components/Contact';
import { FaSearch, FaAddressBook, FaPlusCircle } from 'react-icons/fa';
import axios from 'axios';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

function Main() {
  const toast = useToast();
  const [contacts, setContacts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [newContact, setNewContact] = useState({
    name_first: '',
    name_last: '',
    tel: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const getContactsURL = `${process.env.REACT_APP_API_URL}/phonebook/contacts`;
  const addContactsURL = `${process.env.REACT_APP_API_URL}/phonebook/contacts`;

  useEffect(() => {
    updateContacts();
  }, []);

  const searchItems = searchValue => {
    setSearchInput(searchValue);
    const filteredData = contacts.filter(item => {
      return Object.values(item)
        .join('')
        .toLowerCase()
        .includes(searchInput.toLowerCase());
    });
    setFilteredResults(filteredData);
  };

  const updateContacts = () => {
    axios
      .get(getContactsURL)
      .then(res => {
        setContacts([]);
        setContacts(res.data.contacts);
      })
      .catch(err => {});
  };

  const addContact = () => {
    axios
      .post(addContactsURL, newContact)
      .then(res => {
        console.log(res.data);
        setNewContact({
          name_first: '',
          name_last: '',
          tel: '',
        });
        updateContacts();
        onClose();
        toast({
          title: 'Contact added',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      })
      .catch(err => {
        toast({
          title: 'Error updating contact',
          description: err.response.data.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const onFieldChange = e => {
    const value = e.target.value;
    setNewContact({
      ...newContact,
      [e.target.name]: value,
    });
  };

  return (
    <Flex
      minH={'100vh'}
      align={'flex-start'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={4} px={4} w="full">
        <Stack align={'center'}>
          <Flex justifyContent={'space-between'} w="100%">
            <Flex alignItems={'center'} gap={2}>
              <FaAddressBook size={'32'} />
              <Heading fontSize={'3xl'}>Phone Book App</Heading>
            </Flex>

            <ColorModeSwitcher />
          </Flex>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={4}
        >
          <Flex justifyContent={'space-between'} alignItems="center" pb={4}>
            <Heading size={'lg'}>Contacts</Heading>
            <Button
              colorScheme={'blue'}
              onClick={onOpen}
              leftIcon={<FaPlusCircle />}
            >
              Add contact
            </Button>
          </Flex>
          <InputGroup pb={4}>
            <InputLeftElement
              pointerEvents="none"
              children={<FaSearch color="gray.300" />}
            />
            <Input
              type="text"
              placeholder="Search by name, last name, or phone"
              onChange={e => searchItems(e.target.value)}
            />
          </InputGroup>
          <Flex flexDirection={'column'}>
            {searchInput.length > 1
              ? filteredResults.map(contact => {
                  return (
                    <Flex key={contact._id} shadow="md" p={4} rounded="4">
                      <Contact
                        contact={contact}
                        updateContacts={updateContacts}
                      />
                    </Flex>
                  );
                })
              : contacts.map(contact => {
                  return (
                    <Flex key={contact._id} shadow="md" p={4} rounded="4">
                      <Contact
                        contact={contact}
                        updateContacts={updateContacts}
                      />
                    </Flex>
                  );
                })}
          </Flex>
        </Box>
      </Stack>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add new contact</DrawerHeader>

          <DrawerBody justifyContent={'space-evenly'}>
            <Flex direction={'column'} gap={6}>
              <FormControl id="firstName" isRequired>
                <FormLabel>First name</FormLabel>
                <Input
                  required
                  onChange={onFieldChange}
                  value={newContact.name_first}
                  name="name_first"
                  type="text"
                  placeholder="John"
                />
              </FormControl>
              <FormControl id="lastname" isRequired>
                <FormLabel>Last name</FormLabel>
                <Input
                  required
                  onChange={onFieldChange}
                  value={newContact.name_last}
                  name="name_last"
                  type="text"
                  placeholder="Smith"
                />
              </FormControl>
              <FormControl id="tel" isRequired>
                <FormLabel>Phone number</FormLabel>
                <Input
                  required
                  onChange={onFieldChange}
                  value={newContact.tel}
                  name="tel"
                  type="tel"
                  placeholder="123-456-7890"
                />
              </FormControl>
            </Flex>
          </DrawerBody>

          <DrawerFooter
            justifyContent={'space-evenly'}
            display="flex"
            flexDirection={'column'}
          >
            <Flex justifyContent={'space-around'} w="100%">
              <Button colorScheme={'blue'} mr={3} onClick={onClose} size="lg">
                Cancel
              </Button>
              <Button colorScheme="green" size={'lg'} onClick={addContact}>
                Add contact
              </Button>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default Main;
