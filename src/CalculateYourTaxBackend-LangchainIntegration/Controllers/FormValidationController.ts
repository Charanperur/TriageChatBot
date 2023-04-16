var express = require('express');
var router = express.Router();
var { ValidationError, CustomError } = require('../Middlewares/error');

var { incomeFormSchema, combinedFormSchema, deductionFormSchema, exemptionFormSchema } = require('../Models/formModels');
var { deductionsValidator, exemptionsValidator } = require('../Utilities/calculationValidators');

router.post('/validateIncomeForm', (req: { body: any; }, res: { json: (arg0: { status: string; }) => void; }) => {
    const data = req.body;
    const { error } = incomeFormSchema.validate(data);

    if (error) {
        throw new ValidationError(error.message, error.details);
    } else {
        if (data.basicpay <= 0) {
            throw new ValidationError("Basic Pay cannot be negative or zero", { basicpay: 'Basic Pay cannot be negative or zero' });
        }
        res.json({ status: "success" });
    }
});

router.post('/validateCombinedForm', (req: { body: any; }, res: { json: (arg0: { status: string; }) => void; }) => {
    const data = req.body;
    const { error } = combinedFormSchema.validate(data);
    if (error) {
        throw new ValidationError(error.message, error.details);
    } else {
        try {
            deductionsValidator(data);
            exemptionsValidator(data);
        } catch (error:unknown) {
            throw new CustomError(500, (error as Error).message, 'InvalidInputError');
        }
        res.json({ status: "success" });
    }
});

router.post('/validateExemptionForm', (req: { body: any; }, res: { json: (arg0: { status: string; }) => void; }) => {
    const data = req.body;
    const { error } = exemptionFormSchema.validate(data.exemptionForm);
    if (error) {
        throw new ValidationError(error.message, error.details);
    } else {
        exemptionsValidator(data);
        res.json({ status: "success" });
    }
});

router.post('/validateDeductionForm', (req: { body: any; }, res: { json: (arg0: { status: string; }) => void; }) => {
    const data = req.body;
    const { error } = deductionFormSchema.validate(data.deductionForm);
    if (error) {
        throw new ValidationError(error.message, error.details);
    } else {
        deductionsValidator(data);
        res.json({ status: "success" });
    }
});


module.exports = router;