import React from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

interface HeaderProps {
  onOpenSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  return (
    <Box bg="teal.400" p={4} color="white">
      <Flex align="center" justify="space-between">
        <Box display={{ base: 'block', md: 'none' }}>
          <HamburgerIcon
            w={6}
            h={6}
            cursor="pointer"
            onClick={onOpenSidebar}
          />
        </Box>
        <Heading as="h1" size="lg" textAlign={{ base: 'center', md: 'left' }} flex={1}>
          Threewygo Cursos
        </Heading>
      </Flex>
    </Box>
  );
};

export default Header;