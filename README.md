model PrescriptionHeader {
  id                        String   @id @default(uuid())
  doctorInfoBangla          String   @db.LongText
  doctorInfoEnglish         String   @db.LongText
  logo                      String
  showLogo                  Boolean  @default(true)
  showPrescriptionHeader    Boolean  @default(true)
  showPrescriptionInBangla  Boolean  @default(true)
  showPrescriptionInEnglish Boolean  @default(true)
  chamberId                 String
  chamber                   Chamber  @relation(fields: [chamberId], references: [id], onDelete: Cascade)
  doctorId                  String
  doctor                    Doctor   @relation(fields: [doctorId], references: [id])
  createdAt                 DateTime @default(now())
  updatedAt                 DateTime @updatedAt
}

model PrescriptionFooter {
  id                        String   @id @default(uuid())
  doctorInfoBangla          String   @db.LongText
  doctorInfoEnglish         String   @db.LongText
  logo                      String
  showLogo                  Boolean  @default(true)
  showPrescriptionFooter    Boolean  @default(true)
  showPrescriptionInBangla  Boolean  @default(true)
  showPrescriptionInEnglish Boolean  @default(true)
  chamberId                 String
  chamber                   Chamber  @relation(fields: [chamberId], references: [id], onDelete: Cascade)
  doctorId                  String
  doctor                    Doctor   @relation(fields: [doctorId], references: [id])
  createdAt                 DateTime @default(now())
  updatedAt                 DateTime @updatedAt
}

enum PrescriptionPageSetupStatus {
  custom
  a4
}

model PrescriptionPageSetup {
  id           String                      @id @default(uuid())
  totalHeight  String
  totalWidth   String
  topMargin    String
  bottomMargin String
  leftMargin   String
  rightMargin  String
  doctorId     String
  doctor       Doctor                      @relation(fields: [doctorId], references: [id])
  chamberId    String
  chamber      Chamber                     @relation(fields: [chamberId], references: [id], onDelete: Cascade)
  status       PrescriptionPageSetupStatus @default(custom)
  createdAt    DateTime                    @default(now())
  updatedAt    DateTime                    @updatedAt
}

model PrescriptionPatientSetup {
  id                                String                              @id @default(uuid())
  showAddress                       Boolean                             @default(false)
  showAge                           Boolean                             @default(false)
  showContactInfo                   Boolean                             @default(false)
  showGender                        Boolean                             @default(false)
  showPatientInfo                   Boolean                             @default(true)
  chamberId                         String
  chamber                           Chamber                             @relation(fields: [chamberId], references: [id], onDelete: Cascade)
  doctorId                          String
  doctor                            Doctor                              @relation(fields: [doctorId], references: [id])
  createdAt                         DateTime                            @default(now())
  updatedAt                         DateTime                            @updatedAt
  prescriptionPatientSetupFormField PrescriptionPatientSetupFormField[]
}

model PrescriptionPatientSetupFormField {
  id                         String                   @id @default(uuid())
  defaultValue               String
  label                      String
  order                      String
  placeholder                String
  required                   Boolean                  @default(false)
  row                        String
  type                       String
  widthInches                String
  doctorId                   String
  doctor                     Doctor                   @relation(fields: [doctorId], references: [id])
  prescriptionPatientSetupId String
  prescriptionPatientSetup   PrescriptionPatientSetup @relation(fields: [prescriptionPatientSetupId], references: [id], onDelete: Cascade)
  createdAt                  DateTime                 @default(now())
  updatedAt                  DateTime                 @updatedAt
  Chamber                    Chamber?                 @relation(fields: [chamberId], references: [id])
  chamberId                  String?
}

model PrescriptionBodySetup {
  id                     String   @id @default(uuid())
  bodyLeftSideTopMargin  String
  bodyLeftSideWidth      String
  bodyRightSideTopMargin String
  bodyRightSideWidth     String
  chamberId              String
  chamber                Chamber  @relation(fields: [chamberId], references: [id], onDelete: Cascade)
  doctorId               String
  doctor                 Doctor   @relation(fields: [doctorId], references: [id])
  showBottomLine         Boolean  @default(false)
  showLeftLine           Boolean  @default(true)
  showMiddleLine         Boolean  @default(true)
  showRightLine          Boolean  @default(false)
  showTopLine            Boolean  @default(true)
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
}