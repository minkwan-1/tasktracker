import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TaskCard from "../components/TaskCard";
import { PageContainer } from "../layout/common";
import useAddTask from "../hooks/useAddTask";
import usePreventAuth from "../hooks/usePreventAuth";

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  background: black;
  color: white;
  text-align: center;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  z-index: 1;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #ffffff, #cccccc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeIn 1.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Input = styled.input`
  width: 300px;
  padding: 0.5rem;
  margin: 0.5rem 0;
  font-size: 1rem;
  border: 1px solid #cccccc;
  border-radius: 5px;
  background: #333;
  color: white;
  box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  opacity: 0;
  animation: fadeIn 1.5s ease forwards;

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

  &::placeholder {
    color: #cccccc;
  }
`;

const Select = styled.select`
  width: 317px;
  padding: 0.5rem;
  margin: 0.5rem 0;
  font-size: 1rem;
  border: 1px solid #cccccc;
  border-radius: 5px;
  background: #333;
  color: white;
  box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  opacity: 0;
  animation: fadeIn 1.5s ease forwards;

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

  &::placeholder {
    color: #cccccc;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  padding: 1rem 0;
  margin: 1rem;
  font-size: 1.5rem;
  color: black;
  background: white;
  border: 2px solid white;
  border-radius: 50px;
  box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  opacity: 0;
  animation: fadeIn 1.5s ease forwards;

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
    background: #ffffff;
    color: black;
    transform: translateY(-5px);
    box-shadow: 0px 8px 20px rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: linear-gradient(to right, #1f1f1f 1px, transparent 1px),
    linear-gradient(to bottom, #1f1f1f 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 0;
`;

const InputArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  @media (max-width: 900px) {
    order: 1;
  }
`;

const SecondArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  overflow-y: auto;
  @media (max-width: 900px) {
    order: 2;
  }
`;

const EmptyTaskArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 400px;
  min-width: 300px;
  height: 100%;
  border: 2px dashed #cccccc;
  border-radius: 10px;
  margin: 3rem 0;
  cursor: pointer;
  position: relative;
  opacity: 1;
  animation: fadeIn 1.5s ease forwards;

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

  @media (max-width: 900px) {
    width: 300px;
  }
`;

const timeArray = [
  { title: "05:00", value: 300 },
  { title: "10:00", value: 600 },
  { title: "15:00", value: 900 },
  { title: "20:00", value: 1200 },
  { title: "25:00", value: 1500 },
];

const HomePage = () => {
  const {
    task,
    setTask,
    time,
    setTime,

    handleAddTask,
    tasks,
    user,
    loading,
  } = useAddTask();

  const navigate = useNavigate();
  const filteredTasks = tasks.filter((task) => task?.status !== "complete");
  usePreventAuth();

  console.log(tasks);

  return (
    <PageContainer>
      <StyledContainer>
        <ContentWrapper>
          <InputArea>
            <Title>Add your Pomodoro</Title>
            <Input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="New Task"
            />
            <Select value={time} onChange={(e) => setTime(e.target.value)}>
              {timeArray.map((elem, idx) => (
                <option key={idx} value={elem.value}>
                  {elem.title}
                </option>
              ))}
            </Select>
            <Button disabled={loading} onClick={handleAddTask}>
              Add Task
            </Button>

            <Button onClick={() => navigate("/archive")}>Go to Archive</Button>
          </InputArea>
          {/* 주석 B */}
          <SecondArea>
            {filteredTasks?.length === 0 ? (
              <EmptyTaskArea>Not yet</EmptyTaskArea>
            ) : (
              filteredTasks?.map((task) => (
                <TaskCard key={task.id} task={task} userId={user?.uid} />
              ))
            )}
          </SecondArea>
        </ContentWrapper>
        <GridOverlay />
      </StyledContainer>
    </PageContainer>
  );
};

export default HomePage;
