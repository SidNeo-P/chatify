import React, { useState, useEffect } from "react"; // ✅ Import useEffect
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { getDeviceContacts, uploadContactsToSupabase } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Contact {
  id: string;
  name: string;
}

export default function ImportContactsScreen() {
  const [loading, setLoading] = useState(false);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredContacts(allContacts);
    } else {
      const filtered = allContacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, allContacts]);

  const handleFetchContacts = async () => {
    setLoading(true);
    try {
      const contactsFromDevice = await getDeviceContacts();
      if (!contactsFromDevice || contactsFromDevice.length === 0) {
        Alert.alert(
          "No Contacts Found",
          "Could not find any contacts on your device."
        );
        setLoading(false);
        return;
      }
      const validContacts = contactsFromDevice
        .filter((contact) => typeof contact.id === "string" && contact.name)
        .map((contact) => ({
          id: contact.id!,
          name: contact.name!,
        }));

      setAllContacts(validContacts); // Set the master list
      // setFilteredContacts(validContacts); // This is now handled by useEffect
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to get contacts");
    } finally {
      setLoading(false);
    }
  };

  // handleUploadSelected and toggleContactSelection remain the same...
  const handleUploadSelected = async () => {
    if (selectedContacts.size === 0) {
      Alert.alert(
        "No Selection",
        "Please select at least one contact to upload."
      );
      return;
    }
    if (!session) {
      Alert.alert("Authentication Error", "User is not logged in.");
      return;
    }

    setLoading(true);
    try {
      // Filter the main list to get the full objects for selected contacts
      const contactsToUpload = allContacts.filter((c) =>
        selectedContacts.has(c.id)
      );
      await uploadContactsToSupabase(contactsToUpload, session);
      Alert.alert(
        "Success",
        `${contactsToUpload.length} contacts uploaded successfully!`
      );
      // Clear selection and list after upload
      setSelectedContacts(new Set());
      setAllContacts([]);
      setSearchQuery(""); // ✅ Reset search query
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong during upload");
    } finally {
      setLoading(false);
    }
  };

  const toggleContactSelection = (contactId: string) => {
    const newSelection = new Set(selectedContacts);
    if (newSelection.has(contactId)) {
      newSelection.delete(contactId);
    } else {
      newSelection.add(contactId);
    }
    setSelectedContacts(newSelection);
  };

  if (authLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {allContacts.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.title}>Import contacts from your device</Text>
          <Button
            title="Fetch My Contacts"
            onPress={handleFetchContacts}
            disabled={loading}
          />
        </View>
      ) : (
        <>
          {/* ✅ Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#8e8e93"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              placeholderTextColor="#8e8e93"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredContacts} // ✅ Use the filtered list for display
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.noResultsText}>
                No contacts match your search.
              </Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => toggleContactSelection(item.id)}
              >
                <Text style={styles.contactName}>{item.name}</Text>
                <Ionicons
                  name={
                    selectedContacts.has(item.id)
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={24}
                  color="#30234a"
                />
              </TouchableOpacity>
            )}
          />

          <View style={styles.footer}>
            <Text style={styles.selectionText}>
              {selectedContacts.size} contact(s) selected
            </Text>
            <Button
              title="Upload Selected Contacts"
              onPress={handleUploadSelected}
              disabled={loading}
            />
          </View>
        </>
      )}
      {loading && <ActivityIndicator style={styles.loadingIndicator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" }, // Added background color
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 20, textAlign: "center", marginBottom: 16 },

  // ✅ Styles for the search bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#30234a", // Style similar to bottom tab
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },

  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  contactName: { fontSize: 16 },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f8f8f8",
  },
  selectionText: { textAlign: "center", marginBottom: 10, fontSize: 16 },
  loadingIndicator: { marginVertical: 20 },
});
