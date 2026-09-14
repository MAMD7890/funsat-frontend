/** Misma forma que ApiErrorResponse en el backend (GlobalExceptionHandler). */
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  fieldErrors?: { [field: string]: string } | null;
}
