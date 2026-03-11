export type UrgencyLevel = "CRITICAL" | "WITHIN_48H" | "LOW" | "WATCH";

export interface DiagnosisHypothesis {
  condition: string;
  probability: number;
  explanation: string;
}

export interface DiagnosisResult {
  urgency_level: UrgencyLevel;
  urgency_reason: string;
  hypotheses: DiagnosisHypothesis[];
  immediate_advice: string[];
  watch_for: string[];
  disclaimer: string;
}

export interface SymptomData {
  bodyArea: string;
  symptomsText: string;
  duration: string;
  intensity: string;
  evolution: string;
  photos?: File[];
  photoUrls?: string[];
  animalId: string;
}

export interface PrescriptionMedication {
  name: string;
  generic_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  purpose: string;
  side_effects: string[];
  warnings: string[];
  administration: string;
}

export interface PrescriptionResult {
  medications: PrescriptionMedication[];
  general_notes: string;
  follow_up: string;
}

export type ReminderUrgency = "OVERDUE" | "DUE_SOON" | "UPCOMING" | "UP_TO_DATE";

export interface PendingReminder {
  id: string;
  animalId: string;
  animalName: string;
  animalSpecies: string;
  eventName: string;
  eventType: string;
  nextDue: string;
  daysUntilDue: number;
  urgency: ReminderUrgency;
}

export interface AnimalWithHealth {
  id: string;
  name: string;
  species: "DOG" | "CAT";
  breed: string | null;
  birthDate: Date | null;
  sex: "MALE" | "FEMALE" | null;
  sterilized: boolean;
  weightKg: number | null;
  color: string | null;
  microchipId: string | null;
  photoUrl: string | null;
  vetName: string | null;
  pendingReminders: number;
  lastDiagnosis: Date | null;
}
