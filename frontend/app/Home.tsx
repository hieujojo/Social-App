import React from "react";
import { SafeAreaView, FlatList, StyleSheet } from "react-native";
import Header from "@/components/layout/Header";
import Story from "@/components/home/Story";
import PostList from "@/components/home/PostList";

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Header />
            <Story />
          </>
        }
        data={[1]} // dummy để render PostList
        renderItem={() => <PostList />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingBottom: 60,
  },
});

export default HomeScreen;
