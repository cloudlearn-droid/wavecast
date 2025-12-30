import api from "./client";

export const getArtists = async () => {
  const res = await api.get("/api/artists");
  return res.data;
};

export const getTracksByArtist = async (artistId) => {
  const res = await api.get(`/api/artists/${artistId}/tracks`);
  return res.data;
};
