import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../layout/common";
import usePreventAuth from "../hooks/usePreventAuth";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { allClear } from "../store/taskSlice";
import { useDispatch } from "react-redux";

Chart.register(ArcElement, Tooltip);

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
  min-height: 120vh;
  height: 120vh;
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
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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

const ChartContainer = styled.div`
  width: 80%;
  max-width: 600px;
  margin-top: 2rem;
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

const getRandomColor = () => {
  return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)}, 0.5)`;
};

const ArchivePage = () => {
  const [savedTasks, setSavedTasks] = useState([]);
  const user = useSelector((state) => state?.user?.userInfo);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  usePreventAuth();
  // 컴포넌트가 렌더링될 때마다 실행되는 효과
  useEffect(() => {
    // 작업을 가져오는 함수
    const fetchTasks = async () => {
      // firestore에서 작업 컬렉션의 문서를 가져옴
      const taskCollection = await getDocs(collection(db, "tasks"));
      const userTasks = taskCollection.docs
        // 문서 데이터를 가져와서 객체로 변환
        .map((doc) => doc.data())
        // 사용자 ID와 일치하는 작업만 필터링
        .filter((task) => task.userId === user.uid)
        .filter((task) => task.status === "complete");

      // 가져온 작업을 상태에 저장
      setSavedTasks(userTasks);
    };
    // 사용자가 있을 경우 작업을 가져오는 함수를 호출
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const chartData = {
    labels: [],
    datasets: [
      {
        label: "Tasks",
        data: [],
        backgroundColor: [],
      },
    ],
  };

  // 저장된 작업 목록을 순회
  savedTasks.forEach((task) => {
    // 작업의 카테고리를 가져옴(이때, 카테고리는 작업의 이름 그 자체)
    const category = task.task;
    // 차트 데이터의 라벨에 카테고리가 없는 경우(즉, 새로운 작업이 추가되었을 때)
    if (!chartData.labels.includes(category)) {
      // 라벨에 카테고리를 추가
      chartData.labels.push(category);
      // 데이터셋에 카테고리에 해당하는 데이터를 추가하고 1로 초기화
      chartData.datasets[0].data.push(1);
      // 해당 데이터셋의 배경색을 임의적으로 설정
      chartData.datasets[0].backgroundColor.push(getRandomColor());
    } else {
      // 차트 데이터의 라벨에 이미 카테고리가 있는 경우(=동일한 제목의 작업이 추가된 경우)
      // 카테고리의 인덱스를 찾고, 해당 카테고리의 데이터 값을 증가시킴
      const index = chartData.labels.indexOf(category);
      chartData.datasets[0].data[index]++;
    }
  });

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <PageContainer>
      <StyledContainer>
        <ContentWrapper>
          <Title>
            Hi! {user?.displayName}
            {savedTasks.length === 0
              ? ", Please complete your tasks!"
              : "! These are Your Achievements"}
          </Title>

          {savedTasks.length === 0 ? (
            <>
              <Button onClick={handleGoHome}>Go Home</Button>
            </>
          ) : (
            <>
              <ChartContainer>
                <Pie
                  width={20}
                  height={20}
                  data={chartData}
                  options={{
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.label || "";
                            if (label) {
                              const value = context.parsed || 0;
                              return `${label}: ${value}`;
                            }
                            return null;
                          },
                        },
                      },
                    },
                  }}
                />
              </ChartContainer>
              <Button onClick={() => dispatch(allClear(user?.uid))}>
                All Clear
              </Button>
              <Button onClick={handleGoHome}>Go Home</Button>
            </>
          )}
        </ContentWrapper>
        <GridOverlay />
      </StyledContainer>
    </PageContainer>
  );
};

export default ArchivePage;
