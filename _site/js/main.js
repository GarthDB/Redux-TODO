'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text: text
  };
};

var toggleTodo = function toggleTodo(id) {
  return {
    type: 'TOGGLE_TODO',
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


var Link = function Link(_ref) {
  var active = _ref.active;
  var children = _ref.children;
  var _onClick = _ref.onClick;

  if (active) {
    return React.createElement(
      'span',
      null,
      children
    );
  }

  return React.createElement(
    'a',
    { href: '#',
      onClick: function onClick(e) {
        e.preventDefault();
        _onClick();
      }
    },
    children
  );
};

var mapStateToLinkProps = function mapStateToLinkProps(state, ownProps) {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};
var mapDispatchToLinkProps = function mapDispatchToLinkProps(dispatch, ownProps) {
  return {
    onClick: function onClick() {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
  };
};
var FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

var Footer = function Footer() {
  return React.createElement(
    'p',
    null,
    'Show:',
    ' ',
    React.createElement(
      FilterLink,
      { filter: 'SHOW_ALL' },
      'All'
    ),
    ', ',
    React.createElement(
      FilterLink,
      { filter: 'SHOW_ACTIVE' },
      'Active'
    ),
    ', ',
    React.createElement(
      FilterLink,
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
      style: {
        textDecoration: completed ? 'line-through' : 'none'
      }
    },
    text
  );
};

var TodoList = function TodoList(_ref3) {
  var todos = _ref3.todos;
  var onTodoClick = _ref3.onTodoClick;
  return React.createElement(
    'ul',
    null,
    todos.map(function (todo) {
      return React.createElement(Todo, _extends({
        key: todo.id
      }, todo, {
        onClick: function onClick() {
          return onTodoClick(todo.id);
        }
      }));
    })
  );
};

var AddTodo = function AddTodo(_ref4) {
  var dispatch = _ref4.dispatch;

  var input = void 0;

  return React.createElement(
    'div',
    null,
    React.createElement('input', { ref: function ref(node) {
        input = node;
      } }),
    React.createElement(
      'button',
      { onClick: function onClick() {
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
    null,
    React.createElement(AddTodo, null),
    React.createElement(VisibleTodoList, null),
    React.createElement(Footer, null)
  );
};

var _Redux2 = Redux;
var createStore = _Redux2.createStore;


ReactDOM.render(React.createElement(
  Provider,
  { store: createStore(todoApp) },
  React.createElement(TodoApp, null)
), document.getElementById('root'));
