import { supabase } from "./supabase";
import * as Contacts from "expo-contacts";
import { Session } from "@supabase/supabase-js";
export async function getContacts() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user found");
    }

    const { data: contacts, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("userid", user.id);

    if (error) {
      throw error;
    }

    // Map field names to match your TS Contact type
    return (
      contacts?.map((c) => ({
        ContactID: c.contactid,
        UserID: c.userid,
        ContactUserID: c.contactuserid,
        Nickname: c.nickname,
        Blocked: c.blocked,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
}
export async function getUserById(userId: string) {
  console.log("Fetching user by ID:", userId);
  if (!userId) return null;
  try {
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("userid", userId)
      .maybeSingle(); // Handles zero/one row safely

    if (error) {
      throw error;
    }

    return userData;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function sendMessage(receiverId: string, content: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user found");
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        content: content,
        senderid: user.id,
        receiverid: receiverId,
        timestamp: new Date().toISOString(),
        status: "sent",
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function getMessages(otherUserId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("Messages")
    .select("*")
    .in("SenderID", [user.id, otherUserId])
    .in("ReceiverID", [user.id, otherUserId])
    .order("Timestamp", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
  return data || [];
}

export async function getDeviceContacts(): Promise<Contacts.Contact[]> {
  console.log("Fetching device contacts...");
  const { status } = await Contacts.requestPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Permission to access contacts denied");
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
  });

  // Log first 10 contacts for debugging
  console.log("Device contacts fetched:", data.slice(0, 10));

  // Filter only contacts that have at least one phone number and required fields
  return data.filter(
    (contact): contact is Contacts.Contact =>
      Boolean(contact.id) &&
      Boolean(contact.name) &&
      Boolean(contact.phoneNumbers) &&
      contact.phoneNumbers!.length > 0 &&
      Boolean(contact.phoneNumbers![0].number)
  );
}

// Update the interface to match your processed contacts
interface ProcessedContact {
  id: string;
  name: string;
  phoneNumber: string; // This is the cleaned phone number string
  blocked?: boolean;
}

export async function uploadContactsToSupabase(
  processedContacts: ProcessedContact[], // Changed from any[] to ProcessedContact[]
  session: Session
) {
  console.log("Uploading contacts to Supabase:", processedContacts);

  // Extract phone numbers from the processed contacts
  const userPhoneNumbers = processedContacts
    .map((contact) => contact.phoneNumber) // Use phoneNumber instead of phoneNumbers array
    .filter(Boolean); // Remove undefined/null

  console.log("User Phone Numbers:", userPhoneNumbers);

  if (userPhoneNumbers.length === 0) {
    throw new Error("No valid phone numbers found.");
  }

  // Step 1: Query Users who match the numbers
  const { data: registeredUsers, error } = await supabase
    .from("users")
    .select('"userid", "phonenumber"')
    .in("phonenumber", userPhoneNumbers);

  if (error) throw error;

  console.log("Registered Users from DB:", registeredUsers);

  // Step 2: Map for quick lookup - normalize phone numbers for comparison
  const registeredUsersMap = new Map(
    registeredUsers?.map((u) => [u.phonenumber.replace(/\D/g, ""), u.userid]) ||
      []
  );

  console.log("Registered Users Map:", registeredUsersMap);

  // Step 3: Prepare valid contact uploads
  const contactsToUpload = processedContacts
    .filter((contact) => {
      const cleanPhone = contact.phoneNumber.replace(/\D/g, "");
      const hasMatch = registeredUsersMap.has(cleanPhone);
      console.log(
        `Contact ${contact.name} (${cleanPhone}): ${
          hasMatch ? "MATCH" : "NO MATCH"
        }`
      );
      return hasMatch;
    })
    .map((contact) => {
      const cleanPhone = contact.phoneNumber.replace(/\D/g, "");
      return {
        userid: session.user.id, // Current user
        contactuserid: registeredUsersMap.get(cleanPhone), // App user found
        nickname: contact.name || "", // Contact name
        blocked: false,
      };
    });

  console.log("Contacts to upload:", contactsToUpload);

  if (contactsToUpload.length === 0) {
    throw new Error("No matching users found in the app.");
  }

  // Step 4: Upload to Supabase (ignore duplicates)
  const { error: insertError } = await supabase
    .from("contacts")
    .upsert(contactsToUpload, { ignoreDuplicates: true });

  if (insertError) throw insertError;

  console.log("Contacts uploaded successfully.");
}
