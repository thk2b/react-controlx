'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _xcontrol = require('xcontrol');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _invariant = require('./lib/invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** A HOC that takes a React.Component and returns a controller.
 * It has the side effect of updating the component whenever its store is updated.
 * It must be wrapped into a call to `computed` or `withActions`
 */

exports.default = function (Component) {
    return function (_Controller) {
        _inherits(ComponentController, _Controller);

        function ComponentController(props) {
            _classCallCheck(this, ComponentController);

            var _this = _possibleConstructorReturn(this, (ComponentController.__proto__ || Object.getPrototypeOf(ComponentController)).call(this, props));

            _this.componentWillMount = function () {
                _this._isMounted = true;
                _this.setState(_this.store);
            };

            return _this;
        }

        _createClass(ComponentController, [{
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this.unsubscribe();
            }
        }, {
            key: 'render',
            value: function render() {
                var _props = this.props,
                    children = _props.children,
                    props = _objectWithoutProperties(_props, ['children']);

                var state = this.state;


                return _react2.default.createElement(
                    Component,
                    _extends({}, props, state),
                    children
                );
            }
        }, {
            key: 'store',
            get: function get() {
                return _get(ComponentController.prototype.__proto__ || Object.getPrototypeOf(ComponentController.prototype), 'store', this);
            },
            set: function set(nextState) {
                if (this._isMounted) this.setState(nextState);
                _set(ComponentController.prototype.__proto__ || Object.getPrototypeOf(ComponentController.prototype), 'store', nextState, this);
            }
        }]);

        return ComponentController;
    }((0, _xcontrol.Controller)(_react2.default.Component));
};