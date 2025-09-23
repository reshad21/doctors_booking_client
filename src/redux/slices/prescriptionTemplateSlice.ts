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

interface PatientSection {
  showPatientInfo: boolean;
  showContactInfo: boolean;
  showAge: boolean;
  showGender: boolean;
  showAddress: boolean;
  // Add more patient section fields as needed
}

interface BodySection {
  showMedicineTable: boolean;
  showAdvice: boolean;
  showDiagnosis: boolean;
  showInvestigation: boolean;
  // Add more body section fields as needed
}

interface HeaderSection {
  showLogo: boolean;
  showDoctorName: boolean;
  showSpecialization: boolean;
  showChamberAddress: boolean;
  showContactInfo: boolean;
  // Add more header section fields as needed
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
  },
  bodySection: {
    showMedicineTable: true,
    showAdvice: true,
    showDiagnosis: true,
    showInvestigation: false,
  },
  headerSection: {
    showLogo: true,
    showDoctorName: true,
    showSpecialization: true,
    showChamberAddress: true,
    showContactInfo: true,
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
  },
});

export const {
  setPageSetup,
  setPatientSection,
  setBodySection,
  setHeaderSection,
  setFooterSection,
  updatePageSetupField,
  resetTemplate,
  setCompleted,
} = prescriptionTemplateSlice.actions;

export const prescriptionTemplateReducer = prescriptionTemplateSlice.reducer;
