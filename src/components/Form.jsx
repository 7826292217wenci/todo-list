import { useState, useEffect } from "react";
import React from "react";

function Form(props) {
  const [name, setName] = useState("");
  const [addition, setAddition] = useState(false);

  useEffect(() => {
    if (addition) {
      console.log("useEffect detected addition");
      props.geoFindMe();
      setAddition(false);
    }
  });

  function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) { // 检查字符串是否为空或仅包含空白
      alert("Please enter a task name."); // 弹出警告
      return; // 不提交表单并退出函数
    }
    setAddition(true);
    props.addTask(name.trim()); // 提交时去除输入字符串两边的空格
    setName("");
  }

  function handleChange(event) {
    setName(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
         Add something what you want!
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;
