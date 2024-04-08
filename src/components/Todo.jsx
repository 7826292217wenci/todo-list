import React from 'react';
import { useEffect, useRef, useState, useCallback } from "react";
import Popup from "reactjs-popup";     
import "reactjs-popup/dist/index.css"; 
import Webcam from "react-webcam";     
import { addPhoto, GetPhotoSrc } from "../db.jsx";
import './Todo.css';


function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function Todo(props) {


  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
//Tap can move diffierent button , enter is click
  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);

  const wasEditing = usePrevious(isEditing);
  

  function handleChange(e) {
    setNewName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.editTask(props.id, newName);
    setNewName("");
    setEditing(false);
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
          ref={editFieldRef}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}>
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
          <a href={props.location.mapURL}>(map)</a> 
          &nbsp; | &nbsp; 
          <a href={props.location.smsURL}>(sms)</a>                    
        </label>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => 
            setEditing(true)}
            ref={editButtonRef}>
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        <Popup                                     
          trigger={ 
            <button type="button" className="btn"> 
              {" "} 
              Take Photo{" "} 
            </button> 
          } 
          modal
          className='popup-content' 
        > 
          <div> 
            <WebcamCapture id={props.id} photoedTask={props.photoedTask} /> 
          </div> 
        </Popup> 
 
        <Popup                                   
          trigger={ 
            <button type="button" className="btn"> 
              {" "} 
              View Photo{" "} 
            </button> 
          } 
          modal
          className='popup-content' 
        > 
          <div> 
            <ViewPhoto id={props.id} alt={props.name} /> 
          </div> 
        </Popup>        
      </div>
      <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}>
          Delete <span className="visually-hidden">{props.name}</span>
        </button>      
    </div>
  );

    useEffect(() => {
    if (!wasEditing && isEditing) {
      editFieldRef.current.focus();
    } else if (wasEditing && !isEditing) {
      editButtonRef.current.focus();
    }
  }, [wasEditing, isEditing]);
  

  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}


const WebcamCapture = (props) => {  
  const webcamRef = useRef(null); 
  const [imgSrc, setImgSrc] = useState(null); 
  // const [imgId, setImgId] = useState(null); 
  // const [photoSave, setPhotoSave] = useState(false);

  // useEffect(() => {  
    // if (photoSave) { 
      // console.log("useEffect detected photoSave"); 
      // props.photoedTask(imgId); 
      // setPhotoSave(false); 
    // } 
  // }); 
  // console.log("WebCamCapture", props.id);

  const capture = useCallback( () => { 
    const imageSrc = webcamRef.current.getScreenshot(); 
    setImgSrc(imageSrc); 
  }, 
  [webcamRef]); 

  const savePhoto = () => { 
    if (imgSrc) {
      console.log("savePhoto", imgSrc);
      addPhoto(props.id, imgSrc);
      props.photoedTask(props.id, imgSrc); // 假设photoedTask是更新UI的方法
      setImgSrc(null); // 清空预览
    }
  };    
  const cancelPhoto = () => {
    console.log("cancelPhoto");
    setImgSrc(null);
  };
  return ( 
    <> 
      {!imgSrc && ( 
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" /> 
      )} 
      {imgSrc && <img src={imgSrc} />} 
      <div className="btn-group"> 
        {!imgSrc && (  
          <button 
            type="button" 
            className="btn" 
            onClick={() => capture(props.id)}> 
            Capture photo 
          </button> 
        )} 
        {imgSrc && (   
          <button 
            type="button" 
            className="btn" 
            onClick={() => savePhoto(props.id, imgSrc)}> 
            Save Photo 
          </button> 
        )} 
        <button         
          type="button" 
          className="btn todo-cancel" 
          onClick={() => cancelPhoto(props.id, imgSrc)}> 
          Cancel 
        </button> 
      </div> 
    </>
  );

};

const ViewPhoto = (props) => {
  const [photoSrc, setPhotoSrc] = useState(null);

  useEffect(() => {
    const fetchPhotoSrc = async () => {
      const src = await GetPhotoSrc(props.id); // 假设这是一个异步操作
      setPhotoSrc(src);
    };
    
    fetchPhotoSrc();
  }, [props.id]);

  if (!photoSrc) {
    // 当photoSrc为null时，直接返回一个按钮，点击后显示警告而不是打开模态框
    return (
      <button
        type="button"
        className="btn"
        onClick={() => alert("Photo not found")}
      >
        View Photo
      </button>
    );
  }
  return (
    <Popup
      trigger={
        <button type="button" className="btn">
          {" "}
          View Photo{" "}
        </button>
      }
      modal
    >
      <div>
        <img src={photoSrc} alt={props.name} />
      </div>
    </Popup>
  );
};

export default Todo;
