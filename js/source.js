const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

const todo = (state, action) => {
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

      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t =>
        todo(t, action)
      );
    case 'REMOVE_TODO':
      return state.filter(item => item.id !== action.id)
    default:
      return state;
  }
};

const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos,
  visibilityFilter
});

let nextTodoId = 0;
const addTodo = (text) => {
  if(text != '') {
    return {
      type: 'ADD_TODO',
      id: nextTodoId++,
      text
    };
  } else {
    return false;
  }
};

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  };
};

const removeTodo = (id) => {
  return {
    type: 'REMOVE_TODO',
    id
  };
};

const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  };
};

const { Component } = React;
const { Provider, connect } = ReactRedux;

const Radio = ({
  active,
  children,
  onChange
}) => {
  return (
    <label className="filter">
      <input checked={active}
        type="radio"
        name="filter"
        className="filter__radio"
        onChange={e => {
          onChange();
        }}
      />
      <span className={`filter__label--${children.toLowerCase()}`}>{children}</span>
    </label>
  );
};

const mapStateToLinkProps = (
  state,
  ownProps
) => {
  return {
    active:
      ownProps.filter ===
      state.visibilityFilter
  };
};
const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => {
  return {
    onChange: () => {
      dispatch(
        setVisibilityFilter(ownProps.filter)
      );
    }
  };
}
const FilterRadio = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Radio);

const Footer = () => (
  <fieldset className="filters">
    <legend  className="filters__title">Show:</legend>
    <FilterRadio filter='SHOW_ALL'>All</FilterRadio>
    <FilterRadio filter='SHOW_ACTIVE'>Active</FilterRadio>
    <FilterRadio filter='SHOW_COMPLETED'>Completed</FilterRadio>
  </fieldset>
);

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
    onClick={onClick}
    className={
      completed ?
        'todo-list__item--completed' :
        'todo-list__item--active'
    }
  >
    {text}
  </li>
);

class TodoList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ReactCSSTransitionGroup
        component="ul"
        className="todo-list"
        transitionName="todo-transition"
        transitionEnterTimeout={70}
        transitionLeaveTimeout={70}
      >
        {this.props.todos.map(todo =>
          <Todo
            key={todo.id}
            {...todo}
            onClick={() => this.props.onTodoClick(todo.id)}
          />
        )}
      </ReactCSSTransitionGroup>
    )
  }
}

let AddTodo = ({ dispatch }) => {
  let input;

  return (
    <div className="add-todo">
      <input className="add-todo__input"
      placeholder="New Todo" ref={node => {
        input = node;
      }} onKeyUp={(e) => {
        if (e.keyCode == 13) {
          dispatch(addTodo(input.value));
          input.value = '';
        }
      }} />
      <button className="add-todo__button" onClick={() => {
        dispatch(addTodo(input.value));
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
};
AddTodo = connect()(AddTodo);

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }
}

const mapStateToTodoListProps = (
  state
) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  };
};
const mapDispatchToTodoListProps = (
  dispatch
) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id));
    }
  };
};
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

const TodoApp = () => (
  <div className="app">
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

const { createStore } = Redux;

const todoAppStore = Redux.createStore(todoApp);
todoAppStore.dispatch(addTodo('New TODO'));
todoAppStore.dispatch(addTodo('Even newer TODO'));
todoAppStore.dispatch(addTodo('One more TODO'));
todoAppStore.dispatch(toggleTodo(0));



ReactDOM.render(
  <Provider store={todoAppStore}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);
