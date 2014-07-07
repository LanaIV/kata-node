'use strict';

var
  request = require('superagent'),
  expect  = require('chai').expect
;

describe('Functional tests suite', function() {
  it ('should server respond', function(done) {
    request.get('localhost:3000').end(function(res) {
      expect(res).to.exist;
      expect(res.status).to.equal(200);
      done();
    });
  });

  it ('should server respond with \'not found\' error for non-existent path', function(done) {
    request.get('localhost:3000/test').end(function(res) {
      expect(res).to.exist;
      expect(res.status).to.equal(404);
      done();
    });
  });

  it ('should have the right response if original file is well formated', function(done) {
    request.get('localhost:3000').end(function(res) {
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({mowers : [
        {
          abscissa    : 1,
          ordinate    : 3,
          orientation : 'N'
        },
        {
          abscissa    : 5,
          ordinate    : 1,
          orientation : 'E'
        }
      ]});
      done();
    });
  });

  it ('should have an error if file does not exist', function(done) {
    request.get('localhost:3000?input=file').end(function(res) {
      expect(res.status).to.equal(400);
      expect(res.body).to.have.key('error');
      done();
    });
  });

  it ('should have an error if input file is empty', function(done) {
    request.get('localhost:3000?input=tests/inputs/input1').end(function(res) {
      expect(res.status).to.equal(400);
      expect(res.body).to.have.key('error');
      done();
    });
  });

  it ('should have an error if no one mower is specified', function(done) {
    request.get('localhost:3000?input=tests/inputs/input2').end(function(res) {
      expect(res.status).to.equal(400);
      expect(res.body).to.have.key('error');
      done();
    });
  });

  it ('should have an error if only position of mower is specified', function(done) {
    request.get('localhost:3000?input=tests/inputs/input3').end(function(res) {
      expect(res.status).to.equal(400);
      expect(res.body).to.have.key('error');
      done();
    });
  });

  it ('should have an error if lenth or width of area is not integers', function(done) {
    request.get('localhost:3000?input=tests/inputs/input4').end(function(res) {
      expect(res.status).to.equal(400);
      expect(res.body).to.have.key('error');
      done();
    });
  });

  it ('should have an error if coordinates of mower is not integers', function(done) {
    request.get('localhost:3000?input=tests/inputs/input5').end(function(res) {
      expect(res.status).to.equal(400);
      expect(res.body).to.have.key('error');
      done();
    });
  });

  it ('should have an error if orientation is not one of cardinal directions', function(done) {
    request.get('localhost:3000?input=tests/inputs/input6').end(function(res) {
      expect(res.status).to.equal(400);
      expect(res.body).to.have.key('error');
      done();
    });
  });

  it ('should have an error if path of mower contains wrong values', function(done) {
    request.get('localhost:3000?input=tests/inputs/input7').end(function(res) {
      expect(res.status).to.equal(400);
      expect(res.body).to.have.key('error');
      done();
    });
  });

  it ('should have an error if one mowers has the same position as another one', function(done) {
    request.get('localhost:3000?input=tests/inputs/input8').end(function(res) {
      expect(res.status).to.equal(400);
      expect(res.body).to.have.key('error');
      done();
    });
  });

  it ('should have an error if at least one of mowers is out of area', function(done) {
    request.get('localhost:3000?input=tests/inputs/input9').end(function(res) {
      expect(res.status).to.equal(400);
      expect(res.body).to.have.key('error');
      done();
    });
  });
});
