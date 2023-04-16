// Import ValidationError constructor from error middleware
var { ValidationError } = require("../Middlewares/error");

// Import getGrossSalary function from taxCalculations module
var { getGrossSalary } = require("./taxCalculations");

// Define deductionsValidator function that takes in data object as its parameter
var deductionsValidator:any = function (data:any){
    // Calculate gross salary using getGrossSalary function
    const income = getGrossSalary(data.incomeForm);

    // Calculate total deductions claimed under Section 80C
    const deductions80C = data.deductionForm.section80C.ppf  + data.deductionForm.section80C.elss + data.deductionForm.section80C.others;

    // Calculate total deductions claimed under Section 80C and NPS
    const total80C = deductions80C + data.deductionForm.nps;

    // Calculate total deductions claimed under Section 80D
    const deductions80D = data.deductionForm.section80D.parentsHIS + data.deductionForm.section80D.selfHIS;

    // Get deductions claimed under Section 80G
    const deductions80G = data.deductionForm.section80G;

    // Calculate total deductions claimed
    const total = total80C + deductions80D + deductions80G;

    // Check if total deductions claimed is more than gross salary, throw validation error otherwise
    if(income.grossAnnualSalary<total){
        throw new ValidationError("Total deductions claimed cannot be more than gross income", {deductions: "Total deductions claimed cannot be more than gross income"});
    }

    // Check if deductions claimed under Section 80C is more than limit of 150000, throw validation error otherwise
    if(deductions80C>150000){
        throw new ValidationError("Deductions under Section 80C cannot be more than 150000", {section80C: "Deductions under Section 80C cannot be more than 150000"});
    } 

    // Check if deductions claimed under Section 80CCD is more than limit of 50000, throw validation error otherwise
    if(data.deductionForm.nps>50000){
        throw new ValidationError("Deductions under Section 80CCD cannot be more than 50000", {nps: "Deductions under Section 80CCD cannot be more than 50000"});
    }

    // Check if deductions claimed under Section 80D for self is more than limit of 25000, throw validation error otherwise
    if(data.deductionForm.section80D.selfHIS>25000){
        throw new ValidationError("Deductions under Section 80D cannot be more than 25000 for self", {section80D: "Deductions under Section 80D cannot be more than 25000 for self"});
    }

    // Check if deductions claimed under Section 80D for parents is more than limit of 25000 (for non-senior citizens) or 50000 (for senior citizens), throw validation error otherwise
    if(data.deductionForm.section80D.parentsHIS>25000 && data.deductionForm.section80D.yourParentsAge==false){
        throw new ValidationError("Deductions under Section 80D cannot be more than 25000 for parents if they are not senior citizens", {section80D: "Deductions under Section 80D cannot be more than 25000 for parents if they are not senior citizens"});
    } else if(data.deductionForm.section80D.parentsHIS>50000 && data.deductionForm.section80D.yourParentsAge==true){
        throw new ValidationError("Deductions under Section 80D cannot be more than 50000 for parents if they are senior citizens", {section80D: "Deductions under Section 80D cannot be more than 50000 for parents if they are senior citizens"});
    }        

    // Check if deductions claimed under Section 80G is more than limit of 10000, throw validation error otherwise
    if(deductions80G>10000){
        throw new ValidationError("Deductions under Section 80G cannot be more than 10000", {section80G: "Deductions under Section 80G cannot be more than 10000"});
    }
}

// Define exemptionsValidator function that takes in data object as its parameter
var exemptionsValidator:any = function (data:any) {
    // Check if claimed HRA exemption is more than actual HRA received, throw validation error otherwise
    if(data.exemptionForm.salaryComponents.hra>(data.incomeForm.hra*12)){
        throw new ValidationError("Claimed HRA Exemption cannot be more than actual HRA received", {hra: "Claimed HRA Exemption cannot be more than actual HRA received"});
    }

    // Check if claimed LTA exemption is more than actual LTA received, 
    if(data.exemptionForm.salaryComponents.lta>(data.incomeForm.lta*12)){
        throw new ValidationError("Claimed LTA Exemption cannot be more than actual LTA received", {lta: "Claimed LTA Exemption cannot be more than actual LTA received"});
    }
}

module.exports = { exemptionsValidator, deductionsValidator };