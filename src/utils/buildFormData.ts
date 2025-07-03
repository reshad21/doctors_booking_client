/* eslint-disable @typescript-eslint/no-explicit-any */

export const buildFormData = (data: Record<string, any>, dateFields: string[] = []): FormData => {
    const formData = new FormData();
  
    Object.entries(data).forEach(([key, value]) => {
     
      if (value !== undefined && value !== null && value !== '') {
        // If it's a date field, convert to ISO
        if (dateFields.includes(key)) {
          const isoDate = new Date(value).toISOString();
          formData.append(key, isoDate);
        } else {
          formData.append(key, value);
        }
      }
    });
  
    return formData;
  };
  