import axios from 'axios';
import { Course } from '../types';

const API_BASE_URL = 'http://localhost:3000';

export const getCourses = async (): Promise<Course[]> => {
  const response = await axios.get(`${API_BASE_URL}/courses`);
  return response.data;
};

export const createCourse = async (courseData: FormData): Promise<Course> => {
  const response = await axios.post(`${API_BASE_URL}/courses`, courseData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateCourse = async (id: string, formData: FormData): Promise<Course> => {
  const response = await axios.put(`${API_BASE_URL}/courses/${id}`, formData);
  return response.data;
};
export const getCourse = async (id: string): Promise<Course> => {
  const response = await axios.get(`${API_BASE_URL}/courses/${id}`);
  return response.data;
};

export const deleteCourse = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/courses/${id}`);
};
