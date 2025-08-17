export const dosageOptions = [
  { value: "1+0+0", label: "1+0+0 (Once daily - Morning)" },
  { value: "1+1+0", label: "1+1+0 (Twice daily - Morning & Afternoon)" },
  { value: "1+1+1", label: "1+1+1 (Three times daily)" },
  { value: "0+1+0", label: "0+1+0 (Once daily - Afternoon)" },
  { value: "0+0+1", label: "0+0+1 (Once daily - Evening)" },
  { value: "2+2+2", label: "2+2+2 (2 tablets three times daily)" },
  { value: "1/2+1/2+1/2", label: "1/2+1/2+1/2 (Half tablet three times daily)" },
];

export const timeOptions = [
  { value: "before-meal", label: "Before Meal" },
  { value: "after-meal", label: "After Meal" },
  { value: "with-meal", label: "With Meal" },
  { value: "empty-stomach", label: "Empty Stomach" },
  { value: "bedtime", label: "At Bedtime" },
  { value: "as-needed", label: "As Needed" },
];

export const chiefComplaintOptions = [
  { value: "fever", label: "Fever" },
  { value: "headache", label: "Headache" },
  { value: "cough", label: "Cough" },
  { value: "cold", label: "Cold" },
  { value: "body-ache", label: "Body Ache" },
  { value: "stomach-pain", label: "Stomach Pain" },
  { value: "chest-pain", label: "Chest Pain" },
  { value: "shortness-of-breath", label: "Shortness of Breath" },
  { value: "nausea", label: "Nausea" },
  { value: "vomiting", label: "Vomiting" },
];

export const onExaminationOptions = [
  { value: "bp-normal", label: "BP: Normal (120/80)" },
  { value: "pulse-normal", label: "Pulse: Normal (70-80/min)" },
  { value: "temp-normal", label: "Temperature: Normal (98.6°F)" },
  { value: "resp-normal", label: "Respiratory Rate: Normal" },
  { value: "heart-sounds-normal", label: "Heart Sounds: Normal" },
  { value: "lung-sounds-clear", label: "Lung Sounds: Clear" },
  { value: "abdomen-soft", label: "Abdomen: Soft, Non-tender" },
  { value: "no-lymphadenopathy", label: "No Lymphadenopathy" },
];

export const diagnosisOptions = [
  { value: "viral-fever", label: "Viral Fever" },
  { value: "common-cold", label: "Common Cold" },
  { value: "gastritis", label: "Gastritis" },
  { value: "hypertension", label: "Hypertension" },
  { value: "diabetes", label: "Diabetes Mellitus" },
  { value: "bronchitis", label: "Bronchitis" },
  { value: "migraine", label: "Migraine" },
  { value: "allergic-rhinitis", label: "Allergic Rhinitis" },
  { value: "urinary-tract-infection", label: "Urinary Tract Infection" },
];

export const investigationOptions = [
  { value: "blood-test", label: "Complete Blood Count (CBC)" },
  { value: "blood-sugar", label: "Blood Sugar (Random/Fasting)" },
  { value: "urine-test", label: "Urine Routine & Microscopy" },
  { value: "chest-xray", label: "Chest X-Ray" },
  { value: "ecg", label: "ECG (Electrocardiogram)" },
  { value: "lipid-profile", label: "Lipid Profile" },
  { value: "liver-function", label: "Liver Function Test" },
  { value: "kidney-function", label: "Kidney Function Test" },
  { value: "thyroid-function", label: "Thyroid Function Test" },
];

export const adviceOptions = [
  { value: "rest", label: "Take adequate rest" },
  { value: "fluid-intake", label: "Increase fluid intake" },
  { value: "avoid-cold", label: "Avoid cold foods and drinks" },
  { value: "light-diet", label: "Take light, easily digestible food" },
  { value: "avoid-stress", label: "Avoid stress and anxiety" },
  { value: "regular-exercise", label: "Regular light exercise" },
  { value: "follow-up", label: "Follow up after 1 week" },
  { value: "emergency-care", label: "Seek immediate care if symptoms worsen" },
  { value: "medication-compliance", label: "Take medications as prescribed" },
  { value: "diet-control", label: "Follow dietary restrictions" },
];

export const mockPatient = {
  id: "P001",
  name: "John Doe",
  age: "35 years",
  gender: "Male",
  phone: "+1-234-567-8900",
  address: "123 Main Street, City, State 12345",
};