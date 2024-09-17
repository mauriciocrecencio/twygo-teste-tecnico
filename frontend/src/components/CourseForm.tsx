import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  IconButton,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { createCourse, updateCourse, getCourse, deleteCourse } from '../api';
import { Course } from '../types';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';

const CourseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Partial<Course>>({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    videos: [{ title: '', url: '' }],
  });

  useEffect(() => {
    const resetForm = () => {
      setCourse({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        videos: [{ title: '', url: '' }],
      });
    };

    if (id) {
      getCourse(id).then(setCourse);
    } else {
      resetForm();
    }
  }, [id, location.pathname]);

  const deleteMutation = useMutation({
    mutationFn: (courseId: string) => deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      navigate('/');
    },
    onError: (error) => {
      console.error('Error deleting course:', error);
    },
  });

  const handleDelete = () => {
    if (id && window.confirm('Are you sure you want to delete this course?')) {
      deleteMutation.mutate(id);
    }
  };

  useEffect(() => {
    if (id) {
      getCourse(id).then(setCourse);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };
  const addVideo = () => {
    setCourse(prev => ({
      ...prev,
      videos: [...(prev.videos || []), { title: '', url: '' }]
    }));
  };
  const handleVideoChange = (index: number, field: 'title' | 'url', value: string | File) => {
    const newVideos = [...(course.videos || [])];
    newVideos[index] = { ...newVideos[index], [field]: value };
    setCourse(prev => ({ ...prev, videos: newVideos }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', course.name || '');
      formData.append('description', course.description || '');
      formData.append('start_date', course.start_date || '');
      formData.append('end_date', course.end_date || '');

      course.videos?.forEach((video, index) => {
        formData.append(`videos[${index}][title]`, video.title);
        if (video.url) {
          formData.append(`videos[${index}][video_file]`, video.url);
        }
      }) || [];

      if (id) {
        await updateCourse(id, formData);
      } else {
        await createCourse(formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  const removeVideo = (index: number) => {
    setCourse(prev => ({
      ...prev,
      videos: prev.videos?.filter((_, i) => i !== index) || []
    }));
  };

  console.log(course.videos)
  return (
    <Box maxWidth="800px" margin="auto">
      <Heading mb={4}>{id ? 'Editar Curso' : 'Criar Novo Curso'}</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Nome</FormLabel>
            <Input name="name" value={course.name} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Descrição</FormLabel>
            <Textarea name="description" value={course.description} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Data de Início</FormLabel>
            <Input type="date" name="start_date" value={course.start_date} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Data de Término</FormLabel>
            <Input type="date" name="end_date" value={course.end_date} onChange={handleChange} />
          </FormControl>
          <Divider />
          {!id && course.videos?.map((video, index) => (
            <HStack maxWidth="800px" width="100%" key={index} spacing={2} >
              <FormControl>
                <FormLabel>Título do Vídeo {index + 1}</FormLabel>
                <Input
                  value={video.title}
                  onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Arquivo de Vídeo {index + 1}</FormLabel>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleVideoChange(index, 'url', file);
                    }
                  }}
                />
              </FormControl>
              <IconButton
                borderRadius="full"
                aria-label="Remove video"
                icon={<MinusIcon />}
                onClick={() => removeVideo(index)}
                colorScheme="red"
                placeSelf="flex-end"
                size="sm"
                mb={1}
              />
            </HStack>
          ))}
          <VStack width="100%">

            {!id ?
              <>
                <Button onClick={addVideo} leftIcon={<AddIcon />}>
                  Adicionar vídeo
                </Button>
                <Divider />
              </>
              : ''}
            <HStack spacing={4} justifyContent="flex-end">
              {id && (
                <Button
                  onClick={handleDelete}
                  colorScheme="red"
                  isLoading={deleteMutation.isPaused}
                >
                  Delete Course
                </Button>
              )}
              <Button type="submit" colorScheme="blue">
                {id ? 'Update Course' : 'Create Course'}
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </form>
    </Box>
  );
};

export default CourseForm;