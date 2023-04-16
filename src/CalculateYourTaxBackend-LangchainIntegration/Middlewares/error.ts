var logger = require('./logging');

//Class for form validation errors
export class CustomError extends Error {
    status: string;
    statuscode: number;
    type: string;
    constructor(statuscode=500, message="Something went wrong. Please try again later", type='GenericError') {
        super(message);
        this.status = 'error';
        this.statuscode = statuscode;
        this.type = type;
    }
};

class ValidationError extends CustomError {
    formErrors: any;
    constructor(message: string | undefined, formErrors: any) {
        super(422, message, 'ValidationError');
        this.formErrors = formErrors;
    }
}


function errorHandler(err: { statuscode: number; message: string; stack: any; }, req: { method: any; originalUrl: any; body: any; }, res: { status: (arg0: any) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }, next: any) {
    err.statuscode = err.statuscode || 500;
    err.message = err.message || "Something went wrong. Please try again.";

    logger.error(`${err.stack} for request ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);

    console.log(err);

    res.status(err.statuscode).json(err);
}

module.exports = { errorHandler, CustomError, ValidationError }
