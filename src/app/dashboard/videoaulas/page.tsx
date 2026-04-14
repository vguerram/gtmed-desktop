'use client';

import { useState, useEffect } from 'react';
import { getCourses, getCourseLessons } from '@/services/courses';
import type { SpecialityCourses, Lesson } from '@/services/courses';

export default function VideoaulasPage() {
  const [specialities, setSpecialities] = useState<SpecialityCourses[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loadingLessons, setLoadingLessons] = useState(false);

  useEffect(() => {
    getCourses().then((data) => {
      setSpecialities(data);
      setLoading(false);
    });
  }, []);

  async function handleSelectCourse(courseId: string) {
    setSelectedCourse(courseId);
    setSelectedLesson(null);
    setLoadingLessons(true);
    const ls = await getCourseLessons(courseId);
    setLessons(ls);
    setLoadingLessons(false);
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Videoaulas</h1>
        <p className="text-[#484F58]">Carregando cursos...</p>
      </div>
    );
  }

  // Video player view
  if (selectedLesson) {
    const videoUrl = `https://player-vz-9f500d2f-c0f.tv.pandavideo.com.br/embed/?v=${selectedLesson.video_id}`;
    return (
      <div>
        <button
          onClick={() => setSelectedLesson(null)}
          className="text-sm text-[#8B949E] hover:text-white mb-4 inline-block"
        >
          ← Voltar para aulas
        </button>

        <h1 className="text-2xl font-bold mb-4">{selectedLesson.name}</h1>

        <div className="bg-black rounded-xl overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="flex items-center gap-4 text-sm text-[#8B949E]">
          <span>Duração: {selectedLesson.duration}</span>
          {selectedLesson.watched && <span className="text-[#00C853]">✓ Assistida</span>}
        </div>
      </div>
    );
  }

  // Lessons list view
  if (selectedCourse && lessons.length > 0) {
    return (
      <div>
        <button
          onClick={() => { setSelectedCourse(null); setLessons([]); }}
          className="text-sm text-[#8B949E] hover:text-white mb-4 inline-block"
        >
          ← Voltar para cursos
        </button>

        <h1 className="text-2xl font-bold mb-6">Aulas</h1>

        <div className="space-y-3">
          {lessons.map((lesson, idx) => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className="w-full text-left bg-[#141414] border border-[#21262D] rounded-xl p-5 hover:border-[#E8172C]/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-[#00C853] font-bold text-lg w-8">{idx + 1}</span>
                <div className="flex-1">
                  <h3 className="font-medium">{lesson.name}</h3>
                  <p className="text-sm text-[#484F58]">{lesson.duration}</p>
                </div>
                {lesson.watched && <span className="text-[#00C853]">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Courses list view
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Videoaulas</h1>

      {specialities.map((spec) => (
        <div key={spec.speciality} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-300 mb-3">{spec.speciality}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spec.courses.map((course) => (
              <button
                key={course.id}
                onClick={() => handleSelectCourse(course.id)}
                className="text-left bg-[#141414] border border-[#21262D] rounded-xl p-5 hover:border-[#E8172C]/30 transition-colors"
              >
                <h3 className="font-semibold mb-1">{course.name}</h3>
                <p className="text-sm text-[#8B949E]">{course.instructor}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-[#484F58]">{course.total_lessons} aulas</span>
                  {course.progress > 0 && (
                    <span className="text-xs text-[#00C853]">{course.progress}%</span>
                  )}
                </div>
                {course.progress > 0 && (
                  <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-[#E8172C] h-1.5 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
