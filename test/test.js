// expect(foo).to.be.a('string');
// expect(foo).to.equal('bar');
// expect(foo).to.have.length(3);
// expect(beverages).to.have.property('tea').with.length(3);


var game = require('../game.js')
var expect = require('chai').expect

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      expect([1,2,3].indexOf(5)).to.equal(-1);
      expect([1,2,3].indexOf(0)).to.equal(-1);
    })
  })
})

describe('Ball', function(){
	describe('#nextYposition()', function() {
		it('should return addition of y and dy values', function() {
			var ball = new game().ball;
			var Yposition = ball.y + ball.dy;
			expect(ball.nextYposition()).to.equal(Yposition);
		})
	})
})