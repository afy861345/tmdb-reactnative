import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
const savedCollectionId="6adeff49003c25cd3cc5"

interface SavedMovie {
  $id:string;
  movieId: number;
  name?: string;
  poster: string;
}
export const getSavedMovies = async (): Promise<
  SavedMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, savedCollectionId);

    return result.documents as unknown as SavedMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const saveMovie = async (movie:Movie) => {
  
  try {
    const result = await database.listDocuments(DATABASE_ID, savedCollectionId, [
      Query.equal("name", movie.title),
    ]);
    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.deleteDocument(
        DATABASE_ID,
        savedCollectionId,
        existingMovie.$id
        
      );
    } else {
      await database.createDocument(DATABASE_ID, savedCollectionId, ID.unique(), {
        name: movie.title,
        movieId: movie.id,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error(error);
  }
};