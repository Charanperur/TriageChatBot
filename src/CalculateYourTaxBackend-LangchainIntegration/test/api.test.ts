const chai = require('chai');
var expect  = chai.expect;
var request = require('supertest');
var app = require('../app');


describe('Calculation API', () => {
  describe('POST /getGrossSalary', () => {
    it('should calculate gross salary correctly', async () => {
      const res = await request(app)
        .post('/api/calculation/getGrossSalary')
        .send({
          "basicpay": 50000,
          "hra": 15000,
          "da": 10000,
          "lta": 0,
          "cityallowance": 0,
          "miscellaneous": 0,
          "monthlybonus": 0,
          "quaterlybonus": 0,
          "annualbonus": 0
        })
        .set('Accept', 'application/json')
        .expect(200);

      expect(res.body).to.have.property('status', 'success');
      expect(res.body.data).to.have.property('grossMonthlySalary', 75000);
      expect(res.body.data).to.have.property('grossAnnualSalary', 900000);
    });

    it('should return error if basic salary is not provided', async () => {
      const res = await request(app)
        .post('/api/calculation/getGrossSalary')
        .send({
          "hra": 0,
          "da": 0,
          "lta": 0,
          "cityallowance": 0,
          "miscellaneous": 0,
          "monthlybonus": 0,
          "quaterlybonus": 0,
          "annualbonus": 0
        })
        .set('Accept', 'application/json')
        .expect(400);

      expect(res.text).to.equal('Error validating request body. "basicpay" is required.');
    });
  });

  describe('POST /newRegime/getTaxableIncome', () => {
    it('should return the correct taxable income', async () => {
      const data = {
        "incomeForm": {
          "basicpay": 10000,
          "hra": 0,
          "da": 0,
          "lta": 0,
          "cityallowance": 0,
          "miscellaneous": 0,
          "monthlybonus": 0,
          "quaterlybonus": 0,
          "annualbonus": 0
        },
        "deductionForm": {
          "section80C": {
            "ppf": 0,
            "elss": 0,
            "others": 0
          },
          "nps": 0,
          "section80D": {
            "yourParentsAge": true,
            "parentsHIS": 0,
            "selfHIS": 0
          },
          "section80G": 0
        },
        "exemptionForm": {
          "salaryComponents": {
            "hra": 0,
            "lta": 0
          }
        }
      };
      const res = await request(app)
        .post('/api/calculation/newRegime/getTaxableIncome')
        .send(data)
        .set('Accept', 'application/json')
        .expect(200);


      expect(res.body).to.have.property('status', 'success');
      expect(res.body.data).to.have.property('Taxable Income', 70000);
    });
  });

  describe('POST /oldRegime/getTaxableIncome', () => {
    it('responds with JSON object containing taxable income', (done) => {
      const validData = {
        // add valid data for testing
        // ...
        "incomeForm": {
          "basicpay": 23500,
          "da": 0,
          "hra": 8500,
          "lta": 3000,
          "cityallowance": 1083,
          "miscellaneous": 910,
          "monthlybonus": 12000,
          "quaterlybonus": 9000,
          "annualbonus": 70000
        },
        "deductionForm": {
          "section80C": {
            "ppf": 15000,
            "elss": 2100,
            "others": 0
          },
          "nps": 49000,
          "section80D": {
            "yourParentsAge": true,
            "parentsHIS": 0,
            "selfHIS": 8200
          },
          "section80G": 0
        },
        "exemptionForm": {
          "salaryComponents": {
            "hra": 96000,
            "lta": 0
          }
        }
      };

      request(app).post('/api/calculation/oldRegime/getTaxableIncome')
        .send(validData)
        .end((err: any, res: { statusCode: any; type: any; body: { data: { [x: string]: any; }; }; }) => {
          expect(res.statusCode).to.equal(200);
          expect(res.type).to.equal('application/json');
          expect(res.body).to.have.property('status', 'success');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data['Taxable Income']).to.be.a('number');
          done();
        });
    });

    it('responds with 400 if data is invalid', (done) => {
      const invalidData = {
        // add invalid data for testing
        // ...
        basicpay: 1000
      };

      request(app).post('/api/calculation/oldRegime/getTaxableIncome')
        .send(invalidData)
        .end((err: any, res: { statusCode: any; }) => {
          console.log(res);
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });
});

