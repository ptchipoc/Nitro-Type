import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronDown, ChevronUp, KeyboardIcon, Layout, Lock, Menu, PlayCircle, Search, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { STAGES, Lesson } from "./stages";

const RightSidebar = () => (
  <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
    <button className="h-10 w-10 bg-card/80 border border-border rounded-lg flex items-center justify-center hover:border-primary transition-all shadow-lg glass">
      <Menu className="h-5 w-5" />
    </button>
    <button className="h-10 w-10 bg-card/80 border border-border rounded-lg flex items-center justify-center hover:border-primary transition-all shadow-lg glass">
      <ChevronUp className="h-5 w-5" />
    </button>
    <div className="h-10 w-10 bg-card/80 border border-border rounded-lg flex items-center justify-center font-bold text-xs shadow-lg glass">
      1
    </div>
    <button className="h-10 w-10 bg-card/80 border border-border rounded-lg flex items-center justify-center hover:border-primary transition-all shadow-lg glass">
      <ChevronDown className="h-5 w-5" />
    </button>
  </div>
);

interface LearningStats {
  progress: number;
  stars: number;
  points: number;
}

const StatsBar = ({ stats }: { stats: LearningStats }) => (
  <div className="flex gap-8 mb-8 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-4">
    <div className="flex gap-2">
      <span className="text-primary">{stats.progress}%</span> evolução
    </div>
    <div className="flex gap-2">
      <span className="text-primary">{stats.stars}</span> estrelas
    </div>
    <div className="flex gap-2">
      <span className="text-primary">{stats.points.toLocaleString()}</span>{" "}
      pontos
    </div>
  </div>
);

const LessonCard = ({
  lesson,
  onStart,
}: {
  lesson: Lesson;
  onStart: () => void;
}) => {
  const isLocked = lesson.status === "locked";
  const isCompleted = lesson.status === "completed";

  const getIcon = () => {
    switch (lesson.type) {
      case "keys":
        return <Layout className="h-10 w-10 opacity-40" />;
      case "review":
        return <Search className="h-10 w-10 opacity-40" />;
      case "practice":
        return <Timer className="h-10 w-10 opacity-40" />;
      case "game":
        return <KeyboardIcon className="h-10 w-10 opacity-40" />;
    }
  };

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.05, y: -4 } : {}}
      onClick={!isLocked ? onStart : undefined}
      className={`relative aspect-square flex flex-col items-center justify-between p-4 rounded-lg border transition-all cursor-pointer overflow-hidden ${
        isLocked
          ? "border-border bg-card/10 opacity-40 grayscale"
          : isCompleted
            ? "border-primary/20 bg-primary/5 hover:border-primary/50"
            : "border-primary bg-card/40 glass shadow-[0_0_20px_rgba(var(--primary),0.05)]"
      }`}
    >
      <div className="w-full flex justify-between items-start">
        <span className="text-xl font-bold opacity-30">{lesson.number}</span>
        {isLocked ? (
          <Lock className="h-4 w-4 opacity-30" />
        ) : (
          <PlayCircle className="h-4 w-4 text-primary" />
        )}
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        {getIcon()}
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-primary/40" />
          </div>
        )}
      </div>

      <div className="w-full text-center">
        <p className="text-[10px] font-bold uppercase tracking-tighter truncate text-muted-foreground">
          {lesson.title}
        </p>
      </div>
    </motion.div>
  );
};

const startLesson = (lesson: Lesson, router: ReturnType<typeof useRouter>) => {
  router.push(`/learn/${lesson.id}/${lesson.type}`);
};

interface RoadmapProps {
  setSelectedLesson?: (lesson: Lesson) => void;
  setView?: (view: any) => void;
  setInput?: (input: string) => void;
  setErrors?: (errors: number) => void;
  setStartTime?: (time: number | null) => void;
  setCurrentText?: (text: string) => void;
}

export const Roadmap = ({
  setSelectedLesson,
  setView,
  setInput,
  setErrors,
  setStartTime,
  setCurrentText,
}: RoadmapProps) => {
  const router = useRouter();

  return (
    <motion.div
      key="roadmap"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="max-w-6xl mx-auto pb-20 relative"
    >
      <RightSidebar />
      <StatsBar stats={{ progress: 4, stars: 1, points: 1250 }} />

      <div className="space-y-12">
        {STAGES.map((stage, index) => (
          <div key={stage.id}>
            <h2 className="text-3xl font-bold mb-8 text-foreground/80">
              {stage.title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {stage.lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onStart={() => startLesson(lesson, router)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};