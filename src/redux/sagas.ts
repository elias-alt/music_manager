import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  fetchSongsRequest,
  fetchSongsSuccess,
  fetchSongsFailure,
  addSongRequest,
  addSongSuccess,
  addSongFailure, 
  updateSongRequest,
  updateSongSuccess,
  deleteSongRequest,
  deleteSongSuccess,
} from "./songSlice";

const API_URL = "http://localhost:5000/api/songs";

function* fetchSongsSaga(): Generator<any, void, any> {
  try {
    const response = yield call(axios.get, API_URL);
    yield put(fetchSongsSuccess(response.data));
  } catch (error) {
    yield put(fetchSongsFailure("Failed to fetch songs"));
  }
}

function* addSongSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(axios.post, API_URL, action.payload);
    yield put(addSongSuccess(response.data));
  } catch (error: any) {
    yield put(addSongFailure("Failed to add song"));
    console.error("Error adding song:", error.response?.data || error.message);
  }
}

function* updateSongSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(axios.put, `${API_URL}/${action.payload._id}`, action.payload);
    yield put(updateSongSuccess(response.data));
  } catch (error) {
    console.error("Failed to update song");
  }
}

function* deleteSongSaga(action: any): Generator<any, void, any> {
  try {
    yield call(axios.delete, `${API_URL}/${action.payload}`);
    yield put(deleteSongSuccess(action.payload));
  } catch (error) {
    console.error("Failed to delete song");
  }
}

export default function* rootSaga() {
  yield takeLatest(fetchSongsRequest.type, fetchSongsSaga);
  yield takeLatest(addSongRequest.type, addSongSaga);
  yield takeLatest(updateSongRequest.type, updateSongSaga);
  yield takeLatest(deleteSongRequest.type, deleteSongSaga);
}
