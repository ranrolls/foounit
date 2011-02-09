if (typeof global !== 'undefined'){
  var foounit = require('../dist/foo-unit-node');
}
var footest = foounit.require(':src/foo-unit');

foounit.add(function (kw){ with(kw){
  describe('foounit.Example', function (){
    describe('when the test is pending', function (){
      it('has a pending status', function (){
        var example = new footest.Example('test', function (){
          throw new Error('pending test should not be run');
        }, true);

        example.run();
        expect(example.isPending()).to(beTrue);
      });
    });

    describe('when the test is pending', function (){
      var example, called = false;

      before(function (){
        example = new footest.Example('test', function (){ called = true; }, true);
        expect(example.isPending()).to(beTrue);
      });

      it('does not run the test', function (){
        example.run();
        expect(called).to(beFalse);
      });

      it('executes the onComplete function', function (){
        var onCompleteCalled = false;
        example.onComplete = function (){
          onCompleteCalled = true;
        };
        example.run();
        expect(onCompleteCalled).to(beTrue);
      });
    });

    describe('when the example is successful', function (){
      var example;

      before(function (){
        example = new foounit.Example('test', function (){});
      });

      it('is successful', function (){
        example.run();
        expect(example.isSuccess()).to(beTrue);
      });

      it('executes the onComplete function', function (){
        var actual;
        example.onComplete = function (example){
          actual = example;
        };
        example.run();
        expect(actual).to(be, example);
      });
    });

    describe('when the example fails in a before block', function (){
      var example, _log;

      function log(msg){
        _log.push(msg);
      }

      before(function (){
        _log = [];
        example = new foounit.Example('example', function (){
          log('example');
        });
      });

      it('is a failure', function (){
        example.setBefores([function (){ log('before1'); throw new Error('expected'); }]);
        example.run();
        expect(example.isFailure()).to(beTrue);
        expect(_log).to(equal, ['before1']);
      });

      it('runs the afters created at the same level as all of the before blocks', function (){
        example.setBefores([
          function (){ log('before1'); }
          , null,
          , function (){ log('before3'); throw new Error('expected') }
          , function (){ log('before4'); }
        ]);

        example.setAfters([
          function (){ log('after1'); }
          , function (){ log('after2'); }
          , function (){ log('after3'); }
          , function (){ log('after4'); }
        ]);

        example.run();
        expect(_log).to(equal, [
          'before1', 'before3', 'after3', 'after2', 'after1'
        ]);
      });

      xit('executes the onComplete function', function (){
      });
    });

    describe('when the example fails in an after', function (){
      xit('is a failure', function (){
      });

      xit('runs the remaining afters', function (){
      });

      xit('executes the onComplete function', function (){
      });
    });

    describe('when the examples test fails', function (){
      xit('is a failure', function (){
      });

      xit('runs all afters', function (){
      });

      xit('executes the onComplete function', function (){
      });
    });

    describe('when the test is NOT pending', function (){
      describe('.run', function (){
        it('runs all befores, tests, afters and the onComplete function in order', function (){
          var log = [];

          var example = new footest.Example('test', function (){
            log.push('test');
          });
          example.setBefores([
            function (){ log.push('before1'); }
          , function (){ log.push('before2'); }
          ]);
          example.setAfters([
            function (){ log.push('after1'); }
          , function (){ log.push('after2'); }
          ]);
          example.onComplete = function (example){
            log.push(example);
          }

          example.run();

          expect(log.length).to(be, 6);
          expect(log[0]).to(be, 'before1');
          expect(log[1]).to(be, 'before2');
          expect(log[2]).to(be, 'test');
          expect(log[3]).to(be, 'after2');
          expect(log[4]).to(be, 'after1');
          expect(log[5]).to(be, example);
        });


        describe('when a before fails', function (){
          var example;

          before(function (){
            example = new footest.Example('test', function (){});
            example.setBefores([function (){
              throw new Error('fail');
            }]);
          });

          it('fails the example', function (){
            example.run();
            expect(example.isFailure()).to(be, true);
          });

          it('runs the afters', function (){
            var afterCalled = false;
            example.setAfters([function (){
              afterCalled = true;
            }]);
            example.run();
            expect(example.isFailure()).to(be, true);
            expect(afterCalled).to(be, true);
          });

          it('executes the onComplete function', function (){
            var actualExample;
            example.onComplete = function (example){ actualExample = example; }
            example.run();
            expect(actualExample).to(be, example);
          });
        });

        describe('when the test fails', function (){
          var example;
          before(function (){
            example = new footest.Example('test', function (){
              throw new error('fail');
            });
          });

          it('fails the test', function (){
            example.run();
            expect(example.isFailure()).to(be, true);
          });

          it('runs the afters', function (){
            var afterCalled = false;
            example.setAfters([
              function (){ afterCalled = true; }
            ]);

            example.run();
            expect(example.isFailure()).to(be, true);
            expect(afterCalled).to(be, true);
          });

          it('executes the onComplete function', function (){
            var actualExample;
            example.onComplete = function (example){ actualExample = example; }
            example.run();
            expect(actualExample).to(be, example);
          });
        });

        // FIXME: This means that you can't put an assertion in the after. ERRAAAAAAAR
        describe('when the after throws', function (){
          it('throws', function (){
            var example = new footest.Example('test', function (){});
            example.setAfters([function (){
              throw new Error('expected');
            }]);

            example.run();
            expect(example.getException().message).to(be, 'expected');
          });
        });
      });
    }); // when the test is NOT pending

  });
}});
