import React, { useState, useEffect } from 'react';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { View, FlatList, StyleSheet, Animated } from 'react-native';
import axios from 'axios';
import { TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

const Berita = () => {
  
  const [newsData, setNewsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([
    { name: 'Top Headlines', url: 'https://newsapi.org/v2/top-headlines?country=us&apiKey=51270feafea8462fb0ea64a3084b3a4a', page: 1 },
    { name: 'Entertainment', url: 'https://newsapi.org/v2/top-headlines?country=us&category=entertainment&apiKey=51270feafea8462fb0ea64a3084b3a4a', page: 1 },
    { name: 'Business', url: 'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=51270feafea8462fb0ea64a3084b3a4a', page: 1 },
    { name: 'Health', url: 'https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=51270feafea8462fb0ea64a3084b3a4a', page: 1 },
    { name: 'Science', url: 'https://newsapi.org/v2/top-headlines?country=us&category=science&apiKey=51270feafea8462fb0ea64a3084b3a4a', page: 1 },
    { name: 'Sports', url: 'https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=51270feafea8462fb0ea64a3084b3a4a', page: 1 },
    { name: 'Technology', url: 'https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=51270feafea8462fb0ea64a3084b3a4a', page: 1 },
  ]);

  const [scrollY] = useState(new Animated.Value(0));
  const [categoryButtonOpacity] = useState(new Animated.Value(1));

  useEffect(() => {
    fetchNewsData(categories[0]);
  }, []);

  const fetchNewsData = async (category) => {
    try {
      const response = await axios.get(`${category.url}&page=${category.page}`);
      setNewsData({
        category: category.name,
        articles: response.data.articles.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching news data:', error);
    }
  };

  const handleNextPage = () => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];
      newCategories.find(c => c.name === selectedCategory).page += 1;
      return newCategories;
    });

    fetchNewsData(categories.find(c => c.name === selectedCategory));
  };

  const renderNewsItem = ({ item }) => (
    <Card key={item.url} style={styles.newsCard}>
      <Card.Cover source={{ uri: item.urlToImage }} style={styles.cardImage} />
      <Card.Content>
        <Title style={styles.cardTitle}>{item.title}</Title>
        <Paragraph style={styles.cardAuthor}>{item.author}</Paragraph>
        <Paragraph style={styles.cardDescription}>{item.description}</Paragraph>
      </Card.Content>
    </Card>
  );

  const renderCategoryButton = (category, index) => (
    <Button
      key={index}
      onPress={() => handleCategoryPress(category.name)}
      style={selectedCategory === category.name ? styles.categoryButtonSelected : styles.categoryButton}
    >
      <Title style={styles.categoryButtonText}>{category.name}</Title>
    </Button>
  );

  const handleCategoryPress = (categoryName) => {
    setSelectedCategory(categoryName);
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];
      newCategories.find(c => c.name === categoryName).page = 1;
      return newCategories;
    });

    fetchNewsData(categories.find(c => c.name === categoryName));
  };

  const renderFooter = () => (
    <Button
      mode="contained"
      onPress={handleNextPage}
      style={styles.nextButton}
    >
      Next
    </Button>
  );

  const categoryButtonContainerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

    const handleLogout = async () => {
      await signOut(auth);
      console.log('Logout');
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Title style={styles.appTitle}>Eureka News</Title>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            styles.categoryButtonContainer,
            { opacity: categoryButtonContainerOpacity },
          ]}
        >
          {categories.map(renderCategoryButton)}
        </Animated.View>
        <FlatList
          data={newsData.articles}
          keyExtractor={(item) => item.url}
          renderItem={renderNewsItem}
          ListFooterComponent={renderFooter}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
        <Title style={styles.categoryTitle}>{newsData.category}</Title>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ECEFF1',
    },
    header: {
      backgroundColor: '#1976D2',
      padding: 16,
      paddingBottom: 10,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    appTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    newsCard: {
      margin: 16,
      elevation: 4,
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  cardImage: {
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  cardAuthor: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 4,
  },
  cardDescription: {
    marginBottom: 8,
  },
  nextButton: {
    margin: 16,
    backgroundColor: '#1976D2',
  },
  categoryButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },
  categoryButton: {
    backgroundColor: '#536DFE',
    borderRadius: 20,
    flex: 1,
    marginRight: 5,
  },
  categoryButtonSelected: {
    backgroundColor: '#1976D2',
    borderRadius: 20,
    flex: 1,
    marginRight: 5,
  },
  categoryButtonText: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#FF5252',
    borderRadius: 8,
    padding: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default Berita;
