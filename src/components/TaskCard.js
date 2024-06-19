import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { putTask, deleteTask, completedTask } from "../store/taskSlice";
import { getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

const StyledCard = styled.div`
  background-color: rgb(47, 49, 53);
  color: white;
  padding: 20px;
  width: 300px;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  margin-bottom: 30px;
  opacity: 0;
  animation: fadeIn 1.5s ease forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    border: 1px solid white;
    transform: translateY(-5px);
    box-shadow: 0px 8px 20px rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  }
`;

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  margin: 10px;
  cursor: pointer;
`;

const StyledCircleContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 20px auto;
`;

const StyledCircleTimer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    red 0% ${(props) => props.percent * 3.6}deg,
    white ${(props) => props.percent * 3.6}deg 360deg
  );
  mask-image: radial-gradient(circle, transparent 48%, black 52%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TaskCard = ({ task, userId }) => {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(
    task?.pausedTime || task?.initialTime
  );
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (timerRunning) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerRunning]);

  const handleSaveTask = async (task) => {
    dispatch(completedTask({ ...task, status: "complete" }));
  };

  const handleDeleteTask = (taskId) => {
    console.log(taskId);
    dispatch(deleteTask(taskId));
  };

  const handleStartTimer = () => {
    setTimerRunning(true);
  };

  const handlePauseTimer = (task, timeLeft) => {
    setTimerRunning(false);
    dispatch(putTask({ ...task, pausedTime: timeLeft, status: "paused" }));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  const percent = ((task?.initialTime - timeLeft) / task?.initialTime) * 100;

  return (
    <>
      <StyledCard>
        {/* <StyledTask>{task.task}</StyledTask> */}
        <StyledCircleContainer>
          <StyledCircleTimer percent={percent}></StyledCircleTimer>
        </StyledCircleContainer>
        <div>
          {timeLeft === 0 ? (
            <>
              <StyledButton onClick={() => handleSaveTask(task)}>
                Save
              </StyledButton>
              <StyledButton onClick={() => handleDeleteTask(task.id)}>
                Delete
              </StyledButton>
            </>
          ) : (
            <>
              {timerRunning ? (
                <StyledButton onClick={() => handlePauseTimer(task, timeLeft)}>
                  Pause
                </StyledButton>
              ) : (
                <>
                  <StyledButton onClick={handleStartTimer}>Start</StyledButton>
                  <StyledButton onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </StyledButton>
                </>
              )}
            </>
          )}
          <p style={{ color: "white", fontWeight: "bold" }}>{task.task}</p>
          <p style={{ color: "white" }}>Time Left: {formattedTime}</p>
        </div>
      </StyledCard>
    </>
  );
};

export default TaskCard;
