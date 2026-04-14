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

  // Video player view — layout desktop com vídeo + lista lateral
  if (selectedLesson) {
    const videoUrl = `https://player-vz-9f500d2f-c0f.tv.pandavideo.com.br/embed/?v=${selectedLesson.video_id}`;
    return (
      <div>
        <button
          onClick={() => setSelectedLesson(null)}
          className="text-[12px] mb-4 inline-block"
          style={{ color: '#8B949E' }}
        >
          ← Voltar para aulas
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Vídeo principal */}
          <div className="xl:col-span-2">
            <div className="bg-black rounded-xl overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>{selectedLesson.name}</h1>
            <div className="flex items-center gap-4 text-[13px] mt-2" style={{ color: '#8B949E' }}>
              <span>⏱ {selectedLesson.duration}</span>
              {selectedLesson.watched && <span style={{ color: '#00C853' }}>✓ Assistida</span>}
            </div>
          </div>

          {/* Lista de aulas lateral */}
          <div className="xl:col-span-1">
            <h3 className="text-[12px] font-bold tracking-wider mb-3" style={{ color: '#484F58' }}>OUTRAS AULAS</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {lessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className="w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all"
                  style={{
                    backgroundColor: lesson.id === selectedLesson.id ? 'rgba(232,23,44,0.08)' : '#141414',
                    border: `1px solid ${lesson.id === selectedLesson.id ? 'rgba(232,23,44,0.2)' : '#21262D'}`,
                  }}
                >
                  <span className="text-[12px] font-bold w-6 text-center" style={{ color: lesson.id === selectedLesson.id ? '#E8172C' : '#484F58' }}>{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-white truncate">{lesson.name}</p>
                    <p className="text-[10px]" style={{ color: '#484F58' }}>{lesson.duration}</p>
                  </div>
                  {lesson.watched && <span className="text-[10px]" style={{ color: '#00C853' }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
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
      <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>🎬 Videoaulas</h1>
      <p className="text-[13px] mb-6" style={{ color: '#8B949E' }}>158 aulas por especialistas — navegue por especialidade</p>

      {specialities.map((spec) => (
        <div key={spec.speciality} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-300 mb-3">{spec.speciality}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
