import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PageSettings {
  pageType: "a4" | "custom";
  chamberId: string;
  totalHeight: number;
  totalWidth: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
}

export interface FormFieldData {
  id: string;
  label: string;
  type:
    | "text"
    | "email"
    | "number"
    | "password"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date";
  placeholder: string;
  required: boolean;
  order: number;
  widthInches: number; // Width in inches
  row: number;
  defaultValue: string;
  options?: string[]; // for select, radio
}

interface PatientSection {
  showPatientInfo: boolean;
  showContactInfo: boolean;
  showAge: boolean;
  showGender: boolean;
  showAddress: boolean;
  formFields: FormFieldData[];
}

interface BodySection {
  showBottomLine: boolean;
  showMiddleLine: boolean;
  showTopLine: boolean;
  showRightLine: boolean;
  showLeftLine: boolean;
  bodyRightSideWidth: number;
  bodyLeftSideWidth: number;
  bodyRightSideTopMargin: number;
  bodyLeftSideTopMargin: number;
}

interface HeaderSection {
  showLogo: boolean;
  showPrescriptionInBangla: boolean;
  showPrescriptionInEnglish: boolean;
  showPrescriptionHeader: boolean;
  doctorInfoBangla: string;
  doctorInfoEnglish: string;
  logo: string; // base64 string for display
  logoFile: {
    name: string;
    size: number;
    type: string;
    base64: string;
  } | null; // File data for backend
}

interface FooterSection {
  showSignature: boolean;
  showDate: boolean;
  showNextVisit: boolean;
  customFooterText: string;
  // Add more footer section fields as needed
}

interface PrescriptionTemplateState {
  pageSetup: PageSettings;
  patientSection: PatientSection;
  bodySection: BodySection;
  headerSection: HeaderSection;
  footerSection: FooterSection;
  isCompleted: boolean;
}

const initialState: PrescriptionTemplateState = {
  pageSetup: {
    pageType: "a4",
    chamberId: "",
    totalHeight: 11.7,
    totalWidth: 8.3,
    leftMargin: 0.5,
    rightMargin: 0.5,
    topMargin: 0.5,
    bottomMargin: 0.5,
  },
  patientSection: {
    showPatientInfo: true,
    showContactInfo: true,
    showAge: true,
    showGender: true,
    showAddress: false,
    formFields: [
      {
        id: "1",
        label: "Patient Name",
        type: "text",
        placeholder: "Enter patient name",
        required: true,
        order: 0,
        widthInches: 1.8,
        row: 0,
        defaultValue: "",
      },
      {
        id: "2",
        label: "Age",
        type: "number",
        placeholder: "Enter age",
        required: true,
        order: 1,
        widthInches: 1.0,
        row: 0,
        defaultValue: "",
      },
      {
        id: "3",
        label: "Gender",
        type: "select",
        placeholder: "Select gender",
        required: true,
        order: 2,
        widthInches: 1.2,
        row: 0,
        defaultValue: "",
        options: ["Male", "Female", "Other"],
      },
      {
        id: "4",
        label: "Patient ID",
        type: "text",
        placeholder: "Enter patient ID",
        required: false,
        order: 3,
        widthInches: 1.8,
        row: 0,
        defaultValue: "",
      },
      {
        id: "5",
        label: "Visit Date",
        type: "date",
        placeholder: "Select date",
        required: true,
        order: 4,
        widthInches: 1.5,
        row: 0,
        defaultValue: "",
      },
    ],
  },
  bodySection: {
    showBottomLine: false,
    showMiddleLine: false,
    showTopLine: false,
    showRightLine: false,
    showLeftLine: false,
    bodyRightSideWidth: 50,
    bodyLeftSideWidth: 50,
    bodyRightSideTopMargin: 0,
    bodyLeftSideTopMargin: 0,
  },
  headerSection: {
    showLogo: true,
    showPrescriptionInBangla: true,
    showPrescriptionInEnglish: true,
    showPrescriptionHeader: true,
    doctorInfoBangla: "",
    doctorInfoEnglish: "",
    logo: "",
    logoFile: null,
  },
  footerSection: {
    showSignature: true,
    showDate: true,
    showNextVisit: false,
    customFooterText: "",
  },
  isCompleted: false,
};

const prescriptionTemplateSlice = createSlice({
  name: "prescriptionTemplate",
  initialState,
  reducers: {
    setPageSetup: (state, action: PayloadAction<PageSettings>) => {
      state.pageSetup = action.payload;
    },
    setPatientSection: (state, action: PayloadAction<PatientSection>) => {
      state.patientSection = action.payload;
    },
    setBodySection: (state, action: PayloadAction<BodySection>) => {
      state.bodySection = action.payload;
    },
    setHeaderSection: (state, action: PayloadAction<HeaderSection>) => {
      state.headerSection = action.payload;
    },
    updateHeaderField: (
      state,
      action: PayloadAction<{
        field: keyof HeaderSection;
        value: HeaderSection[keyof HeaderSection];
      }>
    ) => {
      const { field, value } = action.payload;
      state.headerSection[field] = value as never;
    },
    setFooterSection: (state, action: PayloadAction<FooterSection>) => {
      state.footerSection = action.payload;
    },
    updatePageSetupField: (
      state,
      action: PayloadAction<{
        field: keyof PageSettings;
        value: PageSettings[keyof PageSettings];
      }>
    ) => {
      const { field, value } = action.payload;
      state.pageSetup[field] = value as never;
    },
    resetTemplate: () => {
      return initialState;
    },
    setCompleted: (state, action: PayloadAction<boolean>) => {
      state.isCompleted = action.payload;
    },
    updateFormField: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<FormFieldData>;
      }>
    ) => {
      const { id, updates } = action.payload;
      const fieldIndex = state.patientSection.formFields.findIndex(
        (field) => field.id === id
      );
      if (fieldIndex !== -1) {
        state.patientSection.formFields[fieldIndex] = {
          ...state.patientSection.formFields[fieldIndex],
          ...updates,
        };
      }
    },
    setFormFields: (state, action: PayloadAction<FormFieldData[]>) => {
      state.patientSection.formFields = action.payload;
    },
    addFormField: (state, action: PayloadAction<FormFieldData>) => {
      state.patientSection.formFields.push(action.payload);
    },
    deleteFormField: (state, action: PayloadAction<string>) => {
      state.patientSection.formFields = state.patientSection.formFields.filter(
        (field) => field.id !== action.payload
      );
    },
  },
});

export const {
  setPageSetup,
  setPatientSection,
  setBodySection,
  setHeaderSection,
  updateHeaderField,
  setFooterSection,
  updatePageSetupField,
  resetTemplate,
  setCompleted,
  updateFormField,
  setFormFields,
  addFormField,
  deleteFormField,
} = prescriptionTemplateSlice.actions;

export const prescriptionTemplateReducer = prescriptionTemplateSlice.reducer;
