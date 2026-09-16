"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileText,
  Layers,
  Loader2,
  ArrowRight,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  EventCategory,
  EventDifficulty,
} from "@/lib/api/endpoints/events/event.type";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCreateEvent } from "@/features/events/hooks/use-create-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EventType } from "@/features/events/types";
import { CursorGlow } from "@/components/cursor-glow";
import { CreatePrivateEventInput, createPrivateEventSchema } from "@/features/events/actions/event.inputs";
import { ApiClientError } from "@/features/apiClient";
import { useTranslation } from "@/lib/i18n";
import { labelsByLocale } from "@/app/(private)/events/constants/create.constants";

export default function CreateEventPage() {
  const router = useRouter();
  const { locale } = useTranslation();
  const labels = labelsByLocale[locale as keyof typeof labelsByLocale] || labelsByLocale.en;
  const createEventMutation = useCreateEvent();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePrivateEventInput>({
    resolver: zodResolver(createPrivateEventSchema),
    defaultValues: {
      name: "",
      description: "",
      scheduledAt: "",
      betweenRoundsDelay: 10,
      roundsCount: 1,
      category: EventCategory.ANIME,
      difficulty: EventDifficulty.EASY,
      maxParticipants: undefined,
    },
  });

  const category = watch("category");
  const difficulty = watch("difficulty");
  const roundsCount = watch("roundsCount");

  const handleApiError = (error: any) => {
    const apiError = error as ApiClientError;
    if (apiError.getSuccess() === false && apiError.getError()) {
      toast.error(apiError.getError()?.message);
    } else {
      toast.error(labels.error);
    }
  };

  const handleCreateEvent = async (data: CreatePrivateEventInput) => {
    try {
      const event = await createEventMutation.mutateAsync({
        name: data.name,
        description: data.description,
        type: EventType.PRIVATE,
        scheduledAt: data.scheduledAt
          ? new Date(data.scheduledAt).toISOString()
          : undefined,
        betweenRoundsDelay: data.betweenRoundsDelay,
        roundsCount: data.roundsCount,
        category: data.category,
        difficulty: data.difficulty,
        maxParticipants: data.maxParticipants,
      });
      toast.success(labels.createdSuccessfully);
      router.push(`/events/${event.data.id}`);
    } catch (error) {
      handleApiError(error);
    }
  };

  const isSubmitting = createEventMutation.isPending;

  return (
    <div className="min-h-screen bg-background flex flex-col font-mono text-foreground overflow-x-hidden scanlines">
      <Header />
      <CursorGlow />
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-4xl mx-auto w-full">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter flex items-center justify-center gap-3 italic">
            <Plus className="w-8 h-8 text-primary shadow-glow" />
            {labels.title}
          </h1>
          <p className="text-muted-foreground text-[10px] uppercase tracking-widest mt-2">
            {labels.subtitle}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/60 glass border border-border p-8 rounded-sm space-y-8"
        >
          <form
            onSubmit={handleSubmit(handleCreateEvent)}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <FieldSet className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {labels.basicInfo}
                  </h2>
                </div>

                <FieldGroup className="space-y-4">
                  <Field>
                    <FieldContent>
                      <FieldLabel htmlFor="name">{labels.eventName}</FieldLabel>
                      <Input
                        id="name"
                        placeholder={labels.eventNamePlaceholder}
                        className="h-12   uppercase placeholder:text-muted-foreground/30"
                        {...register("name")}
                      />
                      <FieldError errors={[errors.name]} />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldContent>
                      <FieldLabel htmlFor="description">{labels.description}</FieldLabel>
                      <textarea
                        id="description"
                        placeholder={labels.descriptionPlaceholder}
                        className="min-h-24 w-full resize-none border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground   uppercase focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
                        {...register("description")}
                      />
                      <FieldDescription>
                        {labels.descriptionHint}
                      </FieldDescription>
                      <FieldError errors={[errors.description]} />
                    </FieldContent>
                  </Field>
                </FieldGroup>
              </FieldSet>

              <FieldSet className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {labels.arenaConfig}
                  </h2>
                </div>

                <FieldGroup className="space-y-5">
                  <Field>
                    <FieldContent>
                      <FieldLabel>{labels.roundsCount}</FieldLabel>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() =>
                              setValue("roundsCount", num, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              })
                            }
                            className={cn(
                              "flex-1 py-3 text-[10px] border transition-all uppercase font-black",
                              roundsCount === num
                                ? "bg-primary/20 border-primary text-primary shadow-glow"
                                : "bg-card/40 border-border text-muted-foreground",
                            )}
                          >
                            {num}
                          </button>
                        ))}
                        <Input
                          type="number"
                          min={1}
                          className="w-20 h-12   text-center"
                          {...register("roundsCount", {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <FieldError errors={[errors.roundsCount]} />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldContent>
                      <FieldLabel>{labels.arenaCategory}</FieldLabel>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(EventCategory).map((value) => {
                          const displayLabel = 
                            value === EventCategory.ANIME ? labels.anime :
                            value === EventCategory.FUNCTIONS ? labels.function :
                            value === EventCategory.ALGORITHMS ? labels.algorithm :
                            value === EventCategory.RANDOM ? labels.random :
                            value;
                          
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() =>
                                setValue("category", value, {
                                  shouldDirty: true,
                                  shouldTouch: true,
                                  shouldValidate: true,
                                })
                              }
                              className={cn(
                                "px-3 py-2 text-[9px] border transition-all uppercase font-black",
                                category === value
                                  ? "bg-primary/20 border-primary text-primary shadow-glow"
                                  : "bg-card/40 border-border text-muted-foreground",
                              )}
                            >
                              {displayLabel}
                            </button>
                          );
                        })}
                      </div>
                      <FieldError errors={[errors.category]} />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldContent>
                      <FieldLabel>{labels.difficulty}</FieldLabel>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(EventDifficulty).map((value) => {
                          const displayLabel = 
                            value === EventDifficulty.EASY ? labels.easy :
                            value === EventDifficulty.MEDIUM ? labels.medium :
                            value === EventDifficulty.HARD ? labels.hard :
                            value === EventDifficulty.EXPERT ? labels.expert :
                            value === EventDifficulty.RANDOM ? labels.random :
                            value;
                          
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() =>
                                setValue("difficulty", value, {
                                  shouldDirty: true,
                                  shouldTouch: true,
                                  shouldValidate: true,
                                })
                              }
                              className={cn(
                                "px-3 py-2 text-[9px] border transition-all uppercase font-black",
                                difficulty === value
                                  ? "bg-primary/20 border-primary text-primary shadow-glow"
                                  : "bg-card/40 border-border text-muted-foreground",
                              )}
                            >
                              {displayLabel}
                            </button>
                          );
                        })}
                      </div>
                      <FieldError errors={[errors.difficulty]} />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldContent>
                      <FieldLabel htmlFor="betweenRoundsDelay">
                        {labels.betweenRoundsDelay}
                      </FieldLabel>
                      <Input
                        id="betweenRoundsDelay"
                        type="number"
                        min={5}
                        className="h-12  "
                        {...register("betweenRoundsDelay", {
                          valueAsNumber: true,
                        })}
                      />
                      <FieldDescription>
                        {labels.betweenRoundsDelayHint}
                      </FieldDescription>
                      <FieldError errors={[errors.betweenRoundsDelay]} />
                    </FieldContent>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </div>

            <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-center gap-4">
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-3 px-12 py-7 uppercase font-black tracking-widest text-sm relative group overflow-hidden box-glow"
              >
                <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {labels.initialize}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
