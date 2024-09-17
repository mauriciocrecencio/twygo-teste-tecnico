import { ChakraProvider, Box, Flex, useDisclosure } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import CourseDetails from './components/CourseDetails';
import VideoSizeReport from './components/VideoSizeReport';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Router>
          <Flex minHeight="100vh">
            <Sidebar isOpen={isOpen} onClose={onClose} />
            <Box
              flex={1}
              ml={{ base: 0, md: '200px' }}
              transition="margin-left 0.3s"
            >
              <Header onOpenSidebar={onOpen} />
              <Box
                width="100%"
                p={4}
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
              >
                <Box width="100%" maxWidth="container.xl">
                  <Routes>
                    <Route path="/" element={<CourseList />} />
                    <Route path="/add-course" element={<CourseForm />} />
                    <Route path="/edit-course/:id" element={<CourseForm />} />
                    <Route path="/course/:id" element={<CourseDetails />} />
                    <Route path="/video-size-report" element={<VideoSizeReport />} />
                  </Routes>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Router>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
