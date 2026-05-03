import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { productService } from "@/services/product.service";
import { useAuthStore } from "@/store/auth.store";
import { Category } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "SellProduct">;

export default function SellProductScreen({ route, navigation }: Props) {
  const { user } = useAuthStore();
  const productId = route.params?.productId;
  const isEditing = !!productId;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditing);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (productId) {
      loadProduct(productId);
    }
  }, [productId]);

  const loadProduct = async (id: string) => {
    try {
      const product = await productService.getProductById(id);
      if (product) {
        setName(product.name);
        setDescription(product.description || "");
        setPrice(product.price.toString());
        setDiscount(product.discount ? product.discount.toString() : "");
        setCategory(product.category || "");
        setStock(product.stock ? product.stock.toString() : "");
        setExistingImages(product.images || []);
      }
    } catch {
      Alert.alert("Error", "Failed to load product");
      navigation.goBack();
    } finally {
      setPageLoading(false);
    }
  };

  const loadCategories = async () => {
    const cats = await productService.getCategories();
    setCategories(cats);
  };

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert("Limit reached", "You can only add up to 5 images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to sell products");
      return;
    }

    const hasImages = images.length > 0 || existingImages.length > 0;
    if (!name || !description || !price || !category || !hasImages) {
      Alert.alert(
        "Error",
        "Please fill all required fields and add at least one image",
      );
      return;
    }

    setLoading(true);
    try {
      const uploadedImages = [...existingImages];
      for (const imageUri of images) {
        const url = await productService.uploadProductImage(
          Date.now().toString(),
          imageUri,
        );
        uploadedImages.push(url);
      }

      const productData = {
        name,
        description,
        price: parseFloat(price),
        discount: discount ? parseInt(discount) : 0,
        category,
        image: uploadedImages[0] || "",
        images: uploadedImages,
        stock: stock ? parseInt(stock) : 0,
      };

      if (isEditing && productId) {
        await productService.updateProduct(productId, productData);
        Alert.alert("Success", "Product updated successfully!");
      } else {
        await productService.createProduct({
          ...productData,
          rating: 0,
          reviews: 0,
          sellerId: user!.id,
        });
        Alert.alert("Success", "Product listed successfully!");
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        isEditing
          ? "Failed to update product. Please try again."
          : "Failed to list product. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? "Edit Product" : "Sell Your Product"}
      </Text>

      <Text style={styles.label}>Product Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter product name"
      />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe your product"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Price ($) *</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="0.00"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Discount (%)</Text>
      <TextInput
        style={styles.input}
        value={discount}
        onChangeText={setDiscount}
        placeholder="0"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Category *</Text>
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryButton,
              category === cat.name && styles.categoryButtonActive,
            ]}
            onPress={() => setCategory(cat.name)}
          >
            <Text
              style={[
                styles.categoryText,
                category === cat.name && styles.categoryTextActive,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Stock Quantity</Text>
      <TextInput
        style={styles.input}
        value={stock}
        onChangeText={setStock}
        placeholder="0"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Images * (up to 5)</Text>
      <View style={styles.imageContainer}>
        {existingImages.map((uri, index) => (
          <View key={`existing-${index}`} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() =>
                setExistingImages(existingImages.filter((_, i) => i !== index))
              }
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        {images.length + existingImages.length < 5 && (
          <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
            <Text style={styles.addImageText}>+ Add Image</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isEditing ? "Update Product" : "List Product"}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryText: {
    color: "#333",
  },
  categoryTextActive: {
    color: "#fff",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 8,
    marginBottom: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "red",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addImageText: {
    color: "#007AFF",
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
