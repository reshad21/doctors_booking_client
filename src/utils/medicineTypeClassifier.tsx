/**
 * Classifies medicine type based on dosage description
 * Returns 'Tablet', 'Capsule', or 'Other'
 */
export const classifyMedicineType = (
  dosageDescription: string
): "Tablet" | "Capsule" | "Other" => {
  if (!dosageDescription) return "Other";

  const normalizedDesc = dosageDescription.toLowerCase().trim();

  // Tablet patterns - including all variations
  const tabletPatterns = [
    "tablet",
    "tab",
    "tabs",
    "tablate", // common typo
  ];

  // Capsule patterns - including all variations
  const capsulePatterns = [
    "capsule",
    "caps",
    "gelatin capsule",
    "soft gelatin capsule",
    "hard gelatin capsule",
    "delayed release capsule",
  ];

  // Check for tablet match
  const isTablet = tabletPatterns.some((pattern) =>
    normalizedDesc.includes(pattern)
  );

  if (isTablet) return "Tablet";

  // Check for capsule match
  const isCapsule = capsulePatterns.some((pattern) =>
    normalizedDesc.includes(pattern)
  );

  if (isCapsule) return "Capsule";

  // Everything else (syrups, injections, drops, etc.)
  return "Other";
};

/**
 * Extended version that provides more detailed classification
 */
export const getDetailedMedicineType = (dosageDescription: string) => {
  const basicType = classifyMedicineType(dosageDescription);

  return {
    basicType, // 'Tablet', 'Capsule', or 'Other'
    originalDescription: dosageDescription,
    formCategory:
      basicType === "Other" ? detectFormCategory(dosageDescription) : basicType,
  };
};

/**
 * Helper to detect specific form categories for 'Other' types
 */
const detectFormCategory = (dosageDescription: string): string => {
  const normalizedDesc = dosageDescription.toLowerCase();

  if (
    normalizedDesc.includes("syrup") ||
    normalizedDesc.includes("suspension")
  ) {
    return "Syrup";
  }
  if (
    normalizedDesc.includes("injection") ||
    normalizedDesc.includes("ampule") ||
    normalizedDesc.includes("ampoule")
  ) {
    return "Injection";
  }
  if (normalizedDesc.includes("drop") || normalizedDesc.includes("drops")) {
    return "Drops";
  }
  if (
    normalizedDesc.includes("cream") ||
    normalizedDesc.includes("ointment") ||
    normalizedDesc.includes("gel")
  ) {
    return "Topical";
  }
  if (normalizedDesc.includes("inhaler") || normalizedDesc.includes("puff")) {
    return "Inhaler";
  }
  if (normalizedDesc.includes("powder") || normalizedDesc.includes("sachet")) {
    return "Powder";
  }

  return "Other";
};

// Example usage and test cases
export const testClassifier = () => {
  const testCases = [
    "03 Soft Gelatin Capsule",
    "XR Tablet",
    "CR Tablet",
    "Extended Release Tablet",
    "Tablet",
    "Capsule",
    "Syrup",
    "Injection",
    "Eye Drops",
    "Dispersible Tablet",
    "Chewable Tablet",
    "Film Coated Tablet",
  ];

  console.log("Classification Results:");
  testCases.forEach((desc) => {
    const type = classifyMedicineType(desc);
    console.log(`"${desc}" → ${type}`);
  });
};
