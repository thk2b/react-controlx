'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getDisplayName = function getDisplayName(Component) {
    Component.displayName || Component.name || 'Anonymous';
};

var defaultMapStateToProps = function defaultMapStateToProps(state) {
    return state;
};
var defaultMapActionsToProps = function defaultMapActionsToProps(props) {
    return {};
};

exports.default = function (controllers) {
    return function () {
        var mapStateToProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultMapStateToProps;
        var mapActionsToProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultMapActionsToProps;
        return function (Component) {
            var SubscribedComponent = function (_React$Component) {
                _inherits(SubscribedComponent, _React$Component);

                function SubscribedComponent(props) {
                    _classCallCheck(this, SubscribedComponent);

                    var _this = _possibleConstructorReturn(this, (SubscribedComponent.__proto__ || Object.getPrototypeOf(SubscribedComponent)).call(this, props));

                    _this.componentWillMount = function () {
                        Object.entries(controllers).forEach(function (_ref) {
                            var _ref2 = _slicedToArray(_ref, 2),
                                name = _ref2[0],
                                controller = _ref2[1];

                            var unsubscribe = controller.subscribe(function (state) {
                                return _this.setState(_defineProperty({}, name, state));
                            }).bind(controller);
                            _this.unsubscribe[name] = unsubscribe;
                        });
                    };

                    _this.componentWillUnmount = function () {
                        Object.values(_this.unsubscribe).forEach(function (unsubscribe) {
                            return unsubscribe();
                        });
                    };

                    _this.state = {};
                    _this.unsubscribe = {};
                    return _this;
                }

                _createClass(SubscribedComponent, [{
                    key: 'render',
                    value: function render() {
                        var _props = this.props,
                            children = _props.children,
                            rest = _objectWithoutProperties(_props, ['children']);

                        var props = _extends({}, rest, mapActionsToProps(this.props), mapStateToProps(this.state, this.props));
                        return _react2.default.createElement(
                            Component,
                            props,
                            children
                        );
                    }
                }]);

                return SubscribedComponent;
            }(_react2.default.Component);

            SubscribedComponent.displayName = 'subscribe(' + getDisplayName(Component) + ')';
            return SubscribedComponent;
        };
    };
};