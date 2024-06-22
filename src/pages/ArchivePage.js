import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../layout/common";
import usePreventAuth from "../hooks/usePreventAuth";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { allClear } from "../store/taskSlice";
import { useDispatch } from "react-redux";

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

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-width: 360px;
  background: black;
  color: white;
  text-align: center;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  padding: 0 20px;
  margin: 2rem 0;
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem; /* Adjust gap for spacing between TaskCards */
  z-index: 1;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #ffffff, #cccccc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeIn 1.5s ease-in-out;
  z-index: 2;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  @media (max-width: 360px) {
    font-size: 2.5rem;
  }
`;

const TaskCard = styled.div`
  background: #333;
  padding: 1rem;
  border-radius: 10px;
  text-align: left;
  animation: fadeIn 1.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);

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

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  span {
    display: block;
    font-size: 0.875rem;
    color: #aaa;
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
  z-index: 2;

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

const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer",
  "Hardships often prepare ordinary people for an extraordinary destiny. - C.S. Lewis",
  "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
  "You miss 100% of the shots you don’t take. - Wayne Gretzky",
  "I have not failed. I've just found 10,000 ways that won't work. - Thomas Edison",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Life is what happens when you're busy making other plans. - John Lennon",
  "In three words I can sum up everything I've learned about life: it goes on. - Robert Frost",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "It is never too late to be what you might have been. - George Eliot",
  "The journey of a thousand miles begins with one step. - Lao Tzu",
  "The harder I work, the luckier I get. - Samuel Goldwyn",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
  "If you want to lift yourself up, lift up someone else. - Booker T. Washington",
  "Do not wait to strike till the iron is hot, but make it hot by striking. - William Butler Yeats",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
  "The best revenge is massive success. - Frank Sinatra",
  "Don't cry because it's over, smile because it happened. - Dr. Seuss",
  "I find that the harder I work, the more luck I seem to have. - Thomas Jefferson",
  "You must be the change you wish to see in the world. - Mahatma Gandhi",
  "A champion is defined not by their wins but by how they can recover when they fall. - Serena Williams",
  "If you can dream it, you can achieve it. - Zig Ziglar",
  "Do what you can, with what you have, where you are. - Theodore Roosevelt",
  "Strive not to be a success, but rather to be of value. - Albert Einstein",
  "The starting point of all achievement is desire. - Napoleon Hill",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "It always seems impossible until it is done. - Nelson Mandela",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "You don't have to be great to start, but you have to start to be great. - Zig Ziglar",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Life is what happens when you're busy making other plans. - John Lennon",
  "In three words I can sum up everything I've learned about life: it goes on. - Robert Frost",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "It is never too late to be what you might have been. - George Eliot",
  "The journey of a thousand miles begins with one step. - Lao Tzu",
  "The harder I work, the luckier I get. - Samuel Goldwyn",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
  "If you want to lift yourself up, lift up someone else. - Booker T. Washington",
  "Do not wait to strike till the iron is hot, but make it hot by striking. - William Butler Yeats",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
  "The best revenge is massive success. - Frank Sinatra",
  "Don't cry because it's over, smile because it happened. - Dr. Seuss",
  "I find that the harder I work, the more luck I seem to have. - Thomas Jefferson",
  "You must be the change you wish to see in the world. - Mahatma Gandhi",
  "A champion is defined not by their wins but by how they can recover when they fall. - Serena Williams",
  "If you can dream it, you can achieve it. - Zig Ziglar",
  "Do what you can, with what you have, where you are. - Theodore Roosevelt",
  "Strive not to be a success, but rather to be of value. - Albert Einstein",
  "The starting point of all achievement is desire. - Napoleon Hill",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "It always seems impossible until it is done. - Nelson Mandela",
];

const getRandomQuote = () => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

const ArchivePage = () => {
  const [savedTasks, setSavedTasks] = useState([]);
  const user = useSelector((state) => state?.user?.userInfo);
  const tasks = useSelector((state) => state?.tasks?.tasks);
  const filteredTasks = tasks.filter((elem) => elem?.status === "complete");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  usePreventAuth();

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     const taskCollection = await getDocs(collection(db, "tasks"));
  //     const userTasks = taskCollection.docs
  //       .map((doc) => doc.data())
  //       .filter((task) => task.userId === user.uid)
  //       .filter((task) => task.status === "complete");

  //     setSavedTasks(userTasks);
  //   };
  //   if (user) {
  //     fetchTasks();
  //   }
  // }, [user]);

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <PageContainer>
      <StyledContainer>
        <Title>
          Hi! {user?.displayName}
          {filteredTasks?.length === 0
            ? ", Please complete your tasks!"
            : "! These are Your Achievements"}
        </Title>

        <ContentWrapper>
          {filteredTasks?.length === 0 ? (
            <Button onClick={handleGoHome}>Go Home</Button>
          ) : (
            filteredTasks?.map((task, index) => (
              <TaskCard key={index}>
                <h2>{task.task}</h2>
                <p>{task.description}</p>
                <span>{getRandomQuote()}</span>
              </TaskCard>
            ))
          )}
        </ContentWrapper>

        {filteredTasks?.length > 0 && (
          <>
            <Button
              onClick={() => {
                dispatch(allClear(user?.uid));
                window.alert("All saved items have been deleted 😄");
                navigate("/home");
              }}
            >
              All Clear
            </Button>
            <Button onClick={handleGoHome}>Go Home</Button>
          </>
        )}

        <GridOverlay />
      </StyledContainer>
    </PageContainer>
  );
};

export default ArchivePage;
