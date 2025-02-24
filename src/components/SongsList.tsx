import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  fetchSongsRequest,
  addSongRequest,
  updateSongRequest,
  deleteSongRequest,
} from "../redux/songSlice";
import styled from "@emotion/styled";

// Styled Components (unchanged)
const AppContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
`;

const Navbar = styled.div`
  background-color: #333;
  color: white;
  padding: 15px;
  font-size: 18px;
  text-align: center;
  width: 100%;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #f8f8f8;
  padding: 20px;
  border-right: 1px solid #ddd;
  height: 100vh;
  overflow-y: auto;
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

const SidebarItem = styled.div`
  margin-bottom: 15px;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #4caf50;
  color: white;
  border: none;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;

  &:focus {
    outline: none;
  }

  &:hover {
    background: #45a049;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const DropdownContent = styled.div`
  display: ${(props: { open: boolean }) => (props.open ? "block" : "none")};
  padding-left: 15px;
`;

const SongContainer = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  flex-grow: 1;
  max-width: 100%;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const SongCard = styled.div`
  background: #f4f4f4;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SongTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;

  th{
  padding: 10px;
    text-align: left;
    background:rgb(0, 92, 213);
    color:#fff;
  }
  td {
    padding: 5px;
    text-align: left;
  }

  tr:nth-child(even) {
    background-color: #ddd;
  }

  tr:nth-child(odd) {
    background-color: #fff;
  }

  tr:hover {
    background-color: #ccc;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 40px;
`;

const Button = styled.button`
  padding: 8px 10px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const AddButton = styled(Button)`
  background: green;
  color: white;
  margin:5px 5px 10px 0px;
`;

const UpdateButton = styled(Button)`
  background: blue;
  color: white;
`;

const DeleteButton = styled(Button)`
  background: red;
  color: white;
`;

const CloseButton = styled(Button)`
  background: gray;
  color: white;
`;

const StatisticsContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: #f4f4f4;
  padding: 15px;
  margin: 10px;
  border-radius: 5px;
  width: 30%;
  text-align: center;
  box-sizing: border-box;
  font-weight: bold;

  @media (max-width: 768px) {
    width: 48%;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  padding: 8px 12px;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: #4caf50;
  color: white;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const RowsPerPageDropdown = styled.select`
  padding: 8px;
  border-radius: 5px;
  margin-left: 10px;
`;

const SongsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { songs, loading, error } = useSelector((state: RootState) => state.songs);
  const [newSong, setNewSong] = useState({ title: "", artist: "", album: "", genre: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState({ _id: "", title: "", artist: "", album: "", genre: "" });
  const [filter, setFilter] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMode, setIsAddMode] = useState(true);  // For determining if it's Add or Update modal
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null); // For dropdown toggle
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchSongsRequest());
  }, [dispatch]);

  // Handle dropdown toggle
  const handleDropdownToggle = (category: string) => {
    setDropdownOpen(dropdownOpen === category ? null : category);
  };

  const handleAddSong = () => {
    if (!newSong.title || !newSong.artist || !newSong.album || !newSong.genre) {
      alert("All fields are required!");
      return;
    }
    const songToAdd = { ...newSong, _id: Math.random().toString(36).substr(2, 9) };
    dispatch(addSongRequest(songToAdd));
    setNewSong({ title: "", artist: "", album: "", genre: "" });
    setIsModalOpen(false);
  };

  const handleUpdateSong = (song: any) => {
    setCurrentSong(song);
    setIsAddMode(false);  // Set to Update mode
    setIsModalOpen(true);
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSong({ ...currentSong, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = () => {
    if (!currentSong.title || !currentSong.artist || !currentSong.album || !currentSong.genre) {
      alert("All fields are required!");
      return;
    }
    dispatch(updateSongRequest(currentSong));
    setIsModalOpen(false);
  };

  const handleDeleteSong = (id: string) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      dispatch(deleteSongRequest(id));
    }
  };

  // Normalize case for genre and filter
  const normalizedSearchTerm = searchTerm.toLowerCase();
  const filteredSongs = songs.filter(song =>
    filter === "title" ? song.title.toLowerCase().includes(normalizedSearchTerm) :
    filter === "artist" ? song.artist.toLowerCase().includes(normalizedSearchTerm) :
    filter === "genre" ? song.genre.toLowerCase().includes(normalizedSearchTerm) :
    filter === "album" ? song.album.toLowerCase().includes(normalizedSearchTerm) :
    true
  );

  // Pagination logic
  const indexOfLastSong = currentPage * rowsPerPage;
  const indexOfFirstSong = indexOfLastSong - rowsPerPage;
  const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong);

  const totalPages = Math.ceil(filteredSongs.length / rowsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Calculate statistics
  const totalSongs = songs.length;

  // Calculate unique genres, artists, and albums
  const uniqueGenres = new Set(songs.map(song => song.genre.toLowerCase())).size;
  const uniqueArtists = new Set(songs.map(song => song.artist.toLowerCase())).size;
  const uniqueAlbums = new Set(songs.map(song => song.album.toLowerCase())).size;

  const genreCount = songs.reduce((acc, song) => {
    const genreLower = song.genre.toLowerCase(); // Normalize genre case
    acc[genreLower] = (acc[genreLower] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const artistCount = songs.reduce((acc, song) => {
    acc[song.artist] = (acc[song.artist] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const albumCount = songs.reduce((acc, song) => {
    acc[song.album] = (acc[song.album] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AppContainer>
      <Navbar>Song Management App</Navbar>
      <Sidebar>
        <SidebarItem>
          <DropdownButton onClick={() => handleDropdownToggle("total")}>
            Total Songs: {totalSongs}
          </DropdownButton>
          <DropdownContent open={dropdownOpen === "total"}>
            <div>Total Songs: {totalSongs}</div>
          </DropdownContent>
        </SidebarItem>

        <SidebarItem>
          <DropdownButton onClick={() => handleDropdownToggle("genres")}>
            Songs by Genre ({uniqueGenres} Genres)
          </DropdownButton>
          <DropdownContent open={dropdownOpen === "genres"}>
            <SongTable>
              <tbody>
                {Object.entries(genreCount).map(([genre, count]) => (
                  <tr key={genre}>
                    <td>{genre}</td>
                    <td>{count} songs</td>
                  </tr>
                ))}
              </tbody>
            </SongTable>
          </DropdownContent>
        </SidebarItem>

        <SidebarItem>
          <DropdownButton onClick={() => handleDropdownToggle("artists")}>
            Songs by Artist ({uniqueArtists} Artists)
          </DropdownButton>
          <DropdownContent open={dropdownOpen === "artists"}>
            <SongTable>
              <tbody>
                {Object.entries(artistCount).map(([artist, count]) => (
                  <tr key={artist}>
                    <td>{artist}</td>
                    <td>{count} songs</td>
                  </tr>
                ))}
              </tbody>
            </SongTable>
          </DropdownContent>
        </SidebarItem>

        <SidebarItem>
          <DropdownButton onClick={() => handleDropdownToggle("albums")}>
            Songs by Album ({uniqueAlbums} Albums)
          </DropdownButton>
          <DropdownContent open={dropdownOpen === "albums"}>
            <SongTable>
              <tbody>
                {Object.entries(albumCount).map(([album, count]) => (
                  <tr key={album}>
                    <td>{album}</td>
                    <td>{count} songs</td>
                  </tr>
                ))}
              </tbody>
            </SongTable>
          </DropdownContent>
        </SidebarItem>
      </Sidebar>

      <SongContainer>
      <AddButton onClick={() => { setIsModalOpen(true); setIsAddMode(true); }}>Add New Song</AddButton>
    <div style={{ display: "flex", flexDirection: "column", marginBottom: 20 }}>
    <div style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: "10px" }}>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          width: "7%",
          padding: "10px",
          borderRadius: "5px",
          height: "40px",
          marginBottom: "10px"
        }}
      >
      <option value="title">Filter</option>
      <option value="title">Title</option>
      <option value="artist">Artist</option>
      <option value="genre">Genre</option>
      <option value="album">Album</option>
    </select>
    <Input
      type="text"
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        width: "18.5%",
        padding: "7px",
        borderRadius: "5px",
        height: "40px"
      }}
    />
  </div>
</div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          <RowsPerPageDropdown value={rowsPerPage} onChange={handleRowsPerPageChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={-1}>All</option>
          </RowsPerPageDropdown>
        </div>

        <SongTable>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Genre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentSongs.map((song, index) => (
              <tr key={song._id}>
                <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                <td>{song.title}</td>
                <td>{song.artist}</td>
                <td>{song.album}</td>
                <td>{song.genre}</td>
                <td>
                  <UpdateButton onClick={() => handleUpdateSong(song)}>Edit</UpdateButton>
                  <DeleteButton onClick={() => handleDeleteSong(song._id)}>Delete</DeleteButton>
                </td>
              </tr>
            ))}
          </tbody>
        </SongTable>

        <PaginationContainer>
          <PaginationButton
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </PaginationButton>
          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PaginationButton>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PaginationButton>
          <PaginationButton
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </PaginationButton>
        </PaginationContainer>

        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <h3>{isAddMode ? "Add New Song" : "Update Song"}</h3>
              <Input
                type="text"
                name="title"
                placeholder="Title"
                value={isAddMode ? newSong.title : currentSong.title}
                onChange={isAddMode ? (e) => setNewSong({ ...newSong, title: e.target.value }) : handleModalChange}
              />
              <Input
                type="text"
                name="artist"
                placeholder="Artist"
                value={isAddMode ? newSong.artist : currentSong.artist}
                onChange={isAddMode ? (e) => setNewSong({ ...newSong, artist: e.target.value }) : handleModalChange}
              />
              <Input
                type="text"
                name="album"
                placeholder="Album"
                value={isAddMode ? newSong.album : currentSong.album}
                onChange={isAddMode ? (e) => setNewSong({ ...newSong, album: e.target.value }) : handleModalChange}
              />
              <Input
                type="text"
                name="genre"
                placeholder="Genre"
                value={isAddMode ? newSong.genre : currentSong.genre}
                onChange={isAddMode ? (e) => setNewSong({ ...newSong, genre: e.target.value }) : handleModalChange}
              />
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <AddButton onClick={isAddMode ? handleAddSong : handleModalSubmit}>
                  {isAddMode ? "Add Song" : "Update Song"}
                </AddButton>
                <CloseButton onClick={() => setIsModalOpen(false)}>Close</CloseButton>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
      </SongContainer>
    </AppContainer>
  );
};

export default SongsList;