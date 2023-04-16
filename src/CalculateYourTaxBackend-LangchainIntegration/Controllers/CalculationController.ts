var express = require('express');
var router = express.Router();
var expressJoi = require('express-joi-validation');
var logger = require('../Middlewares/logging');
var { deductionsValidator, exemptionsValidator } = require('../Utilities/calculationValidators');
var { getNewTaxableIncome, getOldTaxableIncome, getGrossSalary, getTaxes } = require('../Utilities/taxCalculations');

var { incomeFormSchema, combinedFormSchema, deductionFormSchema, exemptionFormSchema  } = require('../Models/formModels');

const validator = expressJoi.createValidator({});

router.post('/getGrossSalary', validator.body(incomeFormSchema) ,(req: { body: any; }, res: { json: (arg0: { status: string; data: any; }) => void; }) => {
    const data = req.body;
    const grossSalary = getGrossSalary(data);
    res.json({ status: "success", data: {...grossSalary}});
});


router.post('/oldRegime/getTaxableIncome', validator.body(combinedFormSchema),(req: { body: any; }, res: { json: (arg0: { status: string; data: any; }) => void; }) => {
    const data = req.body;

    // Check exemptions and deductions claimed are valid
    exemptionsValidator(data);
    deductionsValidator(data);

    const taxableIncome = getOldTaxableIncome(data);

    res.json({ status: "success", data: {...taxableIncome}});
});

router.post('/newRegime/getTaxableIncome', (req: { body: any; }, res: { json: (arg0: { status: string; data: any; }) => void; }) => {
    // the new regime does not have deductions or exemptions
    const data = req.body;
    const taxableIncome = getNewTaxableIncome(data);
    res.json({ status: "success", data: {...taxableIncome}});
});

router.post('/getTaxes', (req: { body: any; }, res: { json: (arg0: { status: string; data: any; }) => void; }) => {
    // handle POST request for '/forms'
    const data = req.body;
    exemptionsValidator(data);
    deductionsValidator(data);
    const taxes = getTaxes(data);
    res.json({ status: "success", data: {...taxes}});
});



module.exports = router;