export const getAbbreviatedDosageForm = (dosageDescription: string) => {
  if (!dosageDescription) return "";
  const dosageMap: { [key: string]: string } = {
    tablet: "Tab.",
    capsule: "Cap.",
    syrup: "Syp.",
    injection: "Inj.",
    cream: "Cr.",
    ointment: "Oint.",
    drops: "Drp.",
    suspension: "Susp.",
    solution: "Sol.",
    powder: "Pwd.",
    gel: "Gel",
    lotion: "Lot.",
    spray: "Spr.",
    inhaler: "Inh.",
    suppository: "Supp.",
    patch: "Patch",
  };
  const description = dosageDescription.toLowerCase();
  for (const [key, abbreviation] of Object.entries(dosageMap)) {
    if (description.includes(key)) {
      return abbreviation;
    }
  }
  const firstWord = dosageDescription.split(" ")[0];
  return (
    firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase() + "."
  );
};
