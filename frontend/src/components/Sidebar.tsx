import React from 'react';
import {
  Box,
  VStack,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <Box
        as="nav"
        display={{ base: 'none', md: 'block' }}
        width="200px"
        height="100vh"
        bg="teal.400"
        color="white"
        p={5}
        position="fixed"
        left={0}
        top={0}
      >
        <VStack spacing={4} align="stretch">
          <SidebarContent />
        </VStack>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align="stretch">
                <SidebarContent />
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

const SidebarContent: React.FC = () => (
  <>
    <Button as={Link} to="/" colorScheme="white" variant="ghost">
      Cursos
    </Button>
    <Button as={Link} to="/add-course" colorScheme="white" variant="ghost">
      Adicionar Curso
    </Button>
    <Button as={Link} to="/video-size-report" colorScheme="white" variant="ghost">
      Relatório de Vídeos
    </Button>
  </>
);

export default Sidebar;