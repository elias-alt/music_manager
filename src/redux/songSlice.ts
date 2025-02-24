import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
}

interface SongState {
  songs: Song[];
  loading: boolean;
  error: string | null;
}

const initialState: SongState = {
  songs: [],
  loading: false,
  error: null,
};

const songSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    fetchSongsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSongsSuccess: (state, action: PayloadAction<Song[]>) => {
      state.loading = false;
      state.songs = action.payload;
    },
    fetchSongsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addSongRequest: (state, action: PayloadAction<Song>) => {
      state.loading = true;
      state.error = null;
    },
    addSongSuccess: (state, action: PayloadAction<Song>) => {
      state.loading = false;
      state.songs.push(action.payload);
    },
    addSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateSongRequest: (state, action: PayloadAction<Song>) => {
      state.loading = true;
    },
    updateSongSuccess: (state, action: PayloadAction<Song>) => {
      state.loading = false;
      const index = state.songs.findIndex((song) => song._id === action.payload._id);
      if (index !== -1) {
        state.songs[index] = action.payload;
      }
    },
    deleteSongRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
    },
    deleteSongSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.songs = state.songs.filter((song) => song._id !== action.payload);
    },
  },
});

export const {
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
} = songSlice.actions;

export default songSlice.reducer;
