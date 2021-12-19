package com.ddthien.itraining.lib.util.error;

public class RuntimeError extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private ErrorType errorType;

    public RuntimeError() {}

    public RuntimeError(ErrorType errorType, Throwable cause) {
        super(cause);
        this.errorType = errorType;
    }

    public RuntimeError(ErrorType errorType, String message, Throwable cause) {
        super(message, cause);
        this.errorType = errorType;
    }

    public RuntimeError(ErrorType errorType, String message) {
        super(message);
        this.errorType = errorType;
    }

    public ErrorType getErrorType() { return errorType; }
    public void setErrorType(ErrorType errorType) { this.errorType = errorType; }
}
