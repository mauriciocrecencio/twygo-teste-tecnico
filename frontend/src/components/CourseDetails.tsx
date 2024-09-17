import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Heading, Text, VStack, Button, Container, Alert, AlertIcon, Flex, SimpleGrid, useColorModeValue, Stack } from '@chakra-ui/react';
import { Course } from '../types';
import { getCourse } from '../api';
import YouTubePlayer from './YoutubePlayer';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const numberColor = useColorModeValue('teal.500', 'teal.200');
  useEffect(() => {
    const fetchCourse = async () => {
      if (id) {
        const fetchedCourse = await getCourse(id);
        setCourse(fetchedCourse);
      }
    };
    fetchCourse();
  }, [id]);

  if (!course) {
    return <Box>Carregando...</Box>;
  }

  const isCourseActive = new Date(course.end_date) >= new Date();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Container maxW="container.xl" p={0}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        gap={4}
      >
        <Alert
          status={isCourseActive ? "success" : "warning"}
          borderRadius="full"
          paddingX={4}
          paddingY={2}
          flex={{ base: 1, md: 'initial' }}
          maxWidth={{ md: 'fit-content' }}
        >
          <AlertIcon />
          {isCourseActive
            ? "Curso Ativo"
            : `Finalizado em ${formatDate(course.end_date)}`
          }
        </Alert>

        <Stack
          direction="row"
          spacing={4}
          width={{ base: '100%', md: 'auto' }}
          justifyContent={{ base: 'stretch', md: 'flex-end' }}
          flex={{ md: 1 }}
        >
          <Button
            as={Link}
            to="/"
            colorScheme="teal"
            flex={{ base: 1, md: 'none' }}
          >
            Voltar
          </Button>
          <Button
            as={Link}
            to={`/edit-course/${course.id}`}
            colorScheme="blue"
            flex={{ base: 1, md: 'none' }}
          >
            Editar curso
          </Button>
        </Stack>
      </Flex>
      <VStack spacing={6} align="stretch" mt={4}>
        <Heading as="h2" size="xl">
          {course.name}
        </Heading>

        <Text fontSize="lg">{course.description}</Text>
        <Heading as="h3" size="lg">
          Vídeos do curso
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3 }} spacing={6}>
          {course.videos.map((video, index) => (
            <Box
              key={index}
              bg={bgColor}
              borderRadius="lg"
              overflow="hidden"
              position="relative"
            >
              <Box
                top={2}
                left={2}
                bg={numberColor}
                color="white"
                width='100%'
                height="44px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                zIndex={1}
              >
                {`${index + 1} - ${video.title}`} 
              </Box>
              
              <YouTubePlayer videoLink={video.url} />
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default CourseDetails;