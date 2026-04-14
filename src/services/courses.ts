import { apiClient } from '@/lib/api';

export interface Lesson {
  id: string;
  name: string;
  description: string;
  duration: string;
  video_id: string;
  order: number;
  watched: boolean;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  instructor: string;
  instructor_picture: string | null;
  thumbnail: string | null;
  total_lessons: number;
  watched_lessons: number;
  progress: number;
}

export interface SpecialityCourses {
  speciality: string;
  courses: Course[];
}

export async function getCourses(): Promise<SpecialityCourses[]> {
  try {
    const res = await apiClient.get<{ specialities: SpecialityCourses[] }>('/courses');
    return res?.specialities || [];
  } catch {
    return [];
  }
}

export async function getCourseLessons(courseId: string): Promise<Lesson[]> {
  try {
    const res = await apiClient.get<Lesson[] | { lessons: Lesson[] }>(`/courses/${courseId}/lessons`);
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.lessons)) return res.lessons;
    return [];
  } catch {
    return [];
  }
}

export async function markLessonWatched(lessonId: string): Promise<void> {
  await apiClient.post(`/lessons/${lessonId}/watch`);
}
