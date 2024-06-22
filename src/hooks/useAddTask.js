import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../store/userSlice";

import { addTask } from "../store/taskSlice";

import { auth } from "../firebase";

import { getAllTasks } from "../store/taskSlice";

const useAddTask = () => {
  const [task, setTask] = useState("");
  const [time, setTime] = useState(300);
  const tasks = useSelector((state) => state.tasks.tasks);
  const user = useSelector((state) => state?.user?.userInfo);
  const loading = useSelector((state) => state.tasks.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(user);

  const handleAddTask = () => {
    if (!task.trim()) {
      return alert("태스크를 입력해주세요.");
    }
    const newTask = {
      createdAt: Date.now(),
      task,
      status: "pending",
      initialTime: time,
      pausedTime: "",
      userId: user.uid,
    };
    // redux 상태에 새로운 작업을 추가
    dispatch(addTask(newTask));
    // 작업 입력 필드를 초기화
    setTask("");
    setTime(300);
  };

  useEffect(() => {
    if (user) {
      dispatch(getAllTasks(user.uid));
    }
  }, [user]);

  return {
    task,
    setTask,
    time,
    setTime,

    handleAddTask,
    tasks,
    user,
    loading,
  };
};

export default useAddTask;
