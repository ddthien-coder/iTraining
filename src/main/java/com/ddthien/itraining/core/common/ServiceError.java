package com.ddthien.itraining.core.common;

import com.ddthien.itraining.lib.util.error.ErrorType;

public class ServiceError extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private ErrorType errorType;

    public ServiceError() {}

    public ServiceError(ErrorType errorType, String message, Throwable cause) {
        super(message, cause);
        this.errorType = errorType;
    }

    public ServiceError(ErrorType errorType, String message) {
        super(message);
        this.errorType = errorType;
    }

    public ErrorType getErrorType() { return errorType; }
    public void setErrorType(ErrorType errorType) { this.errorType = errorType; }
}
