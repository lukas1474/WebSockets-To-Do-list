import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      tasks: [],
      taskName: ``,
    };
  }

  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.on('updateData', (task) => this.updateTasks(task));
    this.socket.on('addTask', (tasks) => this.addTask(tasks));
    this.socket.on('removeTask', (id) => this.removeTask(id));
  };

  handleInputChange(element) {
    this.setState({ taskName: element });
  }

  addTask(task) {
    this.setState({
      tasks: [...this.state.tasks, task],
    });
    this.setState({ taskName: `` });
  }

  removeTask(id, element) {
    if (element !== undefined) {
      this.socket.emit('removeTask', id);
    }
    this.setState({
      tasks: this.state.tasks.filter((tasks) => tasks.id !== id),
    });
  }

  updateTasks(task) {
    this.setState({ tasks: task });
  }

  submitForm(event) {
    event.preventDefault();
    this.addTask(this.state.taskName);

    const id = uuidv4();
    const task = {id, name: this.state.taskName};
    
    this.addTask(task);
    this.socket.emit('addTask', task);
  }

  render() {
    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map((task) => (
              <li
                className="task"
                key={task.id}
              >
                {task.name}
                <button
                  type="button"
                  className="btn btn--red"
                  onClick={element => this.removeTask(task.id, element)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={(element) => this.submitForm(element)}>
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              value={this.state.taskName}
              onChange={(element) => this.handleInputChange(element.currentTarget.value)}
            />
            <button
              className="btn"
              type="submit"
            >
              Add
              </button>
          </form>

        </section>
      </div>
    );
  };

};

export default App;
