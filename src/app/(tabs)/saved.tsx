import { getSavedMovies } from '../../../services/appwrite';
import useFetch from '../../../services/usefetch';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const SavedMovie = ({name,movieId,poster}:SavedMovie) => {
  return (
    <View className='w-48 my-5'>
      <Link href={`/movies/${movieId}`} asChild>
        <TouchableOpacity >
          <Image 
          className="w-full h-72 rounded-lg"
          resizeMode="cover"
          source={{uri: poster
              ? poster
              : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",}}/>
         <Text className='text-white text-2xl font-bold absolute top-5 left-0 right-0 text-center'>{name}</Text>

        </TouchableOpacity>
      </Link>
    </View>
  )
}
const saved = () => {
  const { data, loading, error, refetch } = useFetch(getSavedMovies);
  useFocusEffect(
  useCallback(() => {
    refetch();
  }, [])
);
  return (
    <SafeAreaView className='bg-primary flex-1'>
      <ScrollView showsVerticalScrollIndicator={false} className='my-5 flex-1'>
        <Text className='text-white font-bold text-4xl self-center my-12'>Saved Movies</Text>
        <FlatList 
        data={data}
        scrollEnabled={false}
        keyExtractor={item=>item.$id}
        renderItem={({item})=>(
          <SavedMovie {...item}/>
        )}
        numColumns={2}
        columnWrapperClassName='gap-4'
        contentContainerClassName='pb-28'
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default saved
