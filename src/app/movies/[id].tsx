import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "../../../constants/icons";
import { fetchMovieDetails } from "../../../services/api";
import { getSavedMovies, saveMovie } from "../../../services/appwrite";
import useFetch from "../../../services/usefetch";

interface MovieInfoProps {
    label: string;
    value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-sm">{label}</Text>
        <Text className="text-light-100 font-bold text-sm mt-2">
            {value || "N/A"}
        </Text>
    </View>
);

const Details = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { data: movie, loading } = useFetch(() =>
        fetchMovieDetails(id as string), true
    );
    const { data: savedMovies, refetch } = useFetch(getSavedMovies, true);
    
    // حالة محلية لتغيير شكل الزر ديناميكياً فوراً
    const [isSaved, setIsSaved] = useState(false);

    // تحديث الحالة المحلية عندما تأتي البيانات من قاعدة البيانات (تم التصحيح هنا)
    useEffect(() => {
        if (savedMovies && movie) {
            const exists = savedMovies.some((m: any) => m.movieId === movie?.id);
            setIsSaved(exists);
        }
    }, [savedMovies, movie]); // ✅ الاعتماد فقط على savedMovies و movie

    // دالة التعامل مع الحفظ ديناميكياً
    const handleSaveToggle = async () => {
        // تغيير الحالة بصرياً فوراً (Dynamic Update)
        setIsSaved((prev) => !prev);
        
        try {
            await saveMovie(movie);
            refetch(); // إعادة جلب البيانات للتأكيد من الخادم
        } catch (error) {
            console.error("Failed to save movie:", error);
            setIsSaved((prev) => !prev); // التراجع في حال حدوث خطأ
        }
    };

    if (loading)
        return (
            <SafeAreaView className="bg-primary flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#ab8bff" />
            </SafeAreaView>
        );

    return (
        <View className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View>
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                        }}
                        className="w-full h-[550px]"
                        resizeMode="stretch"
                    />
                    
                    {/* زر الحفظ الديناميكي */}
                    <TouchableOpacity
                        onPress={handleSaveToggle}
                        className={`absolute bottom-5 left-5 rounded-full size-14 bg-white flex items-center justify-center ${
                            isSaved ? "border-2 border-accent bg-accent/20" : ""
                        }`}
                    >
                        <Image
                            source={icons.save}
                            className="w-6 h-7 ml-1"
                            resizeMode="stretch"
                            tintColor={isSaved ? "#ab8bff" : "#000"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
                        <Image
                            source={icons.play}
                            className="w-6 h-7 ml-1"
                            resizeMode="stretch"
                        />
                    </TouchableOpacity>
                </View>

                <View className="flex-col items-start justify-center mt-5 px-5">
                    <Text className="text-white font-bold text-xl">{movie?.title}</Text>
                    <View className="flex-row items-center gap-x-1 mt-2">
                        <Text className="text-light-200 text-sm">
                            {movie?.release_date?.split("-")[0]} •
                        </Text>
                        <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
                    </View>

                    <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                        <Image source={icons.star} className="size-4" />

                        <Text className="text-white font-bold text-sm">
                            {Math.round(movie?.vote_average ?? 0)}/10
                        </Text>

                        <Text className="text-light-200 text-sm">
                            ({movie?.vote_count} votes)
                        </Text>
                    </View>

                    <MovieInfo label="Overview" value={movie?.overview} />
                    <MovieInfo
                        label="Genres"
                        value={movie?.genres?.map((g: any) => g.name).join(" • ") || "N/A"}
                    />

                    <View className="flex flex-row justify-between w-1/2">
                        <MovieInfo
                            label="Budget"
                            value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
                        />
                        <MovieInfo
                            label="Revenue"
                            value={`$${Math.round(
                                (movie?.revenue ?? 0) / 1_000_000
                            )} million`}
                        />
                    </View>

                    <MovieInfo
                        label="Production Companies"
                        value={
                            movie?.production_companies?.map((c: any) => c.name).join(" • ") ||
                            "N/A"
                        }
                    />
                </View>
            </ScrollView>

            <TouchableOpacity
                className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
                onPress={router.back}
            >
                <Image
                    source={icons.arrow}
                    className="size-5 mr-1 mt-0.5 rotate-180"
                    tintColor="#fff"
                />
                <Text className="text-white font-semibold text-base">Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Details;