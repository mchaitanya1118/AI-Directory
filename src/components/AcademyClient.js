"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AcademyClient({ initialCourses = [] }) {
  const [courses] = useState(initialCourses);
  const [activeCourse, setActiveCourse] = useState(initialCourses[0] || null);
  const [activeLesson, setActiveLesson] = useState(initialCourses[0]?.lessons[0] || null);

  // Lesson completions
  const [completedLessons, setCompletedLessons] = useState([]);
  
  // Interactive quiz state
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizFeedback, setQuizFeedback] = useState("");
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Hardcoded mockup quizzes for active lesson
  const quizzesByLesson = {
    "intro-llms": {
      question: "What is the core building block of Large Language Models (LLMs)?",
      options: ["RNN Gates", "Attention Mechanisms / Transformers", "Traditional SQL Databases", "Static Regex Parsers"],
      correct: "Attention Mechanisms / Transformers",
      explanation: "Transformers rely heavily on Attention mechanisms to process context and relationships between tokens dynamically."
    },
    "model-comparison": {
      question: "Which LLM provider is renowned for pioneering GPQA logic reasoning and the Artifacts system?",
      options: ["Google AI", "OpenAI", "Anthropic", "Meta Open Source"],
      correct: "Anthropic",
      explanation: "Anthropic's Claude 3.5 Sonnet introduced Artifacts and scores extremely high on graduate-level reasoning benchmarks."
    },
    "chain-of-thought": {
      question: "Why does Chain of Thought (CoT) prompting increase LLM output accuracy in reasoning tasks?",
      options: ["It bypasses tokenizer safety filters.", "It increases API billing fees.", "It structures operations into step-by-step logic iterations before arriving at a final deduction.", "It compiles Javascript code locally."],
      correct: "It structures operations into step-by-step logic iterations before arriving at a final deduction.",
      explanation: "By breaking down decisions into sequence iterations, the model reduces hallucinations and verifies logic rules."
    },
    "n8n-nodes": {
      question: "Which element is used to receive external payloads and start a run in n8n automation?",
      options: ["A cron job node only", "Webhook Trigger Node", "HTTP Request Node", "Prisma client db sync"],
      correct: "Webhook Trigger Node",
      explanation: "Webhook nodes serve as the primary API ingress interface to parse incoming REST request payloads."
    }
  };

  const handleLessonSelect = (course, lesson) => {
    setActiveCourse(course);
    setActiveLesson(lesson);
    setQuizAnswer("");
    setQuizFeedback("");
    setQuizSubmitted(false);
  };

  const toggleComplete = (lessonId) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (!activeLesson) return;
    
    const quiz = quizzesByLesson[activeLesson.id];
    if (!quiz) return;

    setQuizSubmitted(true);
    if (quizAnswer === quiz.correct) {
      setQuizFeedback(`🎉 Correct! ${quiz.explanation}`);
      if (!completedLessons.includes(activeLesson.id)) {
        setCompletedLessons((prev) => [...prev, activeLesson.id]);
      }
    } else {
      setQuizFeedback(`❌ Incorrect. Try again! Hint: Read the lesson content carefully.`);
    }
  };

  // Telemetry details
  const totalLessonsCount = courses.flatMap(c => c.lessons).length;
  const completedCount = completedLessons.length;
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

  const activeQuiz = activeLesson ? quizzesByLesson[activeLesson.id] : null;

  return (
    <div style={{ width: "100%" }}>
      {/* Header Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-glass)", paddingBottom: "2rem", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <span 
            style={{ 
              fontSize: "0.85rem", 
              fontWeight: "700", 
              textTransform: "uppercase", 
              letterSpacing: "1.5px", 
              color: "var(--neon-purple)",
              background: "var(--neon-purple-glow)",
              padding: "0.35rem 0.9rem",
              borderRadius: "20px"
            }}
          >
            AuraAI Academy
          </span>
          <h1 
            style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "2.5rem", 
              fontWeight: "800", 
              color: "var(--text-bright)", 
              marginTop: "0.75rem",
              letterSpacing: "-1px"
            }}
          >
            Upskill in AI Engineering & Automation
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginTop: "0.5rem", maxWidth: "600px" }}>
            Free structured courses covering Large Language Models, advanced Prompting, AI Agents, and n8n pipelines.
          </p>
        </div>

        {/* Course Progress Card */}
        <div className="detail-glass-card" style={{ padding: "1.5rem", width: "260px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "0.5rem" }}>
            <span>Your Progress</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div style={{ height: "8px", background: "rgba(0,0,0,0.05)", borderRadius: "4px", overflow: "hidden", marginBottom: "0.75rem" }}>
            <div style={{ height: "100%", width: `${progressPercent}%`, background: "linear-gradient(95deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)", borderRadius: "4px", transition: "width 0.4s ease" }}></div>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Completed <strong style={{ color: "var(--text-bright)" }}>{completedCount}</strong> of {totalLessonsCount} lessons.
          </div>
          {progressPercent === 100 && (
            <div style={{ marginTop: "1rem", padding: "0.5rem", background: "var(--neon-cyan-glow)", borderRadius: "8px", border: "1px solid var(--neon-cyan)", textAlign: "center", color: "var(--neon-cyan)", fontWeight: "800", fontSize: "0.75rem" }}>
              🏆 Certificate Unlocked!
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Left Navigation Sidebar, Right Video Lesson Viewer */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "2.5rem", alignItems: "start" }}>
        
        {/* Left Sidebar Course/Lessons List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: "700", color: "var(--text-bright)", margin: 0, paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-glass)" }}>
            Available Courses
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {courses.map((course) => (
              <div 
                key={course.id}
                className="detail-glass-card"
                style={{ 
                  padding: "1rem", 
                  background: activeCourse?.id === course.id ? "rgba(0,0,0,0.01)" : "var(--bg-card)",
                  borderColor: activeCourse?.id === course.id ? "var(--neon-cyan)" : "var(--border-glass)"
                }}
              >
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "0.25rem" }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.75rem", lineHeight: "1.4" }}>
                  {course.summary}
                </p>

                {/* Lessons list inside course */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {course.lessons.map((lesson) => {
                    const isCurrent = activeLesson?.id === lesson.id;
                    const isDone = completedLessons.includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => handleLessonSelect(course, lesson)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "8px",
                          background: isCurrent ? "var(--neon-cyan-glow)" : "transparent",
                          cursor: "pointer",
                          transition: "background 0.2s"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden" }}>
                          <span style={{ fontSize: "0.85rem" }}>{isDone ? "✅" : "📄"}</span>
                          <span style={{ fontSize: "0.8rem", color: isCurrent ? "var(--neon-cyan)" : "var(--text-main)", fontWeight: isCurrent ? "700" : "400", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {lesson.title}
                          </span>
                        </div>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", flexShrink: 0 }}>
                          {lesson.duration}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Lesson Viewer Panel */}
        {activeLesson ? (
          <div className="detail-glass-card" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Lesson Title Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--neon-purple)" }}>
                  Course: {activeCourse.title}
                </span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: "800", color: "var(--text-bright)", marginTop: "0.25rem", letterSpacing: "-0.5px" }}>
                  {activeLesson.title}
                </h2>
              </div>
              
              <button
                onClick={() => toggleComplete(activeLesson.id)}
                className="card-btn"
                style={{
                  background: completedLessons.includes(activeLesson.id) ? "#00FF87" : "transparent",
                  color: completedLessons.includes(activeLesson.id) ? "#080710" : "var(--text-main)",
                  border: "1px solid var(--border-glass)",
                  height: "36px",
                  fontWeight: "700"
                }}
              >
                {completedLessons.includes(activeLesson.id) ? "✓ Done" : "Mark Complete"}
              </button>
            </div>

            {/* Video Lesson Player (Embed Sandbox) */}
            <div style={{ width: "100%", position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "16px", border: "1px solid var(--border-glass)", boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
              <iframe
                src={activeLesson.videoUrl}
                title={activeLesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              ></iframe>
            </div>

            {/* Lesson Content Text */}
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "0.75rem" }}>
                Lesson Overview
              </h3>
              <p style={{ color: "var(--text-main)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                {activeLesson.content}
              </p>
            </div>

            {/* Interactive Lesson Quiz Section */}
            {activeQuiz && (
              <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "2rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "0.5rem" }}>
                  Knowledge Check 🧠
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                  Answer the question to verify your comprehension and mark the lesson complete.
                </p>

                <form onSubmit={handleQuizSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ fontWeight: "700", color: "var(--text-bright)", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                    {activeQuiz.question}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {activeQuiz.options.map((opt, idx) => (
                      <label 
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          background: quizAnswer === opt ? "rgba(0, 113, 227, 0.05)" : "rgba(0,0,0,0.01)",
                          border: "1px solid",
                          borderColor: quizAnswer === opt ? "var(--neon-cyan)" : "var(--border-glass)",
                          borderRadius: "10px",
                          padding: "0.75rem 1rem",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          transition: "all 0.2s"
                        }}
                      >
                        <input
                          type="radio"
                          name="quiz-option"
                          value={opt}
                          checked={quizAnswer === opt}
                          onChange={(e) => setQuizAnswer(e.target.value)}
                          disabled={quizSubmitted && quizAnswer === activeQuiz.correct}
                          style={{ cursor: "pointer" }}
                        />
                        <span style={{ color: "var(--text-main)" }}>{opt}</span>
                      </label>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.5rem" }}>
                    <button
                      type="submit"
                      className="card-btn action-primary"
                      disabled={!quizAnswer || (quizSubmitted && quizAnswer === activeQuiz.correct)}
                      style={{ height: "38px", padding: "0 1.5rem", border: "none" }}
                    >
                      Verify Answer
                    </button>
                    
                    {quizFeedback && (
                      <span style={{ fontSize: "0.85rem", color: "var(--text-bright)", fontWeight: "600", transition: "all 0.2s" }}>
                        {quizFeedback}
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

          </div>
        ) : (
          <div className="detail-glass-card" style={{ gridColumn: "2", textAlign: "center", padding: "4rem" }}>
            <h3 style={{ color: "var(--text-bright)" }}>No Lesson Selected</h3>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>Please select a lesson on the left to start learning.</p>
          </div>
        )}

      </div>
    </div>
  );
}
