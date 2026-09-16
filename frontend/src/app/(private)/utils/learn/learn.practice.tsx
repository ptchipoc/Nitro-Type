import { motion } from "framer-motion";
import { VirtualKeyboard } from "../keyboard";
import { MOCK_SESSION_DATA } from "./monkeyLearnSetion";
import { Lesson } from "./stages";
import { useTranslation } from "@/lib/i18n";
import { typingArenaLabels } from "@/app/(private)/typing/arena/constants";

interface LearnPracticeProps {
    selectedLesson: Lesson | null;
    input: string;
    currentText: string;
    wpm: number;
    errors: number;
    expectedKey: string;
    pressedKey: string;
    status: 'idle' | 'correct' | 'error';
    shiftPressed: boolean;
    capsLock?: boolean;
}

export const LearnPractice = ({
    selectedLesson,
    input,
    currentText,
    wpm,
    errors,
    expectedKey,
    pressedKey,
    status,
    shiftPressed,
    capsLock = false
}: LearnPracticeProps) => {
    const { locale } = useTranslation();
    const labels = typingArenaLabels[locale as keyof typeof typingArenaLabels];
    return (
        <motion.div
            key="practice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto flex flex-col items-center pt-10"
        >
            {/* Instruction Header */}
            <div className="w-full max-w-4xl mb-12 text-center my-[-50px]">
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary/60 mb-2">
                    {selectedLesson?.title.includes("Intro")
                        ? labels.introductionNewKey
                        : labels.typingPractice}{" "}
                    / {labels.lesson} {selectedLesson?.number}
                </p>
                <h1 className="text-3xl font-bold mb-4">
                    {selectedLesson?.title.includes("Teclas")
                        ? `${labels.practiceKeys} ${selectedLesson.title.split("Teclas ")[1]}`
                        : selectedLesson?.title}
                </h1>
                <div className="w-full h-1 bg-border/20 rounded-full overflow-hidden mt-8 max-w-sm mx-auto">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{
                            width: `${(input.length / currentText.length) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Stats Overlay (Floating Left) */}
            <div className="fixed left-24 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 text-[10px] font-mono text-muted-foreground/40 font-bold uppercase tracking-widest bg-card/20 glass p-6 rounded-2xl border border-border/10">
                <div>
                    <p className="mb-1">{labels.wpm}</p>
                    <p className="text-3xl text-primary">{wpm}</p>
                </div>
                <div>
                    <p className="mb-1">{labels.errors}</p>
                    <p className="text-3xl text-destructive">{errors}</p>
                </div>
                <div>
                    <p className="mb-1">{labels.remaining}</p>
                    <p className="text-3xl text-foreground">
                        {currentText.length - input.length}
                    </p>
                </div>
            </div>

            {/* Typing Area (North Aligned) */}
            <div className="w-full max-w-3xl mb-16 relative">
                <div className="relative text-3xl font-mono leading-relaxed select-none min-h-[120px] bg-card/10 glass rounded-2xl p-10 border border-border/10">
                    {/* Active Typing Layer */}
                    <div className="flex flex-wrap gap-x-[2px]">
                        {currentText.split("").map((char, i) => {
                            let colorClass = "text-muted-foreground/30";
                            let underlineClass = "";

                            if (i < input.length) {
                                if (input[i] === char) {
                                    colorClass = "text-primary text-[15px]";
                                    underlineClass = "border-b-2 border-primary/30";
                                } else {
                                    colorClass = "text-destructive";
                                    underlineClass =
                                        "border-b-2 border-destructive/50 bg-destructive/10";
                                }
                            } else if (i === input.length) {
                                colorClass = "text-foreground font-bold";
                                underlineClass = "border-b-2 border-primary";
                            }

                            return (
                                <span
                                    key={i}
                                    className={`transition-all duration-150 ${colorClass} ${underlineClass} text-[20px]`}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>

            <VirtualKeyboard
                expectedKey={expectedKey}
                pressedKey={pressedKey}
                status={status}
                shiftPressed={shiftPressed}
                capsLock={capsLock}
            />
        </motion.div>
    )
}