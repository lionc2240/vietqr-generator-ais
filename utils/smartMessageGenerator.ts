/**
 * Generates a smart, time-sensitive greeting message in Vietnamese.
 * The message includes a greeting appropriate for the time of day.
 * @returns A formatted string, e.g., "Chuc quy khach buoi sang tot lanh".
 */
export const generateSmartMessage = (): string => {
  const now = new Date();
  const hour = now.getHours();

  let greeting: string;

  if (hour >= 0 && hour < 9) { // 00:00 - 08:59
    greeting = 'Chuc quy khach buoi sang tot lanh';
  } else if (hour >= 9 && hour < 12) { // 09:00 - 11:59
    greeting = 'Chuc quy khach buoi trua tot lanh';
  } else if (hour >= 12 && hour < 18) { // 12:00 - 17:59
    greeting = 'Chuc quy khach buoi chieu tot lanh';
  } else { // 18:00 - 23:59
    greeting = 'Chuc quy khach buoi toi tot lanh';
  }

  return greeting;
};