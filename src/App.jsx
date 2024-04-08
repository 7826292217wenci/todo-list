import { nanoid } from "nanoid";
import { useState, useRef, useEffect } from "react";
import Form  from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";


function App(props) {

    const geoFindMe = () => { 
    if (!navigator.geolocation) { 
      console.log("Geolocation is not supported by your browser"); 
    } else { 
      console.log("Locating…"); 
      navigator.geolocation.getCurrentPosition(success, error); 
    } 
  }; 
 
  const success = (position) => { 
    const latitude = position.coords.latitude; 
    const longitude = position.coords.longitude; 
    console.log(latitude, longitude); 
 
    console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`); 
    console.log(`Try here: https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`); 
    locateTask(lastInsertedId, { 
      latitude: latitude, 
      longitude: longitude, 
      error: "", 
    }); 
  }; 
 
  const error = () => { 
    console.log("Unable to retrieve your location"); 
  };
  //add task
  function addTask(name) {
    const id = `todo-${nanoid()}`;
    const newTask = { id, name, completed: false,
    location: {
      latitude: "##", longitude: "##", error: "##" },
    };
    setLastInsertedId(id);
    setTasks([...tasks, newTask]);
   }

   function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  } 
  //delete task
  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  //editTask=>locateTask
  function locateTask(id, location) { 
    console.log("locate Task", id, " before"); 
    console.log(location, tasks); 
    const locatedTaskList = tasks.map((task) => { 
      // if this task has the same ID as the edited task 
      if (id === task.id) { 
        // 
        return { ...task, location: location }; 
      } 
      return task; 
    }); 
    console.log(locatedTaskList); 
    setTasks(locatedTaskList);
    editTask={locateTask} 
  }  

  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  };

  const FILTER_NAMES = Object.keys(FILTER_MAP);

  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");
  const [lastInsertedId, setLastInsertedId] = useState("");

  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      latitude={task.location.latitude}
      longitude={task.location.longitude}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      //editTask={locateTask}
    />
  ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  //
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  
  const prevTaskLength = usePrevious(tasks.length);
  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);
  
  const listHeadingRef = useRef(null);
  //
 
  const tasksNoun = tasks.length !== 1 ? "tasks" : "task";
  const headingText = `${tasks.length} ${tasksNoun} remaining`;
  //counting tasks

  return ( 
    <div className="todoapp stack-large"> 
      <h1>Geo TodoMatic</h1> 
      <Form addTask={addTask} geoFindMe={geoFindMe} />{" "} 
      <div className="filters btn-group stack-exception">{filterList}</div> 
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}> 
        {headingText} 
      </h2> 
      <ul 
        aria-labelledby="list-heading" 
        className="todo-list stack-large stack-exception" 
        role="list" 
      > 
        {taskList} 
      </ul> 
    </div> 
  );
}

export default App;
