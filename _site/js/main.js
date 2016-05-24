'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var todo = function todo(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return _extends({}, state, {
        completed: !state.completed
      });
    default:
      return state;
  }
};

var todos = function todos() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'ADD_TODO':
      return [].concat(_toConsumableArray(state), [todo(undefined, action)]);
    case 'TOGGLE_TODO':
      return state.map(function (t) {
        return todo(t, action);
      });
    case 'REMOVE_TODO':
      return state.filter(function (item) {
        return item.id !== action.id;
      });
    default:
      return state;
  }
};

var visibilityFilter = function visibilityFilter() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? 'SHOW_ALL' : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

var _Redux = Redux;
var combineReducers = _Redux.combineReducers;

var todoApp = combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter
});

var nextTodoId = 0;
var addTodo = function addTodo(text) {
  if (text != '') {
    return {
      type: 'ADD_TODO',
      id: nextTodoId++,
      text: text
    };
  } else {
    return false;
  }
};

var toggleTodo = function toggleTodo(id) {
  return {
    type: 'TOGGLE_TODO',
    id: id
  };
};

var removeTodo = function removeTodo(id) {
  return {
    type: 'REMOVE_TODO',
    id: id
  };
};

var setVisibilityFilter = function setVisibilityFilter(filter) {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter: filter
  };
};

var _React = React;
var Component = _React.Component;
var _ReactRedux = ReactRedux;
var Provider = _ReactRedux.Provider;
var connect = _ReactRedux.connect;


var Radio = function Radio(_ref) {
  var active = _ref.active;
  var children = _ref.children;
  var _onChange = _ref.onChange;

  return React.createElement(
    'label',
    { className: 'filter' },
    React.createElement('input', { checked: active,
      type: 'radio',
      name: 'filter',
      className: 'filter__radio',
      onChange: function onChange(e) {
        _onChange();
      }
    }),
    React.createElement(
      'span',
      { className: 'filter__label--' + children.toLowerCase() },
      children
    )
  );
};

var mapStateToLinkProps = function mapStateToLinkProps(state, ownProps) {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};
var mapDispatchToLinkProps = function mapDispatchToLinkProps(dispatch, ownProps) {
  return {
    onChange: function onChange() {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
  };
};
var FilterRadio = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Radio);

var Footer = function Footer() {
  return React.createElement(
    'fieldset',
    { className: 'filters' },
    React.createElement(
      'legend',
      { className: 'filters__title' },
      'Show:'
    ),
    React.createElement(
      FilterRadio,
      { filter: 'SHOW_ALL' },
      'All'
    ),
    React.createElement(
      FilterRadio,
      { filter: 'SHOW_ACTIVE' },
      'Active'
    ),
    React.createElement(
      FilterRadio,
      { filter: 'SHOW_COMPLETED' },
      'Completed'
    )
  );
};

var Todo = function Todo(_ref2) {
  var onClick = _ref2.onClick;
  var completed = _ref2.completed;
  var text = _ref2.text;
  return React.createElement(
    'li',
    {
      onClick: onClick,
      className: completed ? 'todo-list__item--completed' : 'todo-list__item--active'
    },
    text
  );
};

var TodoList = function (_React$Component) {
  _inherits(TodoList, _React$Component);

  function TodoList(props) {
    _classCallCheck(this, TodoList);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TodoList).call(this, props));
  }

  _createClass(TodoList, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        ReactCSSTransitionGroup,
        {
          component: 'ul',
          className: 'todo-list',
          transitionName: 'todo-transition',
          transitionEnterTimeout: 70,
          transitionLeaveTimeout: 70
        },
        this.props.todos.map(function (todo) {
          return React.createElement(Todo, _extends({
            key: todo.id
          }, todo, {
            onClick: function onClick() {
              return _this2.props.onTodoClick(todo.id);
            }
          }));
        })
      );
    }
  }]);

  return TodoList;
}(React.Component);

var AddTodo = function AddTodo(_ref3) {
  var dispatch = _ref3.dispatch;

  var input = void 0;

  return React.createElement(
    'div',
    { className: 'add-todo' },
    React.createElement('input', { className: 'add-todo__input',
      placeholder: 'New Todo', ref: function ref(node) {
        input = node;
      }, onKeyUp: function onKeyUp(e) {
        if (e.keyCode == 13) {
          dispatch(addTodo(input.value));
          input.value = '';
        }
      } }),
    React.createElement(
      'button',
      { className: 'add-todo__button', onClick: function onClick() {
          dispatch(addTodo(input.value));
          input.value = '';
        } },
      'Add Todo'
    )
  );
};
AddTodo = connect()(AddTodo);

var getVisibleTodos = function getVisibleTodos(todos, filter) {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(function (t) {
        return t.completed;
      });
    case 'SHOW_ACTIVE':
      return todos.filter(function (t) {
        return !t.completed;
      });
  }
};

var mapStateToTodoListProps = function mapStateToTodoListProps(state) {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};
var mapDispatchToTodoListProps = function mapDispatchToTodoListProps(dispatch) {
  return {
    onTodoClick: function onTodoClick(id) {
      dispatch(toggleTodo(id));
    }
  };
};
var VisibleTodoList = connect(mapStateToTodoListProps, mapDispatchToTodoListProps)(TodoList);

var TodoApp = function TodoApp() {
  return React.createElement(
    'div',
    { className: 'app' },
    React.createElement(AddTodo, null),
    React.createElement(VisibleTodoList, null),
    React.createElement(Footer, null)
  );
};

var _Redux2 = Redux;
var createStore = _Redux2.createStore;


var todoAppStore = Redux.createStore(todoApp);
todoAppStore.dispatch(addTodo('New TODO'));
todoAppStore.dispatch(addTodo('Even newer TODO'));
todoAppStore.dispatch(addTodo('One more TODO'));
todoAppStore.dispatch(toggleTodo(0));

ReactDOM.render(React.createElement(
  Provider,
  { store: todoAppStore },
  React.createElement(TodoApp, null)
), document.getElementById('root'));
