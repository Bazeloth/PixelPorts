/**
 * Logger object for consistent logging throughout the application
 */
export const logger = {
	/**
	 * Logs an informational message to the console in development environment
	 * @param message - The info message to log
	 * @param optionalParams - Optional parameters
	 */
	Info: (message: string, ...optionalParams: unknown[]): void => {
		if (process.env.NODE_ENV !== 'production') {
			console.log(message, ...optionalParams);
		}
	},

	/**
	 * Logs a warning message to the console in development environment
	 * @param message - The warning message to log
	 */
	Warn: (message: string): void => {
		if (process.env.NODE_ENV !== 'production') {
			console.warn(message);
		}
	},

	/**
	 * Logs an error message and error object to the console in development environment
	 * @param message - The error message to log
	 * @param error - The error object to log
	 */
	Error: (message: string, error: unknown): void => {
		if (process.env.NODE_ENV !== 'production') {
			console.error(message, error);
		}
	},
};