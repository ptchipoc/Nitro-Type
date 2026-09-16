import { ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LearnPractice } from "./learn.practice";
import { Lesson } from "./stages";
import { SessionResults, ViewType } from "../../learn/page";

interface ResultLearnProps {
    results: SessionResults;
    startLesson: (lesson: Lesson) => void;
    selectedLesson: Lesson | null;
    setView: (view: ViewType) => void;
}

export const ResultLearn = ({
    results,
    startLesson,
    selectedLesson,
    setView
}: ResultLearnProps) => {
    return (
        <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto py-20 text-center"
              >
                <Trophy className="h-20 w-20 text-primary mx-auto mb-8 animate-bounce" />
                <h2 className="text-5xl font-bold mb-12">RESULTADO</h2>
                <div className="grid grid-cols-3 gap-6 mb-12">
                  <div className="bg-card/40 glass border border-border p-6 rounded-2xl">
                    <p className="text-4xl font-bold">{results.wpm}</p>
                    <p className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">
                      WPM
                    </p>
                  </div>
                  <div className="bg-card/40 glass border border-border p-6 rounded-2xl">
                    <p className="text-4xl font-bold">{results.accuracy}%</p>
                    <p className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">
                      Accuracy
                    </p>
                  </div>
                  <div className="bg-card/40 glass border border-border p-6 rounded-2xl">
                    <p className="text-4xl font-bold">{results.errors}</p>
                    <p className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">
                      Erros
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => startLesson(selectedLesson!)}
                    className="px-8 py-3 rounded-lg border border-border hover:border-primary transition-all font-bold flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" /> RETENTAR
                  </button>
                  <button
                    onClick={() => setView("roadmap")}
                    className="px-8 py-3 rounded-lg bg-primary text-primary-foreground border-2 border-primary hover:bg-transparent hover:text-primary transition-all font-bold flex items-center gap-2"
                  >
                    CONTINUAR <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
    )
}