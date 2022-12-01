import React, { useState } from 'react';
import {
  Flex,
  Text,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Button,
} from '@chakra-ui/react';
import { FaPhone, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

function Contact(props) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contact, setContact] = useState(props.contact);
  const [contactInitial, setContactInitial] = useState(contact);
  const [isLoading, setIsLoading] = useState(false);

  const editURL = `${process.env.REACT_APP_API_URL}/phonebook/contacts`;

  const onFieldChange = e => {
    const value = e.target.value;
    setContact({
      ...contact,
      [e.target.name]: value,
    });
  };

  const onCancelEdit = () => {
    setContact(contactInitial);
    onClose();
  };

  const saveEdit = () => {
    setIsLoading(true);
    axios
      .put(editURL, contact)
      .then(res => {
        setContactInitial(contact);
        props.updateContacts();
        onClose();
        setIsLoading(false);
        toast({
          title: 'Contact updated',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
        toast({
          title: 'Error updating contact',
          description: err.response.data.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const deleteContact = () => {
    axios
      .delete(editURL, { data: { contact: contact } })
      .then(() => {
        props.updateContacts();
        toast({
          title: 'Contact deleted',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      })
      .catch(err => {
        toast({
          title: 'Error adding contact',
          description: err.response.data.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex justifyContent={'space-between'} w="100%">
      <Flex flexDirection={'column'}>
        <Text textAlign={'left'} fontWeight="bold">
          {`${contact.name_last} ${contact.name_first}`}
        </Text>
        <Flex alignItems={'center'} gap={2}>
          <FaPhone size={'12'} />
          <Text color={'gray'}>
            <small>
              <strong>{contact.tel}</strong>
            </small>
          </Text>
        </Flex>
      </Flex>
      <Flex gap={2} alignItems="center">
        <IconButton colorScheme={'blue'} icon={<FaEdit />} onClick={onOpen} />
        <IconButton
          colorScheme={'red'}
          icon={<FaTrash />}
          onClick={deleteContact}
        />
      </Flex>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit contact</DrawerHeader>

          <DrawerBody justifyContent={'space-evenly'}>
            <Flex direction={'column'} gap={6}>
              <FormControl id="firstName">
                <FormLabel>First name</FormLabel>
                <Input
                  required
                  onChange={onFieldChange}
                  value={contact.name_first}
                  name="name_first"
                  type="text"
                  placeholder="John"
                />
              </FormControl>
              <FormControl id="lastname">
                <FormLabel>Last name</FormLabel>
                <Input
                  required
                  onChange={onFieldChange}
                  value={contact.name_last}
                  name="name_last"
                  type="text"
                  placeholder="Smith"
                />
              </FormControl>
              <FormControl id="tel">
                <FormLabel>Phone number</FormLabel>
                <Input
                  required
                  onChange={onFieldChange}
                  value={contact.tel}
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
              <Button
                colorScheme={'blue'}
                mr={3}
                onClick={onCancelEdit}
                size="lg"
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                colorScheme="green"
                size={'lg'}
                onClick={saveEdit}
                loadingText="Adding..."
                isLoading={isLoading}
              >
                Save changes
              </Button>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default Contact;
