'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var fs = require('fs');
var path = require('path');
var os = require('os');

module.exports = function FileStore() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


  var getPath = function getPath() {
    var filePath = opts.path || path.join(os.homedir(), '.filestore');
    fs.closeSync(fs.openSync(filePath, 'a'));
    return filePath;
  };

  var readData = function readData() {
    return new Promise(function (resolve, reject) {
      fs.readFile(getPath(), { flag: 'r' }, function (err, content) {
        if (err) {
          return reject(err);
        }
        var data = content && content.length > 0 ? JSON.parse(content) : {};
        return resolve(data);
      });
    });
  };

  var writeData = function writeData(data) {
    var content = JSON.stringify(data);
    return new Promise(function (resolve, reject) {
      fs.writeFile(getPath(), content, { flag: 'w' }, function (err) {
        if (err) {
          return reject(err);
        }
        return resolve(true);
      });
    });
  };

  return {
    getItem: function getItem(key) {
      var _this = this;

      return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return readData();

              case 2:
                data = _context.sent;
                return _context.abrupt('return', data[key]);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }))();
    },
    setItem: function setItem(key, value) {
      var _this2 = this;

      return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return readData();

              case 2:
                data = _context2.sent;

                data[key] = value;
                _context2.next = 6;
                return writeData(data);

              case 6:
                return _context2.abrupt('return', _context2.sent);

              case 7:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }))();
    },
    deleteItem: function deleteItem(key) {
      var _this3 = this;

      return _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var data;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return readData();

              case 2:
                data = _context3.sent;

                delete data[key];
                _context3.next = 6;
                return writeData(data);

              case 6:
                return _context3.abrupt('return', _context3.sent);

              case 7:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this3);
      }))();
    }
  };
};