// tasksSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  collection,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export const getAllTasks = createAsyncThunk(
  "tasks/getAllTasks",
  async (userId) => {
    const taskCollection = await getDocs(collection(db, "tasks"));

    const allTasks = [
      ...taskCollection.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
    ].filter((task) => task.userId === userId);

    return allTasks;
  }
);

export const addTask = createAsyncThunk("tasks/addTask", async (data) => {
  const result = await addDoc(collection(db, "tasks"), {
    userId: data?.userId,
    task: data?.task,
    initialTime: data?.initialTime,
    pausedTime: "",
    createdAt: data?.createdAt,
    status: data.status,
  });
  const taskId = result.path.split("/")[1];
  return { ...data, id: taskId };
});

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId) => {
    console.log(taskId);
    await deleteDoc(doc(db, "tasks", taskId));

    return taskId;
  }
);

export const putTask = createAsyncThunk("tasks/putTask", async (task) => {
  if (task.pausedTime !== "") {
    await updateDoc(doc(db, "tasks", task.id), {
      pausedTime: task?.pausedTime,
      status: task.status,
    });
  }
  return task;
});

export const completedTask = createAsyncThunk(
  "tasks/completedTask",
  async (task) => {
    if (task?.status === "complete") {
      await updateDoc(doc(db, "tasks", task.id), {
        status: task?.status,
      });
    }

    return task;
  }
);

export const allClear = createAsyncThunk(
  "tasks/allClearTask",
  async (userId) => {
    const taskCollection = await getDocs(collection(db, "tasks"));
    const tasksToDelete = taskCollection.docs.filter(
      (doc) => doc.data().userId === userId && doc.data().status === "complete"
    );

    const deletePromises = tasksToDelete.map((task) =>
      deleteDoc(doc(db, "tasks", task.id))
    );
    await Promise.all(deletePromises);

    return tasksToDelete.map((task) => task.id);
  }
);

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getAllTasks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
    });
    builder.addCase(getAllTasks.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(addTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks.push(action.payload);
    });
    builder.addCase(addTask.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    });
    builder.addCase(deleteTask.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(putTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(putTask.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.map((task) =>
        task.id === action.payload.id ? action.payload : task
      );
    });
    builder.addCase(putTask.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(completedTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(completedTask.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter((task) => task.id !== action.payload.id);
      window.alert("Task saved successfully 😄");
    });
    builder.addCase(completedTask.rejected, (state) => {
      state.loading = false;
    });
    // allClear 비동기 작업 처리
    builder.addCase(allClear.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(allClear.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter(
        (task) => !action.payload.includes(task.id)
      );
      // window.alert("All saved items have been deleted 😄");
    });
    builder.addCase(allClear.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default tasksSlice.reducer;
