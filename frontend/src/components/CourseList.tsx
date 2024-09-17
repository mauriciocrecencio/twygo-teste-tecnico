import React from 'react';
import { Heading, VStack, Container, Center, Text, Button, SimpleGrid, Box, Badge, Tabs, TabList, TabPanels, Tab, TabPanel, Spinner, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons';
import { Course } from '../types';
import { getCourses } from '../api';
import { useQuery } from '@tanstack/react-query';

const CourseList: React.FC = () => {
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses
  });

  const activeCourses = courses.filter(
    (course) => new Date(course.end_date) >= new Date()
  );

  const isCourseActive = (course: Course) => new Date(course.end_date) >= new Date();

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); 
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const CourseGrid: React.FC<{ courses: Course[] }> = ({ courses }) => (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
      {courses.map((course) => (
        <Box key={course.id} borderWidth={1} borderRadius="lg" p={4}>
          <VStack spacing={4} align="stretch">
          <Badge w="fit-content" colorScheme={isCourseActive(course) ? "green" : "red"}>
              {isCourseActive(course) 
                ? "Ativo" 
                : `Finalizado em ${formatDate(course.end_date)}`}
            </Badge>
            <Heading as="h3" size="md">
              {course.name}
            </Heading>
            <Text>
              {course.videos.length} vídeo{course.videos.length !== 1 ? 's' : ''}
            </Text>
                <HStack>
                <Button as={Link} to={`/edit-course/${course.id}`} colorScheme="blue">
              Editar
            </Button>
            <Button as={Link} to={`/course/${course.id}`} colorScheme="teal">
              Acessar Curso
            </Button>
       
            </HStack>

          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Text>Erro ao carregar cursos: {(error as Error).message}</Text>
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" p={0}>
      <VStack spacing={8} align="stretch">
        <Heading as="h2" size="xl">
          Cursos
        </Heading>
        
        <Tabs variant='enclosed'>
          <TabList >
            <Tab>Cursos Ativos</Tab>
            <Tab>Todos os Cursos</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {activeCourses.length === 0 ? (
                <Center flexDirection="column" py={10}>
                  <Text fontSize="xl" mb={4}>
                    Nenhum curso ativo no momento.
                  </Text>
                  <Button
                    as={Link}
                    to="/add-course"
                    colorScheme="teal"
                    leftIcon={<AddIcon />}
                  >
                    Adicionar Novo Curso
                  </Button>
                </Center>
              ) : (
                <CourseGrid courses={activeCourses} />
              )}
            </TabPanel>
            <TabPanel>
              <CourseGrid courses={courses} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default CourseList;
